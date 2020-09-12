const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const readline = new Readline();
const events = require('events');
const emitter = new events.EventEmitter();
let discoveryFunction;
let port;

const startDiscovery = () => {
    discoveryFunction = setInterval(() => {
        console.log("Looking for port...");
    
        SerialPort.list((err, ports) => {
            if (ports.length > 0) emitter.emit('port', ports);
        });
    }, 3000);
}

const onPortCallback = (ports) => {
    port = new SerialPort(ports[0].comName, { baudRate: 115200 });
    port.pipe(readline);

    port.on('open', () => {
        console.log(`Port found: ${ports[0].comName}`);
        clearInterval(discoveryFunction);
    });

    port.on('close', startDiscovery);
}

emitter.on('port', onPortCallback);

module.exports.startDiscovery = startDiscovery;
module.exports.Port = port;
module.exports.Readline = readline;