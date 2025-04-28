"use strict";

export const tecles = (cercaActual, updateCercadorInput) => {
    const keyMap = {
        A: "DO",
        W: "DO#",
        S: "RE",
        E: "RE#",
        D: "MI",
        F: "FA",
        T: "FA#",
        G: "SOL",
        Y: "SOL#",
        H: "LA",
        U: "LA#",
        J: "SI",
        K: "DOAgut"
    };

    const playNote = (nota) => {
        const audio = document.getElementById(`audio-${nota}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }

        const figura = nota.includes("#") ? "NEGRE" : "BLANC";
        const alteracio = "NORMAL";

        const novaNota = {
            idnota: cercaActual.length + 1,
            figura,
            alteracio,
            nom: nota,
            ordre: cercaActual.length + 1
        };
        cercaActual.push(novaNota);
        updateCercadorInput(cercaActual);
    };

    document.querySelectorAll(".key").forEach((button) => {
        button.addEventListener("click", () => {
            const nota = button.getAttribute("data-note");
            playNote(nota);
        });
    });

    document.addEventListener("keydown", (event) => {
        const nota = keyMap[event.key.toUpperCase()];
        if (nota) {
            playNote(nota);
        }
    });
};