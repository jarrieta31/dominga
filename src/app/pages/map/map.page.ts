import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../shared/place';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  argumentos = null;
  place: Place;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    var ll = new mapboxgl.LngLat();    
    this.argumentos = this.activatedRoute.snapshot.paramMap.get('latitud');
    let datos = JSON.parse(this.argumentos);
    alert(datos.latitude);

  }
}


