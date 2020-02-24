import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-descripcion-lugar',
  templateUrl: './descripcion-lugar.page.html',
  styleUrls: ['./descripcion-lugar.page.scss'],
})
export class DescripcionLugarPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async closeModal(){
  	await this.modalController.dismiss();
  }

}
