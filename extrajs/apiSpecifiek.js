const { ipcRenderer } = require("electron")

const app = document.getElementById('test')

const logo = document.getElementById('logo')

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', `https://ghibliapi.herokuapp.com/films`, true)
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach((dossier) => {
      if( "?id=" + dossier.id === document.location.search) {

        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const kruisje = document.createElement('button')
        kruisje.setAttribute('class', 'kruisje')

        const h1 = document.createElement('h1')
        h1.textContent = dossier.title

        const p = document.createElement('p')
        p.textContent = dossier.description

        const date = document.createElement('p')
        date.textContent = `Release date: ${dossier.release_date}`

        const director = document.createElement('p')
        director.textContent = `Director: ${dossier.director}`

        const rt = document.createElement('p')
        rt.textContent = `Tomatometer score: ${dossier.rt_score}`

        container.appendChild(card)
        card.appendChild(kruisje)
        card.appendChild(h1)
        card.appendChild(p)
        card.appendChild(date)
        card.appendChild(director)
        card.appendChild(rt)
        
        document.querySelector("title").innerHTML = `EPD - ${dossier.title}`
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