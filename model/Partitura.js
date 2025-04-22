'use strict';

export class Partitura {
    constructor(idpartitura, name, partituraoriginal, partituratraduccio, idiomaoriginal, idiomatraduccio = 'ca', notes = []) {
        this.idpartitura = idpartitura;
        this.name = name;
        this.partituraoriginal = partituraoriginal;
        this.partituratraduccio = partituratraduccio;
        this.idiomaoriginal = idiomaoriginal;
        this.idiomatraduccio = idiomatraduccio;
        this.notes = notes;
    }
}
