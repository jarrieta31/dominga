import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Place } from '../../shared/place';
import { Favourite } from '../../shared/favourite';

import { Router, ActivatedRoute, Params } from '@angular/router';

import * as Mapboxgl from 'mapbox-gl';

import distance from '@turf/distance';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { LoaderService } from '../../services/loader.service';

import 'rxjs';
import { Point } from '../../shared/point';
import { Platform } from '@ionic/angular';



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
    sugerencias: Place[] = [];
    sug: Place[] = [];
    sug_2: Place[] = [];

    private distancia$: BehaviorSubject<string> = new BehaviorSubject<string>("vacio");
    obsDistancia$ = this.distancia$.asObservable();
    posicion$: Observable<Point>;
    subscripcionPosition: any;

    distancia_cd: string;
    users: string;

    nombre: string;
    descripcion: string;
    key: string;
    auto: boolean;
    bicicleta: boolean;
    caminar: boolean;
    imagenes = new Array();
    valoracion = new Array();
    latitud: string;
    longitud: string;
    imagenPrincipal: string;

    cont = 0;
    val = 0;
    index = 0;
    totalValoracion = 0;
    cantidadVotos = 0;

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
        public loader: LoaderService,
        private geolocationService: GeolocationService,
        private router: Router,
        private platform: Platform

    ) { }


    subscription = this.activatedRoute.paramMap.subscribe(params => {

        this.par = params.get("id");
    });

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
        this.items = [];
        this.sugerencias.length = 0;
        data.forEach(item => {

            if (this.par == item.key) {
                var num = '0';
                let a = item.payload.toJSON();
                a['$key'] = item.key;
                this.items.push(a as Place);

                this.items[num].descripcion = this.items[num].descripcion.substr(0, 140) + " ...";

                let mapped = Object.keys(this.items[num].url).map(key => ({ url: this.items[num].url[key] }));

                if (this.items[num].valoracion != undefined) {
                    this.val = 0;
                    this.totalValoracion = 0;
                    this.cantidadVotos = 0;
                    let valorar = Object.keys(this.items[num].valoracion).map(key => ({ valor: this.items[num].valoracion[key] }));

                    valorar.forEach(data => {
                        this.val;
                        this.valoracion[this.val] = data.valor;
                        this.val++;
                    })

                    this.cantidadVotos = this.valoracion.length;

                    this.valoracion.forEach(votos => {
                        this.totalValoracion = this.totalValoracion + votos;
                    })

                    this.totalValoracion = this.totalValoracion / this.cantidadVotos;
                }

                this.items[num].url = mapped;

                this.nombre = this.items[num].nombre;
                this.descripcion = this.items[num].descripcion;
                this.key = this.items[num].$key;
                this.auto = this.items[num].auto;
                this.bicicleta = this.items[num].bicicleta;
                this.caminar = this.items[num].caminar;
                this.imagenPrincipal = this.items[num].imagenPrincipal;

                this.imagenes.length = 0;
                this.valoracion.length = 0;
                this.cont = 0;

                mapped.forEach(data => {
                    this.cont;
                    this.imagenes[this.cont] = data.url;
                    this.cont++;
                })
                this.latitud = this.items[num].latitud;
                this.longitud = this.items[num].longitud;

                Mapboxgl.accessToken = environment.mapBoxToken;
                this.mapa = new Mapboxgl.Map({
                    container: 'mapaBox',
                    style: 'mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz',
                    center: [this.longitud, this.latitud],
                    zoom: 13,
                });

                const marker = new Mapboxgl.Marker({
                    draggable: false
                }).setLngLat([this.longitud, this.latitud]).addTo(this.mapa);

                this.mapa.on('load', () => {
                    this.mapa.resize();
                });
            }

            let b = item.payload.toJSON();
            b['$key'] = item.key;
            this.sugerencias.push(b as Place);
        })

        this.sugerencias.forEach(sug => {
            let options = { units: 'kilometers' };
            let dist = distance([this.longitud, this.latitud], [sug.longitud, sug.latitud], options);
            let red = parseFloat(dist).toFixed(2);
            this.index;
            this.sugerencias[this.index].distancia = red;
            this.index++;

            //Calcula la distancia desde casa dominga
            if (sug.nombre == 'Casa Dominga') {
                let dist_cd = distance([this.longitud, this.latitud], [sug.longitud, sug.latitud], options);
                let red_cd;
                this.distancia_cd;
                if (dist_cd > 1) {
                    red_cd = parseFloat(dist_cd).toFixed(3);
                    this.distancia_cd = "Desde C. Dominga " + red_cd + " Km";
                } else {
                    dist_cd = dist_cd * 1000;
                    red_cd = parseFloat(dist_cd).toFixed(0);
                    this.distancia_cd = "Desde C. Dominga " + red_cd + " mts"
                }
            }


            //Emite el valor de la distancias desde casa dominga por si no está activo el GPS
            this.distancia$.next(this.distancia_cd)





        })
        console.log(this.sugerencias);
        this.sugerencias.sort((a, b) => a.distancia > b.distancia ? 1 : b.distancia > a.distancia ? -1 : 0);
        this.sug_2[0] = this.sugerencias[1];
        this.sug_2[1] = this.sugerencias[2];
    });

    user = this.authSvc.currentUser.subscribe(authData => {
        this.users = authData.uid;
        this.checkFav();
    });

    ngOnInit() {
        this.loader.show('Cargando lugar...');
        this.user;
        this.subscription;
        this.su;

        this.loader.hide();

        if (this.platform.is('android') && this.geolocationService.gps) {

            this.posicion$ = this.geolocationService.getPosicionActual$();

            this.subscripcionPosition = this.posicion$.subscribe(posicion => {
                if (posicion != null) {
                    let options = { units: 'kilometers' };
                    let dist = distance([this.longitud, this.latitud], [posicion.longitud, posicion.latitud], options);
                    let distFormat, distancia;
                    if (dist > 1) {
                        distFormat = parseFloat(dist).toFixed(3);
                        distancia = "Estás a " + distFormat + " Km";
                    } else {
                        dist = dist * 1000;
                        distFormat = parseFloat(dist).toFixed(0);
                        distancia = "Estás a " + distFormat + " mts"
                    }
                    // Actualiza el observable de lugares con toda la información
                    this.distancia$.next(distancia);
                }
            });
        }
    }


    ngOnDestroy() {
        this.user.unsubscribe();
        this.subscription.unsubscribe();
        this.su.unsubscribe();
        this.distancia$.unsubscribe()
        if(this.platform.is('android') && this.geolocationService.gps ){
            this.subscripcionPosition.unsubscribe();
        }
    }

    async cambiarImagen() {
        $(".imgGaleria").click(function () {
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
                if (this.par == item.key) {
                    let a = item.payload.toJSON();
                    a['$key'] = item.key;
                    this.fav.push(a as Favourite);
                }
            })
        });
    }

    async deleteFav() {
        this.database.removeFavourite(this.users, this.key);
    }

    actualizarDistancias() {

    }
}