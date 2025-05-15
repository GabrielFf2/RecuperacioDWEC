"use strict";

import { VideosService } from "../services/VideosService.js";

export const VideosView = {
    renderVideos: () => {
        const videoContainer = document.createElement("div");
        videoContainer.id = "video-container";

        const videos = VideosService.getVideos();
        const videoElements = [];

        videos.forEach((video) => {
            const iframe = document.createElement("iframe");
            iframe.src = video.src;
            iframe.width = "560";
            iframe.height = "315";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.className = "video-player";

            videoContainer.appendChild(iframe);
            videoElements.push(iframe);
        });

        const pipButton = document.createElement("button");
        pipButton.id = "pip-button";
        pipButton.textContent = "Activar Picture in Picture";
        videoContainer.appendChild(pipButton);

        document.body.prepend(videoContainer);

        // Activar Picture in Picture
        pipButton.addEventListener("click", async () => {
            const activeVideo = videoElements.find((video) => !video.paused);

            if (activeVideo) {
                // Verifica si el vídeo es de YouTube
                if (activeVideo.src.includes("youtube.com") || activeVideo.src.includes("youtu.be")) {
                    alert("El mode 'Picture in Picture' no és compatible amb vídeos de YouTube.");
                    return;
                }

                try {
                    if (document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                    } else {
                        await activeVideo.requestPictureInPicture();
                    }
                } catch (error) {
                    console.error("Error al activar Picture in Picture:", error);
                }
            } else {
                alert("No hi ha cap vídeo reproduint-se.");
            }
        });
    },
};