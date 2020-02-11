const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

//routes
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

var port = new SerialPort('/dev/cu.usbmodem14201', {
  baudRate: 57600
});

var receivedData;
var cleanData;

port.on('data', function(data) {
    receivedData = data.toString();
    var cleanData = receivedData.substring((receivedData.indexOf('07:00:00') + 1),receivedData.indexOf('\r\n'));
    k = cleanData.split(" ");

    var temp = k[0];
    var altitude = k[1];
    var pressure = k[2];
    var wind = k[3];

    console.log(cleanData);


    io.emit('arduino:data', {
      temps: temp,
      altitudes: altitude,
      pressures: pressure,
      winds: wind,
    });

});


server.listen(3000)
