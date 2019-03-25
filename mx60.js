const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const EventEmitter = require('events');
const mx60Emitter = new EventEmitter();

module.exports = mx60Emitter;


const port = new SerialPort('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller-if00-port0',
    {baudRate: 19200})

const parser = port.pipe(new Readline({delimiter: '\r\n'}))
console.log('here');

port.on('open',function(){
    port.set({dtr:true,rts:false})
    console.log('Outback Port Open')
    });


    parser.on('data',function(serialData){
        let outbackData = serialData.split(',');
        if (outbackData[0] != 'B' || outbackData[0] != 'C'){
            console.log('bad data - rejecting',outbackData[0])

        } else
        {
            mx60Emitter.emit('data',{
                address:outbackData[0],
                chargerCurrent:outbackData[2],
                pvCurrent:outbackData[3],
                pvVoltage:outbackData[4],
                dailyKWH:outbackData[5]/10,
                tenths:outbackData[6],
                auxMode:outbackData[7],
                errorMode:outbackData[8],
                chargeMode:outbackData[9],
                batteryVoltage:outbackData[10]/10,
                dailyAH:outbackData[11]

            })

        }


    }
)
