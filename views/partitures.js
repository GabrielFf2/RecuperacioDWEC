'use strict';

import { PartituraService } from "../services/PartituraService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const partitures = await PartituraService.getPartitures();

    if (!partitures || partitures.length === 0) {
        console.error("No se encontraron partituras.");
        return;
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.clear();
        alert('Sessió tancada correctament!');
        window.location.reload();
    });

    console.log("Partitures cargadas:", partitures);

    function crearTaula() {
        const container = document.getElementById("table-container");

        if (!container) {
            console.error("El contenedor con ID 'table-container' no existe.");
            return;
        }

        container.innerHTML = "";

        const taula = document.createElement("table");
        taula.id = "partituresTable";

        taula.innerHTML = `
            <thead>
                <tr>
                    <th>Títol</th>
                    <th>Idioma Original</th>
                    <th>Notes</th>
                    <th>Accions</th>
                </tr>
            </thead>
        `;

        const tbody = document.createElement("tbody");

        partitures.forEach((partitura) => {
            const fila = document.createElement("tr");

            const tdTitol = document.createElement("td");
            tdTitol.textContent = partitura.titol || "Sin título";
            fila.appendChild(tdTitol);

            const tdIdioma = document.createElement("td");
            tdIdioma.textContent = partitura.idiomaoriginal || "Desconocido";
            fila.appendChild(tdIdioma);

            const tdNotes = document.createElement("td");
            tdNotes.textContent = partitura.notes.length > 0
                ? `${partitura.notes.length} notes`
                : "Sin notas";
            fila.appendChild(tdNotes);

            const tdAccions = document.createElement("td");
            const btnEditar = PartituraService.crearBotonEditar(partitura.idpartitura);
            const btnEsborrar = PartituraService.crearBotonEsborrar(partitura.idpartitura);
            const btnVeure = PartituraService.crearBotonVerLetra(partitura);
            if (btnVeure) {
                tdAccions.appendChild(btnVeure);
            } else {
                console.error("No se pudo crear el botón Ver Letra para la partitura:", partitura);
            }

            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEsborrar);
            tdAccions.appendChild(btnVeure);

            fila.appendChild(tdAccions);
            tbody.appendChild(fila);
        });

        taula.appendChild(tbody);
        container.appendChild(taula);
    }

    crearTaula();

    document.getElementById("login-link")?.addEventListener("click", function(event) {
        event.preventDefault();
        window.open('./login.html', 'Login', 'width=500,height=400,top=' + (screen.height / 2 - 200) + ',left=' + (screen.width / 2 - 250));
    });
});