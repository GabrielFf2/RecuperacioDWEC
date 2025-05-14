"use strict";

import { tecles } from "../services/TeclesPiano.js";
import { cercador } from "../services/Cercador.js";
import { cercadorView } from "./cercadorView.js";
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

    const renderPartitures = (partitures) => {
        const partituresContainer = document.querySelector("#partitures-container");

        if (!partituresContainer) {
            console.error("Error: No se encontró el contenedor #partitures-container en el DOM.");
            return;
        }

        partituresContainer.innerHTML = "";

        if (!partitures || partitures.length === 0) {
            partituresContainer.innerHTML = "<p class='mensaje-vacio'>No hay partituras disponibles.</p>";
            return;
        }

        partitures.forEach((partitura) => {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";
            resultItem.setAttribute("data-lletraoriginal", partitura.lletraoriginal || "");
            resultItem.setAttribute("data-lletratraduccio", partitura.lletratraduccio || "");
            resultItem.innerHTML = `
            <p>${partitura.titol} <a class="lyric">Lletra</a></p>
            <button class="button reproduir">Reproduir cançó</button>
        `;
            partituresContainer.appendChild(resultItem);
        });
    };


    document.addEventListener("DOMContentLoaded", () => {
        loadPartitures().then((partitures) => {
            renderPartitures(partitures);

            const cercadorHandlers = cercador(
                cercaActual,
                partitures,
                updateCercadorInput,
                (results) => {
                    console.log("Resultados:", results);
                    renderPartitures(results);
                },
                () => {
                    console.log("Resultados limpiados");
                    renderPartitures(partitures);
                }
            );

            if (cercadorHandlers) {
                const { handleSearch, handleClear } = cercadorHandlers;
                handleSearch();
                handleClear();
            } else {
                console.error("cercadorHandlers no se inicializó correctamente.");
            }

            cercadorView(cercadorHandlers);
            tecles(cercaActual, updateCercadorInput);

            const modal = document.getElementById("modal");
            const closeModal = document.getElementById("close-modal");
            const modalTitle = document.getElementById("modal-title");
            const originalLyrics = document.getElementById("original-lyrics");
            const translatedLyrics = document.getElementById("translated-lyrics");
            const copyOriginalButton = document.getElementById("copy-original");
            const copyTranslatedButton = document.getElementById("copy-translated");

            const openModal = (partitura) => {
                modalTitle.textContent = partitura.titol;
                originalLyrics.textContent = partitura.lletraOriginal || "No hi ha lletra original.";
                translatedLyrics.textContent = partitura.lletraTraduccio || "No hi ha traducció disponible.";
                modal.style.display = "block";
            };

            const closeModalHandler = () => {
                modal.style.display = "none";
            };

            const copyToClipboard = async (text) => {
                try {
                    await navigator.clipboard.writeText(text);
                } catch (err) {
                    console.error("Error en copiar al portapapers:", err);
                }
            };

            copyOriginalButton.addEventListener("click", () => {
                const text = originalLyrics.textContent;
                copyToClipboard(text);
            });

            copyTranslatedButton.addEventListener("click", () => {
                const text = translatedLyrics.textContent;
                copyToClipboard(text);
            });

            closeModal.addEventListener("click", closeModalHandler);

            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("lyric")) {
                    const partituraElement = event.target.closest(".result-item");
                    const titol = partituraElement.querySelector("p").textContent.trim();
                    const partitura = {
                        titol,
                        lletraOriginal: partituraElement.getAttribute("data-lletraoriginal") || "No hi ha lletra original.",
                        lletraTraduccio: partituraElement.getAttribute("data-lletratraduccio") || "No hi ha traducció disponible.",
                    };
                    openModal(partitura);
                }
            });
        });
    });
})();