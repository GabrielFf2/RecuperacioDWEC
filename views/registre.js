document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registreForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Les contrasenyes no coincideixen.';
            document.getElementById('confirmPasswordError').style.display = 'block';
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
            const response = await fetch('https://theteacher.codiblau.com/piano/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message || 'Registre completat amb èxit!');
        } catch (error) {
            console.error('Error en el registre:', error);
            alert('Hi ha hagut un error en el registre. Torna-ho a intentar.');
        }
    });
});