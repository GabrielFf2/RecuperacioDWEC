import { Nota } from "./class/Nota.js";

let cerca = [];
const partitures = [
    { titol: "La Balanguera", idioma: "ca" , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { titol: "Merry Christmas", idioma: "en"  , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { titol: "Frère Jacques", idioma: "fr" , notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { titol: "Sant Antoni i el Dimoni", idioma: "ca" ,  notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { titol: "Ode to Joy", idioma: "de", notes: ["MI", "MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO", "DO", "RE", "MI", "MI", "RE", "RE"] },
    { titol: "Jingle Bells", idioma: "en", notes: ["MI", "MI", "MI", "MI", "MI", "MI", "MI", "SOL", "DO", "RE", "MI"] },
    { titol: "El Cant dels Ocells", idioma: "ca", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Twinkle Twinkle Little Star", idioma: "en", notes: ["DO", "DO", "SOL", "SOL", "LA", "LA", "SOL"] },
    { titol: "Happy Birthday", idioma: "en", notes: ["DO", "DO", "RE", "DO", "FA", "MI"] },
    { titol: "Bella Ciao", idioma: "it", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Himno de la Alegría", idioma: "es", notes: ["MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Auld Lang Syne", idioma: "en", notes: ["DO", "RE", "MI", "FA", "MI", "RE", "DO", "SOL"] },
    { titol: "Guantanamera", idioma: "es", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Yankee Doodle", idioma: "en", notes: ["DO", "DO", "RE", "MI", "FA", "MI", "RE", "DO"] },
    { titol: "L'estaca", idioma: "ca", notes: ["DO", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Alouette", idioma: "fr", notes: ["RE", "MI", "FA", "MI", "RE", "DO"] },
    { titol: "Cielito Lindo", idioma: "es", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "My Bonnie Lies Over the Ocean", idioma: "en", notes: ["FA", "MI", "RE", "DO", "RE", "MI", "FA"] },
    { titol: "Greensleeves", idioma: "en", notes: ["DO", "RE", "MI", "FA", "SOL", "LA", "SOL"] },
    { titol: "Los peces en el río", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "La Cucaracha", idioma: "es", notes: ["SOL", "SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Der Mond ist aufgegangen", idioma: "de", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { titol: "Hava Nagila", idioma: "he", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "El Condor Pasa", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Aquarela do Brasil", idioma: "pt", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Toreador Song", idioma: "fr", notes: ["DO", "FA", "MI", "RE", "DO", "SOL", "FA"] },
    { titol: "Funiculì Funiculà", idioma: "it", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { titol: "Scarborough Fair", idioma: "en", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Amazing Grace", idioma: "en", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Danny Boy", idioma: "en", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] }
];


function addCerca(nom, sostingut) {
    cerca.push(new Nota(nom, sostingut));
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
                <p>${partitura.nom} <a class="lyric">Lletra</a></p>
                <button class="button reproduir">Reproduir cançó</button>
            `;
            resultContainer.appendChild(resultItem);
        }
    });
}

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