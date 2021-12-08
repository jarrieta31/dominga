import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { FilterEventPage } from "../filter-event/filter-event.page";
import { DatabaseService } from "src/app/services/database.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit, OnDestroy {
  now = new Date();
  textoBuscar = "";
  today: Date = new Date();

  eventos: Eventos[] = [];
  eventosSuscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.eventosSuscription = this.dbService
      .getObservable()
      .subscribe((eventos) => (this.eventos = eventos));
    this.dbService.getEventsLocal();
  }

  ngOnDestroy() {
    this.eventosSuscription.unsubscribe();
  }

  /**
   * Slide
   */
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**
   * Muestra el modal con descripción más detallada del evento seleccionado
   * @param id - id del evento
   * @param fecha - fecha del evento
   * @param titulo - titulo del evento
   * @param descripcion - descripcion del evento
   * @param imagen - imagen del evento
   */
  async openModalDetailEvent(
    id: string,
    fecha: string,
    titulo: string,
    descripcion: string,
    imagen: string,
    lugar: string
  ) {
    if (descripcion.length > 250) {
      var desc = descripcion.substr(0, 250) + " ...";
    } else {
      desc = descripcion;
    }

    this.contadorVisitas(id);

    const modal = await this.modalCtrl.create({
      component: EventDetailPage,
      cssClass: "modal-event",
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        id: id,
        fecha: fecha,
        titulo: titulo,
        descripcion: desc,
        descripcion_completa: descripcion,
        imagen: imagen,
        lugar: lugar,
      },
    });

    await modal.present();
  }

  async filterEvents() {
    const modalFilter = await this.modalCtrl.create({
      component: FilterEventPage,
      cssClass: "filterModal",
      backdropDismiss: false,
      showBackdrop: true,
      keyboardClose: true,
      mode: "ios",
    });

    await modalFilter.present();

    const { data } = await modalFilter.onDidDismiss();

    this.textoBuscar = data;
  }

  contadorVisitas(id: string) {
    this.dbService.contadorVisitasEvento(id);
  }
}
