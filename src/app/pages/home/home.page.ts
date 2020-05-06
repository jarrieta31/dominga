import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { Place } from '../../shared/place';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';
import distance from '@turf/distance';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    items: Place[];
    items$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
    obsItems$ = this.items$.asObservable();
    posicion$: Observable<Point>;
    casaDominga =  {"longitud": "-56.7145", "latitud": "-34.340007"};
    
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 1
    };

    cards = {
        initialSlide: 0,
        speed: 100,
        slidesPerView: 1,
        spaceBetween: 20,
        direction: 'vertical'
    };

    isLoading = false;

    constructor(
        private database: DatabaseService,
        private authService: AuthService,
        private router: Router,
        private geolocationService:GeolocationService,
        private screenOrientation: ScreenOrientation,
        public loadingController: LoadingController
    ) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    su = this.database.getPlaces().snapshotChanges().subscribe(data => { 
      this.items = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.items.push(a as Place);
      })
      // Agrega las distancias al array de lugares
      this.items.forEach(place =>{       
        let options = { units: 'kilometers' }; 
        let dist = distance([place.longitud, place.latitud], [this.casaDominga.longitud ,this.casaDominga.latitud], options);
        let distFormat;
        //console.log(dist);
        if(dist > 1){
            distFormat = parseFloat(dist).toFixed(3);
            place.distancia = "Desde C. Dominga "+ distFormat + " Km";
        }else{
            dist = dist*1000 ;
            distFormat = parseFloat(dist).toFixed(0); 
            place.distancia = "Desde C. Dominga "+ distFormat + " mts"
        }              
      })
      // Actualiza el observable de lugares con toda la información
      this.items$.next(this.items);

      //this.actualizarDistancias()
    });

    ngOnInit() {
        this.present();
        this.geolocationService.checkGPSPermission()
        this.su; 
        this.dismiss();
        this.posicion$ = this.geolocationService.getPosicionActual$();
        this.posicion$.subscribe(posicion => {
            // alert(posicion);
            if(posicion != null){
                this.items.forEach(place =>{  
                    //console.log('posicion actual',posicion.latitud)     
                    let options = { units: 'kilometers' }; 
                    let dist = distance([place.longitud, place.latitud], [posicion.longitud , posicion.latitud], options);
                    let distFormat;
                    if(dist > 1){
                        distFormat = parseFloat(dist).toFixed(3);
                        place.distancia = "Estás a "+ distFormat + " Km";
                    }else{
                        dist = dist*1000 ;
                        distFormat = parseFloat(dist).toFixed(0); 
                        place.distancia = "Estás a "+ distFormat + " mts"
                    }              
                    
                })
                // Actualiza el observable de lugares con toda la información
                this.items$.next(this.items);
            }
        }); 
    }

    cerrarSesion() {
        this.su.unsubscribe();
        this.authService.signOut();
    }


 async present() {
    this.isLoading = true;
    return await this.loadingController.create({
        message: 'Por favor espere...'
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
}