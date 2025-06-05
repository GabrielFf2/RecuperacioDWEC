import { LoginService } from "../services/LoginService.js";
import { mostrarNotificacio } from 'src/utils/notifications.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registreForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      const errorElement = document.getElementById('confirmPasswordError');
      errorElement.textContent = 'Les contrasenyes no coincideixen.';
      errorElement.style.display = 'block';
      return;
    } else {
      document.getElementById('confirmPasswordError').style.display = 'none';
    }

    const data = {
      usuari: {
        email: form.email.value,
        nom: form.nom.value
      },
      password: password
    };

    try {
      const result = await LoginService.signup(data);
      mostrarNotificacio("Èxit", result.message || "Registre completat amb èxit!");
    } catch {
      mostrarNotificacio("Error",  "Error en el registre.");

    }
  });
});
