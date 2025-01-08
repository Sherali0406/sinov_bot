const { Scenes, Markup } = require("telegraf");
const userModel = require("../../models/user.model");
const testResultModel = require("../../models/testResult.model");

const scene = new Scenes.BaseScene("test");

const testQuestions = [
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romani kimning qalamiga mansub?\n\n<b>A)</b> Oybek\n<b>B)</b> M.Shayxzoda\n<b>C)</b> Odil Yoqubov\n<b>D)</b> Cho‘lpon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romani qaysi faslning boshlanishi bilan boshlanadi?\n\n<b>A)</b> Bahor\n<b>B)</b> Qish\n<b>C)</b> Kuz\n<b>D)</b> Yoz",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Tollarning ko‘m-ko‘k sochpopuklari nimaga qiyoslanadi?\n\n<b>A)</b> Bahor yomg‘iriga\n<b>B)</b> Ariqda shildirab oqayotgan suvga\n<b>C)</b> Shudringga\n<b>D)</b> Qizlarning kokillariga",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebinisaning yoshi nechchida edi?\n\n<b>A)</b> 16\n<b>B)</b> 17\n<b>C)</b> 15\n<b>D)</b> 19",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebi nimaning bahonasi bilan bir-ikki marta keng hovlilarga (shahar ichida bo‘lsa ham), dala-tuzlarga chiqib kelganidan beri ko‘ngli qirlarni, dalalarni, ishqilib, olis-olis joylarni yana ko‘proq tusay boshlagan edi?\n\n<b>A)</b> Uzoqdagi qarindoshini ko‘rish bahonasi bilan\n<b>B)</b> Ko‘k terish bahonasi bilan\n<b>C)</b> Dugonasinikiga mehmonga borish bahonasi bilan\n<b>D)</b> O‘qishga borish bahonasi bilan",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebining o‘zi tengi dugonasi kim?\n\n<b>A)</b> Saltanat\n<b>B)</b> Enaxon\n<b>C)</b> Fazilat\n<b>D)</b> Sultonxon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Yoyilma soydagi Enaxon kimning o‘rtog‘i?\n\n<b>A)</b> Saltining\n<b>B)</b> Zebining\n<b>C)</b> Sultonxonning\n<b>D)</b> Fazilatning",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebining onasi kim?\n\n<b>A)</b> Hamro ena\n<b>B)</b> Adolatxon\n<b>C)</b> Poshshaxon\n<b>D)</b> Qurvonbibi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebining otasi kim?\n\n<b>A)</b> Razzoq so'fi\n<b>B)</b> Akbarali\n<b>C)</b> Eshon\n<b>D)</b> Umarali",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebining otasi uning onasini qanday chaqirar edi?\n\n<b>A)</b> Qurvon\n<b>B)</b> Onasi\n<b>C)</b> Fitna\n<b>D)</b> Zebining ismi bilan chaqirar edi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida \"Ko‘rgazmaga qo‘yilaturgan antiqa maxluqlardan edi\" deya ta‘riflangan inson kim?\n\n<b>A)</b> Akbarali\n<b>B)</b> Umarali\n<b>C)</b> Razzoq so‘fi\n<b>D)</b> Xolmat",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebining otasi tug‘ilganida kim unga \"Aylanay, mehmon, kimdan xafa bo‘lib tushdingiz? Kim ozor berdi sizga? Ayting! Qovog‘ingizni ochsangiz-chi! Yorug‘ dunyoga keldingiz! Shukur qiling! Sevining! Mundoq bir kuling! Kulimsirang! Iljaying!..\" deydi?\n\n<b>A)</b> Hoji buvi\n<b>B)</b> Hamro ena\n<b>C)</b> Eshon\n<b>D)</b> Onasi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida So‘zga epchil deb ta‘riflangan obraz kim?\n\n<b>A)</b> Razzoq so‘fi\n<b>B)</b> Umarali shig‘ovul\n<b>C)</b> Zebining onasi\n<b>D)</b> Saltanat",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Kamgap, indamas, damini ichiga solgan, ziqna odam kim?\n\n<b>A)</b> Razzoq so‘fi\n<b>B)</b> Qurvonbibi\n<b>C)</b> Zebinisa\n<b>D)</b> Akbarali",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Kimning tashqari olamda, ya‘ni o‘z hovlisidan tashqarida uning doimiy va birdan-bir vazifasi: o‘zidan ulug‘ va kuchlilar gapirsa, \"hovva-hovva\", demak; o‘zidan past va kuchsizlar gapirsa, \"yo‘q-yo‘q\", degan ma‘noda bosh chayqash bo‘lardi?\n\n<b>A)</b> Razzoq so‘fining\n<b>B)</b> Eshon boboning\n<b>C)</b> Umaralining\n<b>D)</b> Enaxonning akasining",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Umrning tanobi deya nima ta‘riflangan?\n\n<b>A)</b> Pasport\n<b>B)</b> Ko‘tarma kran\n<b>C)</b> To‘sin\n\n<b>A)</b> Vaqt\n<b>B)</b> Uyqu\n<b>C)</b> Sabr\n<b>D)</b> Hayot",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida \"Hubbil vatani minal-imon\". Ushbu so‘zlar kim tomonidan aytilgan?\n\n<b>A)</b> Eshon bobo\n<b>B)</b> Xolmat\n<b>C)</b> Zebining otasi\n<b>D)</b> O‘lmas",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida yuz yetmish yil bo‘lgan emish... Hali ham bir g‘ishti ko‘chgani yo‘q... Ichiga kirsang jaranglaydi... Qayer ta‘riflanyapti?\n\n<b>A)</b> Razzoq so‘fining hovlisi\n<b>B)</b> Akbaralining hashamatli uyi\n<b>C)</b> Masjid\n<b>D)</b> Umarali shiģovulning hammomi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Razzoq so‘fining akasi qishloqqa qaytayotganda kim tiniq ovozi bilan: -\"Xayr endi! Adolatxon opamlar kelishsin. Tuhfachani, albatta, olib keling\", deydi?\n\n<b>A)</b> Qurvonbibi\n<b>B)</b> Zebi\n<b>C)</b> Razzoq so‘fi\n<b>D)</b> Salti",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Qurvonbibi Razzoq so‘figa Zebini Enaxonlarnikiga borishiga ruxsat berishi uchun unga qanday bahona aytadi?\n\n<b>A)</b> Zebining anchadan beri uydan ko‘chaga chiqmaganligini bahona qiladi\n<b>B)</b> Ko‘k terish bahonasini aytadi\n<b>C)</b> Uzoqdagi qarindoshining sog‘ligi yaxshi emasligini va Zebi uni ko‘rib qaytishini bahona qiladi\n<b>D)</b> Oydinko‘ldagi Xalfa eshonning qizi uni chaqirtirganligini bahona qiladi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Qumri kimning dugonasi?\n\n<b>A)</b> Zebining\n<b>B)</b> Fazilatning\n<b>C)</b> Saltanatning\n<b>D)</b> Enaxonning",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Enaxonlarnikiga Saltilarni kim olib boradi?\n\n<b>A)</b> Hamro ena\n<b>B)</b> Sarvibibi\n<b>C)</b> O‘lmas\n<b>D)</b> Qurvonbibi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida aravakash kim?\n\n<b>A)</b> Xolmat\n<b>B)</b> O‘lmas\n<b>C)</b> Umarali\n<b>D)</b> Razzoq so‘fining akasi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Enaxonlarnikiga ketayotganda qizlarga kim ko‘z-quloq bo‘lib ketgan?\n\n<b>A)</b> Hamro ena\n<b>B)</b> Sarvibibi\n<b>C)</b> O‘lmas\n<b>D)</b> Qurvonbibi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Enaxonning akasi kim?\n\n<b>A)</b> O‘lmas\n<b>B)</b> Xolmat\n<b>C)</b> Umarali\n<b>D)</b> Miryoqub",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Akbaralining kichik xotini kim?\n\n<b>A)</b> Sultonxon\n<b>B)</b> Xadichaxon\n<b>C)</b> Poshshaxon\n<b>D)</b> Fazilatxon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Mingboshining qizi kim?\n\n<b>A)</b> Fazilatxon\n<b>B)</b> Sultonxon\n<b>C)</b> Enaxon\n<b>D)</b> Qizi yo’q",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida o‘zi pakana va uning ustiga bukchaygan deya ta‘riflangan obraz kim?\n\n<b>A)</b> Qurvonbibi\n<b>B)</b> Enaxonning onasi\n<b>C)</b> Sarvibibi\n<b>D)</b> Saltining onasi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Enaxonlarnikida bo‘lgan o‘yinda shaharliklardan kim yaxshi o‘ynagan edi?\n\n<b>A)</b> Saltanat\n<b>B)</b> Zebinisa\n<b>C)</b> Qumri\n<b>D)</b> Fazilatxon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question:
            "<b>Savol:</b> \"Kecha va kunduz\" romanida Sultonxonning kelin bo‘lib kelganiga endigina qancha muddat bo‘lgan edi?\n\n<b>A)</b> 5 oy\n<b>B)</b> 6 oy\n<b>C)</b> 4 oy\n<b>D)</b> 3 oy",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Mingboshining o‘limiga aslida kim sababchi bo‘lgan?\n\n<b>A)</b> Zebi\n<b>B)</b> Miryoqub\n<b>C)</b> Poshshaxon\n<b>D)</b> Hakimjon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Choynakda zahar borligini bilmasdan mingboshiga suv quyib bergan obraz kim?\n\n<b>A)</b> Poshshaxon\n<b>B)</b> Xadichaxon\n<b>C)</b> Zebinisa\n<b>D)</b> Fazilatxon",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Choynakdagi irim qilingan suv kimga atalgan edi?\n\n<b>A)</b> Zebiga\n<b>B)</b> Poshshaxonga\n<b>C)</b> Sultonxonga\n<b>D)</b> Saltiga",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Inkvizitsiya so‘zining ma‘nosi nima?\n\n<b>A)</b> Asosiy\n<b>B)</b> Qidiruv\n<b>C)</b> Bosib olish\n<b>D)</b> Qurolli soqchi",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Maktabidan \"ozod\" bo‘lgan eski maktab bolalari singari, o‘zini eshikka urgan va o‘sha onda ko‘zdan yo‘q bo‘lgan obraz kim?\n\n<b>A)</b> Zebi\n<b>B)</b> Domla\n<b>C)</b> Tilmoch\n<b>D)</b> Pristav",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question: "<b>Savol:</b> 𝑭𝒐𝒏𝒊𝒚 𝒅𝒖𝒏𝒚𝒐 𝒃𝒆𝒔𝒉 𝒌𝒖𝒏𝒅𝒊𝒓, -𝒆𝒔𝒉 𝒌𝒖𝒏𝒅𝒊𝒓\n𝒉𝒐-𝒐𝒗,\n𝑺𝒐‘𝒇𝒊𝒍𝒊𝒌 𝒂𝒉𝒅𝒊𝒏 𝒔𝒊𝒏𝒅𝒖𝒓,𝒂𝒉𝒅𝒊𝒏 𝒔𝒊𝒏𝒅𝒖𝒓,\n𝒉𝒐-𝒐𝒗.\n\"Kecha va kunduz\" romanida Ushbu kuyni kim kuylagan?\n\n<b>A)</b> Razzoq so‘fi\n<b>B)</b> Eshon\n<b>C)</b> Domla\n<b>D)</b> Taqsir",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Zebiga qancha muddatga jazo tayinlangan?\n\n<b>A)</b> 7 yil\n<b>B)</b> 6 yil\n<b>C)</b> 10 yil\n<b>D)</b> 5 yil",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida O‘zi to‘qigan \"Yoriltosh\" kuyini \"Zebi, Zebi, Zebona\" deya kuylagan obraz kim?\n\n<b>A)</b> Saltanat\n<b>B)</b> Enaxon\n<b>C)</b> Qurvonbibi\n<b>D)</b> Qumri",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Kimlar Matxoliq tomonidan asad oyida ro‘za tutgan bangiga o‘xshatilgan?\n\n<b>A)</b> Amaldorlar\n<b>B)</b> Xalq\n<b>C)</b> Mingboshilar\n<b>D)</b> Kundoshlar",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
    },
    {
        question: "<b>Savol:</b> \"Kecha va kunduz\" romanida Kim bir tatar yigit bo‘lib, qishloq qarz shirkatlarining inspektori edi?\n\n<b>A)</b> Husainov\n<b>B)</b> Xo‘jayev\n<b>C)</b> Romeyev\n<b>D)</b> Hasanov",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
    }
];

