"use strict";

export const cercador = (cercaActual, partitures, updateCercadorInput, renderResults, clearResults) => {
    const filterResults = () => {
        return partitures.filter((partitura) => {
            const notesPartitura = partitura.notes;

            let i = 0;
            let j = 0;

            while (i < cercaActual.length && j < notesPartitura.length) {
                if (cercaActual[i].nom === notesPartitura[j].nom) {
                    i++;
                }
                j++;
            }

            console.log(`Partitura: ${partitura}, Match: ${i === cercaActual.length}`);
            return i === cercaActual.length;
        });
    };

    const handleSearch = () => {
        const results = filterResults();
        renderResults(results);
    };

    const handleClear = () => {
        cercaActual.length = 0;
        updateCercadorInput(cercaActual);
        clearResults();
        console.log("Cerca esborrada");
    };

    return { handleSearch, handleClear };
};