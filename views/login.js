document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuari = document.getElementById('usuari').value.trim();
    const password = document.getElementById('password').value;

    const data = { usuari, password };

    try {
        const loginResponse = await fetch('https://theteacher.codiblau.com/piano/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!loginResponse.ok) {
            const errorResult = await loginResponse.json();
            alert(errorResult.message);
            return;
        }

        const token = await loginResponse.text();
        localStorage.setItem('authToken', token);

        const userResponse = await fetch('https://theteacher.codiblau.com/piano/user/get', {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });

        if (!userResponse.ok) {
            throw new Error('Error obtenint les dades de l\'usuari.');
        }

        const userData = await userResponse.json();
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Sessió iniciada correctament!');
        window.close();
    } catch (error) {
        console.error('Error en el procés de login:', error);
        alert('Hi ha hagut un error. Revisa la consola per més detalls.');
    }
});