document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Formulario enviado');

        const usuari = loginForm.usuari.value.trim();
        const password = loginForm.password.value.trim();

        if (!usuari || !password) {
            console.log('Campos vacíos');
            document.getElementById('loginError').textContent = 'Els camps no poden estar buits.';
            return;
        }

        try {
            const response = await fetch('https://theteacher.codiblau.com/piano/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuari, password })
            });

            console.log('Respuesta del servidor:', response);

            if (response.ok) {
                const token = await response.text();
                console.log('Token recibido:', token);
                localStorage.setItem('token', token);
            } else {
                const errorData = await response.json();
                console.log('Error en el login:', errorData);
                document.getElementById('loginError').textContent = errorData.message || 'Error d\'autenticació.';
            }
        } catch (error) {
            console.error('Error en el login:', error);
            document.getElementById('loginError').textContent = 'Hi ha hagut un error. Torna-ho a intentar.';
        }
    });
});