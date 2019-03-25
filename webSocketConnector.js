const WebSocket = require('ws');

const EventEmitter = require('events');
const wscEmitter = new EventEmitter();

//class MyEmitter extends EventEmitter {}
module.exports = wscEmitter;
var ws;
var sid;

connect();
function connect() {
    if (!localSettings || !localSettings.home.address){
        console.log("Can't connect to MasterConsole - address not in localsettings");
        return}

    ws = new WebSocket('ws://'+localSettings.home.address+'?mac=unknown&type=homeSolar');

    ws.on('open',heartbeat);
    ws.on('open',function(){


            ws.send(JSON.stringify({emitterId:"systemInfo",mac:machineInfo.network[0].mac,
                event:'machineInfo',
                machineInfo:machineInfo}))


    });
    ws.on('ping', heartbeat);

    ws.on('message', function incoming(data) {
        dataProcessor(JSON.parse(data));
        return;

        setTimeout(function () {
            ws.send(JSON.stringify({emitterId: data.emitterId, results: "sucess"}));
        }, data.timeOut);
        console.log(data);
    });
    ws.on('close', function clear() {
        clearTimeout(this.pingTimeout);
        console.log('onclose - lost connection to master console');
        reconnect();
    });

    ws.on('error', function (err) {
        this.close();
        console.log(err)


    });
    function reconnect(){
        setTimeout(function() {
            connect();
        },5000)

    }
}


function heartbeat() {
    clearTimeout(this.pingTimeout);

    // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
    // equal to the interval at which your server sends out pings plus a
    // conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        this.terminate();
        console.log('terminated connection')
    }, 30000 + 1000);
}

mx60.on('data',(x)=>{
    // ws.send(JSON.stringify({emitterId:'mx60',type:'data',data:x}))
});
