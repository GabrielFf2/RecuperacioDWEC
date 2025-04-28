"use strict";

import { tecles } from "../services/TeclesPiano.js";
import { cercador } from "../services/Cercador.js";
import { partituraService } from "../services/PartituraService.js";

(() => {
    let cercaActual = [];

    const updateCercadorInput = (cercaActual) => {
        const cercadorInput = document.querySelector(".cercador");
        cercadorInput.value = cercaActual.map((nota) => nota.nom).join(" ");
    };

    const loadPartitures = async () => {
        const partitures = await partituraService.getPartitures();
        console.log("Partitures carregades:", partitures);

        if (!Array.isArray(partitures)) {
            console.error("Error: `partitures` no és un array.");
            return [];
        }
        return partitures;
    };

    loadPartitures().then((partitures) => {
        tecles(cercaActual, updateCercadorInput);
        cercador(cercaActual, partitures, updateCercadorInput);
    });
})();