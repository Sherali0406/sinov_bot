const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    full_name: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [
        {
            question: { type: String, required: true },
            selectedAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestResult", testResultSchema);
