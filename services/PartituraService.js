'use strict';

import {Nota} from "../model/Nota.js";

let cerca = [];

let token = localStorage.getItem('token')
export const PartituraService = {


    async getPartitures() {
        const url = "https://theteacher.codiblau.com/piano/score/list";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            data.forEach(partitura => {
                partitura.notes.sort((a, b) => a.ordre - b.ordre);
            });

            return data;
        } catch (error) {
            console.error("Error obtenint les partitures del servidor:", error);
            return [];
        }
    },

    async savePartitura(partitura) {
        const url = "https://theteacher.codiblau.com/piano/score/save";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify({ score: partitura })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error enviant la partitura al servidor:", error);
            throw error;
        }
    },

    async deletePartitura(id) {
        const url = "https://theteacher.codiblau.com/piano/score/delete";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error esborrant la partitura al servidor:", error);
            throw error;
        }
    },

    async carregarPartitura(id) {
        try {
            const partitures = await this.getPartitures();

            const part = partitures.find(p => p.idpartitura === Number(id));
            return part;
        } catch (error) {
            console.error("Error carregant la partitura:", error);
            throw error;
        }
    },


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


    crearBotonEditar(partituraId) {
        if (!partituraId) {
            console.error("El ID de la partitura no es válido:", partituraId);
            return null;
        }

        const btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar';
        btn.classList.add("btn", "edit-btn");
        btn.addEventListener("click", () => {
            window.location.href = `formulari.html?id=${encodeURIComponent(partituraId)}`;
        });
        return btn;
    },

    crearBotonEsborrar(partituraId) {
        const btn = document.createElement("button");
        btn.innerHTML = '<i class="fa-solid fa-trash"></i> Esborrar';
        btn.classList.add("btn", "delete-btn");
        btn.addEventListener("click", async () => {
            if (confirm(`Està segur que vol esborrar aquest element amb ID ${partituraId}?`)) {
                try {
                    const message = await this.deletePartitura(partituraId);
                    alert(message);
                    window.location.reload();
                } catch (error) {
                    alert("Error esborrant la partitura. Revisa la consola per més detalls.");
                    console.error(error);
                }
            }
        });
        return btn;
    },

    crearBotonVerLetra(partitura) {
        if (!partitura || !partitura.lletraoriginal) {
            console.error("La partitura no es válida o no tiene letra:", partitura);
            return null;
        }

        const btn = document.createElement("button");
        btn.textContent = "Ver letra";
        btn.classList.add("btn", "view-btn");
        btn.addEventListener("click", () => {
            const modal = document.getElementById("modal");
            const modalTitle = document.getElementById("modal-title");
            const originalLyrics = document.getElementById("original-lyrics");
            const translatedLyrics = document.getElementById("translated-lyrics");

            modalTitle.textContent = partitura.titol || "Sin título";
            originalLyrics.textContent = partitura.lletraoriginal || "Letra no disponible";
            translatedLyrics.textContent = partitura.lletratraduccio || "Traducción no disponible";

            modal.style.display = "block";
        });
        return btn;
    }
};