import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';
import { timer, Subject, Observable, BehaviorSubject } from 'rxjs';
import { Place } from '../shared/place';
import { TwoPoints } from '../shared/two-points';
import { Point } from '../shared/point';
import { tap, map, share, takeWhile } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class GeolocationService {

  mapa: Mapboxgl.Map;
  myPositionMarker: any = null;
  points: Point[];

  watchLocationUpdates: any;
  isWatching: boolean;
  distancia: number;
  distanciaActual$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private posicion$: BehaviorSubject<Point> = new BehaviorSubject<Point>(null);
  posicion: Point = { longitud: 0, latitud: 0 };
  latCenter: number = 0;
  longCenter: number = 0;
  casaDominga = { "longitud": -56.7145, "latitud": -34.340007 };
  timetest: any;
  sourceClock$: Observable<any>;
  sourceGpsSubject$ = new BehaviorSubject(null);
  observerGps: any;
  public gps: boolean = false;
  observerClock: any;

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform,
    private geolocation: Geolocation, private locationAccuracy: LocationAccuracy) {

    this.checkGPSPermission()
    //Observable que obtiene los pulsos y obtiene la posicion
    this.sourceClock$ = timer(500, 36000).pipe(
      tap(clock => {
        this.geolocation.getCurrentPosition({ maximumAge: 0, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
          this.gps = true;
          this.posicion = { longitud: resp.coords.longitude, latitud: resp.coords.latitude };
          this.actualizarPosicion$({ longitud: resp.coords.longitude, latitud: resp.coords.latitude });
          this.actualizarMarcador()
        }).catch((error) => {
          this.posicion = this.casaDominga;
          this.actualizarPosicion$(this.casaDominga);
          if(this.myPositionMarker != null) this.myPositionMarker.remove();
          this.gps = false;
          alert('Error al obtener la ubicación' + error);
        });
      }),
      share()
    )

    //Inicia el clock que genera los pulsos y obtiene la posicion
    this.observerClock = this.sourceClock$.subscribe();

  }

  actualizarMarcador() {
    if (this.myPositionMarker != null) {
      this.myPositionMarker.remove();
      this.myPositionMarker.setLngLat([this.posicion.longitud, this.posicion.latitud]).addTo(this.mapa);
    }
  }


  crearMapa(points: Array<Point>) {
    // si el gps está activo crea el mapa con el marcador
    if (this.gps) {
      this.points = points;
      //agrega la posicion actual a la lista de puntos
      this.points.push(this.posicion)
      let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
      let centro: Point = this.getCenterPoints(maxmin);
      this.distancia = this.calculateDistance(maxmin);
      let zoom = this.calculateZoom(this.distancia);
      Mapboxgl.accessToken = environment.mapBoxToken;
      this.mapa = new Mapboxgl.Map({
        container: 'mapaBox',
        style: 'mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz',
        // pitch: 60,
        // bearing: -17.6,
        antialias: true,
        center: [centro.longitud, centro.latitud],
        zoom: zoom
      });
      this.createMarker()
    } else {
      this.points.push(this.posicion)
      let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
      let centro: Point = this.getCenterPoints(maxmin);
      this.distancia = this.calculateDistance(maxmin);
      let zoom = this.calculateZoom(this.distancia);
      Mapboxgl.accessToken = environment.mapBoxToken;
      this.mapa = new Mapboxgl.Map({
        container: 'mapaBox',
        style: 'mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz',
        // pitch: 60,
        // bearing: -17.6,
        antialias: true,
        center: [centro.longitud, centro.latitud],
        zoom: zoom
      });
    }

  }

  createMarker() {
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
      .setLngLat([this.posicion.longitud, this.posicion.latitud])
      .addTo(this.mapa);
    //Agrega la posición del usuario a la lista de puntos           
    this.points.push(this.posicion as Point);
    //Recalcula los puntos extremos
    let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
    //Recalcula el centro del mapa
    let centro: Point = this.getCenterPoints(maxmin);
    this.distancia = this.calculateDistance(maxmin);
    let zoom = this.calculateZoom(this.distancia);
    this.mapa.setCenter([centro.longitud, centro.latitud]);
    this.mapa.setZoom(zoom);
    //alert('Zoom = ' + zoom);
    //this.createMarkerCenter(centro);

  }

  //Compruebe si la aplicación tiene permiso de acceso GPS 
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //Si tiene permiso, muestre el diálogo 'Activar GPS'
          this.gps = true
          this.askToTurnOnGPS();
        } else {
          //Si no tiene permiso pida permiso
          this.requestGPSPermission();

        }
      },
      err => {
        alert(err);
      }
    );
  }

  //Pide los permisos para el GPS julio
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("canRequest", canRequest);
      } else {
        //Mostrar el diálogo 'Solicitud de permiso de GPS'
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
          .then(
            () => {
              // método de llamada para encender el GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Mostrar alerta si el usuario hace clic en "No, gracias"
              alert('requestPermission. Error al solicitar permisos de ubicación ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas 
        this.gps = true
      },
      error => {
        alert('Error al solicitar permisos de ubicación ' + JSON.stringify(error))
      }
    );
  }

  // Recibe 2 Puntos y obtiene el centro retornando un Point
  getCenterPoints(Points: TwoPoints): Point {
    let center: Point = { latitud: 0, longitud: 0 }
    center.latitud = (Points.latitud1 + Points.latitud2) / 2;
    center.longitud = (Points.longitud1 + Points.longitud2) / 2;
    return center;
  }


  /* Recibe un array de lugares y calcula los Points mas alejados y retorna un array numérico 
  con las coordenadas de ambos  */
  getMaxMinPoints(points: Array<Point>): TwoPoints {
    let maxmin: TwoPoints = { latitud1: 0, latitud2: 0, longitud1: 0, longitud2: 0 };
    let longMax: number = 0;
    let longMin: number = 0;
    let latMax: number = 0;
    let latMin: number = 0;
    for (let i = 0; i < points.length; i++) {
      if (i == 0) {
        longMax = +points[i].longitud
        longMin = +points[i].longitud
        latMax = +points[i].latitud
        latMin = +points[i].latitud
      } else {
        if (longMin > +points[i].longitud) longMin = +points[i].longitud;
        if (latMin > +points[i].latitud) latMin = +points[i].latitud;
        if (longMax < +points[i].longitud) longMax = +points[i].longitud;
        if (latMax < +points[i].latitud) latMax = +points[i].latitud;
      }
    }
    maxmin.latitud1 = latMin;
    maxmin.longitud1 = longMin;
    maxmin.latitud2 = latMax;
    maxmin.longitud2 = longMax;
    console.log(`LatMin ${latMin} LongMin ${longMin}`);
    return maxmin
  }

  createMarkerCenter(centro: Point) {
    //Crea html para el marcador
    var el = document.createElement("div");
    el.className = "marker2";
    el.style.backgroundColor = "rgb(255,30,100)";
    //el.style.backgroundImage = 'url("/assets/icon/marcador_azul.svg")';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.boxShadow = '1px 1px 20px #81bdda';
    //Agrega el marcador al mapa
    this.myPositionMarker = new Mapboxgl.Marker(el, { draggable: false })
      .setLngLat([centro.longitud, centro.latitud])
      .addTo(this.mapa);
  }

  calculateDistance(pts: TwoPoints): number {
    let p = 0.017453292519943295;
    let c = Math.cos;
    let a = 0.5 - c((pts.latitud1 - pts.latitud2) * p) / 2 + c(pts.latitud2 * p) * c((pts.latitud1) * p) * (1 - c(((pts.longitud1 - pts.longitud2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a)));
    return Math.trunc(dis);
  }

  calculateZoom(distancia: number): number {
    let zoom: number = 1;
    let rangos = [[5, 12.6], [10, 12.6], [15, 13], [20, 11], [40, 9.5], [60, 8], [80, 7.5], [100, 7], [120, 6.5], [150, 6], [180, 5.5], [200, 5]]
    for (let i = 0; i < rangos.length; i++) {
      for (let j = 0; j < rangos[i].length; j++) {
        console.log(rangos[i][0])
        if (distancia <= rangos[i][0]) {
          zoom = rangos[i][1];
          return zoom
        }
      }
    }
    return zoom
  }

  getPosicionActual$(): Observable<Point> {
    return this.posicion$.asObservable();
  }

  actualizarPosicion$(point: Point) {
    this.posicion = point;
    this.posicion$.next(this.posicion);
  }


}


