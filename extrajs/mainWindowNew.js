const moment = require("moment")
const tz = require("moment-timezone")
const { remote } = require("electron")
const authService = remote.require("./services/auth-service")

const profile = authService.getProfile()

const appendDiv = document.querySelector(".append-time")

const time = document.createElement("div")
time.textContent = moment().format("HH:mm").toLowerCase()
appendDiv.appendChild(time)

const date = document.createElement("div")
date.textContent = moment().format("ddd D MMM").toLowerCase()
appendDiv.appendChild(date)
