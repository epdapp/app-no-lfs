const { BrowserWindow } = require("electron");
const authService = require("./services/auth-service");
const createAppWindow = require("./app-process");
const axios = require("axios");

let win = null;

async function storeUserInDB() {
  const profile = authService.getProfile();
  console.log(profile);
  const fullId = profile.sub;
  const numId = fullId.split("|")[1];
  console.log(numId);
  await axios
    .post(
      "http://127.0.0.1:5000/users/",
      {
        userId: numId,
        name: profile.name,
        email: profile.email,
        profilePicture: profile.picture,
      },
      {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      }
    )
    .then(alert("geluk!"))
    .catch(function (error) {
      console.log(error);
    });
}

function createAuthWindow() {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  win.loadURL(authService.getAuthenticationURL());

  const {
    session: { webRequest },
  } = win.webContents;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await authService.loadTokens(url);
    createAppWindow();
    return destroyAuthWin();
  });

  win.on("authenticated", () => {
    destroyAuthWin();
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
  storeUserInDB();
}

function createLogoutWindow() {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on("ready-to-show", async () => {
    logoutWindow.close();
    await authService.logout();
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};
