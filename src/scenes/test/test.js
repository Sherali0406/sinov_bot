const { Scenes, Markup } = require("telegraf");
const userModel = require("../../models/user.model"); // Agar foydalanuvchi modeli ishlatilmasa, bu qatorni olib tashlashingiz mumkin

// Test uchun sahna yaratish
const scene = new Scenes.BaseScene("test");

// Test savollari
const testQuestions = [
    {
        question:
            "<b>Savol:</b> Panipat jangida Ibrohim Lo'dining 100 ming kishilik qo‘shiniga qarshi Boburning necha kishilik qo‘shini qatnashgan?\n\n<b>A)</b> 12000\n<b>B)</b> 20000\n<b>C)</b> 70000\n<b>D)</b> 50000",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> Toshkent O'zbekistonning qaysi qismida joylashgan?\n\n<b>A)</b> g'arb\n<b>B)</b> sharq\n<b>C)</b> janub\n<b>D)</b> markaz",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
];

// **Boshlang'ich interfeys (testni tanlash)**
scene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        "<b>Testlardan birini tanlang.</b>",
        Markup.inlineKeyboard([
            [Markup.button.callback("Kitoblararo 80 kun 2-bosqich", "start_test")],
            [Markup.button.callback("🔙 Orqaga", "go_back")],
        ])
    );
});

// **Test ma'lumotlarini ko'rsatish**
scene.action("start_test", async (ctx) => {
    await ctx.replyWithHTML(
        "<b>Test ma'lumotlari:</b>\n\n" +
        "📝 Test: Kitoblararo 80 kun 2-bosqich\n" +
        "⏳ Beriladigan vaqt: 1 daqiqa\n" +
        "📊 Savollar soni: 40 ta\n\n" +
        "‼️ Testni boshlash uchun quyidagi tugmani bosing.",
        Markup.inlineKeyboard([
            [Markup.button.callback("🌟 Testni boshlash", "begin_quiz")],
            [Markup.button.callback("🔙 Orqaga", "go_back")],
        ])
    );
});

// **Savollarni ko'rsatish (testni boshlash)**
scene.action("begin_quiz", async (ctx) => {
    ctx.session.testIndex = 0; // Birinchi savoldan boshlash
    ctx.session.correctCount = 0; // To'g'ri javoblar soni
    ctx.session.userAnswers = []; // Javoblarni saqlash

    const currentQuestion = testQuestions[ctx.session.testIndex];
    await ctx.replyWithHTML(
        currentQuestion.question,
        Markup.inlineKeyboard(
            currentQuestion.options.map((option) =>
                Markup.button.callback(option, `answer_${option}`)
            )
        )
    );
});

// **Savollarga javoblarni qayta ishlash**
scene.action(/^answer_(.*)/, async (ctx) => {
    const userAnswer = ctx.match[1]; // Foydalanuvchi javobi
    const currentQuestion = testQuestions[ctx.session.testIndex];

    // Foydalanuvchi javoblarini saqlash
    ctx.session.userAnswers.push({
        question: currentQuestion.question,
        selectedAnswer: userAnswer,
        isCorrect: userAnswer === currentQuestion.correctAnswer,
    });

    // To'g'ri javoblarni hisoblash
    if (userAnswer === currentQuestion.correctAnswer) {
        ctx.session.correctCount += 1;
    }

    // Keyingi savolga o'tish
    ctx.session.testIndex += 1;

    if (ctx.session.testIndex < testQuestions.length) {
        const nextQuestion = testQuestions[ctx.session.testIndex];

        // Keyingi savolni chiqarish
        await ctx.editMessageText(nextQuestion.question, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: nextQuestion.options.map((option) => [
                    { text: option, callback_data: `answer_${option}` },
                ]),
            },
        });
    } else {
        // Test yakunlandi
        const resultMessage = `<b>Test yakunlandi!</b>\nSiz ${ctx.session.correctCount}/${testQuestions.length} ta savolga to'g'ri javob berdingiz.`;

        await ctx.editMessageText(resultMessage, { parse_mode: "HTML" });

        // Foydalanuvchi ma'lumotlari bilan natijani ko'rsatish (agar kerak bo'lsa)
        const user = await userModel.findOne({ userID: ctx.from.id });
        if (user) {
            const summary =
                `<b>Ism:</b> ${user.full_name}\n<b>Natija:</b> ${ctx.session.correctCount}/${testQuestions.length}\n\n<b>Savollar va javoblar:</b>\n` +
                ctx.session.userAnswers
                    .map((answer, index) => {
                        return `<b>${index + 1}.</b> ${
                            answer.question
                        }\n<b>Sizning javobingiz:</b> ${
                            answer.selectedAnswer
                        }\n<b>To'g'ri javob:</b> ${
                            currentQuestion.correctAnswer
                        }\n`;
                    })
                    .join("\n");

            await ctx.telegram.sendMessage("-4593496345", summary, {
                parse_mode: "HTML",
            });
        }
    }
});

// **Orqaga qaytish**
scene.action("go_back", async (ctx) => {
    await ctx.replyWithHTML(
        "<b>Testlardan birini tanlang.</b>",
        Markup.inlineKeyboard([
            [Markup.button.callback("Kitoblararo 80 kun 2-bosqich", "start_test")],
        ])
    );
});

module.exports = scene;