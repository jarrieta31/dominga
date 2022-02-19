import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { DatabaseService } from "src/app/services/database.service";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { VisitEventService } from "src/app/services/database/visit-event.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
// export class EventsPage implements OnInit, OnDestroy {
export class EventsPage {
  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  now = new Date();
  textoBuscar = "";
  today: Date = new Date();

  eventos: Eventos[] = [];
  eventos_xdptoSelection: Eventos[] = [];
  eventosSuscription: Subscription;
  dpto_select: String;
  /**captura los datos del formulario de filtros */
  dataform: string = "";
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  isFilterType = false;
  isFilterDate = false;
  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  isOpenType: boolean = false;
  isOpenDate: boolean = false;
  /**varibles de filtro por fecha */
  fecha_inicio: Date = new Date();
  fecha_fin   : Date = new Date(this.fecha_inicio.getDate()+90);

  /**se guardan los sliders de la pantalla eventos */
  sliderEvents: Slider[] = [];

  filterForm: FormGroup = this.fb.group({
    tipo        : ["", Validators.required],
    localidad   : ["", Validators.required],
    fecha_fin   : ["", Validators.required],
    fecha_inicio: ["", Validators.required],
    // moneda   : ["", Validators.required],
    // precio: [, Validators.required],
  });

  isFilter: boolean = false;

  constructor(
    private veService: VisitEventService, //Servicio contador de visitas eventos.
    private modalCtrl: ModalController,
    private dbService: DatabaseService,
    private sliderSvc: SlidesService,
    private        fb: FormBuilder,
  ) {}

