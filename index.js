const path = require("path");
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);
const fs = require('fs') 

var sys   = require('sys'),
    spawn = require('child_process').spawn,
    dummy  = spawn('python', ['Joystick.py']); 

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

const parserATS = new parsers.Readline({
  delimiter: '\r\n'
})

const parserATSManual = new parsers.Readline({
  delimiter: '\r\n'
})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var port = new SerialPort('COM10', {
  baudRate: 57600 
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

// app.post("/", function (req, res) {
// port_muatan = req.body.port_muatan;
// baudrate_muatan = req.body.baudrate_muatan;
// console.log(port_muatan);

//   var port = new SerialPort(port_muatan, {
//     baudRate: baudrate_muatan 


//     });
// });

app.post('/', (req,res)=>{
  if(req.body.Connect == "Disconnect"){
    ConnectPort();
  }
  else if(req.body.Connect == "Connect"){
    DisconnectPort();
  }
  if(req.body.ConnectManual == "Disconnect"){
    ConnectManualPort();
  }
  else if(req.body.ConnectManual == "Connect"){
    DisconnectManualPort();
  }
})

var portATS = new SerialPort('COM9',{
  baudRate: 57600
});

var receivedData;
var cleanData;

// var origin_latitude = -7.77126;
// var origin_longitude = 110.37338;

const csvWriter = createCsvWriter({
  path: "CSV/data.csv",
  header: [
    { id: "idP", title: "ID" },
    { id: "waktu", title: "Waktu" },
    { id: "ketinggian", title: "Ketinggian" },
    { id: "temperature", title: "Temperatur" },
    { id: "kelembapan", title: "Kelembapan" },
    { id: "tekanan", title: "Tekanan" },
    { id: "arah_angin", title: "Arah Angin" },
    { id: "kec_angin", title: "Kecepatan Angin" },
    { id: "lintang", title: "Lintang" },
    { id: "bujur", title: "Bujur" },
  ],
});

// function sleep(milliseconds) {
//   const date = Date.now();
//   let currentDate = null;
//   do {
//     currentDate = Date.now();
//   } while (currentDate - date < milliseconds);
// }

var j = 0;
function ConnectPort(){
  console.log("Connected2")
  if(j == 0){
    console.log("Connected")
    port.pipe(parser)
    portATS.pipe(parserATS);
    port.on('open', function() {});
    portATS.on('open', function() {});
  }
  j++;
} 

function DisconnectPort(){
  console.log("Disconnected")
  port.close();
  portATS.close();
}

function ConnectManualPort(){
  console.log("Connected");
  portATS.pipe(parserATSManual);
  portATS.on('open', function(){});
}

function DisconnectManualPort(){
  console.log("Disconnected");
  portATS.close();
}

// var HoriTemp = 0;
// var VerTemp = 0;
var iii = 0;
var Horizontal = 0
var Vertikal = 0
parserATSManual.on('data',function(data){
  receivedData = data.toString();
  var cleanData = receivedData
    .substring(receivedData.indexOf("\r\n"))
    .replace(/(\r\n|\n|\r)/gm, "");
  k = cleanData.split(" ");
  console.log(cleanData)

  // fs.readFile('Input.txt', (err, data) => { 
  //   if (err) throw err;
  //   if(data == "ATAS") {
  //     VerTemp++
  //     // console.log(Math.round(vertical),VerTemp)
  //   }
  //   else if(data == "KANAN"){
  //     HoriTemp++
  //     // console.log(Math.round(bearing),HoriTemp)
  //   }
  //   else if(data == "BAWAH"){
  //     VerTemp--
  //     // console.log(Math.round(vertical),VerTemp)
  //   }
  //   else if(data == "KIRI"){
  //     HoriTemp--
  //     // console.log(Math.round(bearing),HoriTemp)
  //   }
  //   console.log(data.toString()); 
  //   // console.log(Horizontal,Vertikal)
  //   //Manual form
  //   // parserATS.emit('arduino:data1',{
  //   //   Verti: VerTemp,
  //   //   Hori:HoriTemp,
  //   //   Arah: data
  //   // })
  // })
   fs.readFile('Input.txt', 'utf-8', function(err, data) {
      if (err) throw err;
      var newValue = "empty";
      if(data == "ATAS") {
        newValue = data.replace(/ATAS/gim, 'empty');
        Vertikal += 3
      }
      else if(data == "KANAN"){   
        newValue = data.replace(/KANAN/gim, 'empty');
        Horizontal = Math.abs(Horizontal + 3 + 360) % 360;
      }
      else if(data == "BAWAH"){
        newValue = data.replace(/BAWAH/gim, 'empty');
        Vertikal -= 3
      }
      else if(data == "KIRI"){
        var newValue = data.replace(/KIRI/gim, 'empty');
        Horizontal =  Math.abs(Horizontal - 3 + 360) % 360;
      }
      fs.writeFile('Input.txt', newValue, 'utf-8', function(err, data) {
          if (err) throw err;
          console.log('Done!');
      })
  })
  if(Vertikal < 0 ){
    Vertikal = 0;
  }
  else if(Vertikal > 90){
    Vertikal = 90;
  }
  if(iii % 6 == 0){
    Hasil_Manual = Math.round(Horizontal) + " " + Math.round(Vertikal);
    portATS.write(Hasil_Manual, function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log(Hasil_Manual);
  });
  }
  iii++;


  // app.post('/', (req,res)=>{
  //   console.log(req.body.fname + " " + req.body.lname)
  //   booll = false;
  // })
})

var i = 0;
parser.on("data", function (data) {
  //setInterval(function(){
  receivedData = data.toString();
  var cleanData = receivedData
    .substring(receivedData.indexOf("\r\n"))
    .replace(/(\r\n|\n|\r)/gm, "");
  k = cleanData.split(" ");
  var dataCSV = [];

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

  bearing = 0;

  if(k.length == 10){
    io.emit("arduino:data", {
      temps: temp,
      humids: humid,
      altitudes: altitude,
      pressures: pressure,
      windd: wind_dir,
      winds: wind_speed,
      lintangs: lintang,
      bujurs: bujur,
      pause: i,
      bearings: bearing
    });
    i++;
    parserATS.emit("arduino:data1", {
      lintangs: lintang,
      bujurs: bujur,
      altitudes: altitude,
    });
  }

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
    bujur: k[9],
  });
  csvWriter.writeRecords(dataCSV).then(() => console.log("CSV written"));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.post("/", (req, res) => {
    console.log(req.body.fname, req.body.lname, req.body.latitude_ats);
    parserATS.emit("arduino:data1", {
      Horizontal: req.body.fname,
      Vertikal: req.body.lname,
      lintangs: lintang,
      bujurs: bujur,
      altitudes: altitude,
      origin_latitude: req.body.latitude_ats,
      origin_longitude: req.body.longitude_ats
    });
  });
});

