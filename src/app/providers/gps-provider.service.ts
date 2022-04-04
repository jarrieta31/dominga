import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Point } from '../shared/point';

@Injectable({
    providedIn: 'root'
})
export class GpsProvider {

    gps: boolean = false;
    posicion: Point;

    constructor(
        private geolocation: Geolocation,
        private platform: Platform,
    ) {
        console.log('provider.server')
    }

    async getUbicacionInicial() {
    
        const platformReady = await this.platform.ready();
        console.log('ready: ', platformReady)
        //await this.verEstadoGps(platformReady);
        return this.geolocation.getCurrentPosition().then(
            pos => {
                if (pos !== null) {
                    this.gps = true;
                    this.posicion = { longitud: pos.coords.longitude, latitud: pos.coords.latitude }
                    console.log('provider: ', this.posicion)
                }else{this.gps = false}

            }
        ).catch(error => console.log('Error de gps-provider: ', error));

    }



}
