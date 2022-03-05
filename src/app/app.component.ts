import { Component, OnInit } from "@angular/core";

import { AlertController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Subject, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeolocationService } from "./services/geolocation.service";
//import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { AndroidPermissions, AndroidPermissionResponse } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
//import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { isThisISOWeek } from "date-fns";


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
        private geolocation: Geolocation,
        private diagnostic: Diagnostic,
    ) {
        this.initializeApp();
    }

    ngOnInit(): void {
    }

    async initializeApp() {
        this.checkReady()
    }

    checkReady = async () => {
        try {
            await this.platform.ready();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            //await this.checkGPSPermissionAsync();
            this.verEstadoGps()
            await this.requestGPSPermissionAsync();
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

    /**
     * Funcion que muestra si el GPS está activo, debe estar en 'high_accuracy'
     */
    verEstadoGps = async () => {
        try {
            let gpsStatus = await this.diagnostic.getLocationMode(); //
            console.log('Estado: ' + gpsStatus)
            if(gpsStatus !== 'high_accuracy'){//si está apagdo
                //Lanza el popup de google para encender el GPS
                await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                gpsStatus = await this.diagnostic.getLocationMode();
                if(gpsStatus === 'high_accuracy'){
                    const pos = await this.geolocation.getCurrentPosition();
                    this.geolocationSvc.posicion = {latitud: pos.coords.latitude, longitud: pos.coords.longitude};
                    this.geolocationSvc.posicion$.next(this.geolocationSvc.posicion)
                }
            }
        } catch (error) {
            console.log('Error, verPermiso:', error)
        }
    }

    /**
     * Funcion que muestra el estado del permiso para el uso del GPS, debe estar en 'GRANTED'
     */
    verPermisoGps = async () => {
        try {
            const estado = await this.diagnostic.getLocationAuthorizationStatus()
            console.log('LocationAuthorization: ' + estado);
        } catch (error) {
            console.log('Error, verPermiso:', error)
        }
    }

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

    /**
     * 
     */
    requestGPSPermissionAsync = async () => {
        try {
            const consultaPermiso = await this.locationAccuracy.canRequest();
            if (consultaPermiso) {
                alert("LocationAccuracy permiso: " + consultaPermiso)
                this.geolocationSvc.gps = true;
            } else {
                await this.askToTurnOnGPSAsync();
                this.geolocationSvc.gps = true;
                const posicion = await this.getPosicionActual();
                this.geolocationSvc.posicion = { longitud: posicion.coords.longitude, latitud: posicion.coords.longitude };
                this.geolocationSvc.posicion$.next(this.geolocationSvc.posicion)
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

    askToTurnOnGPSAsync = async () => {
        try {
            const pidePermiso = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            console.log("Solicitud de permiso: ", pidePermiso)
            // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas
        } catch (error) {
            console.log("Error al solicitar permisos de ubicación " + JSON.stringify(error));
        }
    }

    getPosicionActual = async () => {
        try {
            return await this.geolocation.getCurrentPosition();
        } catch (error) {
            console.log("Error para obtener la posicion: ", error);
        }
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Notificacion',
            subHeader: 'Subtitle',
            message: 'La apliaci.',
            buttons: ['OK'],
        });
    }
    // if (localStorage.getItem("modoOscuro"))
    //     try {
    //       this.modo = JSON.parse(localStorage.getItem("modoOscuro"));
    //     } catch (error) {
    //       this.modo = false
    //     }
}
