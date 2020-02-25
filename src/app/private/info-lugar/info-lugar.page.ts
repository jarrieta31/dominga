import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DescripcionLugarPage } from '../../core/modals/descripcion-lugar/descripcion-lugar.page';
import { InfoLugarModel } from '../../core/models/info-lugar-model';
import { environment } from '../../../environments/environment';

import * as Mapboxgl from 'mapbox-gl';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-info-lugar',
  templateUrl: './info-lugar.page.html',
  styleUrls: ['./info-lugar.page.scss'],
})
export class InfoLugarPage implements OnInit {

	slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3,
    spaceBetween: 1
  };

  mapa: Mapboxgl.Map;

 
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  	var cambio = "../../../assets/icon/catedral.jpg";
  	$("#foto").attr("src",cambio);

  	Mapboxgl.accessToken = environment.mapBoxKey;
		this.mapa = new Mapboxgl.Map({
		container: 'mapa-box',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-56.713438, -34.340118],
		zoom: 16
	});

		const marker = new Mapboxgl.Marker({
			draggable: false
		}).setLngLat([-56.713438, -34.340118]).addTo(this.mapa);
  }

  async cambiarImagen() {
  	$("#imagenMini img").click(function(){ 
    var imagenSrc = $(this).attr('src');
    $("#foto").attr("src",imagenSrc);  
});
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: DescripcionLugarPage
    });
    return await modal.present();
  }

infoLugar = new InfoLugarModel('Basílica Catedral', 'La Catedral Basílica de San José de Mayo es sede catedralicia de la Diócesis de San José de Mayo, Uruguay. Está situada en la plaza "Treinta y Tres", plaza central de la ciudad de San José de Mayo, departamento de San José. La Catedral Basílica de San José de Mayo es sede catedralicia de la Diócesis de San José de Mayo, Uruguay. Está situada en la plaza "Treinta y Tres", plaza central de la ciudad de San José de Mayo, departamento de San José.');

// while ( container.text().length > largomaximo ) {
//     text.text(function (index, text) {
//         return text.replace(/\W*\s(\S)*$/, '...');
//     });
// }


}




