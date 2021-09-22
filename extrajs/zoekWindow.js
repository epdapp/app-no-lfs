const { remote, protocol } = require("electron")
const authService = remote.require("./services/auth-service")

form = document.querySelector("form")
zoekBalk = document.getElementById("zoekbalk")
opties = document.getElementById("search-type")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchTerm = zoekBalk.value
    const optionVal = opties.options[opties.selectedIndex].value
    console.log(searchTerm)
    console.log(optionVal)

    search(searchTerm, optionVal).then(displayDos)
})

function search(searchTerm, optionVal) {
    return fetch(`http:127.0.0.1:5000/dossiers/search?${optionVal}=${searchTerm}`, {
        headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log(authService.getAccessToken())
            return result
        })
}

function displayDos(result) {
    result.forEach((dossier) => {
        const main = document.querySelector("main")
        const card = document.createElement("div")

        const ziekte = document.createElement("p")
        ziekte.textContent = dossier.Ziekte


        document.body.appendChild(card)
        card.appendChild(ziekte)
    })
}