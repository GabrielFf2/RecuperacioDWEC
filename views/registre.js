document.getElementById('registreForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    if (password !== confirmPassword) {
        alert('Les contrasenyes no coincideixen.');
        return;
    }

    const data = {
        usuari: {
            email: email,
            nom: nom
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

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error en el registre:', error);
        alert('Hi ha hagut un error en el registre. Revisa la consola per més detalls.');
    }

    document.getElementById('registreForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (nom.length < 3 || nom.length > 20) {
            alert('El nom ha de tenir entre 3 i 20 caràcters.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('El correu electrònic no és vàlid.');
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,8}$/.test(password)) {
            alert('La contrasenya ha de tenir entre 6 i 8 caràcters, incloent majúscules, minúscules i números.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Les contrasenyes no coincideixen.');
            return;
        }

        const data = {
            usuari: {
                email: email,
                nom: nom
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

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error en el registre:', error);
            alert('Hi ha hagut un error en el registre. Revisa la consola per més detalls.');
        }
    });
});