const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
let zoekWindow;
let testWindow;

const remote = require('electron').remote;

// listen for app to be ready
app.on('ready', function(){
    //nieuw venster maken
    mainWindow = new BrowserWindow ({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.maximize();
    // html file laden
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //app sluiten als er op kruisje wordt gedrukt
    mainWindow.on('closed', function(){
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});//go to discord

ipcMain.on("zoekWin", (e, item) => {
    zoekWindow = new BrowserWindow ({
        width: 1280,
        height: 720,
        title: 'Zoeken in dossiers',
        webPreferences: {
            nodeIntegration: true,
        }
    });
    // html file laden
    zoekWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'zoekWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    
});


ipcMain.on('vervangWin', (event, arg) => {
    zoekWindow.close()
});

ipcMain.on("pijltje", (event, arg) => {
    zoekWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'zoekWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
});

function createAddWindow(){
    addWindow = new BrowserWindow ({
        title: 'Nieuw dossier aanmaken',
        width: 1680,
        height: 945,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    addWindow.maximize()
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

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Nieuw Dossier',
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

let isDev = false

const protocol = isDev ? 'dev-app' : 'epdapp';
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });

deeplink.on('received', (link) => {
    try {
        cookie = Buffer.from(link.split("?")[1], 'base64').toString()
    }
    catch(err) {
        console.log("URL decoding failed!")
        exit()
    }


    console.log(cookie)
    
    // Het cookie variable moet met alle requests naar het API mee gestuurd worden met de naam google-login-session

});

