const moment = require('moment');
const axios = require('axios').default;
const { remote } = require('electron');
const authService = remote.require('./services/auth-service');

const profile = authService.getProfile();
const fullId = profile.sub;
const numId = fullId.split('|')[1];

const specDosWrapper = document.querySelector('.spec-dos-wrapper');

const section = document.querySelector('#section-all-dossiers');
const zoekbalk = document.getElementById('zoekbalk');
const opties = document.getElementById('search-type');

const appendDiv = document.querySelector('.append-time');

const modalSection = document.querySelector('.modal-wrapper');
const modalAllDosContent = document.querySelector('.all-dossier-modal-content');

let isSaved = false;

function showTime() {
  const timeEl = document.getElementById('time');
  const time = moment().format('HH:mm').toLowerCase();

  const dateEl = document.getElementById('date');
  const date = moment().format('ddd D MMM').toLowerCase();

  timeEl.innerHTML = time;
  dateEl.innerHTML = date;
}

showTime();

setInterval(showTime, 1000);

function getPicture() {
  return axios
    .get(`http://127.0.0.1:5000/profilepicture/${numId}`, {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data[0].ProfielFoto;
    });
}

async function showPicture() {
  const pic = await getPicture();
  console.log(pic);
  const picEl = document.querySelector('.profile-pic');
  picEl.src = pic;
  const picDetail = document.querySelector('.pic-in-dropdown');
  picDetail.style.backgroundImage = `url(${pic})`;
  return picEl;
}

showPicture();

const buttonWrapperImage = document.querySelector('.button-wrapper-img');
const dropDown = document.querySelector('.dropdown');

buttonWrapperImage.addEventListener('click', () => {
  dropDown.classList.toggle('shown');
  console.log(dropDown.outerHTML);
});

const modalChangePic = document.querySelector('.modal-change-pic');

document
  .querySelector('.open-change-pic-modal')
  .addEventListener('click', () => {
    modalChangePic.style.display = 'block';
  });

const changePic = document.querySelector('.change-profile-pic');

changePic.addEventListener('click', async (e) => {
  await updatePicture();
});

const addDossier = document.querySelector('.add-dossier');
const modalAddDos = document.querySelector('.add-dossier-modal');
const closeSpan = document.getElementsByClassName('close')[0];

addDossier.addEventListener('click', () => {
  modalAddDos.style.display = 'block';
});

closeSpan.addEventListener('click', () => {
  modalAddDos.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target == modalAddDos) {
    modalAddDos.style.display = 'none';
  }
  if (e.target == modalChangePic) {
    modalChangePic.style.display = 'none';
  }
});

function postDossier() {
  const gesOpties = document.getElementById('geslacht');
  axios
    .post(
      'http://127.0.0.1:5000/dossiers/',
      {
        z: document.getElementById('ziekte').value,
        b: document.getElementById('behandeling').value,
        g: document.getElementById('geslacht').value,
        g: gesOpties.options[gesOpties.selectedIndex].value,
        l: document.getElementById('leeftijd').value,
        r: document.getElementById('resultaat').value,
        k: document.getElementById('klachten').value.split(',', 2),
        m: document.getElementById('medicijnen').value.split(',', 2),
        a: profile.name,
      },
      {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      }
    )
    .then(() => {
      alert('Dossier toegevoegd');
      modalAddDos.style.display = 'none';
    })
    .catch(function (error) {
      console.log(error);
    });
}

const medicijnen = document.getElementById('medicijnen').value;
const klachten = document.getElementById('klachten').value;
form = document.querySelector('#submit-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  postDossier();
});

const allDossiers = document.querySelector('.all-dossiers');
const modalAllDos = document.querySelector('.all-dossier-modal');

allDossiers.addEventListener('click', async () => {
  modalAllDos.style.display = 'block';
  modalAllDosContent.innerHTML = '';
  fetchAll().then(displayDosModal);
  await checkIfSaved(1);
  console.log('test');
});

