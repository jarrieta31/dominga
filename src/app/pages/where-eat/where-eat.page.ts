import { Component } from "@angular/core";
import { DondeComer } from "../../shared/donde-comer";
import { WhereEatService } from "src/app/services/database/where-eat.service";
import { LoadingController } from "@ionic/angular";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map, takeUntil } from "rxjs/operators";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from "src/app/services/geolocation.service";
import { States } from "src/app/shared/enum/states.enum";
import { DatabaseService } from "src/app/services/database.service";

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
  dep: String = null;
  /**chequea si en el array de lugares hay algo para mostrar en pantalla, si no lo hay se muestra msgEmptyPlace */
  checkDistance: States = States.DEFAULT;
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

  constructor(
    private loadingCtrl: LoadingController,
    private afs: WhereEatService,
    private fb: FormBuilder,
    private sliderSvc: SlidesService,
    private http: HttpClient,
    private geolocationSvc: GeolocationService,
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
    return localidades;
  }

  get selectdistancia() {
    return localStorage.getItem("distanceActivo") ? true : false;
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

  ionViewWillEnter() {
    this.checkDistance = States.DEFAULT;

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

    this.afs.getDondeComer();
    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(
        map((slider) => slider.filter((s) => s.pantalla === "donde_comer")),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.sliderEat = res;
      });

    this.afs.donde_comer.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.eat = res;
      this.locationActive = [];
      this.eat.forEach((loc) => {
        let isLocation = false;
        if (this.locationActive.length == 0) {
          this.locationActive.push({ localidad: loc.localidad });
          isLocation = true;
        } else {
          this.locationActive.forEach((locExist) => {
            if (loc.localidad == locExist.localidad) isLocation = true;
          });
        }
        if (!isLocation) this.locationActive.push({ localidad: loc.localidad });
      });
    });

    setTimeout(() => {
      if (this.dep != null) this.checkDistance = States.OK;

      this.geolocationSvc.posicion$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res != null) {
            this.eat.forEach((calcDist) => {
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
                    placeDistance = "A " + distFormat;
                  } else {
                    distFormat = parseFloat(String(this.distancia)).toFixed(2);
                    placeDistance = "A " + distFormat;
                  }

                  calcDist.distanciaNumber = this.distancia;
                  calcDist.distancia = placeDistance;
                  calcDist.hora = String(this.hora + " h");
                  calcDist.minuto = String(this.minuto + " min");

                  if (this.dist != null) {
                    if (this.dist >= calcDist.distanciaNumber) {
                      calcDist.mostrar = true;
                      this.checkDistance = States.FOUND;
                    } else calcDist.mostrar = false;
                  }
                });
            });
          }
        });
    }, 2000);
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.isFilterLocation = false;
  }
}
