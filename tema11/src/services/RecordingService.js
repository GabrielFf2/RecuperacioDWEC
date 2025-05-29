"use strict";

export const RecordingService = {
    initMediaRecorder: async (videoElement) => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        videoElement.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream);
        const recordedChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        return { mediaRecorder, recordedChunks };
    },

    stopRecording: (mediaRecorder, recordedChunks) => {
        mediaRecorder.stop();

        return new Promise((resolve) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: "audio/webm" });
                resolve(blob);
            };
        });
    },

    sendRecording: async (blob) => {
        const formData = new FormData();
        formData.append("arxiu", blob, "audio.webm");

        const response = await fetch("https://theteacher.codiblau.com/piano/google/transcribe", {
            method: "POST",
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
            body: formData,
        });

        console.log(response);
        return response.json();
    },
};