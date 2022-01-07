import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { FilterEventPage } from "../filter-event/filter-event.page";
import { DatabaseService } from "src/app/services/database.service";
import { Subscription } from "rxjs";
import { VisitEventService } from "src/app/services/database/visit-event.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
// export class EventsPage implements OnInit, OnDestroy {
  export class EventsPage {
  now = new Date();
  textoBuscar = "";
  today: Date = new Date();

  eventos: Eventos[] = [];
  eventos_xdptoSelection: Eventos[] = [];
  eventosSuscription: Subscription;
  dpto_select: String;

  constructor(
    private modalCtrl: ModalController,
    private dbService: DatabaseService,
    private veService: VisitEventService
  ) {}
// eliminar y cambiar por illwill 
  // ngOnInit() {
  //   this.eventosSuscription = this.dbService
  //     .getObservable()
  //     .subscribe((eventos) => (this.eventos = eventos));
  //   this.dbService.getEventsLocal();
  // }

  ionViewWillEnter(){
    this.eventosSuscription = this.dbService
      .getObservable()
      .subscribe((eventos) => (this.eventos = eventos));
    this.dbService.getEventsLocal();
    /** Actualizo el dpto seleccionado */
    this.dpto_select = this.dbService.selectionDepto;
    /** Cargo los eventos por el Dpto Seleccionado */
    this.eventos_xdptoSelection = this.eventosxDptoSeleccionado();
  }

  // ngOnDestroy() {
  //   this.eventosSuscription.unsubscribe();
  // }

  ionViewDidLeave(){
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
    this.veService.contadorVisitasEvento(id);
  }
  
  /**
   * Funcion que genera un arreglo de eventos por departamento seleccionado.
   * @returns Arregldo de Interfaz Eventos
   */
  eventosxDptoSeleccionado(): Eventos[] {
    let eventsxdpto : Eventos[] = [];
    if( this.dpto_select == '' ){
      eventsxdpto = this.eventos;
    }else if( this.eventos.length > 0){
      this.eventos.forEach((ev) => {
        if( ev.departamento == this.dpto_select )
          eventsxdpto.push(ev);
      })
    } else {
      eventsxdpto = this.eventos;
    }

    return eventsxdpto;
  }
}
