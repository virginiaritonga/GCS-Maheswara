const path = require("path");
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body.port_muatan);
  console.log(req.body.baudrate_muatan);
  var arduinoCOMPort = req.body.port_muatan;
  var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudrate: 9600,
  });

  arduinoSerialPort.on("open", function () {
    console.log("Serial Port " + arduinoCOMPort + " is opened.");
  });
});

// app.post('/', (req,res)=>{
//   if(req.body.Connect == "Disconnect"){
//     ConnectPort();
//   }
//   else if(req.body.Connect == "Connect"){
//     DisconnectPort();
//   }
// })

app.use(express.static(__dirname + "/public"));

var SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const parserATS = new parsers.Readline({
  delimiter: "\r\n",
});

/*var port = new SerialPort("/dev/cu.usbmodem14101", {
  baudRate: 57600,
});
port.pipe(parser);


var portATS = new SerialPort("COM12", {
  baudRate: 57600,
});
portATS.pipe(parserATS);

var receivedData;
var cleanData;

var origin_latitude = -7.77126;
var origin_longitude = 110.37338;

const csvWriter = createCsvWriter({
  path: "data.csv",
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

port.on("open", function () {});
portATS.on("open", function () {});

function ConnectPort() {
  console.log("Connected");
  port.open();
  portATS.open();
}

function DisconnectPort() {
  console.log("Disconnected");
  port.close();
  portATS.close();
}

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

  const autotrack = require("./Geo_calculator.js");
  //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
  bearing = autotrack.data.calculate_compass_bearing(
    lintang,
    bujur,
    origin_latitude,
    origin_longitude
  );
  vertical = autotrack.data.calculate_vertical_angle(
    autotrack.data.calculate_distance(
      lintang,
      bujur,
      origin_latitude,
      origin_longitude
    ),
    altitude
  );
  Hasil_Autotrack =
    Math.round(bearing).toString() + " " + Math.round(vertical).toString();

  console.log(cleanData);
  //console.log(Hasil_Autotrack)
  console.log("------------------------");

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
  });
  i++;
  parserATS.emit("arduino:data1", {
    lintangs: lintang,
    bujurs: bujur,
    altitudes: altitude,
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
    bujur: k[9],
  });
  csvWriter.writeRecords(dataCSV).then(() => console.log("CSV written"));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.post("/", (req, res) => {
    console.log(req.body.fname, req.body.lname);
    parserATS.emit("arduino:data1", {
      Horizontal: req.body.fname,
      Vertikal: req.body.lname,
      lintangs: lintang,
      bujurs: bujur,
      altitudes: altitude,
    });
  });
});

parserATS.on("arduino:data1", function (data) {
  //autotrack
  const autotrack = require("./Geo_calculator.js");
  //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
  if (data.Horizontal != undefined || data.Vertikal != undefined) {
    Hasil_Autotrack =
      data.Horizontal.toString() + " " + data.Vertikal.toString();
    portATS.write(Hasil_Autotrack + "\n", function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Autotrack);
    });
  } else {
    bearing = autotrack.data.calculate_compass_bearing(
      data.lintangs,
      data.bujurs,
      origin_latitude,
      origin_longitude
    );
    vertical = autotrack.data.calculate_vertical_angle(
      autotrack.data.calculate_distance(
        data.lintangs,
        data.bujurs,
        origin_latitude,
        origin_longitude
      ),
      data.altitudes
    );
    Hasil_Autotrack =
      Math.round(bearing).toString() + " " + Math.round(vertical).toString();
    portATS.write(Hasil_Autotrack + "\n", function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Autotrack);
    });
  }
});

*/
server.listen(3000);
