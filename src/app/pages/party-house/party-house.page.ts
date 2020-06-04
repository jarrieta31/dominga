import { Component, OnInit, OnDestroy } from '@angular/core';

import { DondeComer } from '../../shared/donde-comer';

import { DatabaseService } from '../../services/database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-party-house',
  templateUrl: './party-house.page.html',
  styleUrls: ['./party-house.page.scss'],
})
export class PartyHousePage implements OnInit, OnDestroy {

	eat: DondeComer[];
  textoBuscar = '';

  loading: any;

  su = this.database.getParty().snapshotChanges().subscribe(data => {
    this.eat = [];
    data.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.eat.push(a as DondeComer);
    })            
});

  constructor(private database: DatabaseService,
              private loadingCtrl: LoadingController) { 
    
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

  buscar(event){
    this.textoBuscar = event.detail.value;
  }
}

