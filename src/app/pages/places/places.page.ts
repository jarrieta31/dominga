import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Place } from '../../shared/place';
import { Favourite } from '../../shared/favourite';
import { Router, ActivatedRoute} from '@angular/router';
import * as Mapboxgl from 'mapbox-gl';
import distance from '@turf/distance';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Point } from '../../shared/point';
import { Platform } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { VideoPage } from '../../pages/video/video.page';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-info-lugar',
    templateUrl: './places.page.html',
    styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit, OnDestroy {

    items: Place[];
    fav: Favourite[];
    sugerencias: Place[] = [];
    sug: Place[] = [];
    sug_2: Place[] = [];
    sug_3: Place[] = [];

    private distancia$: BehaviorSubject<string> = new BehaviorSubject<string>("vacio");
    // obsDistancia$ = this.distancia$.asObservable();
    distancia:string;
    posicion$: Observable<Point>;
    subscripcionPosition: Subscription;
    subscripcionDistancia: Subscription;
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
    video = new Array();
    latitud: string;
    longitud: string;
    imagenPrincipal: string;
    tipo: string;
 
    cont = 0;
    contVideo = 0;
    val = 0;
    index = 0;
    totalValoracion = 0;
    cantidadVotos = 0;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 3,
        spaceBetween: 1,
        autoplay:true
    };

    mapa: Mapboxgl.Map;
    par: string;

    loading: any;

    constructor(
        private database: DatabaseService,
        private authSvc: AuthService,
        private activatedRoute: ActivatedRoute,
        private geolocationService: GeolocationService,
        private router: Router,
        private platform: Platform,
        private loadingCtrl: LoadingController,
        private actionSheetController: ActionSheetController,
        private modalCtrl: ModalController
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
                this.items[num].descripcion = this.items[num].descripcion.replace(/<\/?[^>]+(>|$)/g, '');

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
                    this.totalValoracion = Math.round(this.totalValoracion);
                }

                this.items[num].url = mapped;

                this.nombre = this.items[num].nombre;
                this.descripcion = this.items[num].descripcion;
                this.key = this.items[num].$key;
                this.auto = this.items[num].auto;
                this.bicicleta = this.items[num].bicicleta;
                this.caminar = this.items[num].caminar;
                this.imagenPrincipal = this.items[num].imagenPrincipal;
                this.tipo = this.items[num].tipo;

                this.imagenes.length = 0;
                this.valoracion.length = 0;
                this.cont = 0;

                mapped.forEach(data => {
                    this.cont;
                    this.imagenes[this.cont] = data.url;
                    this.cont++;
                })

                if(this.items[num].video != undefined){
                    this.contVideo = 0;

                    let vid = Object.keys(this.items[num].video).map(key => ({ video: this.items[num].video[key] }));

                    vid.forEach(data => {
                        this.contVideo;
                        this.video[this.contVideo] = data.video;
                        this.contVideo++;
                    })
                }

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
                    draggable: false,
                    color: "#ea4335"
                }).setLngLat([this.longitud, this.latitud]).addTo(this.mapa);

                if(this.tipo == 'Rural' && this.nombre != 'Mal Abrigo'){
                    const markerMalAbrigo = new Mapboxgl.Marker({
                    draggable: false,
                    color: "#006400"
                }).setLngLat([-56.952087, -34.147616]).addTo(this.mapa);
                }
                

                this.mapa.on('load', () => {
                    this.mapa.resize();
                });

                //Abre una nueva pagina con el mapa
                this.mapa.on('click', () => { 
                    //console.log('longitud: '+ this.longitud + ' latitude' + this.latitud);  
                    this.abrirMapaActionSheet();                                                
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
                if (dist_cd >= 1) {
                    red_cd = parseFloat(dist_cd).toFixed(3);
                    this.distancia_cd = "Desde C. Dominga " + red_cd;
                } else {
                    red_cd = parseFloat(dist_cd).toFixed(2);
                    this.distancia_cd = "Desde C. Dominga " + red_cd;
                }
            }

            //Emite el valor de la distancias desde casa dominga por si no está activo el GPS
            this.distancia$.next(this.distancia_cd)
        })

        this.sugerencias.forEach( res => {
            var dist_num = parseFloat(res.distancia);
            res.distanciaNumber = dist_num;
        })

        this.sugerencias.sort((a, b) => a.distanciaNumber > b.distanciaNumber ? 1 : b.distanciaNumber > a.distanciaNumber ? -1 : 0);
        this.sug_2[0] = this.sugerencias[1];
        this.sug_2[1] = this.sugerencias[2];
        this.sug_2[2] = this.sugerencias[3];
        this.sug_2[3] = this.sugerencias[4];
    });

    user = this.authSvc.currentUser.subscribe(authData => {
        this.users = authData.uid;
        this.checkFav();
    });

    ngOnInit() {
        this.subscripcionDistancia = this.distancia$.pipe(
            tap(distancia => this.distancia = distancia)
        ).subscribe();

        this.show("Cargando lugares...");        

    //    if (this.platform.is('android') && this.geolocationService.gps) {

            this.posicion$ = this.geolocationService.getPosicionActual$();
            this.subscripcionPosition = this.posicion$.pipe(
                tap(posicion => {
                    if (posicion != null) {
                        let options = { units: 'kilometers' };
                        let dist = distance([this.longitud, this.latitud], [posicion.longitud, posicion.latitud], options);
                        let distFormat, distancia;
                        if (dist > 1) {
                            distFormat = parseFloat(dist).toFixed(3);
                            distancia = "Estás a " + distFormat;
                        } else {
                            dist = dist * 1000;
                            distFormat = parseFloat(dist).toFixed(0);
                            distancia = "Estás a " + distFormat;
                        }
                        // Actualiza el observable de lugares con toda la información
                        this.distancia$.next(distancia);
                    }
                })
            ).subscribe();
       // }
    }


    ngOnDestroy() {
        this.user.unsubscribe();
        this.subscription.unsubscribe();
        this.su.unsubscribe();
        this.subscripcionDistancia.unsubscribe();
        
    //    if(this.platform.is('android') && this.geolocationService.gps ){
            this.subscripcionPosition.unsubscribe();
    //    }

        this.distancia$.unsubscribe();


    }

    async show(message: string) {

      this.loading = await this.loadingCtrl.create({
        message,
        spinner: 'bubbles'
      });
        
     this.loading.present().then(() => {
         this.user;
         this.subscription;
         this.su;
         this.loading.dismiss();
     });
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

    async abrirMapaActionSheet() {
        const actionSheet = await this.actionSheetController.create({
          header: 'Abrir Mapa',
          cssClass: 'my-custom-class',
          buttons: [
           {
            text: 'Ir en auto',
            icon: 'car-sport',
            handler: () => {
                //Abre el mapa en modo auto
                this.router.navigate(['/map', this.nombre, {longitud: this.longitud, latitud: this.latitud, tipo: this.tipo, id: this.key, profile:"mapbox/driving-traffic"}]);
            }
          }, {
            text: 'Ir caminando',
            icon: 'walk',
            handler: () => {
                this.router.navigate(['/map', this.nombre, {longitud: this.longitud, latitud: this.latitud, tipo: this.tipo, id: this.key, profile:"mapbox/walking"}]);
              console.log('Ir caminando');
            }
          }, {
            text: 'Ir en bicicleta',
            icon: 'bicycle-outline',
            handler: () => {
                this.router.navigate(['/map', this.nombre, {longitud: this.longitud, latitud: this.latitud, tipo: this.tipo, id: this.key, profile:"mapbox/driving"}]);
              console.log('Ir en Bicicleta');
            }
          }, {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]
        });
        await actionSheet.present();
      }

      async verVideo(url: string){

          const video = await this.modalCtrl.create({
              component: VideoPage,
              cssClass: 'modal-video',
              backdropDismiss: false,
              showBackdrop: true,
              componentProps: {
                 url: url
              }
          });

          await video.present();
      }
}