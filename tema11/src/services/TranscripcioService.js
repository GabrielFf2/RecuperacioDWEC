"use strict";

const equivalenciasNotes = {
    "do": ["do", "no", "mo", "2", "dos"],
    "do sostenido": ["dos sostenido", "do sostenido"],
    "re": ["re"],
    "re sostenido": ["re sostenido"],
    "mi": ["mi", "me", "mí", "ní"],
    "fa": ["fa", "fan"],
    "fa sostenido": ["fa sostenido"],
    "sol": ["sol", "so"],
    "sol sostenido": ["sol sostenido"],
    "la": ["la"],
    "la sostenido": ["la sostenido"],
    "si": ["si", "sí", "se", "sé"],
    "do agudo": ["do agudo", "dos agudo", "do", "dos"],
    "do agudo sostenido": ["do agudo sostenido", "dos agudo sostenido"]
};

const sostenidoMap = {
    "do sostenido": "DO#",
    "re sostenido": "RE#",
    "fa sostenido": "FA#",
    "sol sostenido": "SOL#",
    "la sostenido": "LA#"
};

export function interpretaTranscripcio(transcripcio, confianca) {
    if (confianca < 0.4) {
        return { notes: [], errors: ["Confiança massa baixa per interpretar la nota."] };
    }

    const normalitzada = transcripcio.toLowerCase().trim();
    const palabras = normalitzada.split(" ");
    const notesDetectades = [];
    const errors = [];

    let i = 0;
    while (i < palabras.length) {
        let combinacionDoble = palabras[i];
        if (i + 1 < palabras.length) {
            combinacionDoble += " " + palabras[i + 1];
        }

        let trobada = false;

        for (const [nota, variants] of Object.entries(equivalenciasNotes)) {
            if (variants.includes(combinacionDoble)) {
                notesDetectades.push(nota);
                i += 2;
                trobada = true;
                break;
            }
        }

        if (!trobada) {
            for (const [nota, variants] of Object.entries(equivalenciasNotes)) {
                if (variants.includes(palabras[i])) {
                    notesDetectades.push(nota);
                    trobada = true;
                    break;
                }
            }

            if (trobada) {
                i += 1;
            } else {
                errors.push(`No s'ha pogut reconèixer la nota: "${palabras[i]}"`);
                i += 1;
            }
        }
    }

    const notesFinals = notesDetectades.map(nota => sostenidoMap[nota] || nota);

    return { notes: notesFinals, errors };
}
