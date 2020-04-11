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

                this.items.forEach(data => {
                    if (data.tipo == 'Rural') {
                        var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
                            '<img src="'+data.url[0]+'" /><h5 style="text-align: center">'+data.nombre+'</h5>' 
                        );
                        const marker = new Mapboxgl.Marker({
                            draggable: false
                        }).setLngLat([data.longitud, data.latitud])
                        .setPopup(popup)
                        .addTo(this.mapa);
                    }
                })
            }),
            err => console.log(err);
    }
}