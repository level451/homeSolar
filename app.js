loadLocalSettings()
mx60 = require('./mx60')
mx60.on('data',(x)=>{console.log(x)
console.log()})

connector = require('./webSocketConnector');



function loadLocalSettings() {
    try {
        global.localSettings = require('./localSettings.JSON')
    } catch (err) {
        console.log('Local Settings Failed to Load - Going into setting mode')
        global.localSettings = false
    }
}
