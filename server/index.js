var socket = require('socket.io');
var express = require('express');

var app = express();

var listenPort = 4000;
var hostname = "localhost";

var server = app.listen(listenPort, hostname, () => {
	console.log("listening on port : ", listenPort);
});

app.use(express.static('public'));

var io = socket(server);

var socketList = [];

app.use(express.static('client'));

io.on('connection', (socket) => {
	socket.on('sign-in', (data) => {
		var exist = false;
		socketList.forEach((element) => {
			if(element.username != NULL) {
				if(element.username == data.username) {
					socket.emit('connection-error', {
						message: 'Username is taken'
					});
					exist = true;
				}
			}
		});
		if(!exist) {
			socket.username = data.username;
			//socket.password = data.password;
			socket.emit('connection-success');
			console.log(`Error: Connection successful for ${socket.id} as ${data.username}.`);
		} else {
			console.log(`Error: Connection failed for ${socket.id}, username "${data.username}" already exist.`);
		}
	});
});