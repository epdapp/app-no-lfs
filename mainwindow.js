// const { remote } = require("electron");
// const axios = require("axios");
// const authService = remote.require("./services/auth-service");
const authProcess = remote.require("./auth-process");
// const profile = authService.getProfile()
const moment = require("moment");

const appendDiv = document.querySelector(".append-time");

const time = document.createElement("div");
time.textContent = moment().format("ddd D MMM, HH:MM").toLowerCase();
appendDiv.appendChild(time);

const webContents = remote.getCurrentWebContents();

webContents.on("dom-ready", () => {
  const profile = authService.getProfile();
  document.getElementById("picture").src = profile.picture;
  document.getElementById("name").innerText = profile.name;
});

console.log(profile.name);

document.getElementById("logout").onclick = async () => {
  const curWin = remote.getCurrentWindow();
  authProcess.createLogoutWindow();
  authProcess.createAuthWindow();
  await curWin.close();
};
