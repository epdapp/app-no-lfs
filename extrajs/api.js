const { ipcRenderer } = require("electron")

const app = document.getElementById('test')

const logo = document.createElement('img')
logo.src = 'img/logo.png'

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(logo)
app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', `https://ghibliapi.herokuapp.com/films`, true)
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
      h1.textContent = dossier.title

      const p = document.createElement('p')
      dossier.description = dossier.description.substring(0, 300)
      p.textContent = `${dossier.description}...`

      const id = dossier.id

      container.appendChild(card)
      card.appendChild(kruisje)
      card.appendChild(h1)
      card.appendChild(p)

      card.addEventListener("click", function() {
        window.location = `dossier.html?id=${dossier.id}`
      })
    })
  } else {
    const errorMessage = document.createElement('marquee')
    errorMessage.textContent = `Het werkt niet...`
    app.appendChild(errorMessage)
  }
}

request.send()