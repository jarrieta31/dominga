import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  //style = 'mapbox://styles/jarrieta31/ck6n000cm001m1iqx98ks3tvx'; // mapa con circuito de prueba
  style = 'mapbox://styles/jarrieta31/ck6o96c6s1c5n1ilar2w7mgkz';   // mapa streets basico, con un solo marcador

  lat = -34.340051;
  lng = -56.714236;
  zoom = 13;

  constructor() { 
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }
}
