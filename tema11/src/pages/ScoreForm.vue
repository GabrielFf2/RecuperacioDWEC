<template>
  <div>
    <q-form id="creacioPartituraForm" data-idpartitura="" @submit.prevent="submitForm">
      <input type="hidden" id="partitura-id" />

      <q-input v-model="title" label="Títol:" id="titol" name="titol" required />

      <q-select v-model="language" label="Idioma original:" id="idioma-select" :options="languages" name="idioma" option-value="codi" option-label="nom" required />

      <q-input v-model="originalLyrics" label="Lletra original:" id="lletraOriginal" type="textarea" name="lletraOriginal" />

      <q-input v-model="catalanTranslation" label="Traducció al català:" id="traduccioCatala" type="textarea" name="traduccioCatala" />

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
import {GoogleService} from "src/services/GoogleService.js";

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
      Formulari.guardarPartitura()
    }

    const startRecording = () => {
      notification.value = 'Gravació iniciada...'
    }

    const stopRecording = () => {
      notification.value = 'Gravació aturada.'
    }

    onMounted(() => {
      Formulari.inicialitzarFormulari()
    })

    return {
      title,
      language,
      originalLyrics,
      catalanTranslation,
      notification,
      languages,
      submitForm,
      startRecording,
      stopRecording
    }
  }
}
</script>

<style scoped>
@import '../css/creacioPartitures.css';
</style>

