require("dotenv").config()

const bot = require("./core/bot")
const session = require("./core/session")
const auth = require("./middleware/auth")
const stage = require("./scenes")
const startBot = require("./utils/startBot")
require("./models/db")

bot.use(session)
bot.use(stage.middleware())
bot.use(auth)
// bot.use(require("./middleware/obuna"))

bot.start((ctx) => {
    if (ctx.chat.type === "private") {
        ctx.scene.enter("start")
    }
})

startBot(bot)
console.log(`🚀  Bot started! => https://t.me/${process.env.BOT_USERNAME}`)
