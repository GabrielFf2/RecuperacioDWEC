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
          <q-btn id="btn-reproduir" label="Reproduir partitura" type="button"  />
        </div>

        <div id="audio-recording">
          <h2>Afegir Notes amb Gravació</h2>
          <video id="video-preview" autoplay muted></video>
          <div>
            <q-btn id="start-recording" label="Iniciar/Detener Gravació" type="button" @click="startOrStopRecording" />
          </div>
          <p id="notification">{{ notification }}</p>
        </div>

        <q-btn label="Desar Partitura" type="submit" color="primary" />
      </q-form>

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
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as Formulari from '../viewJs/formulari.js';
import { GoogleService } from "src/services/GoogleService.js";
import { TraduccionService } from "src/services/TraduccionService.js";
import tinymce from 'tinymce';
import { PartituraService } from "../services/PartituraService.js";
import { mostrarNotificacio } from 'src/utils/notifications.js';
import { RecordingService } from 'src/services/RecordingService.js';
import { interpretaTranscripcio } from 'src/services/TranscripcioService.js';
import { handleReproduirClick } from 'src/viewJs/reproduirSo.js';
import { RecordView } from 'src/viewJs/RecordView.js';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const title = ref(document.getElementById('titol')?.value || '')
    const language = ref(document.getElementById('idioma-select')?.value || '')
    const originalLyrics = ref(tinymce.get('lletraOriginal')?.getContent() || '')
    const catalanTranslation = ref(tinymce.get('traduccioCatala')?.getContent() || '')
    const notification = ref(document.getElementById('notification')?.textContent || '')
    const languages = ref([])
    const isRecording = ref(false);
    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);


    GoogleService.getIdiomes().then(result => {
      languages.value = result
    })

    const submitForm = async () => {
      const form = document.forms['creacioPartituraForm'];
      if (!form) {
        console.error("El formulario no está disponible en el DOM.");
        return;
      }

      const partituraId = route.query.id || null;
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
        console.log(partitura);
        await PartituraService.savePartitura(partitura);
        router.push({ path: '/score-list' });
      } catch (error) {
        mostrarNotificacio("Error", error.notifyMessage || "Error desant la partitura.");
        console.error(error);
      }
    };
    const startOrStopRecording = async () => {
      if (!isRecording.value) {
        notification.value = 'Gravació iniciada...';
        console.log('Grabación iniciada');

        try {
          const { mediaRecorder: recorder, recordedChunks: chunks } = await RecordView.initMediaRecorder();
          mediaRecorder.value = recorder;
          recordedChunks.value = chunks;

          mediaRecorder.value.start();

          mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunks.value.push(event.data);
              console.log('Datos de audio disponibles:', event.data);
            }
          };

          mediaRecorder.value.onstop = async () => {
            console.log('Grabación detenida. Procesando traducción...');
            notification.value = 'Gravació aturada. Esperant la traducció...';

            const blob = new Blob(recordedChunks.value, { type: 'audio/webm' });

            try {
              const response = await RecordingService.sendRecording(blob);
              console.log('Respuesta del servidor:', response);

              if (response.transcripcio && response.confianca) {
                const { notes, errors } = interpretaTranscripcio(response.transcripcio, response.confianca);

                if (errors.length > 0) {
                  console.error("Errores al interpretar la transcripción:", errors);
                }

                console.log("Notas detectadas:", notes);
                Formulari.carregarNotesAlPentagrama(notes);

                const translatedText = await TraduccionService.traduir(language.value, response.transcripcio);
                console.log("Transcripción traducida:", translatedText);
              } else {
                console.warn("La respuesta no contiene transcripcio o confianca.");
              }
              console.log('Grabación detenida.');
              notification.value = 'Gravació aturada.';
            } catch (error) {
              console.error("Error al enviar la grabación o procesar la respuesta:", error);
            }

            isRecording.value = false;
          };

          isRecording.value = true;
        } catch (error) {
          console.error("Error al iniciar la grabación:", error);
        }
      } else {
        if (mediaRecorder.value) {
          mediaRecorder.value.stop();
        }
        notification.value = 'Gravació aturada.';
        console.log('Grabación detenida');
        isRecording.value = false;
      }
    };
    const translateLyrics = async () => {
      const content = tinymce.get('lletraOriginal').getContent()
      const translation = await TraduccionService.traduir(language.value, content)
      tinymce.get('traduccioCatala').setContent(translation)
    }

    const loadPartitura = async (id) => {
      try {
        const partitura = await PartituraService.carregarPartitura(id);
        console.log(partitura);

        if (partitura) {
          title.value = partitura.name;
          language.value = partitura.partituraoriginal;

          const interval = setInterval(() => {
            const editorOriginal = tinymce.get('lletraOriginal');
            const editorTraduccio = tinymce.get('traduccioCatala');

            if (editorOriginal && editorTraduccio) {
              const originalContent = partitura.idiomaoriginal || '';
              const translationContent = partitura.idiomatraduccio || '';

              editorOriginal.setContent(originalContent);
              editorTraduccio.setContent(translationContent);

              clearInterval(interval);
            }
          }, 300);

          console.log("Notas obtenidas:", partitura.notes);

          if (Array.isArray(partitura.notes)) {
            partitura.notes.forEach((nota, index) => {
              if (nota.ordre == null) {
                nota.ordre = index + 1;
              }
            });

            Formulari.carregarNotesAlPentagrama(partitura.notes);
          }  else {
            console.warn("Las notas no tienen el formato esperado:", partitura.notes);
          }
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
          console.log("Notas obtenidas:", notes);

          if (notes.length === 0) {
            console.warn("No hay notas para reproducir.");
            return;
          }

          const partitura = { notes };
          console.log("Partitura creada:", partitura);

          try {
            handleReproduirClick(partitura, button);
          } catch (error) {
            console.error("Error al reproducir las notas:", error);
          }
        });
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
      startOrStopRecording,
      translateLyrics,
      loadPartitura
    }
  }
}
</script>

<style>
@import '../css/creacioPartitures.css';
</style>
