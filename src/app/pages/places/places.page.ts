import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Place } from '../../shared/place';
import { Favourite } from '../../shared/favourite';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { ModalInfoPage } from '../../pages/modal-info/modal-info.page';

import * as Mapboxgl from 'mapbox-gl';

import 'rxjs';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-info-lugar',
    templateUrl: './places.page.html',
    styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

    items: Place[];
    fav: Favourite[];

    users: string;

    nombre: string;
    descripcion: string;
    key: string;
    auto: boolean;
    bicicleta: boolean;
    caminar: boolean;
    imagenes = new Array();
    latitud: string;
    longitud: string;
    imagenPrincipal: string;

    cont = 0;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 3,
        spaceBetween: 1
    };

    mapa: Mapboxgl.Map;
    par: string;

    constructor(
        private database: DatabaseService,
        private authSvc: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    subscription = this.activatedRoute.paramMap.subscribe(params => {

        this.par = params.get("id");
    });

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
        this.items = [];
        data.forEach(item => {

            if (this.par == item.key) {
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
                this.imagenPrincipal = this.items[num].imagenPrincipal;

                this.imagenes = [];

                mapped.forEach(data => {
                    this.cont;
                    this.imagenes[this.cont] = data.url;
                    this.cont++;
                })

                //console.log(this.imagenes);

                this.latitud = this.items[num].latitud;
                this.longitud = this.items[num].longitud;

                Mapboxgl.accessToken = environment.mapBoxToken;
                this.mapa = new Mapboxgl.Map({
                    container: 'mapaBox',
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [this.longitud, this.latitud],
                    zoom: 6,
                });

                const marker = new Mapboxgl.Marker({
                    draggable: false
                }).setLngLat([this.longitud, this.latitud]).addTo(this.mapa);

                this.mapa.on('load', () => {
                    this.mapa.resize();
                });
            }
        })
    });

    user = this.authSvc.currentUser.subscribe(authData => {
        this.users = authData.uid;
        this.checkFav();
    });

    ngOnInit() {
        this.user;
        this.subscription;
        this.su;
    }

    ngOnDestroy() {
        this.user.unsubscribe();
        this.subscription.unsubscribe();
        this.su.unsubscribe();
    }

    async cambiarImagen() {
        $(".imgGaleria").click(function() {
            var src = $(this).attr('src');
            $("#foto").attr("src", src);
        });
    }

    async agregarFavorito() {
        this.database.addFavourite(this.nombre, this.key, this.users, this.imagenPrincipal);
    }

    async checkFav() {
        this.database.getFavouriteUser(this.users).snapshotChanges().subscribe(data => {
            this.fav = [];


            data.forEach(item => {
                if(this.par == item.key){
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.fav.push(a as Favourite); 
                }          
            })
            console.log(this.fav);
        });
    }

    async deleteFav() {
        this.database.removeFavourite(this.users, this.key);

    }
}