const moment = require("moment")
const tz = require("moment-timezone")
const { remote } = require("electron")
const authService = remote.require("./services/auth-service")

const profile = authService.getProfile()

const specDosWrapper = document.querySelector(".spec-dos-wrapper")

const section = document.querySelector("section")
const zoekbalk = document.getElementById("zoekbalk")
const opties = document.getElementById("search-type")

const appendDiv = document.querySelector(".append-time")

const time = document.createElement("div")
time.textContent = moment().format("HH:mm").toLowerCase()
appendDiv.appendChild(time)

const date = document.createElement("div")
date.textContent = moment().format("ddd D MMM").toLowerCase()
appendDiv.appendChild(date)

const nameContent = document.getElementById("name")
nameContent.textContent = `Welkom ${profile.name}`

document.querySelector("form").addEventListener("input", (e) => {
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
			return result
		})
	
}

function displaySpecDos(result) {
	const dossier = result

	specDosWrapper.innerHTML = ""

	const card = document.createElement('button')
	card.setAttribute('class', 'cardSpec')

	const kruisje = document.createElement('button')
	kruisje.setAttribute('class', 'kruisje')

	const h1 = document.createElement('h1')
	h1.textContent = dossier.Ziekte

	const h2 = document.createElement('h2')
	h2.textContent = `Leeftijd: ${dossier.Leeftijd}`

	const ges = document.createElement('h2')
	ges.setAttribute('class', 'geslachtSpec')
	ges.textContent = `Geslacht: ${dossier.Geslacht}`

	const p = document.createElement('p')
	p.textContent = `${dossier.Behandeling}`

	specDosWrapper.appendChild(card)
	card.appendChild(h1)
	card.appendChild(h2)
	card.appendChild(ges)
	card.appendChild(p)
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

