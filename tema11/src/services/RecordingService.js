"use strict";

export const RecordingService = {
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
