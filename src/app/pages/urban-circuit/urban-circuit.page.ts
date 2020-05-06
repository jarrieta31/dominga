import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Place } from '../../shared/place';

import { DatabaseService } from '../../services/database.service';

import * as Mapboxgl from 'mapbox-gl';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';


@Component({
    selector: 'app-urban-circuit',
    templateUrl: './urban-circuit.page.html',
    styleUrls: ['./urban-circuit.page.scss'],
})
export class UrbanCircuitPage implements OnInit {

    items: Place[];
    points: Point[] = [];
    point: Point;
    lat = 0;
    lon = 0;

    //mapa: Mapboxgl.Map;

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
        this.items = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.items.push(a as Place);
        })

        var largo = 0;

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                largo = largo + 1;
            }
        })

        //console.log(largo);

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                this.point = {latitud: +data.latitud, longitud: +data.longitud}
                this.points.push(this.point);
            }
        })

        this.geolocationService.crearMapa(this.points)

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
                    '<a href="http://localhost:8100/places/' + data.$key + '"><img src="' + data.imagenPrincipal + '" /><h5 style="text-align: center">' + data.nombre + '</h5></a>'
                );
                const marker = new Mapboxgl.Marker({
                        draggable: false
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
                                -56.732051948450575,
                                -34.33235873819117
                            ],
                            [
                                -56.7298708002788,
                                -34.331243130535356
                            ],
                            [
                                -56.729175773185744,
                                -34.33265309331453
                            ],
                            [
                                -56.728061437540234,
                                -34.332379892064935
                            ],
                            [
                                -56.72751050435714,
                                -34.33227910344016
                            ],
                            [
                                -56.727240203496905,
                                -34.332093462810136
                            ],
                            [
                                -56.72657759022917,
                                -34.33203133736216
                            ],
                            [
                                -56.72601902138605,
                                -34.33205379315789
                            ],
                            [
                                -56.716863433080874,
                                -34.32698160314392
                            ],
                            [
                                -56.71520377075237,
                                -34.33270175371089
                            ],
                            [
                                -56.71157059587733,
                                -34.33169480602554
                            ],
                            [
                                -56.71114205206126,
                                -34.332559215780805
                            ],
                            [
                                -56.70993021025755,
                                -34.33707468264876
                            ],
                            [
                                -56.71116316114208,
                                -34.337391456668584
                            ],
                            [
                                -56.710596433431974,
                                -34.33950847826294
                            ],
                            [
                                -56.70941439490018,
                                -34.33931566675093
                            ],
                            [
                                -56.70879788630856,
                                -34.34128375275806
                            ],
                            [
                                -56.71245866931619,
                                -34.34195108396662
                            ],
                            [
                                -56.71278465331815,
                                -34.34105278989898
                            ],
                            [
                                -56.71347978739419,
                                -34.34115677276674
                            ],
                            [
                                -56.71315340357472,
                                -34.34205486889485
                            ],
                            [
                                -56.71380497677278,
                                -34.34220689218392
                            ],
                            [
                                -56.71464430453831,
                                -34.33916293914927
                            ],
                            [
                                -56.71588694030305,
                                -34.33941215239359
                            ],
                            [
                                -56.716190951135005,
                                -34.33823440114641
                            ],
                            [
                                -56.7137224742944,
                                -34.33783983324734
                            ],
                            [
                                -56.71307203267166,
                                -34.33994370907443
                            ],
                            [
                                -56.713615254788195,
                                -34.340067422172154
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

    constructor(
    	private database: DatabaseService,
    	private geolocationService: GeolocationService
    	) {}

    ngOnInit() {
        this.su;
        
    }

    ngOnDestroy() {
        this.su.unsubscribe();
        if(this.geolocationService.isWatching){
            this.geolocationService.isWatching = false;
            //this.geolocationService.sourceGpsSubject$.unsubscribe(); 
            this.geolocationService.myPositionMarker = null;
            this.geolocationService.points = [];
            //this.geolocationService.stopLocationWatch()          
        }
    }

}