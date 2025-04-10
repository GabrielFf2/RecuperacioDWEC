'use strict';

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('creacioPartituraForm');
        form.addEventListener('submit', (event) => {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    });

    const validateForm = () => {
        const { titol, idioma, lletraOriginal, traduccioCatala } = document.forms[0].elements;

        const revisioNumParaules = /^(\b\w+\b\s*){3,}$/;
        const htmlRevisio = /<\/?[a-z][\s\S]*>/i;

        if (!revisioNumParaules.test(titol.value)) {
            alert(`El títol ha de tenir mínim 3 paraules.`);
            return false;
        }

        if (!htmlRevisio.test(lletraOriginal.value)) {
            alert(`La lletra original ha de contenir codi HTML vàlid.`);
            return false;
        }

        if (!htmlRevisio.test(traduccioCatala.value)) {
            alert(`La traducció al català ha de contenir codi HTML vàlid.`);
            return false;
        }

        if (idioma.value === 'ca' && lletraOriginal.value !== traduccioCatala.value) {
            alert(`Si l'idioma original és Català, la lletra original i la traducció al català han de ser idèntiques.`);
            return false;
        }

        window.location.href = 'https://iesmanacor.cat';
    };
})();
