const columnas = document.querySelectorAll('.columna');
const notas = document.querySelectorAll('.nota');
const reproduirBtn = document.getElementById('reproduir');
let partitura = [];

const pentagrama = document.getElementById('pentagrama');

pentagrama.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains('columna') && partitura.length < 12) {
        const pentagramaRect = pentagrama.getBoundingClientRect();
        const y = e.clientY - pentagramaRect.top;
        const note = getNoteFromPosition(y);

        if (!note) {
            console.error("Nota inválida calculada desde posición:", y);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';

        const img = document.createElement('img');
        img.src = '../notesimg/nota1.png';
        img.classList.add('nota');
        img.style.position = 'absolute';
        img.style.top = `${y}px`;
        img.dataset.note = note;

        const btn = document.createElement('button');
        btn.textContent = '🗑️';
        btn.classList.add('borrar');
        btn.style.position = 'absolute';
        btn.style.bottom = '0px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.addEventListener('click', () => {
            target.removeChild(wrapper);
            partitura = partitura.filter(n => n.note !== note || n.column !== target.dataset.index);
        });

        wrapper.appendChild(img);
        wrapper.appendChild(btn);
        target.appendChild(wrapper);

        partitura.push({ note, type: 'regular', column: target.dataset.index });
        console.log("Nota agregada a partitura:", { note, column: target.dataset.index });
    }
});

notas.forEach(nota => {
    nota.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.note);
    });
});

columnas.forEach(columna => {
    columna.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    columna.addEventListener('drop', (e) => {
        e.preventDefault();
        const note = e.dataTransfer.getData('text/plain');
        const index = columna.dataset.index;

        if (!columna.querySelector('.nota-colocada')) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            columna.appendChild(wrapper);
            partitura.push({ note, index });
        }
    });
});

function getNoteFromPosition(y) {
    const heightToNote = [
        { min: 0,   max: 20,  note: "fa"  },
        { min: 21,  max: 40,  note: "mi"  },
        { min: 41,  max: 60,  note: "re"  },
        { min: 61,  max: 80,  note: "do"  },
        { min: 81,  max: 100, note: "si"  },
        { min: 101, max: 120, note: "la"  },
        { min: 121, max: 140, note: "sol" }
    ];
    const note = heightToNote.find(n => y >= n.min && y <= n.max)?.note || null;
    console.log("Nota calculada desde posición:", y, "->", note);
    return note;
}

reproduirBtn.addEventListener('click', () => {
    partitura
        .filter(nota => {
            const isValid = !!nota.note;
            if (!isValid) console.error("Nota inválida en partitura:", nota);
            return isValid;
        })
        .sort((a, b) => a.index - b.index)
        .forEach((nota, i) => {
            setTimeout(() => playSound(nota.note), i * 400);
        });
});

function playSound(note) {
    console.log(note);
    if (!note) {
        console.error("Nota inválida en playSound:", note);
        return;
    }
    console.log("Reproduciendo nota:", note);
    const audio = new Audio(`../audio/${note}.mp3`);
    audio.play().catch(err => console.error(`Error al reproducir ${note}:`, err));
}