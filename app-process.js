const { BrowserWindow } = require("electron");
const authService = require("./services/auth-service");

function createAppWindow() {
  let win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  win.maximize();

  win.loadFile("./mainwindow.html");

  win.on("closed", () => {
    win = null;
  });
}

module.exports = createAppWindow;
