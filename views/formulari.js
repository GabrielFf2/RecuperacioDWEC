import { GoogleService } from "../services/GoogleService.js";
import { PartituraService } from "../services/PartituraService.js";
import { Partitura } from "../model/Partitura.js";
import { Note } from "../model/Note.js";
import { TraduccionService } from "../services/TraduccionService.js";
import {TinyMCEService} from "../services/TinyMCEService.js";


function inicialitzarTraduccioAutomatica() {
    const editorLletraOriginal = tinymce.get('lletraOriginal');
    const editorTraduccioCatala = tinymce.get('traduccioCatala');
    const idioma = document.getElementById('idioma-select');


    if (editorLletraOriginal && idioma) {
        editorLletraOriginal.on('change keyup', async () => {
            const textOriginal = editorLletraOriginal.getContent();

            try {
                const textTraduccio = await TraduccionService.traduir(idioma.value, textOriginal);
                if (editorTraduccioCatala) {
                    editorTraduccioCatala.setContent(textTraduccio);
                }
            } catch (error) {
                console.error('Error al traducir:', error);
            }
        });
    } else {
        console.error('Editor o selector de idioma no encontrado.');
    }
}
function validarLletraTraduccio() {
    const idioma = document.forms['form']['idioma'].value;
    const lletraOriginal = tinymce.get('lletraOriginal').getContent();
    const lletraTraduccio = tinymce.get('traduccioCatala').getContent();

    if (idioma === 'ca' && lletraOriginal !== lletraTraduccio) {
        alert("La lletra original i la traducció al català han de ser idèntiques.");
        return false;
    }
    if (!lletraOriginal.trim()) {
        alert("La lletra original no pot estar buida.");
        return false;
    }

    if (!lletraTraduccio.trim()) {
        alert("La traducció no pot estar buida.");
        return false;
    }
    return true;
}

function inicialitzarValidacio() {
    document.forms['form'].addEventListener('submit', function (event) {
        if (!validarLletraTraduccio()) {
            event.preventDefault();
        }
    });
}

function pintarIdiomesSelect(idiomes) {
    const select = document.getElementById('idioma-select');

    select.innerHTML = '';

    idiomes.forEach(idioma => {
        const option = document.createElement('option');
        option.value = idioma.codi;
        option.textContent = idioma.nom;
        select.appendChild(option);
    });
}

async function omplirFormulariPartitura(partitura) {
    document.getElementById('partitura-id').value = partitura.idpartitura || '';
    document.querySelector('input[name="titol"]').value = partitura.titol || '';
    document.querySelector('select[name="idioma"]').value = partitura.idiomaoriginal || '';

    const editorLletraOriginal = tinymce.get('lletraOriginal');
    const editorTraduccioCatala = tinymce.get('traduccioCatala');

    if (editorLletraOriginal) {
        editorLletraOriginal.setContent(partitura.lletraoriginal || '');
    }
    if (editorTraduccioCatala) {
        editorTraduccioCatala.setContent(partitura.lletratraduccio || '');
    }

    carregarNotesAlPentagrama(partitura.notes || []);
}

async function guardarPartitura(event) {
    event.preventDefault();
    if (!validarLletraTraduccio()) return;

    const form = document.forms["form"];
    const partituraId = document.getElementById('partitura-id').value || null;
    const titol = form.titol.value;
    const idioma = form.idioma.value;
    const lletraOriginal = form.lletraOriginal.value;
    const lletraTraduccio = tinymce.get('traduccioCatala').getContent();
    const notes = obtenirNotasDelPentagrama();

    console.log({
        partituraId,
        titol,
        idioma,
        lletraOriginal,
        lletraTraduccio,
        notes
    });

    const partitura = new Partitura(
        partituraId,
        titol,
        lletraOriginal,
        lletraTraduccio,
        idioma,
        'ca',
        notes
    );

    try {
        const resultat = await PartituraService.savePartitura(partitura);
    } catch (error) {
        console.error(error);
        alert("Error al guardar la partitura.");
    }
}

function reproducirSonido(idAudio) {
    const audioElemento = document.getElementById(idAudio);
    if (audioElemento) {
        audioElemento.currentTime = 0;
        audioElemento.play();
    }
}

