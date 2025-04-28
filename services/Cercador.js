"use strict";

export const cercador = (cercaActual, partitures, updateCercadorInput) => {
    const resultContainer = document.getElementById("result-container");

    const renderResults = (results) => {
        resultContainer.innerHTML = "";
        results.forEach((partitura) => {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";
            resultItem.innerHTML = `
                <p>${partitura.titol} <a class="lyric">Lletra</a></p>
                <button class="button reproduir">Reproduir cançó</button>
            `;
            resultContainer.appendChild(resultItem);

        });
    };

    document.querySelector(".cercar").addEventListener("click", () => {
        const results = partitures.filter((partitura) => {
            const notesPartitura = partitura.notes;

            let i = 0;
            let j = 0;

            while (i < cercaActual.length && j < notesPartitura.length) {
                if (cercaActual[i].nom === notesPartitura[j].nom) {
                    i++;
                }
                j++;
            }

            return i === cercaActual.length;
        });

        renderResults(results);
    });

    document.querySelector(".borrar").addEventListener("click", () => {
        cercaActual.length = 0;
        updateCercadorInput(cercaActual);
        resultContainer.innerHTML = "";
        console.log("Cerca esborrada");
    });
};