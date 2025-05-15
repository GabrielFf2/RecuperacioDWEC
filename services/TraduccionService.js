'use strict';

import { mostrarNotificacio } from "../utils/notifications.js";

export class TraduccionService {
    static async traduir(languageFrom, text) {
        if (languageFrom === 'ca') {
            mostrarNotificacio("Informació", "El text ja està en català.");
            return text;
        }

        try {
            const response = await fetch('https://theteacher.codiblau.com/piano/nologin/google/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    languageFrom: languageFrom,
                    languageTo: 'ca',
                    text: text,
                }),
            });

            if (response.ok) {
                const data = await response.text();
                mostrarNotificacio("Èxit", "Traducció completada correctament.");
                return data;
            } else {
                mostrarNotificacio("Error", "Error en la traducció: " + response.statusText);
                return '';
            }
        } catch (error) {
            mostrarNotificacio("Error", "Error en la petició de traducció.");
            console.error('Error en la petició de traducció:', error);
            return '';
        }
    }
}