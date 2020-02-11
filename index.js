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
app.get('/index.html',(req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get('/map.html',(req, res)=>{
  res.sendFile(__dirname + '/map.html');
});
app.get('/detail.html',(req, res)=>{
  res.sendFile(__dirname + '/detail.html');
});
app.get('/manual.html',(req, res)=>{
  res.sendFile(__dirname + '/manual.html');
});
app.get('/setting.html',(req, res)=>{
  res.sendFile(__dirname + '/setting.html');
});

// static files
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

/*var port = new SerialPort('', {
  baudRate: 38400
});
// var portATS = new SerialPort('COM3',{
//   baudRate: 38400
// });

var receivedData;
var cleanData;

var origin_latitude = -7.77126;
var origin_longitude = 110.37338;


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


port.on('data', function(data) {
  //setInterval(function(){
    receivedData = data.toString();
  var cleanData = receivedData.substring(receivedData.indexOf('\r\n')).replace(/(\r\n|\n|\r)/gm,"");
  k = cleanData.split(" ");

  var ID_Peserta = k[0];
  var waktu = k[1];
  var altitude = k[2]; 
  var temp = k[3];
  var humid = k[4];
  var pressure = k[5];
  var wind_dir = k[6];
  var wind_speed = k[7];
  var lintang = k[8];
  var bujur = k[9];

  //console.log(cleanData);
  console.log(cleanData);
  console.log("------------------------")
  
  io.emit('arduino:data', {
    temps: temp,
    humids: humid,
    altitudes: altitude,
    pressures: pressure,
    windd: wind_dir,
    winds: wind_speed,
    lintangs: lintang,
    bujurs: bujur
  });
  sleep(2000);
});

// portATS.on('arduino:data', function(data){
//   //autotrack
//   const autotrack = require('./Geo_calculator.js')
//   //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
//   //socket.on('arduino:data', function (dataSerial) {
//     // console.log(dataSerial);
//     //chart.data.datasets.forEach(dataset => {
//       //dataset.data.push(dataSerial.temps);
//     bearing = autotrack.data.calculate_compass_bearing(dataserial.lintangs,dataserial.bujurs,origin_latitude,origin_longitude);
//     vertical = autotrack.data.calculate_vertical_angle(autotrack.data.calculate_distance(dataserial.lintangs,data.bujurs),origin_latitude,origin_longitude,dataserial.altitudes);
//     Hasil_Autotrack = (Math.round(bearing)).toString() + " " + (Math.round(vertical)).toString();
//     PortATS.write(Hasil_Autotrack);
//     // });
//   //
//   // console.log("TEST");
//   // portATS.close(function(err){
//   //   console.log("Closed!");
//   // })
//   });
*/

server.listen(3000)
