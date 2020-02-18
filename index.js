const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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
// app.use(bodyParser.urlencoded({ extended: true }));
// app.post('/manual.html', (req,res)=>{
//   // console.log(req.body.fname,req.body.lname)
//   test(req.body.fname,req.body.lname);
// })
// app.post('/detail.html', (req,res)=>{
//   test();
// })

// static files
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

var port = new SerialPort('COM3', {
  baudRate: 38400
});
// var portATS = new SerialPort('COM3',{
//   baudRate: 38400
// });

var receivedData;
var cleanData;

var origin_latitude = -7.77126;
var origin_longitude = 110.37338;

const csvWriter = createCsvWriter({
  path: 'data.csv',
  header: [
    {id: 'idP', title: 'ID'},
    {id: 'waktu', title: 'Waktu'},
    {id: 'ketinggian', title: 'Ketinggian'},
    {id: 'temperature', title: 'Temperatur'},
    {id: 'kelembapan', title: 'Kelembapan'},
    {id: 'tekanan', title: 'Tekanan'},
    {id: 'arah_angin', title: 'Arah Angin'},
    {id: 'kec_angin', title: 'Kecepatan Angin'},
    {id: 'lintang', title: 'Lintang'},
    {id: 'bujur', title: 'Bujur'}
  ]
});

// test = function(Horizontal,Vertikal){
//   var hasil = Horizontal + " " + Vertikal
//   return hasil;
// }

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var i=0;
port.on('data', function(data) {
  //setInterval(function(){
  receivedData = data.toString();
  var cleanData = receivedData.substring(receivedData.indexOf('\r\n')).replace(/(\r\n|\n|\r)/gm,"");
  k = cleanData.split(" ");
  var dataCSV = []

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
  console.log(cleanData);
  console.log("------------------------");
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

  dataCSV.push({
    idP: k[0],
    waktu: k[1],
    ketinggian: k[2],
    temperature: k[3],
    kelembapan: k[4],
    tekanan: k[5],
    arah_angin: k[6],
    kec_angin: k[7],
    lintang: k[8],
    bujur: k[9]
  })
  csvWriter.writeRecords(dataCSV).then(()=> console.log('CSV written'));
  sleep(2000);
  i++;
  if(i %= 2 == 1){
    port.flush(function(err,results){});
  }
});

// portATS.on('arduino:data', function(data){
//   //autotrack
//   const autotrack = require('./Geo_calculator.js')
//   //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
//   bearing = autotrack.data.calculate_compass_bearing(dataserial.lintangs,dataserial.bujurs,origin_latitude,origin_longitude);
//   vertical = autotrack.data.calculate_vertical_angle(autotrack.data.calculate_distance(dataserial.lintangs,data.bujurs),origin_latitude,origin_longitude,dataserial.altitudes);
//   Hasil_Autotrack = (Math.round(bearing)).toString() + " " + (Math.round(vertical)).toString();
//   PortATS.write(Hasil_Autotrack);
//     // });
//   //
//   });
server.listen(3000)