closeSpan.addEventListener('click', () => {
  modalAllDos.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target == modalAllDos) {
    modalAllDos.style.display = 'none';
  }
});

const savedDossiers = document.querySelector('.saved-dossiers');
const modalSavedDos = document.querySelector('.saved-dossiers-modal');
const modalSavedWrapper = document.querySelector(
  '.saved-dossiers-modal-wrapper'
);
const closeSavedDos = document.querySelector('.close-saved');

savedDossiers.addEventListener('click', async () => {
  const allDossierId = await getSavedDossiersId();
  if (allDossierId == null) {
    alert('Je hebt geen opgeslagen dossiers');
  } else {
    getAllSavedDossiersAndDisplay(allDossierId);
    modalSavedDos.style.display = 'block';
  }
});

window.addEventListener('click', (e) => {
  if (e.target == modalSavedDos) {
    modalSavedDos.style.display = 'none';
    modalSavedWrapper.innerHTML = '';
  }
});

closeSavedDos.addEventListener('click', () => {
  modalSavedDos.style.display = 'none';
  modalSavedWrapper.innerHTML = '';
});

function fetchAll() {
  return fetch('http://127.0.0.1:5000/dossiers/all', {
    headers: {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

const nameContent = document.getElementById('name');
const firstName = profile.name.split(' ')[0];
nameContent.textContent = `Welkom ${firstName}`;

document.querySelector('#zoek-form').addEventListener('input', (e) => {
  e.preventDefault();
  const searchTerm = zoekbalk.value;
  const optionVal = opties.options[opties.selectedIndex].value;

  if (optionVal) {
    search(searchTerm, optionVal).then(displayDos);
  } else {
    alert('Kies godverdomme een optie om te kunnen zoeken!');
  }

  if (!searchTerm) {
    section.innerHTML = '';
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
      return result;
    });
}

function searchSpec(id) {
  return fetch(`http://127.0.0.1:5000/dossiers/${id}`, {
    headers: {
      Authorization: `Bearer ${authService.getAccessToken()}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    });
}

function displaySpecDos(result) {
  const dossier = result;

  specDosWrapper.innerHTML = '';

  dossier.innerHTML = '';

  const card = document.createElement('div');
  card.setAttribute('class', 'card-spec');

  const kruisje = document.createElement('button');
  kruisje.setAttribute('class', 'kruisje');

  const zie = document.createElement('h1');
  zie.textContent = dossier.Ziekte;

  const lee = document.createElement('p');
  lee.textContent = `Leeftijd: ${dossier.Leeftijd}`;

  const ges = document.createElement('p');
  ges.setAttribute('class', 'geslacht-spec');
  ges.textContent = `Geslacht: ${dossier.Geslacht}`;

  const res = document.createElement('p');
  res.textContent = `Resultaat: ${dossier.Resultaat}`;

  const beh = document.createElement('p');
  beh.textContent = `Behandeling: ${dossier.Behandeling}`;

  const kla = document.createElement('p');
  kla.textContent = `Klachten: ${dossier.k}`;

  const med = document.createElement('p');
  med.textContent = `Medicijnen: ${dossier.m}`;

  const cre = document.createElement('p');
  cre.textContent = `Aangemaakt: ${dossier.Aangemaakt}`;

  const savedWrapper = document.createElement('div');
  savedWrapper.setAttribute('class', 'saved-wrapper');

  if (!isSaved) {
    const save = document.createElement('button');
    const saveImage = document.createElement('img');
    saveImage.src = './img/niet-opgeslagen.svg';

    save.appendChild(saveImage);
    savedWrapper.appendChild(save);

    save.addEventListener('click', async () => {
      const preStoredDossiers = await getSavedDossiersId();
      console.log(preStoredDossiers);
      saveDossier(id, preStoredDossiers);

      window.setTimeout(() => {
        window.location.reload();
      }, 200);
    });
  } else {
    const delSave = document.createElement('button');
    const delSaveImage = document.createElement('img');
    delSaveImage.src = './img/opgeslagen.svg';

    delSave.appendChild(delSaveImage);
    savedWrapper.appendChild(delSave);

    delSave.addEventListener('click', async () => {
      console.log(id);

      const preStoredDossiers = await getSavedDossiersId();
      preStoredArray = preStoredDossiers.split(', ');

      const index = preStoredArray.indexOf(`${id}`);

      if (index > -1) {
        preStoredArray.splice(index, 1);
      }
      preStoredString = preStoredArray.join(', ');
      console.log(preStoredString);
      const fullId = profile.sub;
      const numId = fullId.split('|')[1];
      await axios
        .put(
          'http://127.0.0.1:5000/del-saved-dossier',
          {
            userId: numId,
            dosString: preStoredString,
          },
          {
            headers: {
              Authorization: `Bearer ${authService.getAccessToken()}`,
            },
          }
        )
        .then(alert('Dossier niet meer opgeslagen!'))
        .then(
          window.setTimeout(() => {
            window.location.reload(true);
          }, 200)
        )
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  const delBut = document.createElement('button');
  delBut.textContent = 'Verwijder dossier';

  specDosWrapper.appendChild(card);
  card.appendChild(zie);
  card.appendChild(lee);
  card.appendChild(ges);
  card.appendChild(beh);
  card.appendChild(res);
  card.appendChild(kla);
  card.appendChild(cre);
  card.appendChild(med);
  card.appendChild(delBut);
  card.appendChild(savedWrapper);

  const id = dossier.DossierId;

  delBut.addEventListener('click', (e) => {
    $.ajax({
      type: 'DELETE',
      url: `http://127.0.0.1:5000/dossiers/del/${id}`,
      headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
    })
      .then((specDosWrapper.innerHTML = ''))
      .then(alert('Dossier verwijderd!'));
  });
}

function displayDos(result) {
  console.log(authService.getAccessToken());

  section.innerHTML = '';

  result.forEach((dossier) => {
    const card = document.createElement('button');
    card.setAttribute('class', 'card');

    const kruisje = document.createElement('button');
    kruisje.setAttribute('class', 'kruisje');

    const h1 = document.createElement('h1');
    if (dossier.Ziekte != null) {
      h1.textContent = dossier.Ziekte;
    } else {
      h1.textContent = 'Geen ziekte gespecificeerd';
    }

    const h2 = document.createElement('h2');
    if (dossier.Leeftijd != null) {
      h2.textContent = `Leeftijd: ${dossier.Leeftijd}`;
    } else {
      h2.textContent = 'Geen leeftijd gespecificeerd';
    }

    const ges = document.createElement('h2');
    ges.setAttribute('class', 'geslacht');
    if (dossier.Geslacht != null) {
      ges.textContent = `Geslacht: ${dossier.Geslacht}`;
    } else {
      ges.textContent = 'Geen geslacht gespecificeerd';
    }

    const p = document.createElement('p');
    if (dossier.Behandeling != null) {
      p.textContent = `${dossier.Behandeling}`;
    } else {
      p.textContent = 'Geen behandeling gespecificeerd';
    }

    const id = dossier.DossierId;

    section.appendChild(card);
    card.appendChild(h1);
    card.appendChild(h2);
    card.appendChild(ges);
    card.appendChild(p);

    card.addEventListener('click', async () => {
      console.log(authService.getAccessToken());
      searchSpec(id)
        .then(await checkIfSaved(id))
        .then(displaySpecDos);
      // window.location.replace(`./dossier.html?id=${id}`)
    });
  });
}

function displayDosModal(result) {
  debugger;
  console.log(result);
  let allIds = '';
  result.forEach((dossier) => {
    allIds += dossier.DossierId + ' ';
  });

  console.log(allIds.split(' '));

  // const allDisplayedDossiers = result
  result.forEach((dossier) => {
    const allDosMod = document.querySelector('.all-dossier-modal');
    const card = document.createElement('button');
    card.setAttribute('class', 'card card-in-modal');

    const kruisje = document.createElement('button');
    kruisje.setAttribute('class', 'kruisje');

    const h1 = document.createElement('h1');
    h1.textContent = dossier.Ziekte;

    const h2 = document.createElement('h2');
    h2.textContent = `Leeftijd: ${dossier.Leeftijd}`;

    const ges = document.createElement('h2');
    ges.setAttribute('class', 'geslacht');
    ges.textContent = `Geslacht: ${dossier.Geslacht}`;

    const p = document.createElement('p');
    p.textContent = `${dossier.Behandeling}`;

    modalAllDosContent.appendChild(card);
    card.appendChild(h1);
    card.appendChild(h2);
    card.appendChild(ges);
    card.appendChild(p);

    const specId = dossier.DossierId;

    card.addEventListener('click', async () => {
      modalAllDosContent.innerHTML = '';
      const specDosRes = await axios.get(
        `http://127.0.0.1:5000/dossiers/${specId}`,
        {
          headers: {
            Authorization: `Bearer ${authService.getAccessToken()}`,
          },
        }
      );
      const specDos = specDosRes.data;

      const card = document.createElement('div');
      card.setAttribute('class', 'card-spec');

      const kruisje = document.createElement('button');
      kruisje.setAttribute('class', 'kruisje');

      const zie = document.createElement('h1');
      zie.textContent = specDos.Ziekte;

      const lee = document.createElement('p');
      lee.textContent = `Leeftijd: ${specDos.Leeftijd}`;

      const ges = document.createElement('p');
      ges.setAttribute('class', 'geslacht-spec');
      ges.textContent = `Geslacht: ${specDos.Geslacht}`;

      const res = document.createElement('p');
      res.textContent = `Resultaat: ${specDos.Resultaat}`;

      const beh = document.createElement('p');
      beh.textContent = `Behandeling: ${specDos.Behandeling}`;

      const kla = document.createElement('p');
      kla.textContent = `Klachten: ${specDos.k}`;

      const med = document.createElement('p');
      med.textContent = `Medicijnen: ${specDos.m}`;

      const cre = document.createElement('p');
      cre.textContent = `Aangemaakt: ${specDos.Aangemaakt}`;

      const savedWrapper = document.createElement('div');
      savedWrapper.setAttribute('class', 'saved-wrapper');

      if (!isSaved) {
        const save = document.createElement('button');
        const saveImage = document.createElement('img');
        saveImage.src = './img/niet-opgeslagen.svg';

        save.appendChild(saveImage);
        savedWrapper.appendChild(save);

        save.addEventListener('click', async () => {
          const preStoredDossiers = await getSavedDossiersId();
          console.log(preStoredDossiers);
          saveDossier(id, preStoredDossiers);

          window.setTimeout(() => {
            window.location.reload();
          }, 200);
        });
      } else {
        const delSave = document.createElement('button');
        const delSaveImage = document.createElement('img');
        delSaveImage.src = './img/opgeslagen.svg';

        delSave.appendChild(delSaveImage);
        savedWrapper.appendChild(delSave);

        delSave.addEventListener('click', async () => {
          console.log(id);

          const preStoredDossiers = await getSavedDossiersId();
          preStoredArray = preStoredDossiers.split(', ');

          const index = preStoredArray.indexOf(`${id}`);

          if (index > -1) {
            preStoredArray.splice(index, 1);
          }
          preStoredString = preStoredArray.join(', ');
          console.log(preStoredString);
          const fullId = profile.sub;
          const numId = fullId.split('|')[1];
          await axios
            .put(
              'http://127.0.0.1:5000/del-saved-dossier',
              {
                userId: numId,
                dosString: preStoredString,
              },
              {
                headers: {
                  Authorization: `Bearer ${authService.getAccessToken()}`,
                },
              }
            )
            .then(alert('Dossier niet meer opgeslagen!'))
            .then(
              window.setTimeout(() => {
                window.location.reload(true);
              }, 200)
            )
            .catch(function (error) {
              console.log(error);
            });
        });
      }

      const delBut = document.createElement('button');
      delBut.textContent = 'Verwijder dossier';

      modalAllDosContent.appendChild(card);
      card.appendChild(zie);
      card.appendChild(lee);
      card.appendChild(ges);
      card.appendChild(beh);
      card.appendChild(res);
      card.appendChild(kla);
      card.appendChild(cre);
      card.appendChild(med);
      card.appendChild(delBut);
      card.appendChild(savedWrapper);

      const id = dossier.DossierId;

      delBut.addEventListener('click', (e) => {
        $.ajax({
          type: 'DELETE',
          url: `http://127.0.0.1:5000/dossiers/del/${id}`,
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        })
          .then((specDosWrapper.innerHTML = ''))
          .then(alert('Dossier verwijderd!'));
      });
    });
  });
}

async function saveDossier(id, preStoredDossiers) {
  const fullId = profile.sub;
  const numId = fullId.split('|')[1];

  let dossierId = `${preStoredDossiers}, ${id}`;

  if (preStoredDossiers == undefined) {
    dossierId = id;
  }

  await axios
    .put(
      'http://127.0.0.1:5000/saveddossiers/',
      {
        userId: numId,
        dossierId: dossierId,
      },
      {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      }
    )
    .then(alert('geluk!'))
    .catch(function (error) {
      console.log(error);
    });
}

function getSavedDossiersId() {
  return axios
    .get(`http://127.0.0.1:5000/get-saveddossiers/${numId}`, {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data[0].StoredDossier;
    });
}

function displaySavedDos(dossier) {
  const wrapper = document.querySelector('.saved-dossiers-modal-wrapper');

  const card = document.createElement('button');
  card.setAttribute('class', 'card card-in-modal');

  const kruisje = document.createElement('button');
  kruisje.setAttribute('class', 'kruisje');

  const h1 = document.createElement('h1');
  h1.textContent = dossier.Ziekte;

  const h2 = document.createElement('h2');
  h2.textContent = `Leeftijd: ${dossier.Leeftijd}`;

  const ges = document.createElement('h2');
  ges.setAttribute('class', 'geslacht');
  ges.textContent = `Geslacht: ${dossier.Geslacht}`;

  const p = document.createElement('p');
  p.textContent = `${dossier.Behandeling}`;

  const id = dossier.DossierId;

  wrapper.appendChild(card);
  card.appendChild(h1);
  card.appendChild(h2);
  card.appendChild(ges);
  card.appendChild(p);
}

function getAllSavedDossiersAndDisplay(allDossierId) {
  const allDossierIdArray = allDossierId.toString().split(', ');

  console.log(allDossierIdArray);

  allDossierIdArray.forEach((dossierId) => {
    return axios
      .get(`http://127.0.0.1:5000/dossiers/${dossierId}`, {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        const dossier = response.data;
        displaySavedDos(dossier);
      });
  });
}

function checkIfSaved(dossierId) {
  return axios
    .get(`http://127.0.0.1:5000/get-saveddossiers/${numId}`, {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    })
    .then((response) => {
      const storedDossiers = response.data[0].StoredDossier.toString();
      if (storedDossiers.length <= 1) {
        if (storedDossiers === `${dossierId}`) {
          isSaved = true;
        } else {
          isSaved = false;
        }
      } else {
        storedDossier = storedDossiers.split(', ');
        if (storedDossiers.includes(`${dossierId}`)) {
          isSaved = true;
        } else {
          isSaved = false;
        }
      }
    });
}

function updatePicture() {
  axios
    .put(
      'http://127.0.0.1:5000/profilepicture',
      {
        userId: `${numId}`,
        picUrl: document.getElementById('change-img-input').value,
      },
      {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      }
    )
    .then(alert('profielfoto is gewijzigd!'))
    .catch((error) => {
      console.log(error);
    });
}
