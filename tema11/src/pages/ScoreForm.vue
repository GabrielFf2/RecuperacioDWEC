<template>
  <q-page>
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
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as Formulari from '../viewJs/formulari.js'
import { GoogleService } from "src/services/GoogleService.js"
import { TraduccionService } from "src/services/TraduccionService.js"
import tinymce from 'tinymce'
import { PartituraService } from "../services/PartituraService.js";

export default {
  setup() {
    const route = useRoute();
    const title = ref(document.getElementById('titol')?.value || '')
    const language = ref(document.getElementById('idioma-select')?.value || '')
    const originalLyrics = ref(tinymce.get('lletraOriginal')?.getContent() || '')
    const catalanTranslation = ref(tinymce.get('traduccioCatala')?.getContent() || '')
    const notification = ref(document.getElementById('notification')?.textContent || '')
    const languages = ref([])

    GoogleService.getIdiomes().then(result => {
      languages.value = result
    })

    const submitForm = async () => {
      const form = document.forms['creacioPartituraForm'];
      if (!form) {
        console.error("El formulario no está disponible en el DOM.");
        return;
      }

      const partituraId = document.getElementById("partitura-id")?.value || null;
      const titol = form['titol']?.value || "";
      const idioma = form['idioma']?.value || "";
      const lletraOriginal = tinymce.get("lletraOriginal")?.getContent() || "";
      const lletraTraduccio = tinymce.get("traduccioCatala")?.getContent() || "";
      const notes = Formulari.obtenirNotasDelPentagrama();


      const partitura = {
        idpartitura: partituraId,
        name: titol,
        idiomaoriginal: idioma,
        idiomatraduccio: 'ca',
        partituraoriginal: lletraOriginal,
        partituratraduccio: lletraTraduccio,
        notes,
      };

      try {
        await PartituraService.savePartitura(partitura);
      } catch (error) {
        console.error(error);
        alert("Error al guardar la partitura.");
      }
    };

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


    const loadPartitura = async (id) => {
      try {
        const partitura = await PartituraService.carregarPartitura(id);

        if (partitura) {
          title.value = partitura.titol;
          language.value = partitura.idiomaoriginal;

          const interval = setInterval(() => {
            const editorOriginal = tinymce.get('lletraOriginal');
            const editorTraduccio = tinymce.get('traduccioCatala');

            if (editorOriginal && editorTraduccio) {
              const originalContent = partitura.lletraoriginal || '';
              const translationContent = partitura.lletratraduccio || '';

              editorOriginal.setContent(originalContent);
              editorTraduccio.setContent(translationContent);

              clearInterval(interval);
            }
          }, 300);

          Formulari.carregarNotesAlPentagrama(partitura.notes);
        }
      } catch (error) {
        console.error("Error cargando la partitura:", error);
      }
    };

    onMounted(() => {

      const form = document.getElementById('creacioPartituraForm');
      form.addEventListener('submit', submitForm);

      tinymce.init({
        selector: '#lletraOriginal',
        base_url: '/node_modules/tinymce',
        license_key: 'gpl',
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
        license_key: 'gpl',
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


      const id = route.query.id;
      console.log("ID en la URL:", id);
      if (id) {
        loadPartitura(id);
      }


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
      translateLyrics,
      loadPartitura
    }
  }
}
</script>

<style>
@import '../css/creacioPartitures.css';
</style>
