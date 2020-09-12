const path              = require("path"),
      express           = require("express"),
      socketIo          = require("socket.io"),
      SerialPort        = require("serialport"),
      http              = require("http"),
      bodyParser        = require("body-parser"),
      createCsvWriter   = require("csv-writer").createObjectCsvWriter,
      app               = express(),
      server            = http.createServer(app),
      io                = socketIo.listen(server),
      fs                = require("fs"),
      parsers           = SerialPort.parsers,
      parser            = new parsers.Readline({
                            delimiter: "\r\n",
                          }),
      parserATS         = new parsers.Readline({
                            delimiter: "\r\n",
                          }),
      readline          = require("readline"),
      rl                = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                          }),
      parserATSManual   = new parsers.Readline({
                            delimiter: "\r\n",
                          }),
      parserManual      = new parsers.Readline({
                            delimiter: "\r\n",
                          });

var mongoose    = require("mongoose"),
    sys         = require("sys"),
    spawn       = require("child_process").spawn,
    dummy       = spawn("python", ["Joystick/Joystick.py"]);
                   
mongoose
  .connect("mongodb://localhost:27017/gcs_maheswara", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

// var settingSchema = new mongoose.Schema({
//   port_muatan: String,
//   baudrate_muatan: Number,
//   port_ats: String,
//   baudrate_ats: Number,
//   latitude: Number,
//   longitude: Number,
// });

// var Setting = mongoose.model("Setting", settingSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// var set = new Setting({
//   port_muatan: "req.body.port_muatan",
//   baudrate_muatan: 1232,
//   port_ats: "req.body.port_ats",
//   baudrate_ats: 132123,
//   latitude: 134,
//   longitude: 23423,
// });
// set.save(function (err, setting) {
//   if (err) {
//     console.log("something went wrong");
//   } else {
//     console.log(setting);
//   }
// });


var port = 0;

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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

var portATS = 0;

var receivedData;
var cleanData;

var origin_latitude =  -7.771173;
var origin_longitude = 110.373230;


// WRITE CSV
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

// AUTOTRACK
var j = 0;
var reconnect = false;
var noportmuatan = '0';
var noportats = '/dev/cu.usbmodem55335201';
// AUTOTRACK - CONNECT
function ConnectPort(){
  // reconnect
  if(reconnect){
    port = new SerialPort(noportmuatan, {
      baudRate: 57600 
    });
    portATS = new SerialPort(noportats,{
      baudRate: 57600
    });
    port.pipe(parser)
    portATS.pipe(parserATS);
    port.on('open', function() {});
    portATS.on('open', function() {});
    reconnect = false;
  }
  //connect
  if(j == 0){
    const openPort = () => {
      return new Promise((resolve, reject) => {
        rl.question("Port Muatan: ", (portMuatan) => {
          noportmuatan = portMuatan;
          port = new SerialPort(portMuatan, { baudRate: 57600 });
          port.pipe(parser);
          port.on("open", function () {});
            portATS = new SerialPort(noportats,{
      baudRate: 57600
    });
    portATS.pipe(parserATS);
    portATS.on('open', function() {});
          resolve();
        });
      });
    };
    // port = new SerialPort(noportmuatan, {
    //   baudRate: 57600 
    // });
    // portATS = new SerialPort(noportats,{
    //   baudRate: 57600
    // });
    console.log("Connected")
    // port.pipe(parser);
    // portATS.pipe(parserATS);
    // port.on('open', function() {});
    // portATS.on('open', function() {});

    const main = async () => {
      await openPort()
    };
    
    main();
  }
  j++;
} 
// AUTOTRACK - DISCONNECT
function DisconnectPort(){
  console.log("Disconnected")
  port.close();
  portATS.close();
  reconnect = true;
}

// MANUAL TRACK
var reconnectmanual = false;
var jj = 0;
// MANUAL TRACK - CONNECT
function ConnectManualPort(){
  //reconnect
  if(reconnectmanual){
    portATS = new SerialPort(noportats,{
      baudRate: 57600
    });
    port = new SerialPort(noportmuatan, {
      baudRate: 57600 
    });
    port.pipe(parserManual);
    portATS.pipe(parserATSManual);
    port.on('open', function() {});
    portATS.on('open', function() {});
    reconnectmanual = false;
  }
  //connect
  if(jj == 0){
  
    portATS = new SerialPort(noportats,{
      baudRate: 57600
    });
    port = new SerialPort(noportmuatan, {
      baudRate: 57600 
    });
    console.log("Connected");
    portATS.pipe(parserATSManual);
    portATS.on('open', function() {});
    port.pipe(parserManual);
    port.on('open', function() {})
  }
  jj++;
}
// MANUAL TRACK - DISCONNECT
function DisconnectManualPort(){
  console.log("Disconnected");
  portATS.close();
  port.close();
  reconnectmanual = true;
}

// PARSERATSMANUAL.ON
// var HoriTemp = 0;
// var VerTemp = 0;
var delay = 0;
var Horizontal = 0;
var Vertikal = 0;
parserATSManual.on("data", function (data) {
  receivedData = data.toString();
  var cleanData = receivedData
    .substring(receivedData.indexOf("\r\n"))
    .replace(/(\r\n|\n|\r)/gm, "");
  k = cleanData.split(" ");
  console.log(cleanData);
  fs.readFile("Joystick/Input.txt", "utf-8", function (err, data) {
    if (err) throw err;
    var newValue = "empty";
    if (data == "ATAS") {
      newValue = data.replace(/ATAS/gim, "empty");
      Vertikal += 3;
    } else if (data == "KANAN") {
      newValue = data.replace(/KANAN/gim, "empty");
      Horizontal = Math.abs(Horizontal + 3 + 360) % 360;
    } else if (data == "BAWAH") {
      newValue = data.replace(/BAWAH/gim, "empty");
      Vertikal -= 3;
    } else if (data == "KIRI") {
      var newValue = data.replace(/KIRI/gim, "empty");
      Horizontal = Math.abs(Horizontal - 3 + 360) % 360;
    }
    fs.writeFile("Joystick/Input.txt", newValue, "utf-8", function (err, data) {
      if (err) throw err;
      console.log("Done!");
    });
  });
  if (Vertikal < 0) {
    Vertikal = 0;
  } else if (Vertikal > 90) {
    Vertikal = 90;
  }
  if (delay % 6 == 0) {
    Hasil_Manual = Math.round(Horizontal) + " " + Math.round(Vertikal);
    portATS.write(Hasil_Manual, function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Manual);
    });
  }
  delay++;
});

