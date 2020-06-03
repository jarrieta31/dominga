import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Place } from '../../shared/place';

import { DatabaseService } from '../../services/database.service';

import * as Mapboxgl from 'mapbox-gl';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-rural-circuit',
    templateUrl: './rural-circuit.page.html',
    styleUrls: ['./rural-circuit.page.scss'],
})
export class RuralCircuitPage implements OnInit, OnDestroy {

    items: Place[];
    points: Point[]=[];
    point: Point;
    
    distancia: any;
    posicion$: Observable<Point>;

    //mapa: Mapboxgl.Map;

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
                this.items = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.items.push(a as Place);
                })

                var largo = 0;

                this.items.forEach(data =>{
                    if(data.tipo == 'Rural'){
                        largo = largo + 1;
                    }
                })

                //console.log(largo);
               
                this.items.forEach(data => {
                    if(data.tipo == 'Rural'){
                        this.point = {latitud: +data.latitud, longitud: +data.longitud}
                        this.points.push(this.point);
                    }
                })

                this.geolocationService.crearMapa(this.points);

                this.items.forEach(data => {
                    if (data.tipo == 'Rural') {                               
                        var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<a href="http://localhost/places/${data.$key}" ><img src="${data.imagenPrincipal}" /><h5 style="text-align: center">${data.nombre}</h5></a>`
                            
                        );
                        const marker = new Mapboxgl.Marker({
                                draggable: false,
                                color: "#ea4335"
                            }).setLngLat([data.longitud, data.latitud])
                            .setPopup(popup)
                            .addTo(this.geolocationService.mapa);
                    }
                })   
            })

    constructor(private database: DatabaseService,
                private geolocationService: GeolocationService) {
        

    }

    ngOnInit() {
        this.su;
        
    }

    ngOnDestroy(){
        this.su.unsubscribe();
        
    }
}