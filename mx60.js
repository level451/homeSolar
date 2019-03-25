const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller-if00-port0',
    {baudRate: 19200})
port.on('data', function (data) {
    console.log('Data:', data)
})
const parser = port.pipe(new Readline({delimiter: '\r'}))
console.log('here');

port.on('open',function(){
    port.set({dtr:true,rts:false})
    console.log('Outback Port Open')
    });


    parser.on('data',function(serialData){
        let outbackData = serialData.split(',');
        console.log(outbackData)

    }
)
