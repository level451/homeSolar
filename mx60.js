const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const connector = require('./webSocketConnector');

const EventEmitter = require('events');
const mx60Emitter = new EventEmitter();
var lastSentTime = 0

module.exports = mx60Emitter;
var lastData = {B:{
        chargerCurrent:0,
        pvCurrent:0,
        pvVoltage:0,
        dailyKWH:0,
        chargeMode:'',
        batteryVoltage:0

    },C:{
        chargerCurrent:0,
        pvCurrent:0,
        pvVoltage:0,
        dailyKWH:0,
        chargeMode:'',
        batteryVoltage:0

    }}

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
            outbackObject = {
                chargerCurrent:Number(outbackData[2]),
                pvCurrent:Number(outbackData[3]),
                pvVoltage:Number(outbackData[4]),
                dailyKWH:outbackData[5]/10,
                chargeMode:chargeMode,
                batteryVoltage:Number(outbackData[10])/10
            }

            if ( (Math.abs(lastData[outbackData[0]].batteryVoltage - outbackObject.batteryVoltage).toFixed(1) ) >= 0.1 ){
                lastData[outbackData[0]] = outbackObject
                 lastSentTime = new Date()
                mx60Emitter.emit('data',lastData)
            } else
            {
                if  ((new Date()-lastSentTime) > 3000){
                    lastSentTime = new Date()
                    mx60Emitter.emit('data',lastData)
                }

            }



        } else
        {

            console.log('bad data - rejecting',outbackData[0],)
        }


    }
)
mx60Emitter.on('data',(x)=>{
    //connector.send(JSON.stringify({emitterId:'mx60',type:'data',data:x}))
    connector.remoteEmit('mx60','realTimeData',x)
});
