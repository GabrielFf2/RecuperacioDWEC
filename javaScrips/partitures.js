const partitures = [
    { titol: "La Balanguera", idioma: "ca" , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { titol: "Merry Christmas", idioma: "en"  , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { titol: "Frère Jacques", idioma: "fr" , notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { titol: "Sant Antoni i el Dimoni", idioma: "ca" ,  notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { titol: "Ode to Joy", idioma: "de", notes: ["MI", "MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO", "DO", "RE", "MI", "MI", "RE", "RE"] },
    { titol: "Jingle Bells", idioma: "en", notes: ["MI", "MI", "MI", "MI", "MI", "MI", "MI", "SOL", "DO", "RE", "MI"] },
    { titol: "El Cant dels Ocells", idioma: "ca", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Twinkle Twinkle Little Star", idioma: "en", notes: ["DO", "DO", "SOL", "SOL", "LA", "LA", "SOL"] },
    { titol: "Happy Birthday", idioma: "en", notes: ["DO", "DO", "RE", "DO", "FA", "MI"] },
    { titol: "Bella Ciao", idioma: "it", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Himno de la Alegría", idioma: "es", notes: ["MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Auld Lang Syne", idioma: "en", notes: ["DO", "RE", "MI", "FA", "MI", "RE", "DO", "SOL"] },
    { titol: "Guantanamera", idioma: "es", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Yankee Doodle", idioma: "en", notes: ["DO", "DO", "RE", "MI", "FA", "MI", "RE", "DO"] },
    { titol: "L'estaca", idioma: "ca", notes: ["DO", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Alouette", idioma: "fr", notes: ["RE", "MI", "FA", "MI", "RE", "DO"] },
    { titol: "Cielito Lindo", idioma: "es", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "My Bonnie Lies Over the Ocean", idioma: "en", notes: ["FA", "MI", "RE", "DO", "RE", "MI", "FA"] },
    { titol: "Greensleeves", idioma: "en", notes: ["DO", "RE", "MI", "FA", "SOL", "LA", "SOL"] },
    { titol: "Los peces en el río", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "La Cucaracha", idioma: "es", notes: ["SOL", "SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Der Mond ist aufgegangen", idioma: "de", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { titol: "Hava Nagila", idioma: "he", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "El Condor Pasa", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Aquarela do Brasil", idioma: "pt", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Toreador Song", idioma: "fr", notes: ["DO", "FA", "MI", "RE", "DO", "SOL", "FA"] },
    { titol: "Funiculì Funiculà", idioma: "it", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { titol: "Scarborough Fair", idioma: "en", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Amazing Grace", idioma: "en", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { titol: "Danny Boy", idioma: "en", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] }
];


function generarDades() {
    const dades = [];
    for (let i = 0; i < 100; i++) {
        dades.push(partitures[i % partitures.length]);
    }
    return dades;
}

function crearTaula() {
    const container = document.getElementById("table-container");

    const taula = document.createElement("table");
    taula.id = "partituresTable";

    taula.innerHTML = `
                <thead>
                    <tr>
                        <th>Títol</th>
                        <th>Idioma Original</th>
                        <th>Accions</th>
                    </tr>
                </thead>
            `;

    const tbody = document.createElement("tbody");
    const dades = generarDades();

    dades.forEach((partitura) => {
        const fila = document.createElement("tr");

        const tdTitol = document.createElement("td");
        tdTitol.textContent = partitura.titol;
        fila.appendChild(tdTitol);

        const tdIdioma = document.createElement("td");
        tdIdioma.textContent = partitura.idioma;
        fila.appendChild(tdIdioma);

        const tdAccions = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️ Editar";
        btnEditar.classList.add("btn", "edit-btn");

        const btnEsborrar = document.createElement("button");
        btnEsborrar.textContent = "🗑️ Esborrar";
        btnEsborrar.classList.add("btn", "delete-btn");

        tdAccions.appendChild(btnEditar);
        tdAccions.appendChild(btnEsborrar);
        fila.appendChild(tdAccions);
        tbody.appendChild(fila);
    });

    taula.appendChild(tbody);
    container.appendChild(taula);
}

window.onload = crearTaula;