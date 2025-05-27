'use strict';

import { mostrarNotificacio } from "../utils/notifications.js";

export class LoginService {
    static async login(usuari, password) {
        try {
            const response = await fetch('https://theteacher.codiblau.com/piano/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuari, password })
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);
                mostrarNotificacio("Èxit", "Login correcte.");
                return token;
            } else {
                const errorData = await response.json();
                mostrarNotificacio("Error", errorData.message || "Error d'autenticació.");
                throw new Error(errorData.message || "Error d'autenticació.");
            }
        } catch (error) {
            mostrarNotificacio("Error", "Hi ha hagut un error en el login.");
            console.error('Error en el login:', error);
            throw error;
        }
    }
}