parserATS.on("arduino:data1", function (data) {
  //autotrack
  const autotrack = require("./Geo_calculator.js");
  //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
  if (data.Horizontal != undefined || data.Vertikal != undefined) {
    Hasil_Autotrack =
      data.Horizontal + " " + data.Vertikal;
    portATS.write(Hasil_Autotrack, function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Autotrack);
    });
  } else {
    bearing = autotrack.data.calculate_compass_bearing(
      data.lintangs,
      data.bujurs,
      data.origin_latitude,
      data.origin_longitude
    );
    vertical = autotrack.data.calculate_vertical_angle(
      autotrack.data.calculate_distance(
        data.lintangs,
        data.bujurs,
        data.origin_latitude,
        data.origin_longitude
      ),
      data.altitudes
    );
    Hasil_Autotrack =
      Math.round(bearing) + " " + Math.round(vertical);
    portATS.write(Hasil_Autotrack, function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Autotrack);
    });
  }
});

  parserATS.on('arduino:data1', function(data){
    //autotrack
    const autotrack = require('./Geo_calculator.js')
    //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
    if(data.Horizontal != undefined || data.Vertikal != undefined){
      Hasil_Autotrack = data.Horizontal + " " + data.Vertikal;
      portATS.write(Hasil_Autotrack, function (err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log(Hasil_Autotrack)
      })
    }
    else{
      bearing = autotrack.data.calculate_compass_bearing(data.lintangs,data.bujurs,data.origin_latitude,data.origin_longitude);
      vertical = autotrack.data.calculate_vertical_angle(autotrack.data.calculate_distance(data.lintangs,data.bujurs,data.origin_latitude,data.origin_longitude),data.altitudes);
      Hasil_Autotrack = (Math.round(bearing)) + " " + (Math.round(vertical));
      portATS.write(Hasil_Autotrack, function (err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log(Hasil_Autotrack)
      })
    }
})

// Start server
server.listen(3000)