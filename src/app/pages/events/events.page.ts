import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { FilterEventPage } from "../filter-event/filter-event.page";
import { DatabaseService } from "src/app/services/database.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { VisitEventService } from "src/app/services/database/visit-event.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventModalComponent } from "../event-modal/event-modal.component";

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
  /**captura los datos del formulario de filtros */
  dataform : string = '';
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  isFilterType = false;
  isFilterDate = false;
   /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  isOpenType: boolean = false;
  isOpenDate: boolean = false;

  filterForm: FormGroup = this.fb.group({
    localidad    : ["", Validators.required],
    tipo         : ["", Validators.required],
    fecha_inicio : ["", Validators.required],
    fecha_fin    : ["", Validators.required],
    // moneda   : ["", Validators.required],
    precio       : [ , Validators.required],
  });

  isFilter: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private dbService: DatabaseService,
    private veService: VisitEventService, //Servicio contador de visitas eventos.
    private fb       : FormBuilder,
  ) {}

  ionViewWillEnter(){
    this.eventosSuscription = this.dbService
      .getObservable()
      .subscribe((eventos) => (this.eventos = eventos));
    

    if(this.eventos.length > 0){
    
      if(this.eventos[0].departamento != this.dbService.selectionDepto){
        this.dbService.getEventos();
      }    
    }else{ this.dbService.getEventos(); }
  /**Se suscribe al array de eventos, si se genera cambios al estar en la pantalla
     * se van a actulizar
     */

      /** */
    this.dbService.getEventsLocal();
    /** Actualizo el dpto seleccionado */
    this.dpto_select = this.dbService.selectionDepto;

    /** ======>>> Pruebas <<<======= */

  
    /** ===========>>>><<<<========= */
    
  }


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
  if (this.isFilterType) {
    this.isFilterType = false;
    this.isOpenType = false;
  }
}

changeFilterType() {
  this.isFilterType = !this.isFilterType;
  this.isOpenType = !this.isOpenType;
  if (this.isFilterLocation) {
    this.isFilterLocation = false;
    this.isOpenLocation = false;
  }
}

changeFilterDate(){
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
  if (this.isOpenType) {
    this.isOpenType = false;
  }
}

changeType() {
  this.isOpenType = !this.isOpenType;
  if (this.isOpenLocation) {
    this.isOpenLocation = false;
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
  tipoEventoGuradado( tipoEventos: string[], evento: string ): boolean {
    let evento_save : boolean = false;
    tipoEventos.forEach(ev => {
      if( ev == evento ) evento_save = true;
    })
    return evento_save;
  }

        
  filterEvento(){
    this.dataform = this.filterForm.value
  }

  /**Ordeno los eventos alfabeticamente por el "Tipo"
   *  0 : son iguales
   *  1 : antes
   * -1 : despues
   */
  get eventos_ordenados_asc_xlocalidad(): Eventos[]{
    let result: Eventos[] = [];
    const eventos = this.eventos;
    result = eventos.sort((a, b) => {
      if(a.tipo.toLocaleLowerCase() > b.tipo.toLocaleLowerCase()) return 1;

      if(a.tipo.toLocaleLowerCase() < b.tipo.toLocaleLowerCase()) return -1;

      if(a.tipo.toLocaleLowerCase() == b.tipo.toLocaleLowerCase()) return 0;
    })
    return result;
  }

  /**Retorna un arreglo con los tipos de eventos existentes por Departamento. */
  get lista_tipos_eventos(){
    /**Copia de arreglo de eventos para trabajar dentro de la funcion */
    const eventos = this.eventos;
    /**Pasar a variable Global
     * Guarda los tipos de eventos que estan en la base.
     * Luego se muestran al usuario
     */
    let tipos_eventos : string[] = [];
    if(eventos.length > 0){
      eventos.forEach((ev) => {
        if( tipos_eventos.indexOf(ev.tipo) == -1 ){
          tipos_eventos.push( ev.tipo );
        }
      })
    }
    return tipos_eventos;
  }
  
  /**Retorna un arreglo con los tipos de eventos existentes por Departamento. */
  get lista_localidades_eventos(){
    /**Copia de arreglo de eventos para trabajar dentro de la funcion */
    const eventos = this.eventos;
    /**Pasar a variable Global
     * Guarda los tipos de eventos que estan en la base.
     * Luego se muestran al usuario
     */
    let localidades_eventos : string[] = [];
    if(eventos.length > 0){
      eventos.forEach((ev) => {
        if( localidades_eventos.indexOf(ev.localidad) == -1 ){
          localidades_eventos.push( ev.localidad );
        }
      })
    }
    return localidades_eventos;
  }



  /**
   * 
   * @param tipo Nombre del "tipo" Evento. Usado como criterio de buscanda.
   * @returns Arreglo de Eventos para el "tipo" buscado.
   */
  eventosPorTipo( tipo: string ): Eventos[]{
    /**Copia del arreglo de eventos */
    const eventos : Eventos[] = this.eventos;
    let eventos_xtipo : Eventos[] = [];
    if (eventos.length > 0) {
      eventos_xtipo = eventos.filter(ev => ev.tipo == tipo);
    }
    return eventos_xtipo;
  }

    /**
   * 
   * @param tipo Nombre de la "localidad" donde se realiza el Evento. 
   *  Es usado como criterio de buscanda.
   * @returns Arreglo de Eventos que se realizaran en esa "localidad".
   */
  eventosPorLocalidad( localidad: string ): Eventos[]{
    /**Copia del arreglo de eventos */
    const eventos : Eventos[] = this.eventos;
    let eventos_xlocalidad : Eventos[] = [];
    if (eventos.length > 0) {
      eventos_xlocalidad = eventos.filter(ev => ev.localidad == localidad);
    }
    return eventos_xlocalidad;
  }

  async modalDate( event ){
    console.log(event );
    
    const modal = await this.modalCtrl.create({

      component: EventModalComponent,
      componentProps: {

        nombre: 'ramon',
      }
    })
    await modal.present();

    const { data } = await modal.onDidDismiss()
    console.log(
      data 
    );
    
  }
  /** <=<=<=<=========== Metodos Para Filtro de Eventos <=<=<=<===========*/  

}
