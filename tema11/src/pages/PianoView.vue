<template>
  <h1>Score Finder</h1>
  <div class="piano">
    <button class="DO key white" data-note="DO"></button>
    <button class="DO# key black" data-note="DO#"></button>
    <button class="RE key white" data-note="RE"></button>
    <button class="RE# key black" data-note="RE#"></button>
    <button class="MI key white" data-note="MI"></button>
    <button class="FA key white" data-note="FA"></button>
    <button class="FA# key black" data-note="FA#"></button>
    <button class="SOL key white" data-note="SOL"></button>
    <button class="SOL# key black" data-note="SOL#"></button>
    <button class="LA key white" data-note="LA"></button>
    <button class="SI# key black" data-note="SI#"></button>
    <button class="SI key white" data-note="SI"></button>
    <button class="DOAgut key white" data-note="DOAgut"></button>
    <audio id="audio-DO" src="/audio/do.mp3"></audio>
    <audio id="audio-DO#" src="/audio/do-sust.mp3"></audio>
    <audio id="audio-RE" src="/audio/re.mp3"></audio>
    <audio id="audio-RE#" src="/audio/re-sust.mp3"></audio>
    <audio id="audio-MI" src="/audio/mi.mp3"></audio>
    <audio id="audio-FA" src="/audio/fa.mp3"></audio>
    <audio id="audio-FA#" src="/audio/fa-sust.mp3"></audio>
    <audio id="audio-SOL" src="/audio/sol.mp3"></audio>
    <audio id="audio-SOL#" src="/audio/sol-sust.mp3"></audio>
    <audio id="audio-LA" src="/audio/la-sust.mp3"></audio>
    <audio id="audio-SI" src="/audio/si.mp3"></audio>
    <audio id="audio-SI#" src="/audio/si0.mp3"></audio>
    <audio id="audio-DOAgut" src="/audio/do7.mp3"></audio>
  </div>
  <div class="results">
    <h2>CERCANT...</h2>
    <label>
      <input type="text" class="cercador">
    </label>
    <button class="button cercar" @click="buscar">Cercar</button>
    <button class="button borrar" @click="limpiarBusqueda">Esborrar</button>
    <h2>RESULTATS:</h2>

    <div id="partitures-container"></div>
  </div>

  <div id="modal" class="modal">
    <div class="modal-content">
      <span id="close-modal" class="close">&times;</span>
      <h2 id="modal-title"></h2>
      <div id="lyrics-container">
        <p id="original-lyrics"></p>
        <button id="copy-original">Copiar lletra original</button>
        <p id="translated-lyrics"></p>
        <button id="copy-translated">Copiar lletra en català</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import { tecles } from "@/viewJs/TeclesPiano.js";
import { cercador } from "@/services/Cercador.js";
import { PartituraService } from "@/services/PartituraService.js";
import { VideosView } from "@/viewJs/VideosView.js";
import { renderPartitures } from "@/viewJs/piano.js";

const cercaActual = ref([]);
const partitures = ref([]);

let teclesController;

const updateCercadorInput = (notes) => {
  const input = document.querySelector(".cercador");
  if (input) {
    input.value = notes.map((note) => note.nom).join(" ");
  }
};

const renderResults = (results) => {
  console.log(results);
  renderPartitures(results);
};

const clearResults = () => {
  console.log("Resultados limpiados");
};

const buscar = () => {
  cercadorInstance.handleSearch();
};

const limpiarBusqueda = () => {
  cercadorInstance.handleClear();
};

let cercadorInstance;

const initializeModalHandlers = () => {
  const copyOriginalButton = document.getElementById("copy-original");
  const copyTranslatedButton = document.getElementById("copy-translated");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-modal");

  if (!copyOriginalButton || !copyTranslatedButton) {
    console.error("Los botones de copiar no existen en el DOM.");
    return;
  }

  copyOriginalButton.addEventListener("click", () => {
    const text = document.getElementById("original-lyrics")?.textContent?.trim();
    console.log("Texto original:", text);
    if (text) navigator.clipboard.writeText(text);
  });

  copyTranslatedButton.addEventListener("click", () => {
    const text = document.getElementById("translated-lyrics")?.textContent?.trim();
    console.log("Texto traducido:", text);
    if (text) navigator.clipboard.writeText(text);
  });

  if (!closeModal) {
    console.error("El botón de cerrar modal no existe en el DOM.");
    return;
  }

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

};

onMounted(async () => {
  teclesController = tecles(cercaActual.value, updateCercadorInput);
  teclesController.mount();

  partitures.value = await PartituraService.getPartituresNoLogin();

  cercadorInstance = cercador(
    cercaActual.value,
    partitures.value,
    updateCercadorInput,
    renderResults,
    clearResults
  );

  VideosView.renderVideos();
  renderPartitures(partitures.value);

  // Inicializa los manejadores de eventos del modal
  initializeModalHandlers();
});

onBeforeUnmount(() => {
  if (teclesController) teclesController.unmount();
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-image: url('@/assets/imgs/fusta.jpg');
}
.piano {
  display: flex;
  justify-content: center;
  margin: 20px;
  background: #222020;
  border-radius: 20px;
  padding-bottom: 30px;
}
.key {
  width: 40px;
  height: 180px;
  margin: 2px;
  border: 1px solid black;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
}
.white {
  background: white;
}
.black {
  background: black;
  color: white;
  height: 100px;
  margin-left: -20px;
  margin-right: -20px;
  z-index: 2;
  position: relative;
}
.results {
  background: white;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.button {
  background: red;
  color: white;
  padding: 10px 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-top: 10px;
}

.lyric {
  color: red;
  text-decoration: none;
}

#partitures-container{
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: 10px;
}

.result-item p a {
  display: flex;

  white-space: pre-line;
}
.cercar{
  margin-bottom: 20px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
  text-align: left;
}

.close-modal {
  color: red;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

#video-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  height: 350px;
  position: relative;
}

.video-player {
  border: 1px solid #ccc;
  border-radius: 5px;
}

#q-app {
  margin-top: 230px;
}
</style>
