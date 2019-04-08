loadLocalSettings()
mx60 = require('./mx60')
mx60.test('=================')


const connector = require('@level451/connector');
connector.connect(localSettings.home.address,true,'MX60','mx60');

// function loadLocalSettings() {
//     try {
//         global.localSettings = require('./localSettings.JSON')
//     } catch (err) {
//         console.log('Local Settings Failed to Load - Going into setting mode',err)
//         global.localSettings = false
//     }
// }
function loadLocalSettings() {
global.localSettings = {
    "home":{
        "address":"level451.com:2112"
    }
}
}