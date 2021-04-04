const { ipcRenderer } = require("electron");

const zoekBtn = document.getElementById('zoeken-btn');
const toevoegenBtn = document.getElementById('toevoegen-btn');

zoekBtn.addEventListener('click', function(event) {
    ipcRenderer.send("zoekWin", ""); 
});

toevoegenBtn.addEventListener('click', function(event) {
    ipcRenderer.send("addWin", "");
});
