import { Component } from "@angular/core";
import { DondeDormir } from "../../shared/donde-dormir";
import { LoadingController } from "@ionic/angular";
import { WhereSleepService } from "src/app/services/database/where-sleep.service";
import { forkJoin, of, Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { States } from "src/app/shared/enum/states.enum";
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from "src/app/services/geolocation.service";
import { DatabaseService } from "src/app/services/database.service";
import { Point } from "src/app/shared/point";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-where-sleep",
  templateUrl: "./where-sleep.page.html",
  styleUrls: ["./where-sleep.page.scss"],
})
export class WhereSleepPage {
  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;
  /**chequea si en el array de lugares hay algo para mostrar en pantalla, si no lo hay se muestra msgEmptyPlace */
  checkDistance: States = States.DEFAULT;
  /**filtro seleccionado, distancia o departamento */
  dist: number = null;
  dep: string = null;
  /**guarda la distancia del usuario a cada lugar en tiempo real */
  distancia: string | number;
  /**cantidad de horas para llegar a cada lugar */
  hora: string | number;
  /**cantidad de minutos para llegar a cada lugar */
  minuto: string | number;
  /**control la apertura de filtros */
  isFilterLocation: boolean = false;
  /**guardan filtos seleccionados */
  optionLocation: String = null;
  /**departamente seleccionado actualmente */
  currentDepto: String = this.databaseSvc.selectionDepto;

  sleep: DondeDormir[] = [];
  loading: any;
  textoBuscar = "";

  locationActive: any[] = [];

  /**captura los datos del formulario de filtros */
  dataForm: any = "";

  emptyData: boolean = false;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  slideOpts = {
    initialSlide: 0,
    speed: 2000,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**se guardan los sliders de la pantalla donde_comer */
  sliderSleep: Slider[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private sleepSvc: WhereSleepService,
    private fb: FormBuilder,
    private sliderSvc: SlidesService,
    private geolocationSvc: GeolocationService,
    private http: HttpClient,
    private databaseSvc: DatabaseService
  ) {}

  async show(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: "bubbles",
    });

    this.loading.present().then(() => {
      this.loading.dismiss();
    });
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  filterSleep() {
    this.dataForm = this.filterForm.value;
    if (this.isFilterLocation) this.isFilterLocation = false;
    this.optionLocation = this.dataForm.localidad;
    if (this.dataForm.localidad === "") this.optionLocation = "localidad";
  }

  changeFilterSleep() {
    this.isFilterLocation = !this.isFilterLocation;
  }

  get selectdistancia() {
    return localStorage.getItem("distanceActivo") ? true : false;
  }

  getLocation(lng: number, lat: number) {
    return this.http
      .get<any>(
        `${environment.urlMopboxDepto}${lng},${lat}.json?access_token=${environment.mapBoxToken}`
      )
      .pipe(
        map((depto) => depto.features[depto.features.length - 2].text),
        takeUntil(this.unsubscribe$)
      );
  }

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

  /** =====>=>=>=> Metodos Filtro localidad <============== */
  /** Devuelve una lista de localidades */
  get localidades() {
    const wsleep = this.sleep;
    let localidades: string[] = [];
    if (wsleep.length > 0) {
      wsleep.forEach((we) => {
        if (localidades.indexOf(we.localidad) == -1) {
          localidades.push(we.localidad);
        }
      });
    }
    return localidades;
  }

  ionViewWillEnter() {
    if (
      localStorage.getItem("deptoActivo") != undefined &&
      localStorage.getItem("deptoActivo") != null
    ) {
      this.dist = null;
      this.dep = localStorage.getItem("deptoActivo");
    } else if (
      localStorage.getItem("distanceActivo") != undefined &&
      localStorage.getItem("distanceActivo") != null
    ) {
      this.dep = null;
      this.dist = parseInt(localStorage.getItem("distanceActivo"));
    }

    if (localStorage.getItem("deptoActivo") != this.currentDepto) {
      this.currentDepto = localStorage.getItem("deptoActivo");
      this.filterForm.reset();
      this.dataForm = "";
      this.optionLocation = "localidad";
    }

    this.unsubscribe$ = new Subject<void>();

    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(
        map((slider) => slider.filter((s) => s.pantalla === "donde_dormir")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.sliderSleep = res;
      });

    /******** RXJS PARA TRAER LUGARES CON INFO COMPLETA ************************************/
    let posDep = this.geolocationSvc.posicion$.pipe(
      switchMap((pos: Point) => {
        return forkJoin(of(pos), this.getLocation(pos.longitud, pos.latitud));
      }),
      takeUntil(this.unsubscribe$)
    );

    let dto = posDep.pipe(
      switchMap((res) => this.sleepSvc.getDondeDormir(res[1])),
      takeUntil(this.unsubscribe$)
    );

    if (this.geolocationSvc.posicion$.value !== null) {
      dto
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe((res) => {
          this.sleep = res;
          this.emptyData = this.sleepSvc.noData;
        });
    } else {
      this.sleepSvc.getDondeDormir(this.dep).subscribe((res) => {
        this.sleep = res;
        this.emptyData = this.sleepSvc.noData;
      });
    }
    /************************************************************************************ */
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.isFilterLocation = false;
  }
}
