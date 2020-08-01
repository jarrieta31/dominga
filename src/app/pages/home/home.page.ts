import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Place } from '../../shared/place';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';
import distance from '@turf/distance';
import { AlertController, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ModalRatingPage } from '../modal-rating/modal-rating.page';
import { NetworkService } from '../../services/network.service';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
declare var jQuery: any;
declare var $: any; 

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy, AfterViewInit {

    subsciptionNetwork: any; //Subscripcion para ver el estado de la conexión a internet
    isConnected = false;  //verifica el estado de la conexion a internet
    items: Place[];
    items$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
    obsItems$ = this.items$.asObservable();
    posicion$: Observable<Point>;
    //casaDominga = { "longitud": "-56.7145", "latitud": "-34.340007" };
    subscripcionPosition: Subscription;
    backButtonSubscription: any;
    dataReturned: any;
    slideOpts = {
        initialSlide: 0,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay:true,
    };

    // cards = {
    //     initialSlide: 0,
    //     speed: 100,
    //     slidesPerView: 1,
    //     spaceBetween: 20,
    //     direction: 'vertical'
    // };

    lugarCercano$: Observable<Place>;
    subscrictionLugarCercano: Subscription;
    //subscrictionUser: any;
    idUser: string;

    loading: any;
    darkMode: string;
    modoOscuro: string = localStorage.getItem("modoOscuro");
    //mode = new Array();

    constructor(
        private database: DatabaseService,
        private authService: AuthService,
        private router: Router,
        private geolocationService: GeolocationService,
        private platform: Platform,
        private alertController: AlertController,
        private modalController: ModalController,
        private networkService: NetworkService,
        private loadingCtrl: LoadingController,
        private browser: InAppBrowser
    
    ) {
        this.geolocationService.iniciarSubscriptionClock();
        this.geolocationService.iniciarSubscriptionMatch();
        this.posicion$ = this.geolocationService.getPosicionActual$(); 
        // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        // this.darkMode = prefersDark.matches;       
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
            let dist = distance([place.longitud, place.latitud], [environment.casaDominga.longitud, environment.casaDominga.latitud], options);
            let distFormat;
            if (dist > 1) {
                distFormat = parseFloat(dist).toFixed(3);
                place.distancia = "Desde C. Dominga " + distFormat;
            } else {
                distFormat = parseFloat(dist).toFixed(2);
                place.distancia = "Desde C. Dominga " + distFormat;
            }
        })
        // Actualiza el observable de lugares con toda la información
        this.items$.next(this.items);
        this.subscripcionPosition = this.posicion$.pipe(
            tap(posicion => {
                if (posicion != null) {
    
                    this.items.forEach(place => {
                        //console.log('posicion actual', posicion.latitud)
                        let options = { units: 'kilometers' };
                        let dist = distance([place.longitud, place.latitud], [posicion.longitud, posicion.latitud], options);
                        let distFormat;
                        if (dist > 1) {
                            distFormat = parseFloat(dist).toFixed(3);
                            place.distancia = "Estás a " + distFormat;
                        } else {
                            distFormat = parseFloat(dist).toFixed(2);
                            place.distancia = "Estás a " + distFormat;
                        }
                    })
                    // Actualiza el observable de lugares con toda la información
                    this.items$.next(this.items);
                }
            })
        ).subscribe();
    });

    //obtiene el id del usuario actual
    subscrictionUser = this.authService.currentUser.subscribe(authData =>
        this.idUser = authData.uid
    );

    ngOnInit() {
        $(document).ready(function(){
            var total = $(window).height();
            var height = document.getElementById("alto");
            var menu = $('.menu').outerHeight(true);
            
            var altoSlider = height.clientWidth;
            altoSlider = ((altoSlider / 1.7) + 5 + 56);
            total = total - altoSlider - menu;
            
            $('.cards').height(total)
        });

        //Chequea el estado de la conexion a internet
        this.subsciptionNetwork = this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
            if (!this.isConnected) {
            //alert('Por favor enciende tu conexión a Internet');
            }
        });

        this.show("Cargando datos...");
        //obtiene 
        this.lugarCercano$ = this.geolocationService.getLugarCercano();
        this.subscrictionLugarCercano = this.lugarCercano$.subscribe(place => {
            if(place){
                this.openModal(place)
            }            
        });
    }

    ngOnDestroy(): void {
        this.subsciptionNetwork.unsubscribe();
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
        this.subsciptionNetwork.unsubscribe();
        this.subscripcionPosition.unsubscribe();
        this.backButtonSubscription.unsubscribe();
        this.subscrictionUser.unsubscribe();
        this.subscrictionLugarCercano.unsubscribe(); 
        this.geolocationService.subscriptionUser.unsubscribe();
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

    async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
     this.loading.present().then(() => {
         this.su;
         this.subscrictionUser;   
         this.loading.dismiss();
     });
    }

    changeTheme(){
        this.darkMode = localStorage.getItem("modoOscuro");

        if(this.darkMode == 'true'){
            localStorage.removeItem("modoOscuro")            
            document.body.classList.toggle('dark');
            this.modoOscuro = localStorage.getItem("modoOscuro");  
        }
        else {
            localStorage.setItem("modoOscuro", JSON.stringify(true))
            document.body.classList.toggle('dark');
        }   
    }

    pageDominga(){
        this.browser.create("https://casadominga.com.uy", "_system")
    }

}