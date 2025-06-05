"use strict";

import { tecles } from "./TeclesPiano.js";
import { cercador } from "../services/Cercador.js";
import { cercadorView } from "./cercadorView.js";
import { PartituraService} from "@/services/PartituraService.js";
import { mostrarNotificacio } from "../utils/notifications.js";
import { VideosView } from "./VideosView.js";

export const renderPartitures = (partitures) => {
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
            <p>${partitura.name} <a class="lyric">Lletra</a></p>
            <button class="button reproduir">Reproduir cançó</button>
        `;

        const button = resultItem.querySelector(".reproduir");
        button.addEventListener("click", () => handleReproduirClick(partitura, button));


        partituresContainer.appendChild(resultItem);
    });
};

const handleReproduirClick = (partitura, button) => {
    let delay = 0;
    const duracio = partitura.notes.length * 1000;
    let tempsFaltant = duracio / 1000;

    button.textContent = `${tempsFaltant}s`;
    button.disabled = true;

    const interval = setInterval(() => {
        tempsFaltant -= 0.1;
        button.textContent = `${tempsFaltant.toFixed(2)}s`;
    }, 100);

    partitura.notes.forEach((nota) => {
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
};


(() => {

    VideosView.renderVideos();

    /*if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
            .then((registration) => {
                console.log("Service Worker registrado con éxito:", registration.scope);
            })
            .catch((error) => {
                console.error("Error al registrar el Service Worker:", error);
            });
    } else {
        console.warn("Service Workers no son compatibles con este navegador.");
    }*/


    let cercaActual = [];

    const updateCercadorInput = (cercaActual) => {
        const cercadorInput = document.querySelector(".cercador");
        cercadorInput.value = cercaActual.map((nota) => nota.nom).join(" ");
    };

    const loadPartitures = async () => {
        const partitures = await PartituraService.getPartitures();
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
/*
                    renderPartitures(results);
*/
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
                    mostrarNotificacio("Èxit", "La lletra s'ha copiat correctament al porta-retalls.");
                } catch (err) {
                    mostrarNotificacio("Error", "No s'ha pogut copiar la lletra.");
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
