"use strict";

export function mostrarNotificacio(titol, missatge) {
    if (!("Notification" in window)) {
        console.error("Aquest navegador no suporta notificacions.");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(titol, {
            body: missatge,
            icon: "./imgs/logo.jpg",
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(titol, {
                    body: missatge,
                    icon: "./imgs/logo.jpg",
                });
            }
        });
    }
}

export function notificarRespostaServidor(resposta) {
    const titol = resposta.notifyType || "Informació";
    const missatge = resposta.notifyMessage || "Operació completada.";
    mostrarNotificacio(titol, missatge);
}
