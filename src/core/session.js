const config = require("../utils/config")

const { session: memorySession } = require("telegraf")

const session = memorySession()

module.exports = session
