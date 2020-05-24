import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { TipoCircuito } from '../../shared/tipo-circuito';

@Component({
    selector: 'app-circuits',
    templateUrl: './circuits.page.html',
    styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit {

    tipoCircuito: TipoCircuito[];
    textoBuscar = '';

    constructor(public database: DatabaseService) {}

    su = this.database.getTypeCircuits().snapshotChanges().subscribe(data => {
                this.tipoCircuito = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.tipoCircuito.push(a as TipoCircuito);
                })
                //console.log(this.tipoCircuito);
            });

    ngOnInit() {
        this.su;
    } 

    ngOnDestroy(){
        this.su.unsubscribe();
    }

    buscar(event){
        this.textoBuscar = event.detail.value;
  }
}