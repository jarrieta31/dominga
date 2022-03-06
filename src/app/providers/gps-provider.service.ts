import { Injectable } from '@angular/core';
//import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { GeolocationService } from '../services/geolocation.service';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Point } from '../shared/point';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

@Injectable({
    providedIn: 'root'
})
export class GpsProvider {

    gps: boolean = false;
    posicion: Point;

    constructor(
        private geolocation: Geolocation,
        private platform: Platform,
        //private geolocationSvc: GeolocationService,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private diagnostic: Diagnostic,
    ) {
        console.log('provider.server')
    }

    async getUbicacionInicial() {
        const platformReady = await this.platform.ready();
        console.log('ready>', platformReady)
        await this.verEstadoGps(platformReady);
        return this.geolocation.getCurrentPosition().then(
            pos => {
                this.gps = true;
                this.posicion = { longitud: pos.coords.longitude, latitud: pos.coords.latitude }
            }
        )
        //   return this.checkGPSPermission()
        /*
                this.geolocationSvc.checkGPSPermission();
                return this.geolocation.getCurrentPosition().then(data => {
                    this.geolocationSvc.posicion = {latitud: data.coords.latitude , longitud: data.coords.longitude};
                    console.log(this.geolocationSvc.posicion)
                })
                .catch(err => console.log("Error del provider"))
                .finally(()=> console.log("finally provider"))
        */
    }


    /**
     * Funcion que muestra si el GPS está activo, debería estar en 'high_accuracy' para que este encendido
     */
    verEstadoGps = async (sistem: string) => {
        try {
            if (sistem === 'cordova') {
                let gpsStatus = await this.diagnostic.getLocationMode(); //
                console.log('Estado: ' + gpsStatus)
                if (gpsStatus !== 'high_accuracy') {//si está apagado
                    //Lanza el popup de google para encender el GPS
                    await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                    gpsStatus = await this.diagnostic.getLocationMode();
                    if (gpsStatus === 'high_accuracy') {
                        console.log('Se encendió el SGP')
                        const pos = await this.geolocation.getCurrentPosition();
                        this.gps = true;
                        this.posicion = { longitud: pos.coords.longitude, latitud: pos.coords.latitude }
                    } else {
                        console.log('El usuario no aceptó encender el GPS.')
                        this.gps = false;
                    }
                }
            }
            else if (sistem === 'dom') {
                console.log("dom")
                try {
                    const pos = await this.geolocation.getCurrentPosition();
                    this.gps = true;
                    console.log('hola', pos)
                    this.posicion = { longitud: pos.coords.longitude, latitud: pos.coords.latitude }
                } catch (error) {
                    console.log("Error de getCurrentPosition: ", error)
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




}
