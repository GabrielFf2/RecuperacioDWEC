'use strict';

import { LoginService } from "../services/LoginService.js";

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
            window.location.href = 'dashboard.html'; // Redirigeix a la pàgina principal
        } catch (error) {
            document.getElementById('loginError').textContent = error.message || 'Error d\'autenticació.';
        }
    });
});