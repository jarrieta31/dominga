import { Injectable } from '@angular/core';
//import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { GeolocationService } from '../services/geolocation.service';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

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

    
}
