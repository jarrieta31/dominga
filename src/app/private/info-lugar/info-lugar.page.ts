import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DescripcionLugarPage } from '../../core/modals/descripcion-lugar/descripcion-lugar.page'

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

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  	var cambio = "../../../assets/icon/catedral.jpg";
  	$("#foto").attr("src",cambio);
  }



  public cambiarImagen(){
  	$('#imagenMini img').click(function(){ 
    var imagenSrc = $(this).attr('src');
    $("#foto").attr("src",imagenSrc);
    // $('.imgGrande').css('background', 'url('+src+')');
});
  }

  // public lunch = {
  // 	mainCourse: 'steak',
  // 	desert: 'pudding'
  // };

  // public dinner: string;

  async openModal() {
    const modal = await this.modalController.create({
      component: DescripcionLugarPage
    });
    return await modal.present();
  }

  // async openModalWithData(){
  // 	const modal = await this.modalController.create({
  // 		component: DescripcionLugarPage,
  // 		componentProps: {
  // 			lunch: this.lunch
  // 		}
  // 	});
  // 	modal.onWillDismiss().then(dataReturned => {
  // 		this.dinner = dataReturned.data;
  // 		console.log('Recive: ', this.dinner);
  // 	});

  // 	return await modal.present().then(_ => {
  // 		console.log('Sending: ', this.lunch);
  // 	});

  // }

}
