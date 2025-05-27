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
        K: "DOAgut",
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
            ordre: cercaActual.length + 1,
        };
        cercaActual.push(novaNota);
        updateCercadorInput([...cercaActual]); // envía copia reactiva
    };

    // En Vue, usa event listeners de forma que no duplique si se monta/desmonta
    const onClickKey = (event) => {
        const nota = event.target.getAttribute("data-note");
        if (nota) playNote(nota);
    };

    const onKeyDown = (event) => {
        const nota = keyMap[event.key.toUpperCase()];
        if (nota) playNote(nota);
    };

    // Devuelve funciones para montar y desmontar listeners (útil en Vue)
    return {
        mount: () => {
            document.querySelectorAll(".key").forEach((button) => {
                button.addEventListener("click", onClickKey);
            });
            document.addEventListener("keydown", onKeyDown);
        },
        unmount: () => {
            document.querySelectorAll(".key").forEach((button) => {
                button.removeEventListener("click", onClickKey);
            });
            document.removeEventListener("keydown", onKeyDown);
        },
    };
};
