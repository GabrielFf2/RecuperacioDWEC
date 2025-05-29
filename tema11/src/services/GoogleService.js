'use strict';

import { Idioma } from "../model/Idioma.js";

export const GoogleService = {
    async getIdiomes() {
        const url = "https://theteacher.codiblau.com/piano/nologin/google/translate/languages";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const idiomesData = await response.json();
            return idiomesData.map(idioma => new Idioma(idioma.code, idioma.name));

        } catch (error) {
            console.error("Error obtenint els idiomes del servidor:", error);
            return [];
        }
    }
};