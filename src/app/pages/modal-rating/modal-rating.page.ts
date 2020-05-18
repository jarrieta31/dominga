
import { Component, Input , Output, EventEmitter} from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';


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
  rate: number;

  @Input() rating: number ;
  
  constructor(private modalController: ModalController, private platform: Platform,
    private navParams: NavParams, private vibration: Vibration) { }

  ngOnInit() {
    console.table(this.navParams);
    this.nombre = this.navParams.data.nombre;
    this.descripcion = this.navParams.data.descripcion;
    this.tipo = this.navParams.data.tipo;
    this.imagen = this.navParams.data.imagen;
    this.rating = 4;

    //Si es un dispositivo móvil vibra al lazar el modal
    if(this.platform.is('android')){
      this.vibration.vibrate([500,500,500]);
    }
  }

  //Cierra el modal enviando parametros al padre
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  //Cierra el modal sin pasar parametros al padre
  async valorarModal(){    
    await this.modalController.dismiss();
  }

  //Captura el valor cuando cambian la valoracion
  puntuacion(rating){
    this.rate = rating;
    console.log(this.rate);
  }
}
