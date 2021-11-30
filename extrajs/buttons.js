const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");

const { remote } = require("electron");
const authService = remote.require("./services/auth-service");
const profile = authService.getProfile()

const alleDos = document.getElementById('alles-dos-btn')
const toevoegenBtn = document.getElementById('toevoegen-btn')
const zoekenBtn = document.getElementById('zoeken-btn')
const updatePfBtn = document.getElementById('update-profile-pic-btn')

console.log(profile)

alleDos.addEventListener('click', function(event) {
    ipcRenderer.send("alleDos", ""); 
});

toevoegenBtn.addEventListener('click', function(event) {
    ipcRenderer.send("addWin", "");
});

zoekenBtn.addEventListener("click", (event) => {
    ipcRenderer.send("zoekWindow", "");
})

updatePfBtn.addEventListener("click", () => {
    const uid = profile.sub
    const options = {
        method: 'PATCH',
        url: `https://dev-ahkqnwcv.us.auth0.com/api/v2/users/${uid}`,
        headers: {authorization: `Bearer ${authService.getAccessToken()}`, 'content-type': 'application/json'},
        data: {user_metadata: {picture: 'https://yt3.ggpht.com/a-/AAuE7mCzDfXlmc5jKPKrLNOLIviib-KBJ8H2QBdoTQ=s900-mo-c-c0xffffffff-rj-k-no'}}
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})