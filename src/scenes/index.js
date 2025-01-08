const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./register/full_name'),
    require('./register/phone'),
    require('./test/test'),
]);

module.exports = stage; 