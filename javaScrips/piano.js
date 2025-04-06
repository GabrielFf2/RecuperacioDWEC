import { Nota } from "./class/Nota.js";

let cerca = [];
const partitures = [
    { id: 1, titol: "La Balanguera", idioma: "ca" , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL"] },
    { id: 2, titol: "Merry Christmas", idioma: "en"  , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL"] },
    { id: 3, titol: "Frère Jacques", idioma: "fr" , notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { id: 4, titol: "Sant Antoni i el Dimoni", idioma: "ca" ,  notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { id: 5, titol: "Ode to Joy", idioma: "de", notes: ["MI", "MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO", "DO", "RE", "MI", "MI", "RE", "RE"] },
    { id: 6, titol: "Jingle Bells", idioma: "en", notes: ["MI", "MI", "MI", "MI", "MI", "MI", "MI", "SOL", "DO", "RE", "MI"] },
    { id: 7, titol: "El Cant dels Ocells", idioma: "ca", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 8, titol: "Twinkle Twinkle Little Star", idioma: "en", notes: ["DO", "DO", "SOL", "SOL", "LA", "LA", "SOL"] },
    { id: 9, titol: "Happy Birthday", idioma: "en", notes: ["DO", "DO", "RE", "DO", "FA", "MI"] },
    { id: 10, titol: "Bella Ciao", idioma: "it", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 11, titol: "Himno de la Alegría", idioma: "es", notes: ["MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 12, titol: "Auld Lang Syne", idioma: "en", notes: ["DO", "RE", "MI", "FA", "MI", "RE", "DO", "SOL"] },
    { id: 13, titol: "Guantanamera", idioma: "es", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 14, titol: "Yankee Doodle", idioma: "en", notes: ["DO", "DO", "RE", "MI", "FA", "MI", "RE", "DO"] },
    { id: 15, titol: "L'estaca", idioma: "ca", notes: ["DO", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 16, titol: "Alouette", idioma: "fr", notes: ["RE", "MI", "FA", "MI", "RE", "DO"] },
    { id: 17, titol: "Cielito Lindo", idioma: "es", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 18, titol: "My Bonnie Lies Over the Ocean", idioma: "en", notes: ["FA", "MI", "RE", "DO", "RE", "MI", "FA"] },
    { id: 19, titol: "Greensleeves", idioma: "en", notes: ["DO", "RE", "MI", "FA", "SOL", "LA", "SOL"] },
    { id: 20, titol: "Los peces en el río", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 21, titol: "La Cucaracha", idioma: "es", notes: ["SOL", "SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 22, titol: "Der Mond ist aufgegangen", idioma: "de", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { id: 23, titol: "Hava Nagila", idioma: "he", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 24, titol: "El Condor Pasa", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 25, titol: "Aquarela do Brasil", idioma: "pt", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 26, titol: "Toreador Song", idioma: "fr", notes: ["DO", "FA", "MI", "RE", "DO", "SOL", "FA"] },
    { id: 27, titol: "Funiculì Funiculà", idioma: "it", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { id: 28, titol: "Scarborough Fair", idioma: "en", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 29, titol: "Amazing Grace", idioma: "en", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 30, titol: "Danny Boy", idioma: "en", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] }
];


function addCerca(nom, sostingut) {
    cerca.push(new Nota(nom, sostingut));
}

function reproduirPartitura(notes, button) {
    let delay = 0;
    const duracio = notes.length * 1000;

    let tempsFaltant = duracio / 1000;
    button.textContent = `${tempsFaltant}s`;
    const interval = setInterval(() => {
        tempsFaltant -= 0.1;
        button.textContent = `${tempsFaltant.toFixed(2)}s`;
    }, 100);

    notes.forEach(nota => {
        setTimeout(() => {
            const audio = document.getElementById(`audio-${nota}`);
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        }, delay);
        delay += 1000;
    });

    setTimeout(() => {
        clearInterval(interval);
        button.textContent = 'Reproduir cançó';
    }, duracio);
}

function cercador() {
    const input = document.querySelector('.cercador').value.toUpperCase();
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    partitures.forEach(partitura => {
        if (partitura.notes.join('').includes(input.replace(/\s+/g, ''))) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <p>${partitura.titol} <a class="lyric">Lletra</a></p>
                <button class="button reproduir">Reproduir cançó</button>
            `;
            resultContainer.appendChild(resultItem);

            const reproduirButton = resultItem.querySelector('.reproduir');
            reproduirButton.addEventListener('click', () => {
                reproduirPartitura(partitura.notes, reproduirButton);
            });
        }
    });
}

document.querySelector('.cercar').addEventListener('click', cercador);

document.querySelector('.cercar').addEventListener('click', () => {
    const input = document.querySelector('.cercador').value.toUpperCase();
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    partitures.forEach(partitura => {
        if (partitura.notes.join('').includes(input.replace(/\s+/g, ''))) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <p>${partitura.titol} <a class="lyric">Lletra</a></p>
                <button class="button reproduir">Reproduir cançó</button>
            `;
            resultContainer.appendChild(resultItem);

            const reproduirButton = resultItem.querySelector('.reproduir');
            reproduirButton.addEventListener('click', () => {
                reproduirPartitura(partitura.notes, reproduirButton);
            });
        }
    });
});

document.querySelectorAll(".key").forEach(button => {
    button.addEventListener("click", () => {
        let nota = button.classList[0].toUpperCase();
        let sostingut = button.classList.contains("black");
        addCerca(nota, sostingut);
        console.log("Cerca actual:", cerca.map(n => n.nom));
    });
});

document.querySelector(".borrar").addEventListener("click", () => {
    cerca = [];
    document.querySelector('.cercador').value = '';
    document.getElementById('result-container').innerHTML = '';
    console.log("Cerca esborrada");
});

document.querySelector('.cercar').addEventListener('click', cercador);

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const nota = key.getAttribute('data-note');
        const audio = document.getElementById(`audio-${nota}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    });
});