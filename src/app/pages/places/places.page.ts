import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits';

import {Router, ActivatedRoute, Params} from '@angular/router';

import { ModalController } from '@ionic/angular';

import { ModalInfoPage } from '../../pages/modal-info/modal-info.page';

import * as Mapboxgl from 'mapbox-gl';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-info-lugar',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

  items : CircuitsModel[] = [];

	slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3,
    spaceBetween: 1
  };

  mapa: Mapboxgl.Map;

 
  constructor(
    public database: DatabaseService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
  	var cambio = "../../../assets/img/basilica-catedral.jpg";
  	$("#foto").attr("src",cambio);

  	Mapboxgl.accessToken = environment.mapBoxToken;
		this.mapa = new Mapboxgl.Map({
		container: 'mapa-box',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-56.713438, -34.340118],
		zoom: 16,
	}

	);

		const marker = new Mapboxgl.Marker({
			draggable: false
		}).setLngLat([-56.713438, -34.340118]).addTo(this.mapa);

		this.mapa.on('load', () => {
  			this.mapa.resize();
  });

     this.getLugaresId();
  }

  async cambiarImagen() {
  	$(".imgGaleria").click(function(){ 
    var imagenSrc = $(this).attr('src');
    $("#foto").attr("src",imagenSrc);  
});
  }

async getLugaresId(){
  this.activatedRoute.paramMap.subscribe(params => {
      //console.log(params.get("id"));
         this.database.getPlacesId(params.get("id")).subscribe((resultado: any) => {
         this.items = [];

         resultado.descripcion = resultado.descripcion.substr(0, 44) + " ...";
       
        this.items = resultado;
        console.log(this.items);
      }); 
   });
  }
}



