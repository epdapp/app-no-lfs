const { ipcRenderer } = require("electron")
const app = document.getElementById('test')

const logo = document.createElement('button')
logo.setAttribute('class', 'logo')

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(logo)
app.appendChild(container)

logo.addEventListener("click", () => {
  ipcRenderer.send("vervangWin", "")
});

var request = new XMLHttpRequest()
request.open('GET', `http://127.0.0.1:5000/dossiers/all`, true)
request.setRequestHeader("Content-Type", "application/json")
request.setRequestHeader("Access-Control-Allow-Origin", "*")
request.setRequestHeader("Access-Control-Allow-Credentials", "true")
request.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
request.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach((dossier) => {
      const card = document.createElement('button')
      card.setAttribute('class', 'card')

      const kruisje = document.createElement('button')
      kruisje.setAttribute('class', 'kruisje')

      const h1 = document.createElement('h1')
      h1.textContent = dossier.Ziekte

      const p = document.createElement('p')
      p.textContent = `${dossier.Behandeling}`

      const id = dossier.dossierId

      container.appendChild(card)
      card.appendChild(kruisje)
      card.appendChild(h1)
      card.appendChild(p)

      card.addEventListener("click", function() {
        window.location = `dossier.html?id=${dossier.id}`
      })
    })
  } else {
    const errorMessage = document.createElement('p')
    errorMessage.textContent = `Het werkt niet...`
    app.appendChild(errorMessage)
  }
}

request.send()