const { Scenes, Markup } = require("telegraf");
const userModel = require("../models/user.model");
const referalModel = require("../models/referal.model");
const testResultModel = require("../models/testResult.model");

const scene = new Scenes.BaseScene("start");

scene.enter(async (ctx) => {
    try {
        console.log("Foydalanuvchi sahnaga kirdi: start");
        const userID = ctx.from.id;
        const refId = ctx.message?.text?.split(" ")[1];

        const user = await userModel.findOne({ userID });
        console.log("Foydalanuvchi ma'lumotlari:", user);

        if (refId && refId !== String(userID)) {
            const refUser = await userModel.findOne({ userID: refId });

            if (refUser) {
                const existingReferral = await referalModel.findOne({
                    referrer: refUser._id,
                    referredUser: user?._id,
                });

                if (!existingReferral && user) {
                    await referalModel.create({
                        referrer: refUser._id,
                        referredUser: user._id,
                    });
                    console.log("Referal muvaffaqiyatli qo‘shildi.");
                } else {
                    console.log("Referal allaqachon mavjud yoki foydalanuvchi topilmadi.");
                }
            }
        }

        if (!user?.full_name || !user?.phone) {
            console.log("Foydalanuvchida to'liq ma'lumotlar mavjud emas.");
            return ctx.scene.enter("full_name");
        }

        const groupChatId = -4593496345; // Guruh ID
        const groupMessage =
            `📥 <b>Yangi foydalanuvchi ro‘yxatdan o‘tdi:</b>\n` +
            `👤 Ismi: ${user.full_name || "Mavjud emas"}\n` +
            `📞 Telefon: ${user.phone || "Mavjud emas"}\n` +
            `🔗 Referallar soni: 0`;

        await ctx.telegram.sendMessage(groupChatId, groupMessage, { parse_mode: "HTML" });

        const menu = Markup.keyboard([
            ["🔠 Test ishlash", "Natijalar"],
            ["👤 Profilim", "ℹ️ Ma'lumot"],
            ["🖇 Referal olish", "📊 Top referallar"],
            ["📜 Tanlov nizomi", "📖 Qo'llanma"],
            ["📚 Kitoblar"],
        ])
            .resize()
            .oneTime();
        
        await ctx.reply("Asosiy menyu:", menu);
        console.log("Asosiy menyu foydalanuvchiga yuborildi.");
    } catch (e) {
        console.error("Sahnaga kirishda xatolik:", e);
    }
});

scene.hears("🔠 Test ishlash", async (ctx) => {
    ctx.scene.enter("test");
})

scene.hears("Natijalar", async (ctx) => {
    try {
        console.log("Natijalar tugmasi bosildi!");

        const results = await testResultModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $unwind: "$userInfo",
            },
            {
                $group: {
                    _id: "$userID",
                    fullName: { $first: "$userInfo.full_name" },
                    totalScore: { $sum: "$score" },
                    totalQuestions: { $sum: "$totalQuestions" },
                },
            },
            { $sort: { totalScore: -1 } }, // Kamayish tartibida saralash
        ]);

        if (!results || results.length === 0) {
            return ctx.reply("Hozircha hech kim test ishlamagan.");
        }

        let message = "<b>Foydalanuvchilar test natijalari:</b>\n\n";
        results.forEach((result, index) => {
            message += `${index + 1}. ${result.fullName || "Ism yo'q"} - ${result.totalScore}/${result.totalQuestions}\n`;
        });

        await ctx.replyWithHTML(message.trim());
    } catch (e) {
        console.error("Natijalarni olishda xatolik:", e);
        await ctx.reply("Natijalarni olishda xatolik yuz berdi. Keyinroq urinib ko‘ring.");
    }
});


