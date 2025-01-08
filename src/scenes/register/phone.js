const { Scenes } = require("telegraf")
const userModel = require("../../models/user.model")

const scene = new Scenes.BaseScene("phone")

scene.enter(async (ctx) => {
    ctx.reply("Telefon raqamingizni yuboring")
})

scene.on("text", async (ctx) => {
    const userID = ctx.from.id

    await userModel.updateOne(
        { userID },
        {
            $set: {
                phone: ctx.message.text,
            },
        }
    )
    ctx.reply("Ro'yxatdan muvofaqqiyatli o'tdingiz")
    return ctx.scene.enter("start")
})

module.exports = scene
