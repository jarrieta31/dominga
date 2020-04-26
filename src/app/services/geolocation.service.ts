import { Injectable } from '@angular/core';
import { Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  Data: any[] = [];
  mapa: Mapboxgl.Map;
  myPositionMarker: any
  latitudeMap: number;
  longitudeMap: number;
  watchLocationUpdates:any;
  loading:any;
  isWatching:boolean;

  constructor(private androidPermissions: AndroidPermissions,
              private platform: Platform,
              private geolocation: Geolocation) { }

  //Obtener coordenadas actuales del dispositivo
  getGeolocation(){
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      this.latitudeMap = resp.coords.latitude;
      this.longitudeMap = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error en getGeolocation: ',error);
     });
  }

  // Iniciar vigilancia de actualización de ubicación
  watchLocation(){
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition({ maximumAge: 3000, timeout: 4000, enableHighAccuracy: true });
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

  checkPermisosGPS(log:number, lat:number ){
    if(this.platform.is('android')){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => { 
          if(!result.hasPermission){
            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS])
              .then(res => {
                alert('pidiendo permisos' + res + ', es de tipo' + typeof res)                
                this.createMarker();
              })        
          }else{          
            this.createMarker()         
          }                  
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      );
    }
    
    
  }

  crearMapa(log:number, lat:number){
    Mapboxgl.accessToken = environment.mapBoxToken;
    this.mapa = new Mapboxgl.Map({
      container: 'mapaBox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [log, lat],
      zoom: 13
    });
    
  }

  createMarker(){
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      this.latitudeMap = resp.coords.latitude;
      this.longitudeMap = resp.coords.longitude;
      //Crea html para el marcador
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = 'url("/assets/icon/marcador_celeste.svg")';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.boxShadow = '1px 1px 20px';

      this.myPositionMarker = new Mapboxgl.Marker(el, {draggable: false, color: "#c8192b"})
        .setLngLat([this.longitudeMap, this.latitudeMap])
        .addTo(this.mapa);
      //Actualiza posicion del marcador 
      this.watchLocation()
     }).catch((error) => {
       console.log('Error en getGeolocation: ',error);
     });    
  }
}
