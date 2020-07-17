import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ToastController } from '@ionic/angular';

import { DondeComer } from '../../shared/donde-comer';
import { DondeDormir } from '../../shared/donde-dormir';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.page.html',
  styleUrls: ['./more-options.page.scss'],
})
export class MoreOptionsPage implements OnInit, OnDestroy {

	sleep:  DondeDormir[];
	eat: DondeComer[];
  party: DondeComer[];

	textoBuscar = '';

  fiesta = this.database.getParty().snapshotChanges().subscribe( res => {
    this.party = [];
                res.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.party.push(a as DondeComer);
                })
  })

	dormir = this.database.getSleep().snapshotChanges().subscribe( res => {
		this.sleep = [];
                res.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.sleep.push(a as DondeDormir);
                })
	})

	comer = this.database.getEat().snapshotChanges().subscribe( res => {
		this.eat = [];
                res.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.eat.push(a as DondeComer);
                })

                this.sleep;
                this.sleep = this.sleep.concat(this.eat, this.party);
                //console.log(this.sleep);
	})

  constructor(private database: DatabaseService,
              private toastCtrl: ToastController) { }

  ngOnInit() {
  	this.comer;
  }

  ngOnDestroy() {
  	this.comer.unsubscribe();
  }

  buscar( event ){
        this.textoBuscar = event.detail.value;
    }

     async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Página en desarrollo, próximamente disponible!',
      duration: 2000
    });
    toast.present();
  }

}
