var socket = require('socket.io');
var express = require('express');
var mysql = require('mysql');

var app = express();

var listenPort = 4000;
var hostname = "localhost";

var isRunning = true;

var socketList = [];

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'minesweeper_plus'
});

db.connect((err) => {
	if(err) {
		console.log('MySql Error connecting' + err.stack);
		isRunning = false;
		return;
	}
	console.log('MySql connected as id : ' + db.threadId);
});


if(isRunning) {
	var server = app.listen(listenPort, hostname, () => {
		console.log("listening on port : ", listenPort);
	});

	app.use(express.static('client'));

	var io = socket(server);

	io.on('connection', (socket) => {
		socket.on('sign-in', (data) => {
			var exist = false;

			socketList.forEach((element) => {
				if(element.username != null) {
					if(element.username == data.username) {
						socket.emit('connection-error', {
							message: 'Username is taken'
						});
						exist = true;
					}
				}
			});
			if(!exist) {
				console.log(`${data.username} :`, getUserIdFromUsername(data.username));
				console.log(`${data.password} :`, getUserIdFromUsername(data.password));
				if(getUserIdFromUsername(data.username) != null) {
					if(getUserIdFromUsername(data.username) == getUserIdFromPassword(data.password)) {
						socket.username = data.username;
						//socket.password = data.password;
						socket.emit('connection-success');
						console.log(`Connection successful for ${socket.id} as ${data.username}`);
						socketList.push(socket);
					} else {
						console.log(`Error: Connection failed, ${socket.id}, username "${data.username}" entered the wrong password.`);
						socket.emit('connection-error', {
							message: 'Wrong password'
						});
					}
				} else {
					console.log(`Error: Connection failed, ${socket.id}, username "${data.username}" is not registered.`);
					socket.emit('connection-error', {
						message: `${data.username} is not registered`
					});
				}
			} else {
				console.log(`Error: Connection failed for ${socket.id}, username "${data.username}" already exist`);
				socket.emit('connection-error', {
					message: 'You are already connected'
				});
			}
		});

		socket.on('disconnect', () => {
			socket.username = "";
			socketList.splice(socketList.indexOf(socket),0);
		});

		socket.on('get-grid', (data) => {
			var game_settings = {
				sizeX: data.game_settings.sizeX,
				sizeY: data.game_settings.sizeY,
				difficulty: data.game_settings.difficulty,
				seed: Math.floor(Math.random() * 1000)
			};
			socket.emit('new-grid', {
				game_settings: game_settings
			});
		});

		socket.on('game-finish', (data) => {
			db.query('INSERT INTO scores VALUES (NULL, ?, ?, ?, ?);', [socket.username, data.time, data.size, data.difficulty], (err, result, fields) => {
				if(err) throw err;
			})
		});

		socket.on('register', (data) => {
			db.query('SELECT id FROM users WHERE username = ?;', [data.username], (err, results, fields) => {
				if(!(results.length > 0)) {
					socket.emit('register-success');
					createUser(data.username, data.password);
				} else {
					socket.emit('register-error', {
						message: "Username is already registered."
					});
				}
			});
		});
	});
}

function getUserIdFromUsername(username) {
	var returnValue = null;
	db.query('SELECT id FROM users WHERE username = ' +  mysql.escape(username) + ';', (err, results, fields) => {
		if(err) {
			console.log(err.stack);
			throw err;
		}
		else {
			if(results) {
				returnValue = results[0];
			}
			console.log(results[0].id);
		}
	});
	return returnValue;
}

function getUserIdFromPassword(password) {
	var returnValue = null;
	db.query('SELECT id FROM users WHERE password = ' +  mysql.escape(password) + ';', (err, results, fields) => {
		if(err) {
			console.log(err.stack);
			throw err;
		}
		else {
			if(results) {
				returnValue = results[0];
			}
		}
	});
	return returnValue;
}

function createUser(username, password) {
	var currentDate = new Date();
	var dateStr = currentDate.getFullYear() + "-" + (1 + currentDate.getMonth()) + "-" + currentDate.getDate();
	db.query('INSERT INTO users VALUES (NULL, ?, ?, ?);', [username, password, dateStr], (err, results, fields) => {
		if(err) {
			throw err;
		}
	});
}