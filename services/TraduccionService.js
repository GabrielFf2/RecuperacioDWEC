'use strict';

export class TraduccionService {
    static async traduir(languageFrom, text) {
        if (languageFrom === 'ca') {
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
                return data;
            } else {
                console.error('Error en la traducción:', response.statusText);
                return '';
            }
        } catch (error) {
            console.error('Error en la petición de traducción:', error);
            return '';
        }
    }
}