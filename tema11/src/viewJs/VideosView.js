"use strict";


export const VideosView = {

    getVideos: () => [
      { id: 1, src: "/imgs/134486-759714562_small.mp4" },
      { id: 2, src: "/imgs/134486-759714562_small.mp4" },
      { id: 3, src: "/imgs/134486-759714562_small.mp4" },
    ],

    renderVideos: () => {
        const existingContainer = document.querySelector("#video-container");
        if (existingContainer) {
            console.warn("El contenedor #video-container ya existe. Evitando duplicados.");
            return;
        }
        const videoContainer = document.createElement("div");
        videoContainer.id = "video-container";

      const videos = VideosView.getVideos();
      const videoElements = [];

        videos.forEach((video) => {
            if (video.src.endsWith(".mp4")) {
                const videoElement = document.createElement("video");
                videoElement.src = video.src;
                videoElement.width = 560;
                videoElement.height = 315;
                videoElement.controls = true;
                videoElement.className = "video-player";

                videoContainer.appendChild(videoElement);
                videoElements.push(videoElement);
            } else {
                const iframe = document.createElement("iframe");
                iframe.src = video.src;
                iframe.width = "560";
                iframe.height = "315";
                iframe.frameBorder = "0";
                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                iframe.className = "video-player";

                videoContainer.appendChild(iframe);
                videoElements.push(iframe);
            }
        });

        const pipButton = document.createElement("button");
        pipButton.id = "pip-button";
        pipButton.textContent = "Activar Picture in Picture";
        videoContainer.appendChild(pipButton);

        document.body.prepend(videoContainer);

        pipButton.addEventListener("click", async () => {
            const activeVideo = videoElements.find((video) => {
                if (video.tagName === "VIDEO") {
                    return !video.paused;
                }
                return false;
            });

            if (activeVideo) {
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
                alert(
                    "No hi ha cap vídeo reproduint-se o el vídeo no és compatible amb Picture in Picture."
                );
            }
        });
    },
};
