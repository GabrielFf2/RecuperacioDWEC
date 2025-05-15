'use strict';

import {Note} from "../model/Note.js";
import { mostrarNotificacio, notificarRespostaServidor } from "../utils/notifications.js";

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

            const result = await response.json();

            if (!response.ok) {
                throw result;
            }

            notificarRespostaServidor(result);
            return result.message;
        } catch (error) {
            mostrarNotificacio("Error", error.notifyMessage || "Error desant la partitura.");
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
        cerca.push(new Note(nom, sostingut));
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

};