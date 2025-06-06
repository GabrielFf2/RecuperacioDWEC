"use strict";

import { carregarNotesAlPentagrama } from "./formulari.js";
import { interpretaTranscripcio } from "../services/TranscripcioService.js";
import { RecordingService } from "../services/RecordingService.js";

export const RecordView = {
  initMediaRecorder: async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const mediaRecorder = new MediaRecorder(stream);
    const recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    return { mediaRecorder, recordedChunks };
  },

  init: async () => {
    const startButton = document.getElementById("start-recording");
    const stopButton = document.getElementById("stop-recording");
    const notification = document.getElementById("notification");

    let mediaRecorder = null;
    let recordedChunks = [];

    const stopRecording = async () => {
      mediaRecorder.stop();
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          resolve(blob);
        };
      });
    };

    const { mediaRecorder: recorder, recordedChunks: chunks } = await RecordView.initMediaRecorder();
    mediaRecorder = recorder;
    recordedChunks = chunks;

    startButton.addEventListener("click", () => {
      recordedChunks.length = 0;
      mediaRecorder.start();
      notification.textContent = "Gravació iniciada...";
    });

    stopButton.addEventListener("click", async () => {
      const blob = await stopRecording();
      notification.textContent = "Gravació aturada. Enviant gravació...";

      try {
        const result = await RecordingService.sendRecording(blob);
        if (result.confianca >= 0.4) {
          const interpretacio = interpretaTranscripcio(result.transcripcio, result.confianca);
          if (interpretacio.notes.length > 0) {
            const notesArray = interpretacio.notes.map((nota, index) => ({
              nom: nota.toUpperCase(),
              ordre: index + 1,
            }));
            notification.textContent = `Notes reconegudes: ${interpretacio.notes.join(", ")}`;
            carregarNotesAlPentagrama(notesArray);
          } else {
            notification.textContent = "No s'han pogut reconèixer notes amb prou confiança.";
          }
        } else {
          notification.textContent = "Confiança massa baixa per reconèixer notes.";
        }
      } catch (error) {
        notification.textContent = "Error en enviar la gravació." + error;
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  RecordView.init();
});
