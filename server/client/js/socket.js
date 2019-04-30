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
	var errorMessage = document.getElementById('connection-err');
	errorMessage.innerText = `Error: ${data.message}`;
	errorMessage.style.display = block;
});

socket.on('connection-success', () => {
	document.getElementById('connectionScene').style.display = "none";
	document.getElementById('gameScene').style.display = "block";
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