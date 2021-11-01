import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { FilterEventPage } from "../filter-event/filter-event.page";
import { async } from "@angular/core/testing";
import { DatabaseService } from "src/app/services/database.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit {
  now = new Date();
  textoBuscar = "";
  today: Date = new Date();

  eventos: Eventos[] = [];
  eventosActivos: Eventos[] = [];

  constructor(
    private modalCtrl: ModalController,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.getEventos();
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
    id: number,
    fecha: string,
    titulo: string,
    descripcion: string,
    imagen: string
  ) {
    if (descripcion.length > 250) {
      var desc = descripcion.substr(0, 250) + " ...";
    } else {
      desc = descripcion;
    }

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
    });

    await modalFilter.present();

    const { data } = await modalFilter.onDidDismiss();

    this.textoBuscar = data;
  }

  getEventos() {
    this.eventosActivos = [];
    this.dbService
      .getCollection("evento", (ref) => ref.orderBy("fecha", "asc"))
      .subscribe((res) => {
        this.eventos = res;

        this.eventos.forEach((f) => {
          f.fecha = new Date(f.fecha["seconds"] * 1000);

          if (this.today < f.fecha) {
            this.eventosActivos.push(f);
          }
        });
      });
  }
}
