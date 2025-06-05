'use strict';

import { LoginService } from "../services/LoginService.js";
import { mostrarNotificacio } from 'src/utils/notifications.js'

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuari = loginForm.usuari.value.trim();
        const password = loginForm.password.value.trim();

        if (!usuari || !password) {
            document.getElementById('loginError').textContent = 'Els camps no poden estar buits.';
            return;
        }

        try {
            await LoginService.login(usuari, password);
            mostrarNotificacio("Èxit", "Login correcte.");
            window.location.href = 'dashboard.html';
        } catch (error) {
          mostrarNotificacio("Error", error.message || "Error d'autenticació.");
          document.getElementById('loginError').textContent = error.message || 'Error d\'autenticació.';
        }
    });
});
