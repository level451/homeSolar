loadLocalSettings()
mx60 = require('./mx60')
mx60.test('=================')
mx60.on('data',(x)=>{console.log(x)
console.log()})




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