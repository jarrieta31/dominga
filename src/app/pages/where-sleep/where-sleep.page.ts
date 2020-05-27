import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { DondeDormir } from '../../shared/donde-dormir';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-where-sleep',
    templateUrl: './where-sleep.page.html',
    styleUrls: ['./where-sleep.page.scss'],
})
export class WhereSleepPage implements OnInit {

    sleep: DondeDormir[];
    textoBuscar = '';
    items: any[] = [];

    loading: any;

    su = this.database.getSleep().snapshotChanges().subscribe(data => {
        this.sleep = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.sleep.push(a as DondeDormir);
        })
    });

    constructor(private database: DatabaseService,
                private loadingCtrl: LoadingController) { }

    

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

    

}