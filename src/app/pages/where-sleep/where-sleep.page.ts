import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { DondeDormir } from '../../shared/donde-dormir';
import { LoadingController } from '@ionic/angular';
import { DondeDormirService } from 'src/app/services/donde-dormir.service';

@Component({
    selector: 'app-where-sleep',
    templateUrl: './where-sleep.page.html',
    styleUrls: ['./where-sleep.page.scss'],
})
export class WhereSleepPage implements OnInit, OnDestroy {

    sleep  : DondeDormir[];
    wsleep : DondeDormir[];
    items  :    any[] = [];
    loading:           any;
    textoBuscar       = '';

    su = this.database.getSleep().snapshotChanges().subscribe(data => {
        this.sleep = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.sleep.push(a as DondeDormir);
        })
    });

    constructor(
        private database    : DatabaseService,
        private loadingCtrl : LoadingController,
        private afs         : DondeDormirService ) 
        {
            this.cargarDondeDormir();
        }

    

    ngOnInit() {
        this.show("Cargando lugares...");
    }

    ngOnDestroy(){
        this.su.unsubscribe();
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

    buscar( event ){
        this.textoBuscar = event.detail.value;
    }

    get dondeDormir(){
        this.afs.getDondeDormir();

        return 'donde dormir';
    }

    cargarDondeDormir(){
        this.wsleep = this.afs.donde_dormir;
    }

}