'use strict';

export class Note {
    constructor(id = 0 , nom, alteracio = false, ordre = 0) {
        this.id = id;
        this.note = nom;
        this.alteracio = alteracio;
        this.ordre = ordre;
    }
}
