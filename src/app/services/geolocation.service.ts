import { Injectable } from '@angular/core';
import { Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
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

  watchLocationUpdates:any;
  isWatching:boolean;

  locationCoords: any;
  timetest: any;

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform,
              private geolocation: Geolocation, private locationAccuracy: LocationAccuracy) {

    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
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
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      console.log('longitud: ' + this.locationCoords.longitude + 'latitud: ' + this.locationCoords.latitude)
      //Crea html para el marcador
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = 'url("/assets/icon/marcador_celeste.svg")';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.boxShadow = '1px 1px 20px #81bdda';
      //Agrega el marcador al mapa
      this.myPositionMarker = new Mapboxgl.Marker(el, {draggable: false})
        .setLngLat([resp.coords.longitude , resp.coords.latitude ])
        .addTo(this.mapa);

      // Agrega el control para localizador en el mapa
      this.mapa.addControl( new Mapboxgl.GeolocateControl({
        positionOptions: {enableHighAccuracy: true},trackUserLocation: true })
      );
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
        //this.watchLocation();
      },
      error => alert('Error al solicitar permisos de ubicación ' + JSON.stringify(error))
    );
  }

  // Métodos para obtener coordenadas precisas del dispositivo utilizando el dispositivo GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      console.log('longitud: ' + this.locationCoords.longitude + 'latitud: ' + this.locationCoords.latitude)
    }).catch((error) => {
      alert('Error al obtener la ubicación' + error);
    });
  }

}