scene.enter(async (ctx) => {
    try {
        console.log("Foydalanuvchi sahnaga kirdi: test");
        const user = await userModel.findOne({ userID: ctx.from.id });

        if (!user) {
            await ctx.reply("Siz ro‘yxatdan o‘tmagansiz. Iltimos, dastlab o‘z profilingizni to‘ldiring.");
            return ctx.scene.leave();
        }

        // Foydalanuvchi allaqachon test ishlaganligini tekshirish
        if (user.hasCompletedTest) {
            await ctx.reply("Siz allaqachon testni ishlagansiz va uni qayta ishlay olmaysiz.");
            return ctx.scene.leave();
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


scene.action("start_test", async (ctx) => {
    await ctx.replyWithHTML(
        "<b>Test ma'lumotlari:</b>\n\n" +
        "📝 Test: Kitoblararo 80 kun 2-bosqich\n" +
        "⏳ Beriladigan vaqt: 40 daqiqa\n" +
        "📊 Savollar soni: 40 ta\n\n" +
        "‼️ Testni boshlash uchun quyidagi tugmani bosing.",
        Markup.inlineKeyboard([
            [Markup.button.callback("🌟 Testni boshlash", "begin_quiz")],
            [Markup.button.callback("🔙 Orqaga", "go_back")],
        ])
    );
});


scene.action("start_test", async (ctx) => {
    try {
        if (!ctx.session) {
            ctx.session = {}; // Agar sessiya bo'sh bo'lsa, uni yaratish
        }

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
        console.error("start_test tugmasida xatolik:", e);
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
    }
});

scene.action("begin_quiz", async (ctx) => {
    ctx.session.testIndex = 0;
    ctx.session.correctCount = 0;
    ctx.session.userAnswers = [];

    // Umumiy vaqtni 1 daqiqaga sozlash
    ctx.session.testTimer = setTimeout(async () => {
        await finishTest(ctx); // Testni yakunlash
    }, 2400000);

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
        if (!ctx.session) {
            ctx.session = {};
        }

        // Savolga javoblarni qayta ishlash
        const userAnswer = ctx.match[1];
        const currentQuestion = testQuestions[ctx.session.testIndex];

        ctx.session.userAnswers = ctx.session.userAnswers || [];
        ctx.session.userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: userAnswer,
            isCorrect: userAnswer === currentQuestion.correctAnswer,
        });

        if (userAnswer === currentQuestion.correctAnswer) {
            ctx.session.correctCount = (ctx.session.correctCount || 0) + 1;
        }

        ctx.session.testIndex += 1;

        // Eski savolni o'chirish
        await ctx.deleteMessage();

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


async function sendQuestion(ctx) {
    const currentQuestion = testQuestions[ctx.session.testIndex];
    await ctx.replyWithHTML(
        currentQuestion.question,
        Markup.inlineKeyboard(
            currentQuestion.options.map((option) =>
                Markup.button.callback(option, `answer_${option}`)
            )
        )
    );
}

async function finishTest(ctx) {
    try {
        const resultMessage = `<b>Test yakunlandi!</b>\nSiz ${ctx.session.correctCount || 0}/${testQuestions.length} ta savolga to'g'ri javob berdingiz.`;
        await ctx.replyWithHTML(resultMessage);

        const user = await userModel.findOne({ userID: ctx.from.id });
        if (!user) {
            await ctx.reply("Foydalanuvchi ma'lumotlarini topib bo‘lmadi.");
            return;
        }

        // Test natijasini saqlash
        await testResultModel.create({
            userID: user._id,
            score: ctx.session.correctCount || 0,
            totalQuestions: testQuestions.length,
            answers: ctx.session.userAnswers || [],
        });

        // Foydalanuvchi statusini yangilash (testni tugatgan deb belgilash)
        await userModel.updateOne({ userID: ctx.from.id }, { $set: { hasCompletedTest: true } });

        // Sessiyani tozalash
        ctx.session = null;
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