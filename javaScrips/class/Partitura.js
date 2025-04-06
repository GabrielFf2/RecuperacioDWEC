class Partitura {
    constructor(id, titol, idioma, notes) {
        this.id = id;
        this.titol = titol;
        this.idioma = idioma;
        this.notes = notes;
    }

    displayDetails() {
        console.log(`ID: ${this.id}`);
        console.log(`Title: ${this.titol}`);
        console.log(`Language: ${this.idioma}`);
        console.log(`Notes: ${this.notes.join(', ')}`);
    }

    // Method to play the partitura
    play() {
        let delay = 0;
        this.notes.forEach(nota => {
            setTimeout(() => {
                const audio = document.getElementById(`audio-${nota}`);
                if (audio) {
                    audio.currentTime = 0;
                    audio.play();
                }
            }, delay);
            delay += 1000;
        });
    }
}