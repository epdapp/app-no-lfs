const { ipcRenderer } = require('electron');
const pijltjeBtn = document.getElementById("pijltje-terug")

pijltjeBtn.addEventListener("click", (e) => {
    ipcRenderer.send("pijltje", "");
});
