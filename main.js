const electron = require('electron');
const url = require('url');
const path = require('path');
const {createAuthWindow} = require('./auth-process');
const createAppWindow = require('./app-process');
const authService = require('./services/auth-service');

const { app, BrowserWindow, Menu, ipcMain, session } = electron;

let mainWindow;
let addWindow;
let zoekWindow;
let alleDosWindow;
let dossierWindow;

const remote = require('electron').remote;





async function showWindow() {
    try {
        await authService.refreshTokens();
        return createAppWindow();
    } catch (err) {
        createAuthWindow();
    }
}

// listen for app to be ready
app.on('ready', showWindow, function(){
    //nieuw venster maken

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});//go to discord

ipcMain.on("alleDos", (e, item) => {
   alleDosWindow = new BrowserWindow ({
        width: 1280,
        height: 720,
        title: 'Zoeken in dossiers',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    // html file laden
    alleDosWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'alleDossiers.html'),
        protocol:'file:',
        slashes: true
    }));
    
});


ipcMain.on('vervangWin', (event, arg) => {
    alleDosWindow.close()
});

ipcMain.on("pijltje", (event, arg) => {
    alleDosWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'alleDossiers.html'),
        protocol: 'file:',
        slashes: true
    }));
});

function createAddWindow(){
    addWindow = new BrowserWindow ({
        title: 'Nieuw dossier aanmaken',
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    // html file laden
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));
}

ipcMain.on("addWin", (e, item) => {
    createAddWindow();
});

ipcMain.on("zoekWindow", (e, item) => {
    zoekWindow = new BrowserWindow ({
        width: 1280,
        height: 720,
        title: 'Zoeken in dossiers',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    // html file laden
    zoekWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'zoekWindow.html'),
        protocol:'file:',
        slashes: true
    }));
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Nieuw Dossier',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Sluit venster',
                accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
                click(){
                    let focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.close();
                }
            },
            {
                label: 'Sluiten', 
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Refresh',
                accelerator: process.platform === 'darwin' ? 'Command+R' : 'ctrl+R',
                click(){
                    let focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.reload();
                }
            }
        ]
    }
]

//Als mac wordt gebruikt moet er een leeg object worden toegevoegd aan de menubalk 
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({
        label: ''
    });
}

//developer tools als niet in productie
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}


// main.js
const { Deeplink } = require('electron-deeplink');
const { exit } = require('process');
const { platform } = require('os');

let isDev = false

const protocol = isDev ? 'dev-app' : 'epdapp';
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });

deeplink.on('received', (link) => {
    try {
        cookie = Buffer.from(link.split("?")[1], 'base64').toString()
        console.log("test")
    }
    catch(err) {
        console.log("URL decoding failed!")
        exit()
    }


    console.log(cookie)

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    module.exports = {cookie}
    
    // Het cookie variable moet met alle requests naar het API mee gestuurd worden met de naam google-login-session

});

