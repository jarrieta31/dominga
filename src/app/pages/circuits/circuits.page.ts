import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { TipoCircuito } from '../../shared/tipo-circuito';
import { Place } from '../../shared/place';

import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-circuits',
    templateUrl: './circuits.page.html',
    styleUrls: ['./circuits.page.scss'],
})
export class CircuitsPage implements OnInit, OnDestroy {

    tipoCircuito: Place[] = [];
    lugaresRurales: Place[] = [];
    textoBuscar = '';

    loading: any;

    constructor(private database: DatabaseService,
                private loadingCtrl: LoadingController) {}

    su = this.database.getTypeCircuits().snapshotChanges().subscribe(data => {
                this.tipoCircuito.length = 0;
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.tipoCircuito.push(a as Place);
                })
            });

    rural = this.database.getPlaces().snapshotChanges().subscribe( data => {
      this.lugaresRurales.length = 0;
      data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    if(a['tipo'] == 'Rural'){
                      this.lugaresRurales.push(a as Place);
                    }
                })
    })

    ngOnInit() {
        this.show("Cargando circuitos...");
    } 

    ngOnDestroy(){
      this.su.unsubscribe();
      this.rural.unsubscribe();
    }

    /**
     * Filtro de circuitos
     * @param event 
     */
    buscar(event){
        this.textoBuscar = event.detail.value;
  }

  /**
   * Spinner de carga
   * @param message - mensage de spinner
   */
  async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
     this.loading.present().then(() => {
         this.su;
         this.rural;
         this.loading.dismiss();
     });
    }
}