
import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { IonicRatingModule } from 'ionic-rating';


@Component({
  selector: 'app-modal-rating',
  templateUrl: './modal-rating.page.html',
  styleUrls: ['./modal-rating.page.scss'],
})
export class ModalRatingPage {

  nombre: string;
  descripcion: string;
  imagen: string;
  tipo: string;

  constructor(private modalController: ModalController,
    private navParams: NavParams) { }

  ngOnInit() {
    console.table(this.navParams);
    this.nombre = this.navParams.data.nombre;
    this.descripcion = this.navParams.data.descripcion;
    this.tipo = this.navParams.data.tipo;
    this.imagen = this.navParams.data.imagen;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async valorarModal(){
    
    await this.modalController.dismiss();
  }

  onRateChange(event) {
    console.log('Your rate:', event);
  }


}
