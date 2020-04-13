import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { TipoCircuito } from '../../shared/tipo-circuito';

@Component({
    selector: 'app-circuits',
    templateUrl: './circuits.page.html',
    styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit {

    tipoCircuito: TipoCircuito[];

    constructor(public database: DatabaseService) {}

    ngOnInit() {
        this.getTipoCircuito();
    }

    getTipoCircuito() {

        let s = this.database.getTypeCircuits();
        // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
        // último pasamos los datos a JSON
        s.snapshotChanges().subscribe(data => {
                this.tipoCircuito = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.tipoCircuito.push(a as TipoCircuito);
                })
            }),
            err => console.log(err)
    }

}