const { ipcRenderer } = require("electron");

const alleDos = document.getElementById('alles-dos-btn');
const toevoegenBtn = document.getElementById('toevoegen-btn');
const zoekenBtn = document.getElementById('zoeken-btn')

alleDos.addEventListener('click', function(event) {
    ipcRenderer.send("alleDos", ""); 
});

toevoegenBtn.addEventListener('click', function(event) {
    ipcRenderer.send("addWin", "");
});

zoekenBtn.addEventListener("click", (event) => {
    ipcRenderer.send("zoekWindow", "");
})