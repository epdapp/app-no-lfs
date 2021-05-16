const { ipcRenderer } = require("electron")

const app = document.getElementById('test')

const logo = document.getElementById('logo')

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', `http://127.0.0.1:5000/dossiers/all`, true)
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach((dossier) => {
      if( "?dossierId=" + dossier.dossierId === document.location.search) {

        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const kruisje = document.createElement('button')
        kruisje.setAttribute('class', 'kruisje')

        const h1 = document.createElement('h1')
        h1.textContent = dossier.Ziekte

        const p = document.createElement('p')
        p.textContent = dossier.Behandeling

        const date = document.createElement('p')
        date.textContent = `Klachten: ${dossier.k}`

        const director = document.createElement('p')
        director.textContent = `Medicijnen: ${dossier.m}`

        container.appendChild(card)
        card.appendChild(kruisje)
        card.appendChild(h1)
        card.appendChild(p)
        card.appendChild(date)
        card.appendChild(director)
        
        document.querySelector("title").innerHTML = `EPD - ${dossier.Ziekte}`
      }
    })
  } else {
    const errorMessage = document.createElement('marquee')
    errorMessage.textContent = `It ain't working`
    app.appendChild(errorMessage)
  }
}

logo.addEventListener("click", () => {
  ipcRenderer.send("vervangWin", "")
})

request.send()