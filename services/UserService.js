

async function obtenirUsuari(token) {
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
}

function actualitzarUsuariBackend(userData) {
    console.log('Actualitzant usuari al backend:', userData);
}