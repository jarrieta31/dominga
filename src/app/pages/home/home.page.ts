import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { Place } from '../../shared/place';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';
import distance from '@turf/distance';
import { AlertController, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ModalRatingPage } from '../modal-rating/modal-rating.page';


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

    items: Place[];
    items$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
    obsItems$ = this.items$.asObservable();
    posicion$: Observable<Point>;
    casaDominga = { "longitud": "-56.7145", "latitud": "-34.340007" };
    subscripcionPosition: any;
    backButtonSubscription: any;
    dataReturned: any;
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 1,
        autoplay:true
    };

    cards = {
        initialSlide: 0,
        speed: 100,
        slidesPerView: 1,
        spaceBetween: 20,
        direction: 'vertical',
        autoplay:true
    };

    lugarCercano$: Observable<Place>;
    subscrictionLugarCercano: any;
    //subscrictionUser: any;
    idUser: string;

    constructor(
        private database: DatabaseService,
        private authService: AuthService,
        private router: Router,
        private geolocationService: GeolocationService,
        private platform: Platform,
        private alertController: AlertController,
        private modalController: ModalController
    ) {
        this.geolocationService.iniciarSubscriptionClock();
        this.geolocationService.iniciarSubscriptionMatch();
        this.posicion$ = this.geolocationService.getPosicionActual$();        
    }

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
        this.items = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.items.push(a as Place);
        })
        // Agrega las distancias calculadas desde casa dominga al array de lugares
        this.items.forEach(place => {
            let options = { units: 'kilometers' };
            let dist = distance([place.longitud, place.latitud], [this.casaDominga.longitud, this.casaDominga.latitud], options);
            let distFormat;
            if (dist > 1) {
                distFormat = parseFloat(dist).toFixed(3);
                place.distancia = "Desde C. Dominga " + distFormat + " Km";
            } else {
                dist = dist * 1000;
                distFormat = parseFloat(dist).toFixed(0);
                place.distancia = "Desde C. Dominga " + distFormat + " mts"
            }
        })
        // Actualiza el observable de lugares con toda la información
        this.items$.next(this.items);
        this.subscripcionPosition = this.posicion$.subscribe(posicion => {
            if (posicion != null) {

                this.items.forEach(place => {
                    //console.log('posicion actual', posicion.latitud)
                    let options = { units: 'kilometers' };
                    let dist = distance([place.longitud, place.latitud], [posicion.longitud, posicion.latitud], options);
                    let distFormat;
                    if (dist > 1) {
                        distFormat = parseFloat(dist).toFixed(3);
                        place.distancia = "Estás a " + distFormat + " Km";
                    } else {
                        dist = dist * 1000;
                        distFormat = parseFloat(dist).toFixed(0);
                        place.distancia = "Estás a " + distFormat + " mts"
                    }
                })
                // Actualiza el observable de lugares con toda la información
                this.items$.next(this.items);
            }
        });
    });

    //obtiene el id del usuario actual
    subscrictionUser = this.authService.currentUser.subscribe(authData => 
        this.idUser = authData.uid
    );
    
    ngOnInit() {
        this.su;    
        this.subscrictionUser;
        //obtiene 
        this.lugarCercano$ = this.geolocationService.getLugarCercano();
        this.subscrictionLugarCercano = this.lugarCercano$.subscribe(place => {
            if(place){
                this.openModal(place)
            }            
        });
    }

    ngOnDestroy(): void {
        this.subscripcionPosition.unsubscribe();
        this.backButtonSubscription.unsubscribe();
        this.subscrictionUser.unsubscribe();
        this.subscrictionLugarCercano.unsubscribe();        
    }

    ngAfterViewInit() {
        this.platform.backButton.subscribe();
        this.backButtonSubscription = this.platform.backButton.subscribe(() => {
            if(this.router.url.indexOf('/home') == 0 || this.router.url.indexOf('/login') == 0 ){
                this.cerrarAppAlertConfirm()
            }            
        });
    }

    cerrarSesion() {
        this.su.unsubscribe();
        this.authService.signOut();
    }

    async cerrarAppAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Salir!',
            message: '<strong>¿Seguro que quiere salir?</strong>',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                       // console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Cerrar',
                    handler: () => {
                       // console.log('Confirm Okay');
                        navigator['app'].exitApp();
                    }
                }
            ]
        });
        await alert.present();
    }

    async openModal(place: Place) {
        const modal = await this.modalController.create({
          component: ModalRatingPage,
          cssClass: 'personalizar-modal',
          componentProps: {
            "nombre": place.nombre,
            "tipo": place.tipo,
            "imagen": place.imagenPrincipal,
            "key": place.$key
          }
        });
     
        modal.onDidDismiss().then((dataReturned) => {
          if (dataReturned !== null) {
            this.dataReturned = dataReturned.data;
            //alert('Modal Sent Data :'+ dataReturned);
          }
        });
     
        return await modal.present();
    }

}