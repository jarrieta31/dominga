import { Component, OnInit } from "@angular/core";

import { AlertController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Subject, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeolocationService } from "./services/geolocation.service";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
    showSplash = true;
    modo: boolean;
    dyslexic: boolean;

    gps: any = null;

    /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
    private unsubscribe$: Subject<void>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private geolocationSvc: GeolocationService,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        public alertController: AlertController,
    ) {
        this.initializeApp();
    }

    ngOnInit(): void {
        this.unsubscribe$ = new Subject<void>();
        this.geolocationSvc.posicion$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
                console.log(res);
                this.gps = res;
            });

        //    this.geolocationSvc.checkGPSPermission();
        //    this.geolocationSvc.iniciarSubscriptionClock();

        /*    setTimeout(() => {
                this.unsubscribe$.next();
                this.unsubscribe$.complete();
            }, 5000)
        */
    }

    async initializeApp() {
        this.checkReady()
    }
    
    checkReady = async () => {
        try {
            await this.platform.ready();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            await this.checkGPSPermissionAsync();
            timer(3000).subscribe(() => (this.showSplash = false));
            this.checkDarkMode();
            this.modeDyslexic();
        } catch (error) {
           console.log("Error de Platform Ready: ", error) 
        }
    }

    checkDarkMode() {
        if (localStorage.getItem("modoOscuro") == "true") {
            try {
                document.body.classList.toggle("dark");
            } catch (error) {
                console.log(error);
            }
        }
    }

    modeDyslexic() {
        if (localStorage.getItem("dyslexic") == "true") {
            try {
                document.body.classList.toggle("dyslexic");
            } catch (error) {
                console.log(error);
            }
        }
    }


    //Compruebe si la aplicación tiene permiso de acceso GPS
//    checkGPSPermission() {
//        return this.androidPermissions
//            .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
//            .then(
//                (result) => {
//                    if (result.hasPermission) {
//                        //Si tiene permiso, muestre el diálogo 'Activar GPS'
//                        this.geolocationSvc.gps = true;
//                        this.askToTurnOnGPS();
//                    } else {
//                        //Si no tiene permiso pida permiso
//                        this.requestGPSPermission();
//                    }
//                },
//                (err) => {
//                    console.log("Error checkGPS: ", err);
//                }
//            );
//    }

    /**
     * Función que inicia el proceso de comprobar el acceso al gps
     */
    checkGPSPermissionAsync = async () => {
        try {
            const consultaPermiso = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            if (consultaPermiso.hasPermission) { //si el gps está activo hace lo que tenga que hacer
                alert("Ya tiene permisos")
                this.geolocationSvc.gps = true;
            } else { // Si no está activo, solitia para activarlo
                const solicitud = await this.requestGPSPermissionAsync();
                alert("Solicitados los permisos")
                console.log("linea 131: ", solicitud)
            }
        } catch (error) {
            console.log("Error checkGPS: ", error);
        }
    }

    //Pide los permisos para el GPS julio
    //    async requestGPSPermission() {
    //        return await this.locationAccuracy.canRequest().then((canRequest: boolean) => {
    //            if (canRequest) {
    //                console.log("canRequest", canRequest);
    //            } else {
    //                //Mostrar el diálogo 'Solicitud de permiso de GPS'
    //                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
    //                    // método de llamada para encender el GPS
    //                    () => { this.askToTurnOnGPS(); },
    //                    //Mostrar alerta si el usuario hace clic en "No, gracias"
    //                    (error) => { console.log("requestPermission. Error al solicitar permisos de ubicación ", error); }
    //                );
    //            }
    //        });
    //    }

    /**
     * 
     */
    requestGPSPermissionAsync = async () => {
        try {
            const consultaPermiso = await this.locationAccuracy.canRequest();
            if (consultaPermiso) {
                console.log("Ya tiene el permiso: ", consultaPermiso)
                this.geolocationSvc.gps = true;
            } else {
              await this.askToTurnOnGPSAsync()
            }
        } catch (error) {
            console.log("Error en requestGPSPermissionAsync: ", error);
        }
    }

    showAlertRequestPermisions = async () => {
        try {//Mostrar el diálogo 'Solicitud de permiso de GPS'
            const mostrarAlert = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            await this.askToTurnOnGPSAsync()
        } catch (error) {
            console.log("requestPermission. Error al solicitar permisos de ubicación ", error);
        }
    }

    /*    async askToTurnOnGPS() {
            return await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
    
                    this.geolocationSvc.gps = true;
                }, // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas
                (error) => { ; }
            );
        }
    */
    askToTurnOnGPSAsync = async () => {
        try {
            const pidePermiso = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            console.log("Solicitud de permiso: ", pidePermiso)
            // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas
        } catch (error) {
            console.log("Error al solicitar permisos de ubicación " + JSON.stringify(error));
        }
    }


    // if (localStorage.getItem("modoOscuro"))
    //     try {
    //       this.modo = JSON.parse(localStorage.getItem("modoOscuro"));
    //     } catch (error) {
    //       this.modo = false
    //     }
}
