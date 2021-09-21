const { remote } = require("electron")
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

    search(searchTerm, optionVal)
})

function search(searchTerm, optionVal) {
    fetch(`http:127.0.0.1:5000/dossiers/search?${optionVal}=${searchTerm}`, {
        headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`
        }
    })
        .then(response => response)
        .then(result => {
            const id = result

            console.log(id);
        })
}

function fetchSpecDos(id) {
    fetch(`http://127.0.0.1:5000/dossiers/${id}`, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}` 
            }
        })
        .then(response => response.json)
        .then(result => {
            console.log(result)
        })
}
