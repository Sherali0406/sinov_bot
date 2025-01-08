const { Scenes, Markup } = require("telegraf");
const userModel = require("../../models/user.model");
const testResultModel = require("../../models/testResult.model");

const scene = new Scenes.BaseScene("test");

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

scene.enter(async (ctx) => {
    try {
        console.log("Foydalanuvchi sahnaga kirdi: test");
        const user = await userModel.findOne({ userID: ctx.from.id });

        if (user?.hasCompletedTest) {
            await ctx.replyWithHTML("Siz ushbu testni allaqachon yakunlagansiz. Qayta test yechish ruxsat etilmaydi. 👀");
            // return ctx.scene.leave();
        }

        await ctx.replyWithHTML(
            "<b>Testlardan birini tanlang.</b>",
            Markup.inlineKeyboard([
                [Markup.button.callback("Kitoblararo 80 kun 2-bosqich", "start_test")],
                [Markup.button.callback("🔙 Orqaga", "go_back")],
            ])
        );
    } catch (e) {
        console.error("Test sahnasiga kirishda xatolik:", e);
    }
});


// scene.action("start_test", async (ctx) => {
//     await ctx.replyWithHTML(
//         "<b>Test ma'lumotlari:</b>\n\n" +
//         "📝 Test: Kitoblararo 80 kun 2-bosqich\n" +
//         "⏳ Beriladigan vaqt: 1 daqiqa\n" +
//         "📊 Savollar soni: 2 ta\n\n" +
//         "‼️ Testni boshlash uchun quyidagi tugmani bosing.",
//         Markup.inlineKeyboard([
//             [Markup.button.callback("🌟 Testni boshlash", "begin_quiz")],
//             [Markup.button.callback("🔙 Orqaga", "go_back")],
//         ])
//     );
// });


scene.action("start_test", async (ctx) => {
    try {
        console.log("Foydalanuvchi testni boshlash tugmasini bosdi.");
        ctx.session.testIndex = 0;
        ctx.session.correctCount = 0;
        ctx.session.userAnswers = [];

        const currentQuestion = testQuestions[ctx.session.testIndex];
        await ctx.replyWithHTML(
            currentQuestion.question,
            Markup.inlineKeyboard(
                currentQuestion.options.map((option) =>
                    Markup.button.callback(option, `answer_${option}`)
                )
            )
        );
    } catch (e) {
        console.error("Testni boshlashda xatolik:", e);
    }
});

scene.action("begin_quiz", async (ctx) => {
    ctx.session.testIndex = 0;
    ctx.session.correctCount = 0;
    ctx.session.userAnswers = [];

    // Umumiy vaqtni 1 daqiqaga sozlash
    ctx.session.testTimer = setTimeout(async () => {
        await finishTest(ctx); // Testni yakunlash
    }, 60000);

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

scene.action(/^answer_(.*)/, async (ctx) => {
    try {
        const userAnswer = ctx.match[1];
        const currentQuestion = testQuestions[ctx.session.testIndex];

        ctx.session.userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: userAnswer,
            isCorrect: userAnswer === currentQuestion.correctAnswer,
        });

        if (userAnswer === currentQuestion.correctAnswer) {
            ctx.session.correctCount += 1;
        }

        ctx.session.testIndex += 1;

        if (ctx.session.testIndex < testQuestions.length) {
            const nextQuestion = testQuestions[ctx.session.testIndex];
            await ctx.replyWithHTML(
                nextQuestion.question,
                Markup.inlineKeyboard(
                    nextQuestion.options.map((option) =>
                        Markup.button.callback(option, `answer_${option}`)
                    )
                )
            );
        } else {
            await finishTest(ctx);
        }
    } catch (e) {
        console.error("Javobni qayta ishlashda xatolik:", e);
    }
});

async function finishTest(ctx) {
    try {
        const resultMessage = `<b>Test yakunlandi!</b>\nSiz ${ctx.session.correctCount}/${testQuestions.length} ta savolga to'g'ri javob berdingiz.`;
        await ctx.replyWithHTML(resultMessage);

        const user = await userModel.findOne({ userID: ctx.from.id });

        // Test natijasini saqlash
        await testResultModel.create({
            userID: user._id,
            score: ctx.session.correctCount,
            totalQuestions: testQuestions.length,
            answers: ctx.session.userAnswers,
        });

        await userModel.updateOne({ userID: ctx.from.id }, { hasCompletedTest: true });
    } catch (e) {
        console.error("Testni yakunlashda xatolik:", e);
    }
}


scene.action(/^result_(\d+)$/, async (ctx) => {
    const index = Number(ctx.match[1]);
    const answer = ctx.session.userAnswers[index];

    const resultMessage = `<b>Savol:</b>\n${answer.question}\n\n` +
        `<b>Sizning javobingiz:</b> ${answer.selectedAnswer}\n` +
        `<b>To'g'ri javob:</b> ${testQuestions[index].correctAnswer}\n` +
        `<b>Noto'g'ri javobmi?</b> ${answer.isCorrect ? "Yo'q ✅" : "Ha ❌"}`;

    await ctx.editMessageText(resultMessage, {
        parse_mode: "HTML",
    });
});

scene.action("go_back", async (ctx) => {
    await ctx.replyWithHTML(
        "<b>Testlardan birini tanlang.</b>",
        Markup.inlineKeyboard([
            [Markup.button.callback("Kitoblararo 80 kun 2-bosqich", "start_test")],
        ])
    );
});

module.exports = scene;