// PARSERMANUAL.ON
parserManual.on("data", function(data){
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

  if (k.length == 10) {
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
      bearings: bearing,
    });
    i++;
    // Setting.findOne({}, function (err, foundSetting) {
    //   if (err) {
    //     console.log(err);
    //   } else {
        parserATSManual.emit("data", {
          origin_latitude: origin_latitude,
          origin_longitude: origin_longitude,
          lintangs: lintang,
          bujurs: bujur,
          altitudes: altitude,
        });
    //   }
    // });
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

  const autotrack = require("./Geo_calculator.js");
  bearing = autotrack.data.calculate_compass_bearing(
    lintang,
    bujur,
    data.origin_latitude,
    data.origin_longitude
  );
  vertical = autotrack.data.calculate_vertical_angle(
    autotrack.data.calculate_distance(
      lintang,
      bujur,
      data.origin_latitude,
      data.origin_longitude
    ),
    altitude
  );
  // console.log(lintang,bujur,data.origin_latitude,data.origin_longitude,altitude);
  console.log(bearing,vertical)
});

// PARSER.ON
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

  if (k.length == 10) {
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
      bearings: bearing,
    });
    i++;
 
        parserATS.emit("arduino:data1", {
          origin_latitude: origin_latitude,
          origin_longitude: origin_longitude,
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
});

// PARSERATS.ON
parserATS.on("arduino:data1", function (data) {
  //autotrack

  const autotrack = require("./Geo_calculator.js");
  // console.log("latitude: " + data.origin_latitude);
  // console.log("longitude: " + data.origin_longitude);

  //console.log(autotrack.data.calculate_compass_bearing(100,45,10,0))
  if (data.Horizontal != undefined || data.Vertikal != undefined) {
    Hasil_Autotrack = data.Horizontal + " " + data.Vertikal;
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
    // console.log(
    //   data.lintangs,
    //   data.bujurs,
    //   data.origin_latitude,
    //   data.origin_longitude
    // );
    // console.log('port muatan: ' + data.port_muatan);
    // console.log('baudrate muatan: ' + data.baudrate_muatan);
    // console.log('port ats: ' + data.port_ats);
    // console.log('baudrate ats: ' + data.baudrate_ats);

    Hasil_Autotrack = Math.round(bearing) + " " + Math.round(vertical);
    portATS.write(Hasil_Autotrack, function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(Hasil_Autotrack);
    });
  }
});

// START SERVER
server.listen(3000);
