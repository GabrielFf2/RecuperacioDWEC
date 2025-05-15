"use strict";

import { carregarNotesAlPentagrama } from "./formulari.js";
import { RecordingService } from "../services/RecordingService.js";

export const RecordView = {
    init: async () => {
        const videoElement = document.getElementById("video-preview");
        const startButton = document.getElementById("start-recording");
        const stopButton = document.getElementById("stop-recording");
        const sendButton = document.getElementById("send-recording");
        const notification = document.getElementById("notification");

        const { mediaRecorder, recordedChunks } = await RecordingService.initMediaRecorder(videoElement);

        startButton.addEventListener("click", () => {
            recordedChunks.length = 0;
            mediaRecorder.start();
            notification.textContent = "Gravació iniciada...";
        });

        stopButton.addEventListener("click", async () => {
            const blob = await RecordingService.stopRecording(mediaRecorder, recordedChunks, videoElement);
            sendButton.dataset.blob = blob;
            notification.textContent = "Gravació aturada.";
        });

        sendButton.addEventListener("click", async () => {
            const blob = sendButton.dataset.blob;
            if (!blob) {
                notification.textContent = "No hi ha cap gravació per enviar.";
                return;
            }

            try {
                const result = await RecordingService.sendRecording(blob);
                console.log(result);

                if (result.confianca >= 0.8) {
                    notification.textContent = `Transcripció: ${result.transcripcio}`;

                    const notesArray = result.transcripcio.split(" ").map((note, index) => ({
                        nom: note.toUpperCase(),
                        ordre: index + 1,
                    }));

                    carregarNotesAlPentagrama(notesArray);
                } else {
                    notification.textContent = "No s'ha pogut traduir el contingut (confiança baixa).";
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