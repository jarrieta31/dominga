import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import * as Mapboxgl from 'mapbox-gl';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-info-lugar',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

	slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3,
    spaceBetween: 1
  };

  mapa: Mapboxgl.Map;

 
  constructor(/*private modalController: ModalController*/) { }

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
  })
  }



  async cambiarImagen() {
  	$(".imgGaleria").click(function(){ 
    var imagenSrc = $(this).attr('src');
    $("#foto").attr("src",imagenSrc);  
});
  }

  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: DescripcionLugarPage
  //   });
  //   return await modal.present();
  // }

// infoLugar = new InfoLugarModel('Basílica Catedral', 'La Catedral Basílica de San José de Mayo es sede catedralicia de la Diócesis de San José de Mayo, Uruguay. Está situada en la plaza "Treinta y Tres", plaza central de la ciudad de San José de Mayo, departamento de San José. La Catedral Basílica de San José de Mayo es sede catedralicia de la Diócesis de San José de Mayo, Uruguay. Está situada en la plaza "Treinta y Tres", plaza central de la ciudad de San José de Mayo, departamento de San José.');

}



