const { remote, protocol } = require("electron");
const authService = remote.require("./services/auth-service");

form = document.querySelector("form");
zoekBalk = document.getElementById("zoekbalk");
opties = document.getElementById("search-type");

const section = document.querySelector("section");

form.addEventListener("input", (e) => {
  e.preventDefault();
  const searchTerm = zoekBalk.value;
  const optionVal = opties.options[opties.selectedIndex].value;

  if (optionVal) {
    search(searchTerm, optionVal).then(displayDos);
  } else {
    alert(
      "Kies eerst waar je in wilt zoeken door op het dropdown menu te klikken"
    );
  }
});

zoekBalk.addEventListener("input", (e) => {
  const searchTerm = zoekBalk.value;

  if (!searchTerm) {
    section.innerHTML = "";
  }
});

function search(searchTerm, optionVal) {
  return fetch(
    `http://127.0.0.1:5000/dossiers/search?${optionVal}=${searchTerm}`,
    {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    }
  )
    .then((response) => response.json())
    .then((result) => {
      // console.log(authService.getAccessToken())
      return result;
    });
}

function displayDos(result) {
  section.innerHTML = "";

  result.forEach((dossier) => {
    const card = document.createElement("button");
    card.setAttribute("class", "card");

    const h1 = document.createElement("h1");
    h1.textContent = dossier.Ziekte;

    const h2 = document.createElement("h2");
    h2.textContent = `Leeftijd: ${dossier.Leeftijd}`;

    const ges = document.createElement("h2");
    ges.setAttribute("class", "geslacht");
    ges.textContent = `Geslacht: ${dossier.Geslacht}`;

    const p = document.createElement("p");
    p.textContent = `${dossier.Behandeling}`;

    const id = dossier.DossierId;

    section.appendChild(card);
    card.appendChild(h1);
    card.appendChild(h2);
    card.appendChild(ges);
    card.appendChild(p);

    card.addEventListener("click", () => {
      window.location.replace(`./dossier.html?id=${id}`);
    });
  });
}
