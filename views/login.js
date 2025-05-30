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
            const token = await LoginService.login(usuari, password);
            console.log('Token guardado:', token);
        } catch (error) {
            document.getElementById('loginError').textContent = error.message || 'Error d\'autenticació.';
        }
    });
});