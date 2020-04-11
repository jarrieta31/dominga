import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { DatabaseService } from '../../services/database.service';

import { Place } from '../../shared/place';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { ModalInfoPage } from '../../pages/modal-info/modal-info.page';

import * as Mapboxgl from 'mapbox-gl';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-info-lugar',
    templateUrl: './places.page.html',
    styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

    items: Place[];

    nombre: string;
    descripcion: string;
    key: string;
    auto: boolean;
    bicicleta: boolean;
    caminar: boolean;
    imagenes = new Array();

    cont = 0;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 3,
        spaceBetween: 1
    };

    mapa: Mapboxgl.Map;

    constructor(
        private database: DatabaseService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {

        this.getCargarLugar();

        Mapboxgl.accessToken = environment.mapBoxToken;
        this.mapa = new Mapboxgl.Map({
            container: 'mapaBox',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-56.713438, -34.340118],
            zoom: 16,
        });

        const marker = new Mapboxgl.Marker({
            draggable: false
        }).setLngLat([-56.713438, -34.340118]).addTo(this.mapa);

        this.mapa.on('load', () => {
            this.mapa.resize();
        });
    }

    async cambiarImagen() {
        $(".imgGaleria").click(function() {
            var imagenSrc = $(this).attr('src');
            $("#foto").attr("src", imagenSrc);
        });
    }

    async getCargarLugar() {
        this.activatedRoute.paramMap.subscribe(params => {
            // Dentro de la variable s colocamos el método database y hacemos llamado al 
            // método getPlaces() que se encuentra en el servicio 'DataService'

            let par = params.get("id");

            let s = this.database.getPlaces();
            // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
            // último pasamos los datos a JSON
            s.snapshotChanges().subscribe(data => {
                    this.items = [];
                    data.forEach(item => {

                        if (par == item.key) {
                            var num = '0';
                            let a = item.payload.toJSON();
                            a['$key'] = item.key;
                            this.items.push(a as Place);

                            this.items[num].descripcion = this.items[num].descripcion.substr(0, 44) + " ...";

                            let mapped = Object.keys(this.items[num].url).map(key => ({ url: this.items[num].url[key] }));

                            this.items[num].url = mapped;

                            this.nombre = this.items[num].nombre;
                            this.descripcion = this.items[num].descripcion;
                            this.key = this.items[num].$key;
                            this.auto = this.items[num].auto;
                            this.bicicleta = this.items[num].bicicleta;
                            this.caminar = this.items[num].caminar;

                            mapped.forEach(data => {
                                this.cont;                               
                                this.imagenes[this.cont] = data.url;                              
                                this.cont++;
                            })                                                   
                        }
                    })

                }),
                err => console.log(err)
        });
    }

    async agregarFavorito() {

    }
}