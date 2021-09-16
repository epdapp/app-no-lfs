const { remote } = require("electron");
const axios = require("axios");
const authService = remote.require("./services/auth-service");
const authProcess = remote.require("./auth-process");

console.log(authService.getAccessToken())

axios
	.get("http://127.0.0.1:5000/dossiers/all", {
		headers: {
			Authorization: `Bearer ${authService.getAccessToken()}`,
			
		},
	})
	.then((response) => {
		const data = response
		data.foreach((dossier) => {
			const card = document.createElement('button')
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
	  
			const id = dossier.DossierId
	  
			container.appendChild(card)
			card.appendChild(kruisje)
			card.appendChild(h1)
			card.appendChild(h2)
			card.appendChild(ges)
			card.appendChild(p)
	  
			console.log(id)
	  
			card.addEventListener("click", function() {
			  window.location.assign(`./dossier.html?id=${id}`)
			})
		})
	})
	.catch((error) => {
		if (error) throw new Error(error)
	})