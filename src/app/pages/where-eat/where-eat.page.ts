import { Component, OnInit, OnDestroy } from '@angular/core';

import { DondeComer } from '../../shared/donde-comer';

import { DatabaseService } from '../../services/database.service';
import { WhereEatService } from 'src/app/services/database/where-eat.service';
import { LoadingController } from '@ionic/angular';
import { InfoSlider } from '../../shared/info-slider';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-where-eat',
  templateUrl: './where-eat.page.html',
  styleUrls: ['./where-eat.page.scss'],
})
export class WhereEatPage implements OnInit, OnDestroy {

	eat             : DondeComer[];
	weat            : DondeComer[];
  sliderDondeComer: InfoSlider[];
  textoBuscar = '';
  weat_suscribe : Subscription;

  loading: any;

  slideOpts = {
        initialSlide: 0,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay:true,
    };

  su = this.database.getEat().snapshotChanges().subscribe(data => {
    this.eat = [];
    data.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.eat.push(a as DondeComer);
    })
});


slider =  this.database.getSliderDondeComer().snapshotChanges().subscribe(data => {
  this.sliderDondeComer = [];
  data.forEach(item => {
      let a = item.payload.toJSON();
      a['$key'] = item.key;
      this.sliderDondeComer.push(a as InfoSlider);
  })
});

  constructor(
    private database    : DatabaseService,
    private afs         : WhereEatService,          
    private loadingCtrl : LoadingController) 
    {
      this.cargarDondeComer();  
    }

  ngOnInit() {
  	this.show("Cargando lugares...");
  }

  ngOnDestroy(){
    this.su.unsubscribe();
    this.slider.unsubscribe();
    this.weat_suscribe.unsubscribe();
  }

   async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
    this.loading.present().then(() => {
        this.su;
        this.slider;
        this.loading.dismiss();
    });
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  cargarDondeComer(){
    this.weat_suscribe = this.afs.donde_comer.subscribe((res) => this.weat = res);
  }
}
