"use strict";

import { carregarNotesAlPentagrama } from "./formulari.js";
import { interpretaTranscripcio } from "../services/TranscripcioService.js";
import { RecordingService } from "../services/RecordingService.js";

export const RecordView = {
  init: async () => {
    const startButton = document.getElementById("start-recording");
    const stopButton = document.getElementById("stop-recording");
    const notification = document.getElementById("notification");

    let mediaRecorder = null;
    let recordedChunks = [];

    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

      mediaRecorder = new MediaRecorder(stream);
      recordedChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
    };

    const stopRecording = () => {
      return new Promise((resolve) => {
        mediaRecorder.stop();

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          resolve(blob);
        };
      });
    };

    await initMediaRecorder();

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
