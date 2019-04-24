const sWidth = 1000;
const sHeight = 500;

var canvasEle = document.getElementById('gameCanvas');

canvasEle.width = sWidth;
canvasEle.height = sHeight;

var canvasCon = canvasEle.getContext('2d');

var MyMineField = new Minefield(10, 10, 5, 2);

var game_screen_config = {
	x: 100,
	y: 0,
	w: 500,
	h: 500,
};

var game_isRunning = false;
var gameTimer = 0;
var startTime;
var timer_id;

MyMineField.draw(canvasCon, game_screen_config.x,
	game_screen_config.y, game_screen_config.w,
	game_screen_config.h);


document.getElementById('btnGenerate').onclick = () => {
	var gameWidth = document.getElementById('size').value;
	var gameHeight = gameWidth;
	var gameDifficulty = document.getElementById('difficulty').value;
	var gameSeed = 2;
	
	gameTimer = 0;
	game_isRunning = false;

	MyMineField = new Minefield(gameWidth, gameHeight, gameDifficulty, gameSeed);

	MyMineField.draw(canvasCon, game_screen_config.x,
		game_screen_config.y, game_screen_config.w,
		game_screen_config.h);

	
};

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