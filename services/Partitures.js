import {partituraService} from "./PartituraService.js";

(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const modal = document.getElementById('modal');
        const closeModal = document.getElementById('close-modal');
        const originalLyrics = document.getElementById('original-lyrics');
        const translatedLyrics = document.getElementById('translated-lyrics');
        const copyOriginalButton = document.getElementById('copy-original');
        const copyTranslatedButton = document.getElementById('copy-translated');

        function openModal(partitura) {
            document.getElementById('modal-title').textContent = partitura.name;
            originalLyrics.textContent = partitura.partituraoriginal;
            translatedLyrics.textContent = partitura.partituratraduccio;
            modal.style.display = 'block';
        }

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });


        const partitures = await partituraService.getPartitures();

        const tableContainer = document.getElementById('table-container');
        partitures.forEach(partitura => {
            const partituraDiv = document.createElement('div');
            partituraDiv.classList.add('partitura-item');

            const title = document.createElement('p');
            title.textContent = partitura.name;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Ver Partitura';
            viewButton.classList.add('btn', 'view-btn');
            viewButton.addEventListener('click', () => openModal(partitura));

            partituraDiv.appendChild(title);
            partituraDiv.appendChild(viewButton);
            tableContainer.appendChild(partituraDiv);
        });

        copyOriginalButton.addEventListener('click', async () => {
            try {
                const textToCopy = originalLyrics.textContent;
                await navigator.clipboard.writeText(textToCopy);
            } catch (err) {
                console.error('Error copiant la lletra original:', err);
            }
        });

        copyTranslatedButton.addEventListener('click', async () => {
            try {
                const textToCopy = translatedLyrics.textContent;
                await navigator.clipboard.writeText(textToCopy);
            } catch (err) {
                console.error('Error copiant la lletra en català:', err);
            }
        });
    });
})();