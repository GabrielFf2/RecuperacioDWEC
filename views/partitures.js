'use strict';
import { partituraObjects } from "../services/initPartitures.js";
import { partituraService } from "../services/PartituraService.js";

(() => {
    const partitures = partituraObjects;

    function crearTaula() {
        const container = document.getElementById("table-container");
        container.innerHTML = "";

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
        const dades = partituraService.generarDades(partitures);

        dades.forEach((partitura) => {
            const fila = document.createElement("tr");

            const tdTitol = document.createElement("td");
            tdTitol.textContent = partitura.name;
            fila.appendChild(tdTitol);

            const tdIdioma = document.createElement("td");
            tdIdioma.textContent = partitura.idiomaoriginal;
            fila.appendChild(tdIdioma);

            const tdAccions = document.createElement("td");
            const btnEditar = partituraService.crearBotonEditar();
            const btnEsborrar = partituraService.crearBotonEsborrar(partitura.id);

            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEsborrar);

            fila.appendChild(tdAccions);
            tbody.appendChild(fila);
        });

        taula.appendChild(tbody);
        container.appendChild(taula);
    }

    window.onload = crearTaula;

    document.getElementById("login-link").addEventListener("click", function(event) {
        event.preventDefault();
        window.open('./login.html', 'Login', 'width=500,height=400,top=' + (screen.height / 2 - 200) + ',left=' + (screen.width / 2 - 250));
    });
})();