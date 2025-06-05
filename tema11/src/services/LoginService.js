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
                return token;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error d'autenticació.");
            }
        } catch (error) {
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
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registre.");
      }
    } catch (error) {
      console.error('Error en el registre:', error);
      throw error;
    }
  }
}
