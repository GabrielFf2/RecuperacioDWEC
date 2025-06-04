'use strict';

export class Note {
    constructor(id = 0 , nom, alteracio = false, ordre = 0) {
        this.id = id;
        this.nom = nom;
        this.alteracio = alteracio;
        this.note = nom;
        this.type = alteracio;
        this.ordre = ordre;
    }
}
