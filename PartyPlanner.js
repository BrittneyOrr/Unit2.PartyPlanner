const COHORT = '/2311-FTB-MT-WEB-PT';
const BASE_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api';
const EVENTS = '/events';
const API = BASE_URL + COHORT;
const EVENTS_API_URL = BASE_URL + COHORT + EVENTS;

const state = {
    parties: [],
};

async function getParties() {
    try{
        const response = await fetch(EVENTS_API_URL);
        const result = await response.json();
        console.log(result);

        if(result.success === false) {
            throw new Error('Error in fetching Events');
        }

        state.parties = result.data;
    } catch (error) {
        console.error(error);
    }
}

const partiesList = document.querySelector('#parties');

function renderParties() {
    if (!state.parties.length){
        partiesList.innerHTL = '<li>No parties found.</li>';
        return;
    }
    const partyCards = state.parties.map((party) => {
        const partyCard = document.createElement('li');

        partyCard.classList.add('party');
        partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        `;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Party';
        partyCard.append(deleteButton);

        deleteButton.addEventListener('click', () => deleteParty(party.id));
        return partyCard;
    });
    console.log(partyCards);
    console.log(...partyCards);
    partiesList.replaceChildren(...partyCards);
}

async function render() {
    await getParties();
    renderParties();
}

render();

const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', addParty);

// const btn = document.querySelector('.btn');
// btn.addEventListener('click', function (event) {
//     console.log('CLICKED');
// });

async function addParty(event) {
    event.preventDefault();

    await createParty(
        addPartyForm.name.value,
        addPartyForm.description.value,
        addPartyForm.date.value,
        addPartyForm.location.value,
    );
}

async function createParty(name, description, date, location) {
    try{
        const response = await fetch(EVENTS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, date, location })
        });
        const json = await response.json();

        console.log({ json });
        if (json.error) {
            throw new Error(json.message);
        }
        render();
    } catch (error) {
        console.error(error);
    }
}

async function updateParty(id, name, description, date, location) {
    try {
        const response = await fetch (`${EVENTS_API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, date, location })
        });
        const json = await response.json();

        if (json.error) {
            throw new Error (json.message);
        }
        render();
    } catch (error){
        console.error(error);
    }
}

async function deleteParty(id) {
    try {
        const response = await fetch(`${EVENTS_API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error ('Party could not be deleted.');
    }
        render();
    } catch (error) {
        console.log(error);
    }
}