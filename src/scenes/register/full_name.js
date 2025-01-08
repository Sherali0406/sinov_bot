const { Scenes } = require("telegraf")
const userModel = require("../../models/user.model")


const scene = new Scenes.BaseScene("full_name")


scene.enter(async (ctx) => {
    ctx.reply("Ism familiyangizni kiriting")
})


scene.on("text", async (ctx) => {
    const userID = ctx.from.id

    await userModel.updateOne(
        { userID },
        {
            $set: {
                full_name: ctx.message.text,
            },
        }
    )

    ctx.scene.enter("phone")
})


module.exports = scene
