const { remote } = require("electron")
const authService = remote.require("./services/auth-service");

const app = document.getElementById('test')

const logo = document.getElementById('logo')

logo.addEventListener("click", () => {
  window.location.replace("./zoekWindow.html")
})

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(container)

const search = document.location.search
id = new URLSearchParams(search).get('id')
console.log(id)
var request = new XMLHttpRequest()
request.open('GET', `http://127.0.0.1:5000/dossiers/${id}`, true)
request.setRequestHeader("Content-Type", "application/json")
request.setRequestHeader("Authorization", `Bearer ${authService.getAccessToken()}`)
request.setRequestHeader("Access-Control-Allow-Origin", "*")
request.setRequestHeader("Access-Control-Allow-Credentials", "true")
request.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
request.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
request.onload = function () {
  // Begin accessing JSON data here
  const data = JSON.parse(this.response)
  const dossier = data
  if (request.status >= 200 && request.status < 400) {
      const card = document.createElement('div')
      card.setAttribute('class', 'card')

      const kruisje = document.createElement('button')
      kruisje.setAttribute('class', 'kruisje')

      const h1 = document.createElement('h1')
      h1.textContent = dossier.Ziekte

      const h2 = document.createElement('h2')
      h2.textContent = `Leeftijd: ${dossier.Leeftijd}`

      const ges = document.createElement('h2')
      ges.textContent = `Geslacht: ${dossier.Geslacht}`

      const p = document.createElement('p')
      p.textContent = `${dossier.Behandeling}`

      const medsContainer = document.createElement('div')
      
      const meds = dossier.m
      meds.forEach((med) => {
        const medTxt = document.createElement('span')
        medTxt.textContent = `${med} `
        medsContainer.appendChild(medTxt)
      })

      const delBut = document.createElement('button')
      delBut.textContent = "Verwijder dossier"

      const id = dossier.DossierId

      container.appendChild(card)
      card.appendChild(kruisje)
      card.appendChild(h1)
      card.appendChild(h2)
      card.appendChild(ges)
      card.appendChild(p)
      card.appendChild(medsContainer)
      card.appendChild(delBut)
  } else {
    const errorMessage = document.createElement('p')
    errorMessage.textContent = `Het werkt niet...`
    app.appendChild(errorMessage)
  }
}

request.send()