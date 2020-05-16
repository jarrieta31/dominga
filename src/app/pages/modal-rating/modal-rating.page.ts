
import { Component, Input , Output, EventEmitter} from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';





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
  //@Output() valoracion: EventEmitter<number> = new EventEmitter();

  constructor(private modalController: ModalController,
    private navParams: NavParams) { }

  ngOnInit() {
    console.table(this.navParams);
    this.nombre = this.navParams.data.nombre;
    this.descripcion = this.navParams.data.descripcion;
    this.tipo = this.navParams.data.tipo;
    this.imagen = this.navParams.data.imagen;
    this.rating = 4;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async valorarModal(){
    
    await this.modalController.dismiss();
  }

  // onRateChange(event) {
  //   this.rate = event.target.value
  //   console.log(event.target.value)
  //   console.log('valoracion: ', this.rate)
  //   //this.valoracion.emit(this.rate)
  // }

  puntuacion(rating){
    this.rate = rating;
    console.log(this.rate);
  }
 


}
