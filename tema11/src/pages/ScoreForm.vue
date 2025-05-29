<template>
  <div>
    <q-form ref="formRef" id="creacioPartituraForm" data-idpartitura="" @submit.prevent="submitForm">
      <input type="hidden" id="partitura-id" />

      <q-input v-model="title" label="Títol:" id="titol" name="titol" required />

      <q-select v-model="language" label="Idioma original:" id="idioma-select" :options="languages" name="idioma" option-value="codi" option-label="nom" required />

      <label for="lletraOriginal">Lletra original:</label>
      <div id="lletraOriginal"></div>

      <label for="traduccioCatala">Traducció al català:</label>
      <div id="traduccioCatala"></div>

      <div id="pentagrama-container"></div>

      <div id="nota-original-container">
        <img src="../notesimg/nota1.png" alt="Note" id="nota1" class="nota-arrastrable" draggable="true" />
        <q-btn id="btn-reproduir" label="Reproduir partitura" type="button" />
      </div>

      <div id="audio-recording">
        <h2>Afegir Notes amb Gravació</h2>
        <video id="video-preview" autoplay muted></video>
        <div>
          <q-btn id="start-recording" label="Iniciar Gravació" type="button" @click="startRecording" />
          <q-btn id="stop-recording" label="Aturar Gravació" type="button" @click="stopRecording" />
        </div>
        <p id="notification">{{ notification }}</p>
      </div>

      <q-btn label="Desar Partitura" type="submit" color="primary" />
    </q-form>

    <audio id="audio-do" src="audio/do.mp3"></audio>
    <audio id="audio-re" src="audio/re.mp3"></audio>
    <audio id="audio-mi" src="audio/mi.mp3"></audio>
    <audio id="audio-fa" src="audio/fa.mp3"></audio>
    <audio id="audio-sol" src="audio/sol.mp3"></audio>
    <audio id="audio-la" src="audio/la.mp3"></audio>
    <audio id="audio-si" src="audio/si.mp3"></audio>
    <audio id="audio-do2" src="audio/do7.mp3"></audio>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import * as Formulari from '../viewJs/formulari.js'
import { GoogleService } from "src/services/GoogleService.js"
import { TraduccionService } from "src/services/TraduccionService.js"
import tinymce from 'tinymce'
import { RecordView } from '../viewJs/RecordView.js'
import { guardarPartitura } from "../viewJs/formulari.js";
import {inicialitzarFormulari} from "../viewJs/formulari.js";

export default {
  setup() {
    const title = ref('')
    const language = ref('')
    const originalLyrics = ref('')
    const catalanTranslation = ref('')
    const notification = ref('')
    const languages = ref([])

    GoogleService.getIdiomes().then(result => {
      languages.value = result
    })

    const submitForm = () => {
      guardarPartitura()
    }

    const startRecording = () => {
      notification.value = 'Gravació iniciada...'
    }

    const stopRecording = () => {
      notification.value = 'Gravació aturada.'
    }

    const translateLyrics = async () => {
      const content = tinymce.get('lletraOriginal').getContent()
      const translation = await TraduccionService.traduir(language.value, content)
      tinymce.get('traduccioCatala').setContent(translation)
    }

    onMounted(() => {
      const form = document.getElementById("creacioPartituraForm");
      if (!form) {
        console.error("El formulario no está disponible en el DOM.");
        return;
      }

      inicialitzarFormulari();

      form.addEventListener('submit', submitForm);

      tinymce.init({
        selector: '#lletraOriginal',
        base_url: '/node_modules/tinymce',
        readonly: false,
        setup(editor) {
          editor.on('input', () => {
            originalLyrics.value = editor.getContent();
            translateLyrics();
          });
        }
      });

      tinymce.init({
        selector: '#traduccioCatala',
        base_url: '/node_modules/tinymce',
        readonly: true
      });

      const pentagramaContainer = document.getElementById("pentagrama-container");
      if (pentagramaContainer) {
        Formulari.pintarPentagrama();
      }

      const btnReproduir = document.getElementById("btn-reproduir");
      if (btnReproduir) {
        btnReproduir.addEventListener("click", (event) => {
          const button = event.target;
          const notes = Formulari.obtenirNotasDelPentagrama();
          Formulari.reproduirPartitura(notes, button);
        });
      }

      const startButton = document.getElementById('start-recording');
      const stopButton = document.getElementById('stop-recording');
      const notificationElement = document.getElementById('notification');

      if (!startButton || !stopButton || !notificationElement) {
        console.error('Uno o más elementos no existen en el DOM.');
        return;
      }

      RecordView.init();
    });

    return {
      title,
      language,
      originalLyrics,
      catalanTranslation,
      notification,
      languages,
      submitForm,
      startRecording,
      stopRecording,
      translateLyrics
    }
  }
}
</script>

<style>
@import '../css/creacioPartitures.css';
</style>
