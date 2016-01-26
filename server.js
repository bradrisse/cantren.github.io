// server.js
var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(httpServer);

var port = 8080;

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);
var leftMotor, rightMotor, leftTilt, rightTilt;

var arduinoConnected = false;

//Arduino board connection

var board = new five.Board();
var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;
board.on("ready", function () {
    console.log('Arduino connected');
    arduinoConnected = true;
    leftMotor = new five.Motor(configs.M3);
    rightMotor = new five.Motor(configs.M4);
    leftTilt = new five.Servo(9);
    rightTilt = new five.Servo(10);
});

//Socket connection handler
io.on('connection', function (socket) {
    console.log(socket.id);

    socket.on('speed:allStop', function (data) {
        if (arduinoConnected) {
          leftMotor.stop();
          rightMotor.stop();
        } else {
          console.log('simulated: vessel all stop');
        }
    });

    socket.on('speed:forward', function (data) {
        if (arduinoConnected) {
          leftMotor.forward(data.speed.left);
          rightMotor.forward(data.speed.right);
        } else {
          console.log('simulated: vessel moving forward');
        }
    });

    socket.on('speed:reverse', function (data) {
        if (arduinoConnected) {
          leftMotor.reverse(data.speed.left);
          rightMotor.reverse(data.speed.right);
        } else {
          console.log('simulated: vessel moving backward');
        }
    });

    socket.on('roll:right', function (data) {
        if (arduinoConnected) {
          leftTilt.to(data.tilt.left);
          rightTilt.to(data.tilt.right);
        } else {
          console.log('simulated: vessel rolling right');
        }
    });

    socket.on('roll:left', function (data) {
        if (arduinoConnected) {
          leftTilt.to(data.tilt.angle);
          rightTilt.to(data.tilt.angle);
        } else {
          console.log('simulated: vessel rolling left');
        }
    });

    socket.on('depth:assend', function (data) {
        if (arduinoConnected) {
          leftTilt.to(data.tilt.left);
          rightTilt.to(data.tilt.right);
        } else {
          console.log('simulated: vessel assending');
        }
    });

    socket.on('depth:descend', function (data) {
        if (arduinoConnected) {
          leftTilt.to(data.tilt.angle);
          rightTilt.to(data.tilt.angle);
        } else {
          console.log('simulated: vessel descending');
        }
    });

});

console.log('Waiting for connection');
