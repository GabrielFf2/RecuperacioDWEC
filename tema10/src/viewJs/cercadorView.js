"use strict";

export const cercadorView = (cercadorHandlers) => {
    const { handleSearch, handleClear } = cercadorHandlers;
    const resultContainer = document.getElementById("result-container");

    const renderResults = (results) => {
        resultContainer.innerHTML = "";
        results.forEach((partitura) => {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";
            resultItem.innerHTML = `
                <p>${partitura.titol} <a class="lyric">Lletra</a></p>
                <button class="button reproduir">Reproduir cançó</button>
            `;
            resultContainer.appendChild(resultItem);
        });
    };

    const clearResults = () => {
        resultContainer.innerHTML = "";
    };

    document.querySelector(".cercar").addEventListener("click", handleSearch);
    document.querySelector(".borrar").addEventListener("click", handleClear);

    return { renderResults, clearResults };
};