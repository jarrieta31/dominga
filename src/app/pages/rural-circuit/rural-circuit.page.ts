import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Place } from '../../shared/place';

import { DatabaseService } from '../../services/database.service';

import * as Mapboxgl from 'mapbox-gl';

@Component({
    selector: 'app-rural-circuit',
    templateUrl: './rural-circuit.page.html',
    styleUrls: ['./rural-circuit.page.scss'],
})
export class RuralCircuitPage implements OnInit {

    items: Place[];
    lat = 0;
    lon = 0;

    mapa: Mapboxgl.Map;

    constructor(private database: DatabaseService) {}

    ngOnInit() {
        this.cargarMarcadores();
    }


    cargarMarcadores() {
        // Dentro de la variable s colocamos el método database y hacemos llamado al 
        // método getPlaces() que se encuentra en el servicio 'DataService'
        let s = this.database.getPlaces();

        // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
        // último pasamos los datos a JSON
        s.snapshotChanges().subscribe(data => {
                this.items = [];
                data.forEach(item => {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.items.push(a as Place);
                })

                var largo = this.items.length;
               
                this.items.forEach(data => {
                    this.lat = this.lat + parseFloat(data.latitud);
                    this.lon = this.lon + parseFloat(data.longitud);
                })

                var PromLat = this.lat / largo;
                var PromLon = this.lon / largo;

                Mapboxgl.accessToken = environment.mapBoxToken;
                this.mapa = new Mapboxgl.Map({
                    container: 'mapaRural',
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [PromLon, PromLat],
                    zoom: 11,
                });

                this.mapa.addControl(
                    new Mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: false
                        },
                        trackUserLocation: false
                    })
                );

                this.items.forEach(data => {
                    if (data.tipo == 'Rural') {
                        var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
                            '<a href="http://localhost:8100/places/' + data.$key + '"><img src="' + data.url[0] + '" /><h5 style="text-align: center">' + data.nombre + '</h5></a>'
                        );
                        const marker = new Mapboxgl.Marker({
                                draggable: false
                            }).setLngLat([data.longitud, data.latitud])
                            .setPopup(popup)
                            .addTo(this.mapa);
                    }
                })

                var largo = this.items.length;               

                this.mapa.on('load', () => {
                    this.mapa.addSource('route', {
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
                    this.mapa.addLayer({
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
            }),
            err => console.log(err);
    }
}