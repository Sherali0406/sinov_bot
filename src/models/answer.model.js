const mongoose = require("mongoose")

const userResponseSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    responses: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            _id: false,
        },
    ],
})

module.exports = mongoose.model("UserResponse", userResponseSchema)
