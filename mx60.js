const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller-if00-port0',
    {baudRate: 19200})

const parser = port.pipe(new Readline({delimiter: '\r'}))
console.log('here')
parser.on('data', console.log)