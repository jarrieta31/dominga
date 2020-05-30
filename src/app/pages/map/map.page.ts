import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../shared/place';
import { Point } from '../../shared/point';
import { environment } from '../../../environments/environment';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { GeolocationService } from '../../services/geolocation.service';
import { Observable, Subscription } from 'rxjs';
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
  subscripcionPosition: Subscription;
  distancia: number = 0;
  longitud: number = null;
  latitud: number = null;
  nombre: string = null;
  place: Place;
  points: Point[] = [];
  myPositionMarker: Mapboxgl.Marker = null;
  id: number;
  mapa: Mapboxgl.Map; //Mapa para mostrar
  directions: MapboxDirections = null; //Buscador de direcciones para indicar recorrido
  

  constructor(private activatedRoute: ActivatedRoute, private geolocationService: GeolocationService,
    private router: Router) {
    // this.geolocationService.iniciarSubscriptionClock();
    // this.posicion$ = this.geolocationService.getPosicionActual$();
    //Obtiene el observable con la posicion del usuario
    //this.posicion$ = this.geolocationService.getPosicionActual$();
  }

  regresar() {

    this.router.navigate(['/places', this.id])
  }

  ngOnInit() {

    //Obtiene el observable con la posicion del usuario
    this.posicion$ = this.geolocationService.getPosicionActual$();
    Mapboxgl.accessToken = environment.mapBoxToken;
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.longitud = Number(this.activatedRoute.snapshot.paramMap.get('longitud'));
    this.latitud = Number(this.activatedRoute.snapshot.paramMap.get('latitud'));
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    let lugar: Point = { longitud: this.longitud, latitud: this.latitud };
    this.points.push(lugar);
    //Crea un mapa para indicar el camino al usuario
    this.mapa = new Mapboxgl.Map({
      container: 'mapaIndicador',
      style: 'mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz',
      antialias: true,
      center: [this.longitud, this.latitud],
      zoom: 12
    });

    // Agrega el control de navegación
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    

    //Crea el objeto direction para agregarlo al mapa
    this.directions = new MapboxDirections({
      accessToken: environment.mapBoxToken,
      unit: 'metric',
      profile: 'mapbox/walking',
      interactive: false,
      controls: {
        inputs: false,
        instructions: false,
        profileSwitcher: true        
      },
      placeholderOrigin: "Tu",
      placeholderDestination: this.nombre
    });

    this.mapa.addControl(new MapboxDirections({ accessToken: Mapboxgl.accessToken }), 'top-left');

    //Crea e marcador del lugar
    const marker = new Mapboxgl.Marker({
      draggable: false,
      color: "#ea4335"
    }).setLngLat([this.longitud, this.latitud])
      .addTo(this.mapa);


    this.subscripcionPosition = this.posicion$.pipe(
      tap(posicionUser => {
        if (this.myPositionMarker == null && posicionUser != null) {
          this.createMarker(posicionUser.longitud, posicionUser.latitud);
        }
        if (posicionUser != null) {
          this.actualizarMarcador(posicionUser.longitud, posicionUser.latitud);
          
        }
        if (this.directions != null && posicionUser != null) {
          
          this.mapa.on('load', () => {
            this.directions.setOrigin([posicionUser.longitud, posicionUser.latitud]);
            this.directions.setDestination([this.longitud, this.latitud]);
            //directions.setProfile('driving-traffic');
          });
        }
        console.log(posicionUser)
      })
    ).subscribe()

    //Subscripcion para ver la ruta
    this.directions.on("route", e => {
      let routes = e.route
      this.distancia = routes.map(r => r.distance);
    })

    this.mapa.on('load', () => {
      this.mapa.resize();
    });





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
    this.subscripcionPosition.unsubscribe(); //Dessubscripcion a la posicion del usuario    
  }

  actualizarMarcador(longitud: number, latitud: number) {
    if (this.myPositionMarker != null) {
      this.myPositionMarker.remove();
      this.myPositionMarker.setLngLat([longitud, latitud]).addTo(this.mapa);
    }
  }

  createMarker(longitud: number, latitud: number) {
    //Crea html para el marcador
    var el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = 'url("/assets/icon/marcador_celeste.svg")';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.boxShadow = '1px 1px 40px #81bdda';
    //Agrega el marcador al mapa
    this.myPositionMarker = new Mapboxgl.Marker(el, { draggable: false })
      .setLngLat([longitud, latitud])
      .addTo(this.mapa);
    //Agrega la posición del usuario a la lista de puntos           
    //this.points.push(this.posicion as Point);
    //Recalcula los puntos extremos
    //let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
    //Recalcula el centro del mapa
    // let centro: Point = this.getCenterPoints(maxmin);
    // this.distancia = this.calculateDistance(maxmin);
    // let zoom = this.calculateZoom(this.distancia);
    // this.mapa.setCenter([centro.longitud, centro.latitud]);
    // this.mapa.setZoom(zoom);

  }

}




