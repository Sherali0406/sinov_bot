const { Scenes, Markup } = require("telegraf")
const userModel = require("../../models/user.model")

const scene = new Scenes.BaseScene("test")

// Static test questions and answers
const testQuestions = [
    {
        question: "1. 2 + 2 nechiga teng?",
        options: ["3", "4", "5"],
        correctAnswer: "4",
    },
    {
        question: "2. Toshkent O'zbekistonning qaysi qismida joylashgan?",
        options: ["g'arb", "sharq", "janub"],
        correctAnswer: "sharq",
    },
    {
        question: "3. Yerning sun'iy yo'ldoshi nima?",
        options: ["oy", "quyosh", "mars"],
        correctAnswer: "oy",
    },
]

// State to keep track of user progress in test questions
scene.enter(async (ctx) => {
    ctx.session.testIndex = 0 // Start from the first question
    ctx.session.correctCount = 0 // Track correct answers
    ctx.session.userAnswers = [] // Track user answers

    const currentQuestion = testQuestions[ctx.session.testIndex]

    await ctx.reply(
        currentQuestion.question,
        Markup.inlineKeyboard(
            currentQuestion.options.map((option) => Markup.button.callback(option, option))
        )
    )
})

scene.action(/.*/, async (ctx) => {
    const currentQuestion = testQuestions[ctx.session.testIndex]
    const userAnswer = ctx.match[0]

    // Store the user's answer
    ctx.session.userAnswers.push({
        question: currentQuestion.question,
        selectedAnswer: userAnswer,
        isCorrect: userAnswer === currentQuestion.correctAnswer,
    })

    if (userAnswer === currentQuestion.correctAnswer) {
        ctx.session.correctCount += 1 // Increment correct answer count
    }

    ctx.session.testIndex += 1 // Move to the next question

    if (ctx.session.testIndex < testQuestions.length) {
        const nextQuestion = testQuestions[ctx.session.testIndex]
        await ctx.editMessageText(
            nextQuestion.question,
            Markup.inlineKeyboard(
                nextQuestion.options.map((option) => Markup.button.callback(option, option))
            )
        )
    } else {
        // Test completed, show results
        const user = await userModel.findOne({ userID: ctx.from.id }) 

        const resultMessage = `Test yakunlandi! Siz ${ctx.session.correctCount}/${testQuestions.length} ta savolga to'g'ri javob berdingiz.`

        if (user) {
            const summary =
                `Ism: ${user.full_name}\nNatija: ${ctx.session.correctCount}/${testQuestions.length}\n\nSavollar va javoblar:\n` +
                ctx.session.userAnswers
                    .map((answer, index) => {
                        return `${index + 1}. ${answer.question}\nSizning javobingiz: ${
                            answer.selectedAnswer
                        }\nTo'g'ri javob: ${testQuestions[index].correctAnswer}\n`
                    })
                    .join("\n")

            await ctx.telegram.sendMessage("-1002446123573", summary) // Replace with your channel ID
        }

        await ctx.editMessageText(resultMessage)
    }
})

module.exports = scene
