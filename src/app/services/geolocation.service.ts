import { Injectable } from '@angular/core';
import { Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';
import { timer, Subject, Observable, Observer } from 'rxjs';
import { Place } from '../shared/place';
import { TwoPoints } from '../shared/two-points';
import { Point } from '../shared/point';


@Injectable({
  providedIn: 'root'
})

export class GeolocationService {
  
  mapa: Mapboxgl.Map;
  myPositionMarker: any
  points: Point[];
  watchLocationUpdates:any;
  isWatching:boolean;
  distancia: number = 0;
  latCenter:number = 0;
  longCenter:number = 0;
  locationCoords: any;
  timetest: any;
  sourceClock: Observable<number> = timer(1000, 5000);
  sourceGpsSubject = new Subject();
  observerGps: any;
  
  constructor(private androidPermissions: AndroidPermissions, private platform: Platform,
              private geolocation: Geolocation, private locationAccuracy: LocationAccuracy) {

    this.locationCoords = {latitude: "",longitude: "", accuracy: "", timestamp: "" };
    this.timetest = Date.now(); 
    
  }

  //Obtener coordenadas actuales del dispositivo
  getGeolocation(){
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 6000, enableHighAccuracy: true }).then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error al obtener la posicion acctual: ',error);
     });
  }

  // Iniciar vigilancia de actualización de ubicación
  watchLocation(){
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition({ maximumAge: 3000, timeout: 3000, enableHighAccuracy: true });
    this.watchLocationUpdates.subscribe((resp) => {
      this.myPositionMarker.remove();
      this.myPositionMarker.setLngLat([ resp.coords.longitude, resp.coords.latitude]).addTo(this.mapa);
    });
  }

  //Detiene la vigilancia de la actualización de ubicación
  stopLocationWatch(){
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }

  crearMapa(points: Array<Point>){
    console.log('cantidad de Puntos: ', points.length)
    this.points = points;
    let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
    let centro: Point = this.getCenterPoints(maxmin);
    this.distancia = this.calculateDistance(maxmin);
    let zoom = this.calculateZoom(this.distancia);
    alert('Zoom = ' + zoom)
    Mapboxgl.accessToken = environment.mapBoxToken;
    this.mapa = new Mapboxgl.Map({
      container: 'mapaBox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [centro.longitud, centro.latitud],
      zoom: zoom
    });
    //Si es un dispositivo movil y es android se agregan el marcador del usuario
    if(this.platform.is('android') && this.platform.is('mobile')){
      //Chequea los permisos y agrega el marcador del usuario
      this.checkGPSPermission()
    }
    
    
  }

  createMarker(){     
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      //Crea html para el marcador
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = 'url("/assets/icon/marcador_celeste.svg")';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '1px 1px 20px #81bdda';
      //Agrega el marcador al mapa
      this.myPositionMarker = new Mapboxgl.Marker(el, {draggable: false})
        .setLngLat([resp.coords.longitude , resp.coords.latitude ])
        .addTo(this.mapa);
      //Agrega la posición del usuario a la lista de puntos
      const lugar_user:Point = { latitud: +resp.coords.latitude, longitud: +resp.coords.longitude};      
      this.points.push(lugar_user as Point);
      //Recalcula los puntos extremos
      let maxmin: TwoPoints = this.getMaxMinPoints(this.points);
      //Recalcula el centro del mapa
      let centro: Point = this.getCenterPoints(maxmin);
      this.distancia = this.calculateDistance(maxmin);
      let zoom = this.calculateZoom(this.distancia);
      this.mapa.setCenter([centro.longitud, centro.latitud]);
      this.mapa.setZoom(zoom);
      alert('Zoom = ' + zoom);
      this.createMarkerCenter(centro);
    }).catch((error) => {
      alert('Error al obtener la ubicación para crear el marcador' + error);
    });      
  }

  //Compruebe si la aplicación tiene permiso de acceso GPS 
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) { 
          //Si tiene permiso, muestre el diálogo 'Activar GPS'
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
        console.log("4");
      } else {
        //Mostrar el diálogo 'Solicitud de permiso de GPS'
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
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
        // Cuando el GPS se activó el método de llamada para obtener coordenadas de ubicación precisas        
        this.createMarker();       
        this.watchGPS()
      },
      error => alert('Error al solicitar permisos de ubicación ' + JSON.stringify(error))
    );
  }

  // Métodos para obtener coordenadas precisas del dispositivo utilizando el dispositivo GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 6000, enableHighAccuracy: true }).then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      console.log('longitud: ' + this.locationCoords.longitude + 'latitud: ' + this.locationCoords.latitude)
    }).catch((error) => {
      alert('Error al obtener la ubicación' + error);
    });
  }

  watchGPS(){
    this.isWatching = true;
    //Subjet que se subscribe al reloj y obtiene la posicion actual cambiando la posición del marcador
    this.sourceGpsSubject.subscribe(clock => {
      this.geolocation.getCurrentPosition().then(res =>{
        this.myPositionMarker.remove();
        if(res){
          this.myPositionMarker.setLngLat([ res.coords.longitude, res.coords.latitude]).addTo(this.mapa);
          console.log('longitud: ' + res.coords.longitude + ', latitud: ' + res.coords.longitude );
        }        
      }).catch( e => console.log('error = ',e))
    })
    this.sourceClock.subscribe(this.sourceGpsSubject);
    //se desubscribe a los 30 minutos, luego corta la subscripsion
    timer(1000 * 60 * 30).subscribe(() => this.sourceGpsSubject.unsubscribe())

  }

  // Recibe 2 Puntos y obtiene el centro retornando un Point
  getCenterPoints(Points: TwoPoints): Point {    
    let center : Point = {latitud:0, longitud:0}
    center.latitud = (Points.latitud1 + Points.latitud2)/2;
    center.longitud = (Points.longitud1 + Points.longitud2)/2;    
    return center;
  }


  /* Recibe un array de lugares y calcula los Points mas alejados y retorna un array numérico 
  con las coordenadas de ambos  */
  getMaxMinPoints(points: Array<Point>): TwoPoints{  
    let maxmin: TwoPoints = {latitud1: 0, latitud2:0,longitud1:0, longitud2:0};
    let longMax:number = 0;
    let longMin:number = 0;
    let latMax:number = 0;
    let latMin:number = 0;
    for (let i = 0; i < points.length; i++) {
      if( i == 0){
        longMax = +points[i].longitud
        longMin = +points[i].longitud
        latMax = +points[i].latitud
        latMin = +points[i].latitud
      }else{
        if( longMin > +points[i].longitud ) longMin = +points[i].longitud;
        if( latMin > +points[i].latitud ) latMin = +points[i].latitud;
        if( longMax < +points[i].longitud ) longMax = +points[i].longitud;
        if( latMax < +points[i].latitud ) latMax = +points[i].latitud;
      }      
    }
    maxmin.latitud1 = latMin;
    maxmin.longitud1 = longMin;
    maxmin.latitud2 = latMax;
    maxmin.longitud2 = longMax;
    console.log(`LatMin ${latMin} LongMin ${longMin}`);
    return maxmin 
  }

  createMarkerCenter(centro: Point){   
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
      this.myPositionMarker = new Mapboxgl.Marker(el, {draggable: false})
        .setLngLat([centro.longitud, centro.latitud])
        .addTo(this.mapa);
  }

  calculateDistance(pts: TwoPoints):number{
    let p = 0.017453292519943295;
    let c = Math.cos;
    let a = 0.5 - c((pts.latitud1-pts.latitud2) * p) / 2 + c(pts.latitud2 * p) *c((pts.latitud1) * p) * (1 - c(((pts.longitud1- pts.longitud2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a)));
    return Math.trunc(dis);
  }

  calculateZoom(distancia:number):number{
    let zoom:number = 1;
    let rangos = [[5,14], [10,13], [15,11], [20, 9], [40, 8.5], [60,8], [80,7.5], [100, 7], [120, 6.5], [150,6], [180,5.5], [200,5]]
    for (let i = 0; i < rangos.length; i++) {
      for (let j = 0; j < rangos[i].length; j++) {
        console.log(rangos[i][0])
        if(distancia <= rangos[i][0]){
          zoom = rangos[i][1];
          return zoom
        }        
      }      
    }
    return zoom
  }

}


