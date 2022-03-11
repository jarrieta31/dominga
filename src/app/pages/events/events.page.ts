import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { DatabaseService } from "src/app/services/database.service";
import { Subject, Subscription } from "rxjs";
import { VisitEventService } from "src/app/services/database/visit-event.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map, takeUntil } from "rxjs/operators";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { GeolocationService } from "src/app/services/geolocation.service";
import { HttpClient } from "@angular/common/http";

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
  dpto_select: string = null;
  /**captura los datos del formulario de filtros */
  dataform: any = "";
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation: boolean = false;
  isFilterType: boolean = false;
  isFilterDate: boolean = false;
  /**varibles de filtro por fecha */
  fecha_inicio: Date = new Date();
  fecha_fin: Date = new Date(this.fecha_inicio.getDate() + 90);
  /**guardan filtos seleccionados */
  optionLocation: string = null;
  optionType: string = null;
  optionDateStart: string = null;
  optionDateEnd: string = null;
  /**guarda la distancia del usuario a cada lugar en tiempo real */
  distancia: string | number;
  /**cantidad de horas para llegar a cada lugar */
  hora: string | number;
  /**cantidad de minutos para llegar a cada lugar */
  minuto: string | number;
  /**filtro seleccionado distancia*/
  dist: number = null;
  /**chequea si en el array de lugares hay algo para mostrar en pantalla, si no lo hay se muestra msgEmptyPlace */
  checkDistance: boolean = false;
  /**departamente seleccionado actualmente */
  currentDepto: String = this.dbService.selectionDepto;

  /**se guardan los sliders de la pantalla eventos */
  sliderEvents: Slider[] = [];

  filterForm: FormGroup = this.fb.group({
    tipo: ["", Validators.required],
    localidad: ["", Validators.required],
    fecha_fin: ["", Validators.required],
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
    private fb: FormBuilder,
    private geolocationSvc: GeolocationService,
    private http: HttpClient
  ) {}

  /**endpoint de mapbox para calcular distancia entre dos puntos teniendo en cuenta las calles */
  getDistance(
    lngUser: number,
    latUser: number,
    lngPlace: number,
    latPlace: number
  ) {
    return this.http.get(
      "https://api.mapbox.com/directions/v5/mapbox/driving/" +
        lngUser +
        "," +
        latUser +
        ";" +
        lngPlace +
        "," +
        latPlace +
        "?overview=full&geometries=geojson&access_token=pk.eyJ1IjoiY2FzYWRvbWluZ2EiLCJhIjoiY2s3NTlzajFoMDVzZTNlcGduMWh0aml3aSJ9.JcZFoGdIQnz3hSg2p4FGkA"
    );
  }

  anioActual: number = 0;
  customYearValues = [];
  customDayShortNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  monthShortNames = [
    "Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Set, Oct, Nov, Dic",
  ];
  month: number = 0;
  day: string;
  fullDay: string = "";
  month_aux: string = "";

  ionViewWillEnter() {
    this.anioActual = new Date().getFullYear();
    this.month = this.today.getMonth() + 1;
    this.day = this.today.getDate().toString();

    if (this.day.length === 1) {
      this.day = ("0" + this.today.getDate()).toString();
    } else {
      this.day = this.today.getDate().toString();
    }

    if (this.month < 10) {
      this.month_aux = ("0" + (this.today.getMonth() + 1)).toString();
    } else {
      this.month_aux = (this.today.getMonth() + 1).toString();
    }

    this.fullDay = (
      this.anioActual +
      "-" +
      this.month_aux +
      "-" +
      this.day
    ).toString();

    this.customYearValues = [];
    for (let i = 0; i < 3; i++) {
      this.customYearValues.push(this.anioActual);
      this.anioActual = this.anioActual + 1;
    }

    this.unsubscribe$ = new Subject<void>();

    this.dist = parseInt(localStorage.getItem("distanceActivo"));
    this.dpto_select = localStorage.getItem("deptoActivo");

    if (localStorage.getItem("deptoActivo") != this.currentDepto) {
      this.currentDepto = localStorage.getItem("deptoActivo");
      this.filterForm.reset();
      this.dataform = "";
      this.optionLocation = "localidad";
      this.optionDateEnd = "";
      this.optionDateStart = "";
      this.optionType = "tipo";
    }

    this.dbService.getEventos();

    this.sliderSvc.slider
      .pipe(
        map((slider) => slider.filter((s) => s.pantalla === "eventos")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        console.log("este es res", res)
        this.sliderEvents = res;
      });

    this.dbService.eventos
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((eventos) => {
        this.eventos = eventos;
      });

    setTimeout(() => {
      this.geolocationSvc.posicion$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res != null) {
            this.eventos.forEach((calcDist) => {
              this.getDistance(
                res.longitud,
                res.latitud,
                calcDist.ubicacion.lng,
                calcDist.ubicacion.lat
              )
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((res) => {
                  this.distancia = res["routes"]["0"].distance / 1000;

                  this.hora = Math.trunc(res["routes"]["0"].duration / 60 / 60);
                  this.minuto = Math.trunc(
                    (res["routes"]["0"].duration / 60) % 60
                  );

                  let distFormat: string | number, placeDistance: string;
                  if (this.distancia >= 1) {
                    distFormat = parseFloat(String(this.distancia)).toFixed(3);
                    placeDistance = "Estás a " + distFormat;
                  } else {
                    distFormat = parseFloat(String(this.distancia)).toFixed(2);
                    placeDistance = "Estás a " + distFormat;
                  }

                  calcDist.distanciaNumber = this.distancia;
                  calcDist.distancia = placeDistance;
                  calcDist.hora = String(this.hora + " h");
                  calcDist.minuto = String(this.minuto + " min");

                  if (this.dist != null) {
                    if (this.dist >= calcDist.distanciaNumber) {
                      this.checkDistance = true;
                    }
                  } else this.checkDistance = true;
                });
            });
          } else this.checkDistance = true;
        });
    }, 2000);
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.isFilterLocation = false;
    this.isFilterType = false;
    this.isFilterDate = false;
  }

  /**
   * Slide
   */
  slideOpts = {
    initialSlide: 0,
    speed: 2000,
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
    precioUnico: boolean,
    direccion: string
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
        precioUnico: precioUnico,
        direccion: direccion,
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

    if (this.isFilterType) this.isFilterType = false;
    if (this.isFilterDate) this.isFilterDate = false;
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;

    if (this.isFilterLocation) this.isFilterLocation = false;
    if (this.isFilterDate) this.isFilterDate = false;
  }

  changeFilterDate() {
    this.isFilterDate = !this.isFilterDate;

    if (this.isFilterType) this.isFilterType = false;
    if (this.isFilterLocation) this.isFilterLocation = false;
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

    if (this.isFilterLocation) this.isFilterLocation = false;
    if (this.isFilterType) this.isFilterType = false;
    if (this.isFilterDate) this.isFilterDate = false;

    this.optionLocation = this.dataform.localidad;
    this.optionType = this.dataform.tipo;
    this.optionDateStart = this.dataform.fecha_inicio;
    this.optionDateEnd = this.dataform.fecha_fin;

    if (this.dataform.localidad === "") this.optionLocation = "localidad";
    if (this.dataform.tipo === "") this.optionType = "tipo";
  }

  actualizarFechas() {
    this.fecha_inicio = this.filterForm.get("fecha_inicio").value;
    this.fecha_fin = this.filterForm.get("fecha_fin").value;
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
  get selectdistancia() {
    return localStorage.getItem("distanceActivo") ? true : false;
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
