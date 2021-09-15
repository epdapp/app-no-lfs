const { remote } = require("electron");
const axios = require("axios");
const authService = remote.require("./services/auth-service");
const authProcess = remote.require("./auth-process");

const webContents = remote.getCurrentWebContents();

webContents.on("dom-ready", () => {
  const profile = authService.getProfile();
  document.getElementById("picture").src = profile.picture;
  document.getElementById("name").innerText = profile.name;
  document.getElementById("success").innerText =
    "You successfully used OpenID Connect and OAuth 2.0 to authenticate.";
});

document.getElementById("logout").onclick = async () => {
  const curWin = remote.getCurrentWindow();
  authProcess.createLogoutWindow();
  authProcess.createAuthWindow();
  await curWin.close();
};
