import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { GeolocationService } from '../services/geolocation.service';
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

@Injectable({
    providedIn: 'root'
})
export class GpsProvider {

    constructor(
        private geolocation: Geolocation,
        private geolocationSvc: GeolocationService,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
    ) {}

    getUbicacionInicial() {
        return this.checkGPSPermission()
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

    //Compruebe si la aplicación tiene permiso de acceso GPS
    checkGPSPermission() {
        return this.androidPermissions
            .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            .then(
                (result) => {
                    if (result.hasPermission) {
                        //Si tiene permiso, muestre el diálogo 'Activar GPS'
                        this.geolocationSvc.gps = true;
                        this.askToTurnOnGPS();
                    } else {
                        //Si no tiene permiso pida permiso
                        this.requestGPSPermission();
                    }
                },
                (err) => {
                    console.log("Error checkGPS: ", err);
                }
            );
    }

    //Pide los permisos para el GPS julio
    async requestGPSPermission() {
        return this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                console.log("canRequest", canRequest);
            } else {
                //Mostrar el diálogo 'Solicitud de permiso de GPS'
                this.androidPermissions.requestPermission( this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ).then(
                         // método de llamada para encender el GPS
                        () => { this.askToTurnOnGPS(); },
                        //Mostrar alerta si el usuario hace clic en "No, gracias"
                        (error) => {console.log("requestPermission. Error al solicitar permisos de ubicación ",error); }
                    );
            }
        });
    }

    askToTurnOnGPS() {
        return this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then( 
                () => {this.geolocationSvc.gps = true; }, // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas
                (error) => { console.log( "Error al solicitar permisos de ubicación " + JSON.stringify(error)); }
            );
    }
}
