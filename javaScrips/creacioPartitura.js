document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('creacioPartituraForm');
    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });
});

function validateForm() {
    const titol = document.forms[0].elements['titol'].value;
    const idioma = document.forms[0].elements['idioma'].value;
    const lletraOriginal = document.forms[0].elements['lletraOriginal'].value;
    const traduccioCatala = document.forms[0].elements['traduccioCatala'].value;

    const revisioNumParaules = /^(\b\w+\b\s*){3,}$/;
    const htmlRevisio = /<\/?[a-z][\s\S]*>/i;

    if (!revisioNumParaules.test(titol)) {
        alert("El títol ha de tenir mínim 3 paraules.");
        return false;
    }

    if (!htmlRevisio.test(lletraOriginal)) {
        alert("La lletra original ha de contenir codi HTML vàlid.");
        return false;
    }

    if (!htmlRevisio.test(traduccioCatala)) {
        alert("La traducció al català ha de contenir codi HTML vàlid.");
        return false;
    }

    if (idioma === "ca" && lletraOriginal !== traduccioCatala) {
        alert("Han de ser idèntiques.");
        return false;
    }

    window.location.href = "https://iesmanacor.cat";
}