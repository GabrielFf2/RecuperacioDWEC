'use strict';

import { GoogleService } from "../services/GoogleService.js";
import { Partitura } from "../model/Partitura.js";
import { partituraService } from "../services/PartituraService.js";
import { TraduccionService } from "../services/TraduccionService.js";
import { TinyMCEService } from '../services/TinyMCEService.js';


(async () => {
    document.addEventListener('DOMContentLoaded', async () => {


        TinyMCEService.init('#lletraOriginal, #traduccioCatala');

        const content = TinyMCEService.getEditorContent('lletraOriginal');
        console.log('Contenido del editor:', content);

        TinyMCEService.setEditorContent('traduccioCatala', '<p>Texto de ejemplo</p>');
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
            const notes = Array.from(document.querySelectorAll('.nota-en-pentagrama')).map((nota, index) => ({
                note: nota.textContent,
                type: nota.dataset.type || 'regular',
                ordre: index + 1
            }));

            const partitura = new Partitura(
                idpartitura,
                name,
                partituraoriginal,
                partituratraduccio,
                idiomaoriginal,
                notes
            );

            try {
                const message = await partituraService.savePartitura(partitura);
                alert(message);
                form.reset();
            } catch (error) {
                alert("Error enviant la partitura. Revisa la consola per més detalls.");
            }
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

        const editorOriginal = tinymce.get('lletraOriginal');
        const idiomaSelect = document.getElementById('idioma');

        if (editorOriginal) {
            editorOriginal.on('input', async () => {
                console.log(editorOriginal.value)
                const idiomaOriginal = idiomaSelect.value;

                const textOriginal = editorOriginal.getContent({ format: 'text' });

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
        } else {
            console.error('No se encontró el TinyMCE con id "lletraOriginal"');
        }
    });


    const pentagrama = document.getElementById('pentagrama');
    const notas = document.querySelectorAll('.nota');
    const lineas = Array.from(pentagrama.querySelectorAll('.linea'));
    const MAX_NOTES = 12;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Mapatge de notes a freqüències (escala temperada)
    const notesFreq = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.00,
        A4: 440.00,
        B4: 493.88,
        C5: 523.25
    };

    // Funció per reproduir una nota
    const playNote = (freq, duration = 0.5) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    };

    // Esdeveniment per iniciar l'arrossegament
    notas.forEach(nota => {
        nota.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.dataset.note);
        });
    });

    // Reproduir nota mentre es fa "dragover"
    pentagrama.addEventListener('dragover', (event) => {
        event.preventDefault();
        const y = event.offsetY;

        const note = lineas.reduce((closest, linea) => {
            const distancia = Math.abs(linea.offsetTop - y);
            return distancia < closest.distancia ? { note: linea.dataset.note, distancia } : closest;
        }, { note: null, distancia: Infinity }).note;

        if (note && notesFreq[note]) {
            playNote(notesFreq[note], 0.2);
        }
    });

    // Manejar el drop
    pentagrama.addEventListener('drop', (event) => {
        event.preventDefault();

        const notesActuals = pentagrama.querySelectorAll('.nota-en-pentagrama');
        if (notesActuals.length >= MAX_NOTES) {
            alert('Només es poden afegir un màxim de 12 notes al pentagrama.');
            return;
        }

        const y = event.offsetY;

        const note = lineas.reduce((closest, linea) => {
            const distancia = Math.abs(linea.offsetTop - y);
            return distancia < closest.distancia ? { note: linea.dataset.note, distancia } : closest;
        }, { note: null, distancia: Infinity }).note;

        if (note) {
            const nuevaNota = document.createElement('div');
            nuevaNota.classList.add('nota-en-pentagrama');
            nuevaNota.textContent = note;

            nuevaNota.style.position = 'absolute';
            nuevaNota.style.left = `${event.offsetX}px`;
            nuevaNota.style.top = `${y}px`;

            nuevaNota.addEventListener('click', () => {
                nuevaNota.remove();
            });

            pentagrama.appendChild(nuevaNota);
        }
    });

    // Reproduir partitura
    const playPartitura = () => {
        const notes = Array.from(pentagrama.querySelectorAll('.nota-en-pentagrama'));
        let delay = 0;

        notes.forEach(note => {
            const noteName = note.textContent;
            if (notesFreq[noteName]) {
                setTimeout(() => playNote(notesFreq[noteName]), delay);
                delay += 600; // 600ms entre notes
            }
        });
    };

    // Afegir botó "Reproduir partitura"
    const playButton = document.createElement('button');
    playButton.textContent = 'Reproduir partitura';
    playButton.addEventListener('click', playPartitura);
    document.body.appendChild(playButton);








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
