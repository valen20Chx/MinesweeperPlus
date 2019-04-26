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