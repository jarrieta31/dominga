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
                
                this.geolocationService.mapa.on('load', () => {
                    this.geolocationService.mapa.addSource('route', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': [
                                    [
                                        this.items[1].longitud,
                                        this.items[1].latitud
                                    ],
                                    [
                                        -56.95667269348044,
                                        -34.14221188345429
                                    ],
                                    [
                                        -56.95781787415646,
                                        -34.13898066680512
                                    ],
                                    [
                                        -56.95534532496946,
                                        -34.137494265653295
                                    ],
                                    [
                                        -56.94459187557392,
                                        -34.12476594020018
                                    ],
                                    [
                                        -56.93732715734782,
                                        -34.11390148803951
                                    ],
                                    [
                                        -56.93831669691656,
                                        -34.110715401997936
                                    ],
                                    [
                                        -56.93809679923521,
                                        -34.10980506965787
                                    ],
                                    [
                                        -56.93567792473634,
                                        -34.10862162296928
                                    ],
                                    [
                                        -56.93018048269373,
                                        -34.104798066680736
                                    ],
                                    [
                                        -56.91678158749927,
                                        -34.102868128489625
                                    ],
                                    [
                                        -56.88172389563982,
                                        -34.09274116207643
                                    ],
                                    [
                                        -56.885565410204194,
                                        -34.0825457696674
                                    ],
                                    [
                                        -56.885011528711075,
                                        -34.07543497215358
                                    ],
                                    [
                                        -56.88667317319154,
                                        -34.0735998307211
                                    ],
                                    [
                                        this.items[largo-1].longitud,
                                        this.items[largo-1].latitud
                                    ]
                                ]
                            }
                        }
                    });
                    this.geolocationService.mapa.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#3880ff',
                            'line-width': 5
                        }
                    });
                });
                
                
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