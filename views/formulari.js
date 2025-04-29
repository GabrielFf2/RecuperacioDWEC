'use strict';

import { GoogleService } from "../services/GoogleService.js";
import { Partitura } from "../model/Partitura.js";
import { partituraService } from "../services/PartituraService.js";
import { TraduccionService } from "../services/TraduccionService.js";


(async () => {
    document.addEventListener('DOMContentLoaded', async () => {

        await carregarIdiomes();

        const urlParams = new URLSearchParams(window.location.search);
        const partituraId = urlParams.get("id");

        let partitura = {};

        if (partituraId) {
            partitura = await partituraService.carregarPartitura(partituraId);
            if (partitura) {
                const form = document.getElementById('creacioPartituraForm');
                form.elements['titol'].value = partitura.titol || "";

                const editorOriginal = tinymce.get('lletraOriginal');
                if (editorOriginal) {
                    editorOriginal.setContent(partitura.lletraoriginal || "");
                }

                const editorTraduccio = tinymce.get('traduccioCatala');
                if (editorTraduccio) {
                    editorTraduccio.setContent(partitura.lletratraduccio || "");
                }

                form.elements['idioma'].value = partitura.idiomaoriginal || "";

                const notesList = document.getElementById('notesList');
                notesList.innerHTML = "";
                if (Array.isArray(partitura.notes) && partitura.notes.length > 0) {
                    const sortedNotes = partitura.notes.sort((a, b) => a.ordre - b.ordre);
                    sortedNotes.forEach(note => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${note.nom}`;
                        notesList.appendChild(listItem);
                    });
                }
            }
        }

        const form = document.getElementById('creacioPartituraForm');
        form.addEventListener('submit', async (event) => {
            if (!validateForm()) {
                event.preventDefault();
            }
            const idpartitura = partituraId || form.dataset.idpartitura || "";
            const name = form.elements['titol'].value;
            const partituraoriginal = form.elements['lletraOriginal'].value;
            const partituratraduccio = form.elements['traduccioCatala'].value;
            const idiomaoriginal = form.elements['idioma'].value;

            const partitura = new Partitura(idpartitura, name, partituraoriginal, partituratraduccio, idiomaoriginal);

            try {
                const message = await partituraService.savePartitura(partitura);
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

    const botoTraduir = document.getElementById('btnTraduccio');
    const idiomaSelect = document.getElementById('idioma');

    botoTraduir.addEventListener('click', async () => {
        const idiomaOriginal = idiomaSelect.value;

        const editor = tinymce.get('lletraOriginal');
        if (!editor) {
            console.error('No se encontró el TinyMCE con id "lletraOriginal"');
            return;
        }

        const textOriginal = editor.getContent({ format: 'text' });

        if (!textOriginal.trim()) {
            alert('El campo "Texto original" está vacío. Por favor, escribe algo antes de traducir.');
            return;
        }

        try {
            const traduccion = await TraduccionService.traduir(idiomaOriginal, textOriginal);
            console.log('Traducción recibida:', traduccion);
            const editorTraduccio = tinymce.get('traduccioCatala');
            if (editorTraduccio) {
                editorTraduccio.setContent(traduccion);
            }
        } catch (error) {
            console.error('Error en la petición de traducción:', error);
            alert('Hubo un error al realizar la traducción. Revisa la consola para más detalles.');
        }
    });



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
