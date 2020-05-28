import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { TipoCircuito } from '../../shared/tipo-circuito';

import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-circuits',
    templateUrl: './circuits.page.html',
    styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit {

    tipoCircuito: TipoCircuito[];
    textoBuscar = '';

    loading: any;

    constructor(private database: DatabaseService,
                private loadingCtrl: LoadingController) {}

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
        this.show("Cargando circuitos...");
    } 

    ngOnDestroy(){
        this.su.unsubscribe();
    }

    buscar(event){
        this.textoBuscar = event.detail.value;
  }

  async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
     this.loading.present().then(() => {
         this.su;
         this.loading.dismiss();
     });
    }
}