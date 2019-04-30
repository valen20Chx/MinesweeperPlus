const sWidth = 1000;
const sHeight = 500;

var canvasEle = document.getElementById('gameCanvas');

canvasEle.width = sWidth;
canvasEle.height = sHeight;

var canvasCon = canvasEle.getContext('2d');

var game_screen_config = {
	x: 100,
	y: 0,
	w: 500,
	h: 500,
};

var game_settings = {
	difficulty: 5,
	sizeX: 10,
	sizeY: 10,
	seed: 2
};

var MyMineField = new Minefield(game_settings.sizeX,
	game_settings.sizeY, game_settings.difficulty,
	game_settings.seed);

var game_isRunning = false;
var gameTimer = 0;
var startTime;
var timer_id;

MyMineField.draw(canvasCon, game_screen_config.x,
	game_screen_config.y, game_screen_config.w,
	game_screen_config.h);

function updateTimer() {
	let tempDate = new Date();
	gameTimer = tempDate.valueOf();
	document.getElementById('timer').innerText = `${gameTimer - startTime.valueOf()} ms`;
}

//Click Event
canvasEle.onmousedown = (ev) => {
	var mouseEvent = {
		X: ev.clientX - canvasEle.getBoundingClientRect().left,
		Y: ev.clientY - canvasEle.getBoundingClientRect().top,
		button: ev.button,
	};

	if (ev.stopPropagation)
        ev.stopPropagation();
	ev.cancelBubble = true;

	// Do after Click
	if(MyMineField.get_state() == 0) {
		if(!game_isRunning) {
			game_isRunning = true;
			startTime = new Date();
			timer_id = window.setInterval(updateTimer, 1);
		}
		switch(mouseEvent.button) {
			case 0: // Mouse 1 : Left Click
			MyMineField.play(0, mouseEvent.X,
				mouseEvent.Y, game_screen_config.x,
				game_screen_config.y, game_screen_config.w,
				game_screen_config.h);
			break;
			case 2: // Mouse 2 : Right Click
			MyMineField.play(1, mouseEvent.X,
				mouseEvent.Y, game_screen_config.x,
				game_screen_config.y, game_screen_config.w,
				game_screen_config.h);
			break;
			default:
			console.log("Input not handled: " + mouseEvent.button);
			break;
		}
		MyMineField.draw(canvasCon, game_screen_config.x,
			game_screen_config.y, game_screen_config.w,
			game_screen_config.h);
	
		console.log(mouseEvent);
	}

	// Checks for game state (all bomb flagged...)
	MyMineField.update_state();

		document.getElementById('bombs').innerText = MyMineField.get_nbBomb();
		document.getElementById('flags').innerText = MyMineField.get_nbFlag();
		if(MyMineField.get_state() == 0) {
			document.getElementById('state').innerText = "Playing";
			document.getElementById('state').style.color = "#000";
		} else if(MyMineField.get_state() == -1) {
			document.getElementById('state').innerText = "Loss";
			document.getElementById('state').style.color = "#fa0";
		} else if(MyMineField.get_state() == 1) {
			document.getElementById('state').innerText = "Won";
			document.getElementById('state').style.color = "#0c0";
		}
		
	//Detects if game state changed
	if(MyMineField.get_state() != 0) {
		if(game_isRunning) {
			console.log("Game Finished")
			game_isRunning = false;
			window.clearInterval(timer_id);
		}
	}
};

var socket = io.connect();

document.getElementById('btnConnect').addEventListener('click', (el, ev) => {
	var username = document.getElementById('username');
	var password = document.getElementById('password');
	
	if(username.value != "" && password.value != "") {
		socket.emit('sign-in', {
			username: username.value,
			password: password.value,
		});
		console.log(`Attempting connection.`);
	}
});

socket.on('connection-error', (data) => {
	console.log(`Error: ${data.message}`);
	var errorMessage = document.getElementById('connection-err');
	errorMessage.innerText = `Error: ${data.message}`;
});

socket.on('connection-success', () => {
	document.getElementById('connectionScene').style.display = "none";
	document.getElementById('gameScene').style.display = "inline";
});

socket.on('new-grid', (data) => {
	game_settings = data.game_settings;
});

// Get New Grid
document.getElementById('btnGenerate').onclick = () => {
	game_settings.sizeX = document.getElementById('size').value;
	game_settings.sizeY = game_settings.sizeX;
	game_settings.difficulty = document.getElementById('difficulty').value;

	socket.emit('get-grid', {game_settings});
	
	gameTimer = 0;
	game_isRunning = false;
	window.clearInterval(timer_id);

	MyMineField = new Minefield(game_settings.sizeX, game_settings.sizeY,
		game_settings.difficulty, game_settings.seed);

	MyMineField.draw(canvasCon, game_screen_config.x,
		game_screen_config.y, game_screen_config.w,
		game_screen_config.h);
};

document.getElementById('btnRegisterScene').onclick = () => {
	document.getElementById('connectionScene').style.display = 'none';
	document.getElementById('registerScene').style.display = 'inline';
};

document.getElementById('btnRegister').onclick = () => {
	var username = document.getElementById('reg_username');
	var password = document.getElementById('reg_password');
	var errTxt = document.getElementById('register-err');

	if(username.value == "" || password.value == "") {
		errTxt.innerText = "The two fields must contain text.";
		errTxt.style.color = 'red';
	}
	else {
		socket.emit('register', {
			username: username.value,
			password: password.value
		});
		errTxt.innerText = "";
		errTxt.color = "black";
	}
};

socket.on('register-error', (data) => {
	var username = document.getElementById('reg_username');
	var password = document.getElementById('reg_password');
	var errTxt = document.getElementById('register-err');

	username.value = "";
	password.value = "";
	errTxt.innerText = data.message;
	errTxt.style.color = "red";
});

socket.on('register-success', (data) => {
	var username = document.getElementById('reg_username');
	var password = document.getElementById('reg_password');
	var errTxt = document.getElementById('register-err');
	
	username.value = "";
	password.value = "";
	errTxt.innerText = "Registration Successful! Homescreen will load.";
	errTxt.style.color = "green";
	window.setTimeout(() => {
		document.getElementById('registerScene').style.display = 'none';
		document.getElementById('connectionScene').style.display = 'inline';
	}, 2000);
	errTxt.innerText = "";
	errTxt.style.color = "black";
});