const partitures = [
    { id: 1, titol: "La Balanguera", idioma: "ca" , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { id: 2, titol: "Merry Christmas", idioma: "en"  , notes: ["DO", "RE", "MI", "FA", "FA", "SOL", "SOL", "LA#", "LA#"] },
    { id: 3, titol: "Frère Jacques", idioma: "fr" , notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { id: 4, titol: "Sant Antoni i el Dimoni", idioma: "ca" ,  notes: ["DO", "DO", "RE", "DO", "FA", "MI", "DO", "DO", "RE", "DO", "SOL", "FA"] },
    { id: 5, titol: "Ode to Joy", idioma: "de", notes: ["MI", "MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO", "DO", "RE", "MI", "MI", "RE", "RE"] },
    { id: 6, titol: "Jingle Bells", idioma: "en", notes: ["MI", "MI", "MI", "MI", "MI", "MI", "MI", "SOL", "DO", "RE", "MI"] },
    { id: 7, titol: "El Cant dels Ocells", idioma: "ca", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 8, titol: "Twinkle Twinkle Little Star", idioma: "en", notes: ["DO", "DO", "SOL", "SOL", "LA", "LA", "SOL"] },
    { id: 9, titol: "Happy Birthday", idioma: "en", notes: ["DO", "DO", "RE", "DO", "FA", "MI"] },
    { id: 10, titol: "Bella Ciao", idioma: "it", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 11, titol: "Himno de la Alegría", idioma: "es", notes: ["MI", "FA", "SOL", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 12, titol: "Auld Lang Syne", idioma: "en", notes: ["DO", "RE", "MI", "FA", "MI", "RE", "DO", "SOL"] },
    { id: 13, titol: "Guantanamera", idioma: "es", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 14, titol: "Yankee Doodle", idioma: "en", notes: ["DO", "DO", "RE", "MI", "FA", "MI", "RE", "DO"] },
    { id: 15, titol: "L'estaca", idioma: "ca", notes: ["DO", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 16, titol: "Alouette", idioma: "fr", notes: ["RE", "MI", "FA", "MI", "RE", "DO"] },
    { id: 17, titol: "Cielito Lindo", idioma: "es", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 18, titol: "My Bonnie Lies Over the Ocean", idioma: "en", notes: ["FA", "MI", "RE", "DO", "RE", "MI", "FA"] },
    { id: 19, titol: "Greensleeves", idioma: "en", notes: ["DO", "RE", "MI", "FA", "SOL", "LA", "SOL"] },
    { id: 20, titol: "Los peces en el río", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 21, titol: "La Cucaracha", idioma: "es", notes: ["SOL", "SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 22, titol: "Der Mond ist aufgegangen", idioma: "de", notes: ["DO", "RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { id: 23, titol: "Hava Nagila", idioma: "he", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 24, titol: "El Condor Pasa", idioma: "es", notes: ["MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 25, titol: "Aquarela do Brasil", idioma: "pt", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 26, titol: "Toreador Song", idioma: "fr", notes: ["DO", "FA", "MI", "RE", "DO", "SOL", "FA"] },
    { id: 27, titol: "Funiculì Funiculà", idioma: "it", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] },
    { id: 28, titol: "Scarborough Fair", idioma: "en", notes: ["DO", "MI", "FA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 29, titol: "Amazing Grace", idioma: "en", notes: ["SOL", "LA", "SOL", "FA", "MI", "RE", "DO"] },
    { id: 30, titol: "Danny Boy", idioma: "en", notes: ["RE", "MI", "FA", "SOL", "FA", "MI", "RE"] }
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
        btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar';
        btnEditar.classList.add("btn", "edit-btn");

        const btnEsborrar = document.createElement("button");
        btnEsborrar.innerHTML = '<i class="fa-solid fa-trash"></i> Esborrar';
        btnEsborrar.classList.add("btn", "delete-btn");
        btnEsborrar.addEventListener("click", () => {
            if (confirm("Està segur que vol esborrar aquest element " + partitura.id + "?")) {
                alert("Element esborrat!");
            } else {
                alert("Has cancel·lat l'acció.");
            }
        });

        tdAccions.appendChild(btnEditar);
        tdAccions.appendChild(btnEsborrar);
        fila.appendChild(tdAccions);
        tbody.appendChild(fila);
    });

    taula.appendChild(tbody);
    container.appendChild(taula);
}

window.onload = crearTaula;