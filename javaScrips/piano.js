import { Nota } from "./class/Nota.js";

let cerca = [];
let partitures = [
    { nom: "La Balanguera", notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { nom: "Happy Birthday", notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] }
];

function addCerca(nom, sostingut = false) {
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