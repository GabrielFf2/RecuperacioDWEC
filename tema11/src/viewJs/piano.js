"use strict";

import { tecles } from "./TeclesPiano.js";
import { cercador } from "../services/Cercador.js";
import { cercadorView } from "./cercadorView.js";
import { PartituraService } from "@/services/PartituraService.js";
import { mostrarNotificacio } from "../utils/notifications.js";
import { VideosView } from "./VideosView.js";

const copyToClipboard = async (text) => {
  console.log(text);
  if (!text || text.trim() === "") {
    mostrarNotificacio("Error", "No hay texto para copiar.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    mostrarNotificacio("Èxit", "La lletra s'ha copiat correctament al porta-retalls.");
  } catch (err) {
    mostrarNotificacio("Error", "No s'ha pogut copiar la lletra.");
    console.error("Error en copiar al portapapers:", err);
  }
};

const initializeModalHandlers = () => {
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");
  const copyOriginalButton = document.getElementById("copy-original");
  const copyTranslatedButton = document.getElementById("copy-translated");

  const closeModalHandler = () => {
    modal.style.display = "none";
  };

  copyOriginalButton.addEventListener("click", () => {
    const text = document.getElementById("original-lyrics").textContent.trim();
    console.log("Texto original:", text);
    copyToClipboard(text);
  });

  copyTranslatedButton.addEventListener("click", () => {
    const text = document.getElementById("translated-lyrics").textContent.trim();
    console.log("Texto traducido:", text);
    copyToClipboard(text);
  });

  closeModal.addEventListener("click", closeModalHandler);
};

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

  const openModal = (partitura) => {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const originalLyrics = document.getElementById("original-lyrics");
    const translatedLyrics = document.getElementById("translated-lyrics");

    const getLyrics = (lyrics, defaultText) => lyrics || defaultText;

    const lletraOriginal = getLyrics(partitura.idiomaoriginal, "No hi ha lletra original.");
    const lletraTraduccio = getLyrics(partitura.idiomatraduccio, "No hi ha traducció disponible.");

    const updateModalContent = () => {
      modalTitle.textContent = partitura.name;
      originalLyrics.innerHTML = lletraOriginal;
      translatedLyrics.innerHTML = lletraTraduccio;
    };

    updateModalContent();
    modal.style.display = "block";
  };

  partitures.forEach((partitura) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.setAttribute("data-lletraoriginal", partitura.idiomaoriginal || "");
    resultItem.setAttribute("data-lletratraduccio", partitura.idiomatraduccio || "");
    resultItem.innerHTML = `
            <p>${partitura.name} <a class="lyric" href="#">Lletra</a></p>
            <button class="button reproduir">Reproduir cançó</button>
        `;

    const button = resultItem.querySelector(".reproduir");
    button.addEventListener("click", () => handleReproduirClick(partitura, button));

    const lyricLink = resultItem.querySelector(".lyric");
    lyricLink.addEventListener("click", (event) => {
      event.preventDefault();

      const partituraData = {
        name: partitura.name,
        idiomaoriginal: partitura.idiomaoriginal || "No hi ha lletra original.",
        idiomatraduccio: partitura.idiomatraduccio || "No hi ha traducció disponible.",
      };

      console.log(partituraData);

      openModal(partituraData);
    });

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

const loadPartitures = async () => {
  const partitures = await PartituraService.getPartituresNoLogin();
  console.log("Partitures carregades:", partitures);

  if (!Array.isArray(partitures)) {
    console.error("Error: `partitures` no és un array.");
    return [];
  }
  return partitures;
};

(() => {
  document.addEventListener("DOMContentLoaded", async () => {
    const partitures = await loadPartitures();
    renderPartitures(partitures);

    const cercaActual = [];
    const updateCercadorInput = (cercaActual) => {
      const cercadorInput = document.querySelector(".cercador");
      cercadorInput.value = cercaActual.map((nota) => nota.nom).join(" ");
    };

    const cercadorHandlers = cercador(
      cercaActual,
      partitures,
      updateCercadorInput,
      (results) => {
        console.log("Resultados:", results);
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
    VideosView.renderVideos();
    initializeModalHandlers();
  });
})();
