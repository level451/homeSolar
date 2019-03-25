const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const EventEmitter = require('events');
const mx60Emitter = new EventEmitter();

module.exports = mx60Emitter;
var lastData = {}
var mxC = {};

const port = new SerialPort('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller-if00-port0',
    {baudRate: 19200})

const parser = port.pipe(new Readline({delimiter: '\r'}))
console.log('here');

port.on('open',function(){
    port.set({dtr:true,rts:false})
    console.log('Outback Port Open')
    });


    parser.on('data',function(serialData){
        let outbackData = serialData.split(',');
        outbackData[0]=outbackData[0].substr(1);
        let chargeMode = '';
        switch (Number(outbackData[9])) { // aux mode
            case 0:
                chargeMode = 'Silent';
                break;
            case 1:
                chargeMode = 'Float';
                break;
            case 2:
                chargeMode = 'Bulk';
                break;
            case 3:
                chargeMode = 'Absorb';
                break;
            case 4:
                chargeMode = 'EQ';
                break;
            default:
                console.log('chargemode'+data[9])
        }

        if (outbackData[0] == 'B' || outbackData[0] == 'C'){
            let outbackObject = {}
            // outbackObject = {
            //     chargerCurrent:Number(outbackData[2]),
            //     pvCurrent:Number(outbackData[3]),
            //     pvVoltage:Number(outbackData[4]),
            //     dailyKWH:outbackData[5]/10,
            //     chargeMode:chargeMode,
            //     batteryVoltage:outbackData[10]/10
            // }
            outbackObject = {
                chargerCurrent:Number(outbackData[2]),
                pvCurrent:Number(outbackData[3]),

                dailyKWH:outbackData[5]/10,
                chargeMode:chargeMode,

            }

            if (lastData[outbackData[0]] != outbackObject){
                lastData[outbackData[0]] = outbackObject
                mx60Emitter.emit('data',lastData)
            } else
            {
                mx60Emitter.emit('data','skip')
            }



        } else
        {

            console.log('bad data - rejecting',outbackData[0],)
        }


    }
)
