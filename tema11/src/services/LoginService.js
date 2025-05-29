'use strict';

import { mostrarNotificacio } from "../utils/notifications.js";

export class LoginService {

  /*async function obtenirUsuari(token) {
    try {
        const response = await fetch('http://localhost:8080/piano/user/get', {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            alert('Usuari recuperat correctament!');
            document.getElementById('loginForm').style.display = 'none';
            actualitzarUsuariBackend(userData);
        } else {
            throw new Error('Error obtenint dades de l\'usuari.');
        }
    } catch (error) {
        console.error('Error obtenint l\'usuari:', error);
    }
}*/
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

  static async signup(data) {
    try {
      const response = await fetch('https://theteacher.codiblau.com/piano/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        mostrarNotificacio("Èxit", result.message || "Registre completat amb èxit!");
        return result;
      } else {
        const errorData = await response.json();
        mostrarNotificacio("Error", errorData.message || "Error en el registre.");
        throw new Error(errorData.message || "Error en el registre.");
      }
    } catch (error) {
      mostrarNotificacio("Error", "Hi ha hagut un error en el registre.");
      console.error('Error en el registre:', error);
      throw error;
    }
  }
}
