import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../shared/place';
import { Point } from '../../shared/point';
import { environment } from '../../../environments/environment';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { GeolocationService } from '../../services/geolocation.service';
import { Observable } from 'rxjs';
import { TwoPoints } from 'src/app/shared/two-points';
import * as Mapboxgl from 'mapbox-gl';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  posicion$: Observable<Point>;
  subscripcionPosition: any;
  distancia: number = 0;
  longitud: number = null;
  latitud: number = null;
  nombre: string = null;
  place: Place;
  points: Point[] = [];

  id: number;

  constructor(private activatedRoute: ActivatedRoute, private geolocationService: GeolocationService,
    private router: Router) {
    // this.geolocationService.iniciarSubscriptionClock();
    // this.posicion$ = this.geolocationService.getPosicionActual$();
  }

  regresar() {
    this.router.navigate(['/places', this.id])
  }

  ngOnInit() {



    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.longitud = Number(this.activatedRoute.snapshot.paramMap.get('longitud'));
    this.latitud = Number(this.activatedRoute.snapshot.paramMap.get('latitud'));
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    let lugar: Point = { longitud: this.longitud, latitud: this.latitud };
    this.points.push(lugar);
    this.geolocationService.crearMapa(this.points);

    // const marker = new Mapboxgl.Marker({
    //   draggable: false,
    //   color: "#ea4335"
    // }).setLngLat([this.points[0].longitud, this.points[0].latitud])
    // .addTo(this.geolocationService.mapa);

    // var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
    //   `<a href="http://localhost/places/${data.$key}"><img src="${data.imagenPrincipal}" /><h5 style="text-align: center">${data.nombre}</h5></a>`
    // );

    this.geolocationService.mapa.on('load', () => {
      this.geolocationService.mapa.resize();
    });

    // //Crea el objeto direction para agregarlo al mapa
    // var directions = new MapboxDirections({
    //   accessToken: environment.mapBoxToken,
    //   unit: 'metric',
    //   profile: 'mapbox/walking',
    //   interactive: false,
    //   controls: {
    //     inputs: false,
    //     instructions: false,
    //     profileSwitcher: true

    //   }
    // });
    // console.log('***********', this.geolocationService.posicion.longitud)
    // this.geolocationService.mapa.on('load', () => {
    //   directions.setOrigin([this.geolocationService.posicion.longitud, this.geolocationService.posicion.latitud]);
    //   directions.setDestination([this.longitud, this.latitud]);
    //   //directions.setProfile('driving-traffic');
    // });

    // this.geolocationService.mapa.addControl(directions);

    // directions.on("route", e => {
    //   // routes is an array of route objects as documented here:
    //   // https://docs.mapbox.com/api/navigation/#route-object
    //   let routes = e.route

    //   // Each route object has a distance property
    //   console.log("Route lengths", routes.map(r => r.distance))
    // })


  }

  OnDestroy() {
    // this.subscripcionPosition.unsubscribe();
    this.geolocationService.clearDatosMapa();
  }
}


