'use strict';

import { Nota } from "../model/Nota.js";

let cerca = [];

export const partituresService = {

    addCerca(nom, sostingut) {
        cerca.push(new Nota(nom, sostingut));
    },

    reproduirPartitura(notes, button) {
        let delay = 0;
        const duracio = notes.length * 1000;
        let tempsFaltant = duracio / 1000;

        button.textContent = `${tempsFaltant}s`;
        button.disabled = true;

        const interval = setInterval(() => {
            tempsFaltant -= 0.1;
            button.textContent = `${tempsFaltant.toFixed(2)}s`;
        }, 100);

        notes.forEach(nota => {
            setTimeout(() => {
                const audio = document.getElementById(`audio-${nota.nom}`);
                if (audio) {
                    audio.currentTime = 0;
                    audio.play();
                }
            }, delay);
            delay += 1000;
        });

        setTimeout(() => {
            clearInterval(interval);
            button.textContent = "Reproduir cançó";
            button.disabled = false;
        }, duracio);
    },

    cercador(partitures, input) {
        const result = [];
        const searchString = input.toUpperCase().replace(/\s+/g, '');

        partitures.forEach(partitura => {
            const notesString = partitura.notes.map(nota => nota.nom).join('');
            if (notesString.includes(searchString)) {
                result.push(partitura);
            }
        });

        return result;
    },

    resetCerca() {
        cerca = [];
    },

    getCerca() {
        return cerca;
    },

    generarDades(partitures) {
        return Array.from({ length: 100 }, (_, i) => partitures[i % partitures.length]);
    },

    crearBotonEditar() {
        const btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar';
        btn.classList.add("btn", "edit-btn");
        return btn;
    },

    crearBotonEsborrar(partituraId) {
        const btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-trash"></i> Esborrar';
        btn.classList.add("btn", "delete-btn");
        btn.addEventListener("click", () => {
            if (confirm(`Està segur que vol esborrar aquest element amb ID ${partituraId}?`)) {
                alert(`Element amb ID ${partituraId} esborrat!`);
            } else {
                alert("Has cancel·lat l'acció.");
            }
        });
        return btn;
    }
};