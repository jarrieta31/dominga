import { Component } from "@angular/core";
import { DondeComer } from "../../shared/donde-comer";
import { WhereEatService } from "src/app/services/database/where-eat.service";
import { LoadingController } from "@ionic/angular";
import { forkJoin, of, Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from "src/app/services/geolocation.service";
import { DatabaseService } from "src/app/services/database.service";
import { Point } from "src/app/shared/point";
import { environment } from "src/environments/environment";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-where-eat",
  templateUrl: "./where-eat.page.html",
  styleUrls: ["./where-eat.page.scss"],
})
export class WhereEatPage {
  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  /**captura los datos del formulario de filtros */
  dataForm: any = "";

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
  });

  loading: any;

  locationActive: any[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 2000,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /** =====>=>=>=> Variables Filtro localidad <============== */
  /**guarda los lugares activos en la subscription del servicio */
  eat: DondeComer[] = [];
  /**guarda las localidades con lugares publicados */
  location: any[] = [];
  /**controla cuando descartar el spinner de carga */
  isLoading = false;
  /**se guardan los sliders de la pantalla donde_comer */
  sliderEat: Slider[] = [];
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
  optionLocation: string = null;
  /**departamente seleccionado actualmente */
  currentDepto: string = this.databaseSvc.selectionDepto;
  /**url load  */
  preloadImage: string = "/assets/load.gif";
  /**url load  */
  preloadImage_list: string = "/assets/load_cuadrada.gif";
  /** clase de preload list */
  preloadClase: string = "img-comer";

  constructor(
    private loadingCtrl: LoadingController,
    private eatSvc: WhereEatService,
    private fb: FormBuilder,
    private sliderSvc: SlidesService,
    private http: HttpClient,
    private geolocationSvc: GeolocationService,
    private databaseSvc: DatabaseService,
    private browser: InAppBrowser,
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

  /** =====>=>=>=> Metodos Filtro localidad <============== */
  /** Devuelve una lista de localidades */
  get localidades() {
    const weat = this.eat;
    let localidades: string[] = [];
    if (weat.length > 0) {
      weat.forEach((we) => {
        if (localidades.indexOf(we.localidad) == -1) {
          localidades.push(we.localidad);
        }
      });
    }

    localidades = localidades.sort();
    return localidades;
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

  filterEat() {
    this.dataForm = this.filterForm.value;
    if (this.isFilterLocation) this.isFilterLocation = false;
    this.optionLocation = this.dataForm.localidad;
    if (this.dataForm.localidad === "") this.optionLocation = "localidad";
  }

  changeFilterEat() {
    this.isFilterLocation = !this.isFilterLocation;
  }

  openInstagram(url: string) {
    this.browser.create(url, "_system");
  }

  openWhatsapp(url: string) {
    this.browser.create(url, "_system");
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
        map((slider) => slider.filter((s) => s.pantalla === "donde_comer")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.sliderEat = res;
      });

    /******** RXJS PARA TRAER LUGARES CON INFO COMPLETA ************************************/
    let posDep = this.geolocationSvc.posicion$.pipe(
      switchMap((pos: Point) => {
        return forkJoin(of(pos), this.getLocation(pos.longitud, pos.latitud));
      }),
      takeUntil(this.unsubscribe$)
    );

    let dto = posDep.pipe(
      switchMap((res) => this.eatSvc.getDondeComer(res[1])),
      takeUntil(this.unsubscribe$)
    );

    if (this.geolocationSvc.posicion$.value !== null) {
      dto.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
        this.eat = [];
        this.eat = res;
      });
    } else {
      this.eatSvc.getDondeComer(this.dep).subscribe((res) => {
        this.eat = [];
        this.eat = res;
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