function pintarPentagrama() {
    const notes = [
        { nota: "DO", top: 155, audioId: "audio-do" },
        { nota: "DO#", top: 150, audioId: "audio-do-sust" },
        { nota: "RE", top: 140, audioId: "audio-re" },
        { nota: "RE#", top: 135, audioId: "audio-re-sust" },
        { nota: "MI", top: 125, audioId: "audio-mi" },
        { nota: "FA", top: 110, audioId: "audio-fa" },
        { nota: "FA#", top: 105, audioId: "audio-fa-sust" },
        { nota: "SOL", top: 95, audioId: "audio-sol" },
        { nota: "SOL#", top: 90, audioId: "audio-sol-sust" },
        { nota: "LA", top: 80, audioId: "audio-la" },
        { nota: "LA#", top: 75, audioId: "audio-la-sust" },
        { nota: "SI", top: 65, audioId: "audio-si" },
        { nota: "DO_AGUT", top: 50, audioId: "audio-do2" },
        { nota: "DO#_AGUT", top: 45, audioId: "audio-do2-sust" },
    ];

    const liniesTop = [15, 45, 75, 105, 135];
    const container = document.getElementById("pentagrama-container");

    container.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const columna = document.createElement("div");
        columna.className = "columna-pentagrama";

        liniesTop.forEach(top => {
            const linea = document.createElement("div");
            linea.className = "linea";
            linea.style.top = `${top}px`;
            columna.appendChild(linea);
        });

        notes.forEach(note => {
            const zona = document.createElement("div");
            zona.className = "nota-zona";
            zona.style.top = `${note.top}px`;
            zona.dataset.note = note.nota;
            zona.dataset.audioId = note.audioId;

            zona.addEventListener("dragover", e => {
                e.preventDefault();
            });

            const arrastrables = document.querySelectorAll(".nota-arrastrable");
            let isSostenido = false;
            arrastrables.forEach(nota => {
                nota.addEventListener("dragstart", e => {
                    const src = e.target.src;
                    e.dataTransfer.setData("text/plain", src);
                    isSostenido = src.includes("sust");
                });
            });

            zona.addEventListener("dragenter", e => {
                e.preventDefault();
                let audioId = zona.dataset.audioId;

                if (isSostenido) {
                    audioId += "-sust";
                }

                reproducirSonido(audioId);
            });

            zona.addEventListener("drop", e => {
                e.preventDefault();
                const src = e.dataTransfer.getData("text/plain");

                const wrapper = zona.closest(".columna-wrapper");
                const notaExistente = wrapper.querySelector(".nota-img");
                if (notaExistente) notaExistente.remove();

                const nota = document.createElement("div");
                nota.className = "nota";

                const img = document.createElement("img");

                if (zona.dataset.note === "DO") {
                    img.src = src.replace("nota1", "nota2");
                } else {
                    img.src = src;
                }

                img.className = "nota-img";
                nota.appendChild(img);
                zona.appendChild(nota);
            });

            columna.appendChild(zona);
        });

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar nota";
        botonBorrar.className = "btn-borrar";
        botonBorrar.type = "button";
        botonBorrar.addEventListener("click", () => {
            const nota = columna.querySelector(".nota-img");
            if (nota) nota.remove();
        });

        const wrapper = document.createElement("div");
        wrapper.className = "columna-wrapper";
        wrapper.appendChild(columna);
        wrapper.appendChild(botonBorrar);

        container.appendChild(wrapper);
    }
}

function obtenirNotasDelPentagrama() {
    const columnas = document.querySelectorAll(".columna-wrapper");
    const notas = [];

    columnas.forEach((wrapper, index) => {
        const imgNota = wrapper.querySelector(".nota-img");
        if (imgNota) {
            const zona = imgNota.closest(".nota-zona");
            if (zona) {
                const note = zona.dataset.note;
                const type = imgNota.src.includes("sust") ? "sharp" : "regular";
                const nota = { note, type };
                notas.push(nota);
            }
        }
    });

    return notas;
}

export function carregarNotesAlPentagrama(notas) {
    notas.forEach(nota => {
        const columna = document.querySelectorAll(".columna-wrapper")[nota.ordre - 1];
        if (!columna) {
            console.warn(`No se encontró la columna para la nota con orden ${nota.ordre}`);
            return;
        }

        const zona = Array.from(columna.querySelectorAll(".nota-zona"))
            .find(z => z.dataset.note === nota.nom);

        if (!zona) {
            console.warn(`No se encontró la zona para la nota ${nota.nom} en la columna ${nota.ordre}`);
            return;
        }

        const notaExistente = zona.querySelector(".nota-img");
        if (notaExistente) notaExistente.remove();

        const divNota = document.createElement("div");
        divNota.className = "nota";

        const img = document.createElement("img");
        img.className = "nota-img";
        img.src = `../notesimg/nota1.png`;

        divNota.appendChild(img);
        zona.appendChild(divNota);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    TinyMCEService.init('#lletraOriginal, #traduccioCatala');
    inicialitzarValidacio();

    const urlParams = new URLSearchParams(window.location.search);

    GoogleService.getIdiomes().then(idiomes => {
        pintarIdiomesSelect(idiomes);
    });

    pintarPentagrama();

    const id = urlParams.get('id');
    if (id) {
        PartituraService.carregarPartitura(id).then(async partitura => {
            if (partitura) {
                console.log(partitura)
                await omplirFormulariPartitura(partitura);
            }
        });
    }

    document.getElementById("btn-reproduir").addEventListener("click", (event) => {
        const button = event.target;
        const notes = obtenirNotasDelPentagrama();
        PartituraService.reproduirPartitura(notes, button);
    });

    document.forms['form'].addEventListener('submit', guardarPartitura);

    inicialitzarTraduccioAutomatica();

});