const moment = require("moment")
const tz = require("moment-timezone")
const { remote } = require("electron")
const { get } = require("jquery")
const authService = remote.require("./services/auth-service")

const profile = authService.getProfile()

const specDosWrapper = document.querySelector(".spec-dos-wrapper")

const section = document.querySelector("section")
const zoekbalk = document.getElementById("zoekbalk")
const opties = document.getElementById("search-type")

const appendDiv = document.querySelector(".append-time")


function showTime() {
	const timeEl = document.getElementById("time")
	const time = moment().format("HH:mm").toLowerCase()

	const dateEl = document.getElementById("date")
	const date = moment().format("ddd D MMM").toLowerCase()

	timeEl.innerHTML = time
	dateEl.innerHTML = date
}

showTime()

setInterval(showTime, 1000)

const addDossier = document.querySelector(".add-dossier")
const modalAddDos = document.querySelector(".add-dossier-modal")
const closeSpan = document.getElementsByClassName("close")[0]

addDossier.addEventListener("click", () => {
	modalAddDos.style.display = "block"
})

closeSpan.addEventListener("click", () => {
	modalAddDos.style.display = "none"
})

window.addEventListener("click", (e) => {
	if (e.target == modalAddDos) {
		modalAddDos.style.display = "none"
	}
})

const medicijnen = document.getElementById("medicijnen").value
const klachten = document.getElementById("klachten").value
form = document.querySelector("#submit-form")
form.addEventListener("submit", () => {        
  const { remote } = require("electron") 
  const authService = remote.require("./services/auth-service")
  const gesOpties = document.getElementById("geslacht")
  const profile = authService.getProfile()
  const http = require("http");
  const data = JSON.stringify({
	  z: document.getElementById("ziekte").value,
	  b: document.getElementById("behandeling").value,
	  g: document.getElementById("geslacht").value,
	  g: gesOpties.options[gesOpties.selectedIndex].value,
	  l: document.getElementById("leeftijd").value,
	  r: document.getElementById("resultaat").value,
	  k: document.getElementById("klachten").value.split(',', 2),
	  m: document.getElementById("medicijnen").value.split(',', 2),
	  a: profile.name
  })

  const options = {
	  hostname: "127.0.0.1",
	  port: 5000,
	  path: "/dossiers/",
	  method: "POST",
	  headers: {
		"Content-Type": "application/json;charset=utf-8",
		"Data-Type": "charset=utf-8",
		"Content-Length": data.length,
		"Authorization": `Bearer ${authService.getAccessToken()}`,
	  }
  }

  try {          
	const req = http.request(options, (res) => {
	  console.log(`status: ${res.statusCode}`);
	});
	req.write(data);
	req.end();

	alert("dossier toegevoegd") 
	document.getElementById("ziekte").value = ""
	document.getElementById("behandeling").value = ""
	document.getElementById("geslacht").value = ""
	document.getElementById("leeftijd").value = ""
	document.getElementById("resultaat").value = ""
	document.getElementById("klachten").value = ""
	document.getElementById("medicijnen").value = ""
	modalAddDos.style.display = "none"

  } catch(err) {
	console.log(err)
  }
})

const nameContent = document.getElementById("name")
const firstName = profile.name.split(" ")[0]
nameContent.textContent = `Welkom ${firstName}`

document.querySelector("#zoek-form").addEventListener("input", (e) => {
	e.preventDefault()
	const searchTerm = zoekbalk.value
    const optionVal = opties.options[opties.selectedIndex].value

	if (optionVal) {
		search(searchTerm, optionVal).then(displayDos)
	} else {
		alert("Kies godverdomme een optie om te kunnen zoeken!")
	}

	if (!searchTerm) {
		section.innerHTML = ""
	}
})

function search(searchTerm, optionVal) {
    return fetch(`http://127.0.0.1:5000/dossiers/search?${optionVal}=${searchTerm}`, {
        headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`
        }
    })
        .then(response => response.json())
        .then(result => {
            return result
        })
}

function searchSpec(id) {
	return fetch(`http://127.0.0.1:5000/dossiers/${id}`, {
		headers: {
			'Authorization': `Bearer ${authService.getAccessToken()}`
		}
	})
		.then(response => response.json())
		.then(result => {
			console.log(result)
			return result
		})
}

function displaySpecDos(result) {
	const dossier = result

	specDosWrapper.innerHTML = ""

	const card = document.createElement('div')
	card.setAttribute('class', 'card-spec')

	const kruisje = document.createElement('button')
	kruisje.setAttribute('class', 'kruisje')

	const zie = document.createElement('h1')
	zie.textContent = dossier.Ziekte

	const lee = document.createElement('p')
	lee.textContent = `Leeftijd: ${dossier.Leeftijd}`

	const ges = document.createElement('p')
	ges.setAttribute('class', 'geslacht-spec')
	ges.textContent = `Geslacht: ${dossier.Geslacht}`

	const res = document.createElement('p')
	res.textContent = `Resultaat: ${dossier.Resultaat}`

	const beh = document.createElement('p')
	beh.textContent = `Behandeling: ${dossier.Behandeling}`

	const kla = document.createElement('p')
	kla.textContent = `Klachten: ${dossier.k}`

	const med = document.createElement("p")
	med.textContent = `Medicijnen: ${dossier.m}`

	const cre = document.createElement('p')
	cre.textContent = `Aangemaakt: ${dossier.Aangemaakt}`

	const delBut = document.createElement('button')
	delBut.textContent = "Verwijder dossier"

	specDosWrapper.appendChild(card)
	card.appendChild(zie)
	card.appendChild(lee)
	card.appendChild(ges)
	card.appendChild(beh)
	card.appendChild(res)
	card.appendChild(kla)
	card.appendChild(cre)
	card.appendChild(med)
	card.appendChild(delBut)

	const id = dossier.DossierId

	delBut.addEventListener("click", (e) => {
        $.ajax({
          type: "DELETE",
          url: `http://127.0.0.1:5000/dossiers/del/${id}`,
          headers: { "Authorization": `Bearer ${authService.getAccessToken()}` }
        }).then(specDosWrapper.innerHTML = "").then(alert("Dossier verwijderd!"))
      })
}

function displayDos(result) {

    section.innerHTML = ""

    result.forEach((dossier) => {
        const card = document.createElement('button')
        card.setAttribute('class', 'card')

        const kruisje = document.createElement('button')
        kruisje.setAttribute('class', 'kruisje')
  
        const h1 = document.createElement('h1')
        h1.textContent = dossier.Ziekte
  
        const h2 = document.createElement('h2')
        h2.textContent = `Leeftijd: ${dossier.Leeftijd}`
  
        const ges = document.createElement('h2')
		ges.setAttribute('class', 'geslacht')
        ges.textContent = `Geslacht: ${dossier.Geslacht}`
  
        const p = document.createElement('p')
        p.textContent = `${dossier.Behandeling}`
  
        const id = dossier.DossierId


        section.appendChild(card)
        card.appendChild(h1)
        card.appendChild(h2)
        card.appendChild(ges)
        card.appendChild(p)

        card.addEventListener("click", () => {
			console.log(authService.getAccessToken());
			searchSpec(id).then(displaySpecDos)
            // window.location.replace(`./dossier.html?id=${id}`)
        })

    })
}



