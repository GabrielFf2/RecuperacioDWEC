"use strict";

import { carregarNotesAlPentagrama } from "./formulari.js";
import { interpretaTranscripcio } from "../services/TranscripcioService.js";
import { RecordingService } from "../services/RecordingService.js";

export const RecordView = {
  init: async () => {
    const startButton = document.getElementById("start-recording");
    const stopButton = document.getElementById("stop-recording");
    const notification = document.getElementById("notification");

    const { mediaRecorder, recordedChunks } = await RecordingService.initMediaRecorder();

    startButton.addEventListener("click", () => {
      recordedChunks.length = 0;
      mediaRecorder.start();
      notification.textContent = "Gravació iniciada...";
    });

    stopButton.addEventListener("click", async () => {
      const blob = await RecordingService.stopRecording(mediaRecorder, recordedChunks);
      notification.textContent = "Gravació aturada. Enviant gravació...";

      try {
        const result = await RecordingService.sendRecording(blob);
        console.log(result);

        if (result.confianca >= 0.4) {
          const interpretacio = interpretaTranscripcio(result.transcripcio, result.confianca);
          console.log("Interpretació:", interpretacio);

          if (interpretacio.notes.length > 0) {
            const notesArray = interpretacio.notes.map((nota, index) => ({
              nom: nota.toUpperCase(),
              ordre: index + 1
            }));

            notification.textContent = `Notes reconegudes: ${interpretacio.notes.join(", ")}`;
            carregarNotesAlPentagrama(notesArray);
          } else {
            notification.textContent = "No s'han pogut reconèixer notes amb prou confiança.";
          }

          if (interpretacio.errors.length > 0) {
            console.warn("Errors de reconeixement:", interpretacio.errors);
          }
        } else {
          notification.textContent = "Confiança massa baixa per reconèixer notes.";
        }

      } catch (error) {
        console.error("Error en enviar la gravació:", error);
        notification.textContent = "Error en enviar la gravació.";
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  RecordView.init();
});
