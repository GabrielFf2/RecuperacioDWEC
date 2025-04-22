'use strict';

import {GoogleService} from "../services/GoogleService.js";
import {Partitura} from "../model/Partitura.js";
import {partituraService as PartituraService} from "../services/PartituraService.js";

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('creacioPartituraForm');
        form.addEventListener('submit', async (event) => {
            if (!validateForm()) {
                event.preventDefault();
            }
            const idpartitura = form.dataset.idpartitura || "";
            const name = form.elements['titol'].value;
            const partituraoriginal = form.elements['lletraOriginal'].value;
            const partituratraduccio = form.elements['traduccioCatala'].value;
            const idiomaoriginal = form.elements['idioma'].value;

            const partitura = new Partitura(idpartitura, name, partituraoriginal, partituratraduccio, idiomaoriginal);

            try {
                const message = await PartituraService.savePartitura(partitura);
                alert(message);
                form.reset();
            } catch (error) {
                alert("Error enviant la partitura. Revisa la consola per més detalls.");
            }
        });
    });

    async function carregarIdiomes() {
        const selectIdioma = document.getElementById("idioma");
        selectIdioma.innerHTML = "";

        try {
            const idiomes = await GoogleService.getIdiomes();
            idiomes.forEach(idioma => {
                const option = document.createElement("option");
                option.value = idioma.codi;
                option.textContent = idioma.nom;
                selectIdioma.appendChild(option);
            });
        } catch (error) {
            console.error("Error carregant els idiomes:", error);
        }
    }

    window.onload = carregarIdiomes;

    const validateForm = () => {
        const { titol, idioma, lletraOriginal, traduccioCatala } = document.forms[0].elements;

        const revisioNumParaules = /^(\b\w+\b\s*){3,}$/;
        const htmlRevisio = /<\/?[a-z][\s\S]*>/i;

        if (!revisioNumParaules.test(titol.value)) {
            alert(`El títol ha de tenir mínim 3 paraules.`);
            return false;
        }

        if (!htmlRevisio.test(lletraOriginal.value)) {
            alert(`La lletra original ha de contenir codi HTML vàlid.`);
            return false;
        }

        if (!htmlRevisio.test(traduccioCatala.value)) {
            alert(`La traducció al català ha de contenir codi HTML vàlid.`);
            return false;
        }

        if (idioma.value === 'ca' && lletraOriginal.value !== traduccioCatala.value) {
            alert(`Si l'idioma original és Català, la lletra original i la traducció al català han de ser idèntiques.`);
            return false;
        }

        window.location.href = 'https://iesmanacor.cat';
    };
})();
