"use strict";
import { reactive } from "vue";
import { Note } from "@/model/Note";
import { mostrarNotificacio, notificarRespostaServidor } from "@/utils/notifications";

let cerca = reactive([]);



const state = reactive({
    token: localStorage.getItem("token") || null,
});

export const useAuth = () => {
    const setToken = (newToken) => {
        state.token = newToken;
        localStorage.setItem("token", newToken);
    };

    const getToken = () => state.token;

    return { setToken, getToken };
};
export const PartituraService = {
    async getPartitures() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("El token no está disponible en localStorage.");
            return [];
        }


        const url = "https://theteacher.codiblau.com/piano/score/list";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = (await response.json()).map((partitura) => {
              return {
                ...partitura,
                notes: partitura.notes.map((nota) => ({
                  ...nota
                }))
              };
            });

            data.forEach((partitura) => {
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
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ score: partitura }),
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
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw result;
            }

            notificarRespostaServidor(result);
            return result.message;
        } catch (error) {
            mostrarNotificacio("Error", error.notifyMessage || "Error esborrant la partitura.");
            throw error;
        }
    },

    async carregarPartitura(id) {
        try {
            const partitures = await this.getPartitures();
            return partitures.find((p) => p.idpartitura === Number(id));
        } catch (error) {
            console.error("Error carregant la partitura:", error);
            throw error;
        }
    },

    addCerca(nom, sostingut) {
        cerca.push(new Note(nom, sostingut));
    },

    reproduirNotes(notes, onPlayNote) {
        let delay = 0;

        notes.forEach((nota) => {
            setTimeout(() => {
                if (typeof onPlayNote === "function") {
                    onPlayNote(nota);
                }
            }, delay);
            delay += 1000;
        });

        return notes.length * 1000;
    },

    cercador(partitures, input) {
        const result = [];
        const searchString = input.toUpperCase().replace(/\s+/g, "");

        partitures.forEach((partitura) => {
            const notesString = partitura.notes.map((nota) => nota.nom).join("");
            if (notesString.includes(searchString)) {
                result.push(partitura);
            }
        });

        return result;
    },

    resetCerca() {
        cerca.splice(0, cerca.length);
    },

    getCerca() {
        return cerca;
    },
};