scene.hears("🖇 Referal olish", async (ctx) => {
    try {
        const message = `
📚 <b>KITOBLARARO 80 KUN | MARAFON</b>

Assalomu alaykum, xush kelibsiz!

Respublika ma'naviyat va ma'rifat markazi Surxondaryo viloyati bo'limi tomonidan <b>\"KITOBLARARO 80 KUN\"</b> marafonining birinchi bosqichiga start berildi🔥

G‘oliblar quyidagicha taqdirlanadi:
🔸 <b>1-o‘rin</b> - 8 mln so‘m;
🔸 <b>2-o‘rin</b> - 5 mln so‘m;
🔸 <b>3-o‘rin</b> - 3 mln so‘m;
🔸 <b>4-o‘rin</b> – 1,5 mln so‘m;

🔗 <b>Sizning referal havolangiz:</b>👇
<a href="https://t.me/${process.env.BOT_USERNAME}?start=${ctx.from.id}">Ishtirok etish uchun bu yerni bosing</a>

👉 <b>\"Kitoblararo 80 kun\"</b> marafonini targ‘ib qilib,  
50 dan oshiq referal yig‘gan 4 nafar ishtirokchilar badiiy adabiyotlar bilan taqdirlanadilar.
        `;

        const inlineButton = Markup.inlineKeyboard([
            [
                Markup.button.url(
                    "👉 Ishtirok etish 👈",
                    `https://t.me/${process.env.BOT_USERNAME}?start=${ctx.from.id}`
                ),
            ],
        ]);

        await ctx.replyWithPhoto(
            { source: "1.png" },
            {
                caption: message.trim(),
                parse_mode: "HTML",
                reply_markup: inlineButton,
            }
        );
    } catch (e) {
        console.error("Error in Referal olish:", e);
        await ctx.reply("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    }
});

scene.hears("📊 Top referallar", async (ctx) => {
    try {
        const referrals = await referalModel.aggregate([
            {
                $group: {
                    _id: "$referrer",
                    referralCount: { $sum: 1 },
                },
            },
            {
                $sort: { referralCount: -1 },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "referrerInfo",
                },
            },
            {
                $unwind: "$referrerInfo",
            },
        ]);

        let message = "📊 Top Referallar:\n\n";

        referrals.forEach((ref, index) => {
            message += `${index + 1}. ${ref.referrerInfo.full_name || "Ism yo'q"} - ${ref.referralCount}\n`;
        });

        if (referrals.length === 0) {
            message = "Hech qanday referal topilmadi.";
        }

        await ctx.reply(message.trim());
    } catch (e) {
        console.error("Error in Top referallar:", e);
        await ctx.reply("Referallarni olishda xatolik yuz berdi.");
    }
});

scene.hears("👤 Profilim", async (ctx) => {
    try {
        const groupChatId =  -4593496345;
        const user = await userModel.findOne({ userID: ctx.from.id });
        const referrals = await referalModel.find({ referrer: user?._id });
        const referralCount = referrals.length;

        const profileMessage =
            `📊 Foydalanuvchi profil ma'lumotlari:\n\n` +
            `👤 Ism-familiya: ${user?.full_name || "Mavjud emas"}\n` +
            `📞 Telefon raqami: ${user?.phone || "Mavjud emas"}\n` +
            `🔗 Referallaringiz soni: ${referralCount}\n\n` +
            ` 🔖 Unikal taklif havolangiz: 👇🏻\n` +
            `https://t.me/Kitoblararo_robot?start=${user?.userID}`;

        await ctx.reply(profileMessage);
        await ctx.telegram.sendMessage(groupChatId, profileMessage);
    } catch (e) {
        console.error("Error in Profilim:", e);
        await ctx.reply("Profil ma'lumotlarini olishda xatolik yuz berdi.");
    }
});

scene.hears("📜 Tanlov nizomi", async (ctx) => {
    try {
        const message = `
📜 <b>\"Kitoblararo 80 kun\" marafoni tashkil etish va o‘tkazish bo‘yicha NIZOMI</b>

<b>I. Umumiy qoidalar:</b>

▫️ Ushbu nizom aholi orasida kitobxonlikni targ‘ib etishga qaratilgan “KITOBLARARO 80 KUN” marafonini (keyingi o‘rinlarda Marafon deb yuritiladi) o‘tkazish tartibini belgilaydi.
▫️ Marafonda yosh chegarasi belgilanmagan bo‘lib, barcha O‘zbekiston (Surxondaryo viloyati istiqomat qilayotgan aholi) fuqarolari ishtirok etishlari mumkin.
▫️ Yurtdoshlarimiz, xususan, yoshlar orasida kitobxonlikni keng va zamonaviy yo‘nalishda targ‘ib etish, shu orqali yoshlarni ilm-fan, tarix, adabiyot va madaniyat sohalariga bo‘lgan qiziqishlarini yanada kuchaytirish, ularning bilim va salohiyat darajasini munosib baholash va rag‘batlantirish marafonning asosiy maqsadi hisoblanadi.

👉 <b>Batafsil nizom va dastur bilan tanishib chiqing:</b>
<a href="https://telegra.ph/Kitoblararo-80-kun-marafoni-tashkil-etish-va-otkazish-boyicha-NIZOMI-11-27">Marafon nizomi</a>

✅ Bizni kuzatib boring:
<a href="https://t.me/Janub_javohiri">@Janub_javohiri</a>
        `;

        await ctx.replyWithHTML(message.trim());
    } catch (e) {
        console.error("Error in Tanlov nizomi:", e);
        await ctx.reply("Nizom ma'lumotlarini olishda xatolik yuz berdi.");
    }
});
scene.hears("🔠 Test ishlash", async (ctx) => {
    try {
        console.log('ishlash ishlashishlashishlashishlashishlash');
        await ctx.reply("Hozircha hech qanday test mavjud emas.");
    } catch (e) {
        console.error("Error in Test ishlash:", e);
        await ctx.reply("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    }
});

scene.hears("📚 Kitoblar", async (ctx) => {
    try {
        const message = `
📚 <b>Marafon kitoblari</b>

Marafon kitoblarini quyidagi kanalimizdan barchasini yuklab olishingiz mumkin:

👉 <a href="https://t.me/surxonkitobxonlari">Marafon kitoblari @surxonkitobxonlari</a>
        `;

        await ctx.replyWithHTML(message.trim());
    } catch (e) {
        console.error("Error in Kitoblar:", e);
        await ctx.reply("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    }
});

module.exports = scene;
