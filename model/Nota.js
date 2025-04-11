'use strict';

export class Nota {
    constructor(id = 0 , nom, alteracio = false, ordre = 0) {
        this.id = id;
        this.nom = nom;
        this.alteracio = alteracio;
        this.ordre = ordre;
    }
}