  ionViewWillEnter() {
    this.unsubscribe$ = new Subject<void>();

    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "eventos") this.sliderEvents.push(item);
        });
      });

    this.eventosSuscription = this.dbService
      .getObservable()
      .subscribe((eventos) => {(this.eventos = eventos)
      console.log(eventos)});

    if (this.eventos.length > 0) {
      if (this.eventos[0].departamento != this.dbService.selectionDepto) {
        this.dbService.getEventos();
      }
    } else {
      this.dbService.getEventos();
    }
    /**Se suscribe al array de eventos, si se genera cambios al estar en la pantalla
     * se van a actulizar
     */

    /** */
    this.dbService.getEventsLocal();
    /** Actualizo el dpto seleccionado */
    this.dpto_select = this.dbService.selectionDepto;
  }

  ionViewDidLeave() {
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
  /**para decodificar texto en base64 */
  decodeDescEventos(){
    this.eventos.forEach(ev => {
      console.log(`descEnCode:: ${ev.descripcion}`);
      const descripcion = atob(ev.descripcion);
      ev.descripcion = descripcion;
      console.log(`desc:: ${ev.descripcion}`);

    })
  }

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
    lugar: string,
    latitud: number,
    longitud: number,
    fechaFin: string,
    instagram: string,
    tickAntel: string,
    facebook: string,
    whatsapp: string,
    moneda: string,
    precio: number,
    precioUnico: boolean
  ) {
    
    if (descripcion.length > 250) {
      var desc = descripcion.substring(0, 250) + " ...";
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
        latitud: latitud,
        longitud: longitud,
        fechaFin: fechaFin,
        instagram: instagram,
        tickAntel: tickAntel,
        facebook: facebook,
        whatsapp: whatsapp,
        moneda: moneda,
        precio: precio,
        precioUnico: precioUnico
      },
    });

    await modal.present();
  }


  contadorVisitas(id: string) {
    this.veService.contadorVisitasEvento(id);
  }

  /** ===========>=>=>=> Metodos Para Filtro de Eventos ===========>=>=>=>*/
  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isFilterType || this.isFilterDate) {
      this.isFilterType = false;
      this.isOpenType = false;
      this.isFilterDate = false;
      this.isOpenDate = false;
    }
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    this.isOpenType = !this.isOpenType;
    if (this.isFilterLocation || this.isFilterDate) {
      this.isFilterLocation = false;
      this.isOpenLocation = false;
      this.isFilterDate = false;
      this.isOpenDate = false;
    }
  }

  changeFilterDate() {
    this.isFilterDate = !this.isFilterDate;
    this.isOpenDate = !this.isOpenDate;
    if (this.isFilterLocation || this.isFilterType) {
      this.isFilterLocation = false;
      this.isOpenLocation = false;
      this.isFilterType = false;
      this.isOpenType = false;
    }
  }

  changeLocation() {
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isOpenType || this.isOpenDate) {
      this.isOpenType = false;
      this.isOpenDate = false;
    }
  }

  changeType() {
    this.isOpenType = !this.isOpenType;
    if (this.isOpenLocation || this.isOpenDate) {
      this.isOpenLocation = false;
      this.isOpenDate = false;
    }
  }

  changeDate() {
    this.isOpenDate = !this.isOpenDate;
    if (this.isOpenLocation || this.isOpenType) {
      this.isOpenLocation = false;
      this.isOpenType = false;
    }
  }
  /**
   * Metodo que se encarga de chequar si el array de TipoEventos ya tiene un Tipo guardado.
   * @param tipoEventos Arreglo de tipos de eventos. String
   * @param evento nombre del tipo de evento a verificar.
   * @returns true o false.
   */
  tipoEventoGuradado(tipoEventos: string[], evento: string): boolean {
    let evento_save: boolean = false;
    tipoEventos.forEach((ev) => {
      if (ev == evento) evento_save = true;
    });
    return evento_save;
  }

  filterEvento() {
    this.dataform = this.filterForm.value;
    this.actualizarFechas();
  }

  actualizarFechas(){
    this.fecha_inicio = this.filterForm.get("fecha_inicio").value;
    this.fecha_fin    = this.filterForm.get("fecha_fin").value;
  }

  /**Ordeno los eventos alfabeticamente por el "Tipo"
   *  0 : son iguales
   *  1 : antes
   * -1 : despues
   */
  get eventos_ordenados_asc_xlocalidad(): Eventos[] {
    let result: Eventos[] = [];
    const eventos = this.eventos;
    result = eventos.sort((a, b) => {
      if (a.tipo.toLocaleLowerCase() > b.tipo.toLocaleLowerCase()) return 1;

      if (a.tipo.toLocaleLowerCase() < b.tipo.toLocaleLowerCase()) return -1;

      if (a.tipo.toLocaleLowerCase() == b.tipo.toLocaleLowerCase()) return 0;
    });
    return result;
  }

  /**Retorna un arreglo con los tipos de eventos existentes por Departamento. */
  get lista_tipos_eventos() {
    /**Copia de arreglo de eventos para trabajar dentro de la funcion */
    const eventos = this.eventos;
    /**Pasar a variable Global
     * Guarda los tipos de eventos que estan en la base.
     * Luego se muestran al usuario
     */
    let tipos_eventos: string[] = [];
    if (eventos.length > 0) {
      eventos.forEach((ev) => {
        if (tipos_eventos.indexOf(ev.tipo) == -1) {
          tipos_eventos.push(ev.tipo);
        }
      });
    }
    return tipos_eventos;
  }

  /**Retorna un arreglo con los tipos de eventos existentes por Departamento. */
  get lista_localidades_eventos() {
    /**Copia de arreglo de eventos para trabajar dentro de la funcion */
    const eventos = this.eventos;
    /**Pasar a variable Global
     * Guarda los tipos de eventos que estan en la base.
     * Luego se muestran al usuario
     */
    let localidades_eventos: string[] = [];
    if (eventos.length > 0) {
      eventos.forEach((ev) => {
        if (localidades_eventos.indexOf(ev.localidad) == -1) {
          localidades_eventos.push(ev.localidad);
        }
      });
    }
    return localidades_eventos;
  }

  /**retorna true si se selecciono Distancia como filtro principal */
  get selectdistancia(){
    return localStorage.getItem('distanceActivo') ? true : false;
  }
  
  /**
   *
   * @param tipo Nombre del "tipo" Evento. Usado como criterio de buscanda.
   * @returns Arreglo de Eventos para el "tipo" buscado.
   */
  eventosPorTipo(tipo: string): Eventos[] {
    /**Copia del arreglo de eventos */
    const eventos: Eventos[] = this.eventos;
    let eventos_xtipo: Eventos[] = [];
    if (eventos.length > 0) {
      eventos_xtipo = eventos.filter((ev) => ev.tipo == tipo);
    }
    return eventos_xtipo;
  }

  /**
   *
   * @param tipo Nombre de la "localidad" donde se realiza el Evento.
   *  Es usado como criterio de buscanda.
   * @returns Arreglo de Eventos que se realizaran en esa "localidad".
   */
  eventosPorLocalidad(localidad: string): Eventos[] {
    /**Copia del arreglo de eventos */
    const eventos: Eventos[] = this.eventos;
    let eventos_xlocalidad: Eventos[] = [];
    if (eventos.length > 0) {
      eventos_xlocalidad = eventos.filter((ev) => ev.localidad == localidad);
    }
    return eventos_xlocalidad;
  }
  /** <=<=<=<=========== Metodos Para Filtro de Eventos <=<=<=<===========*/
}
