"use strict";

import { partituraObjects } from "../services/initPartitures.js";
import { pianoService } from "../services/pianoService.js";

const partitures = partituraObjects;

document.querySelector('.cercar').addEventListener('click', () => {
    const input = document.querySelector('.cercador').value;
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    const results = pianoService.cercador(partitures, input);

    results.forEach(partitura => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <p>${partitura.titol} <a class="lyric">Lletra</a></p>
            <button class="button reproduir">Reproduir cançó</button>
        `;
        resultContainer.appendChild(resultItem);

        const reproduirButton = resultItem.querySelector('.reproduir');
        reproduirButton.addEventListener('click', () => {
            pianoService.reproduirPartitura(partitura.notes, reproduirButton);
        });
    });
});

document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', () => {
        const nota = button.getAttribute('data-note');
        const audio = document.getElementById(`audio-${nota}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }

        const nom = button.classList[0].toUpperCase();
        const sostingut = button.classList.contains('black');

        pianoService.addCerca(nom, sostingut);

        console.log("Cerca actual:", pianoService.getCerca().map(n => n.nom));
    });
});

document.querySelector('.borrar').addEventListener('click', () => {
    pianoService.resetCerca();
    document.querySelector('.cercador').value = '';
    document.getElementById('result-container').innerHTML = '';
    console.log("Cerca esborrada");
});