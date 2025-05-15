'use strict';

import { PartituraService } from "../services/PartituraService.js";

function mostrarNotificacio(titol, missatge) {
    const notificacio = document.createElement("div");
    notificacio.className = "notificacio";
    notificacio.innerHTML = `
        <strong>${titol}</strong>
        <p>${missatge}</p>
    `;
    document.body.appendChild(notificacio);

    setTimeout(() => {
        notificacio.remove();
    }, 3000);
}

function crearBotonEditar(partituraId) {
    const btn = document.createElement("button");
    btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar';
    btn.classList.add("btn", "edit-btn");
    btn.addEventListener("click", () => {
        window.location.href = `formulari.html?id=${encodeURIComponent(partituraId)}`;
    });
    return btn;
}

function crearBotonEsborrar(partituraId) {
    const btn = document.createElement("button");
    btn.innerHTML = '<i class="fa-solid fa-trash"></i> Esborrar';
    btn.classList.add("btn", "delete-btn");
    btn.addEventListener("click", async () => {
        if (confirm(`Està segur que vol esborrar aquest element amb ID ${partituraId}?`)) {
            try {
                const message = await PartituraService.deletePartitura(partituraId);
                mostrarNotificacio("Èxit", message);
                window.location.reload();
            } catch (error) {
                mostrarNotificacio("Error", "No s'ha pogut esborrar la partitura.");
                console.error(error);
            }
        }
    });
    return btn;
}

function crearBotonVerLetra(partitura) {
    const btn = document.createElement("button");
    btn.textContent = "Ver letra";
    btn.classList.add("btn", "view-btn");
    btn.addEventListener("click", () => {
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modal-title");
        const originalLyrics = document.getElementById("original-lyrics");
        const translatedLyrics = document.getElementById("translated-lyrics");

        modalTitle.textContent = partitura.titol || "Sin título";
        originalLyrics.textContent = partitura.lletraoriginal || "Letra no disponible";
        translatedLyrics.textContent = partitura.lletratraduccio || "Traducción no disponible";

        modal.style.display = "block";
    });
    return btn;
}

export { crearBotonEditar, crearBotonEsborrar, crearBotonVerLetra };

document.addEventListener("DOMContentLoaded", async () => {
    const partitures = await PartituraService.getPartitures();

    if (!partitures || partitures.length === 0) {
        mostrarNotificacio("Error", "No se encontraron partituras.");
        return;
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.clear();
        mostrarNotificacio("Èxit", "Sessió tancada correctament!");
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
            tdAccions.appendChild(crearBotonEditar(partitura.idpartitura));
            tdAccions.appendChild(crearBotonEsborrar(partitura.idpartitura));
            tdAccions.appendChild(crearBotonVerLetra(partitura));

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