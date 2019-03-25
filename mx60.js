const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const EventEmitter = require('events');
const mx60Emitter = new EventEmitter();

module.exports = mx60Emitter;


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

        if (outbackData[0] == '\nB' || outbackData[0] == '\nC'){
            let  outbackObject = {
                address:outbackData[0],
                chargerCurrent:outbackData[2],
                pvCurrent:outbackData[3],
                pvVoltage:outbackData[4],
                dailyKWH:outbackData[5]/10,
                tenths:outbackData[6],
                chargeMode:chargeMode,
                batteryVoltage:outbackData[10]/10,
                dailyAH:outbackData[11]
            }

            mx60Emitter.emit('data',outbackObject)

        } else
        {

            console.log('bad data - rejecting',outbackData[0],)
        }


    }
)
