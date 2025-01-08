const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userID: String,
    full_name: String,
    phone: String,
    telegram: {},
})

module.exports = mongoose.model("User", userSchema)
