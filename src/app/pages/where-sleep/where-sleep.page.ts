import { Component } from "@angular/core";
import { DondeDormir } from "../../shared/donde-dormir";
import { LoadingController } from "@ionic/angular";
import { WhereSleepService } from "src/app/services/database/where-sleep.service";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { takeUntil } from "rxjs/operators";
import { States } from "src/app/shared/enum/states.enum";
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from "src/app/services/geolocation.service";

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
  dep: String = null;
  /**guarda la distancia del usuario a cada lugar en tiempo real */
  distancia: string | number;
  /**cantidad de horas para llegar a cada lugar */
  hora: string | number;
  /**cantidad de minutos para llegar a cada lugar */
  minuto: string | number;

  sleep: DondeDormir[] = [];
  loading: any;
  textoBuscar = "";

  locationActive: any[] = [];

  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  slideOpts = {
    initialSlide: 0,
    speed: 600,
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
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    this.isOpenLocation = !this.isOpenLocation;
  }

  changeLocation() {
    this.isOpenLocation = !this.isOpenLocation;
    // if (this.isOpenLocation == false) this.isFilterLocation = false;
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

    this.unsubscribe$ = new Subject<void>();

    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "donde_comer") this.sliderSleep.push(item);
        });
      });
    this.sleepSvc.getDondeDormir();
    this.sleepSvc.donde_dormir
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.sleep = res;

        this.locationActive = [];

        this.sleep.forEach((loc) => {
          let isLocation: boolean = false;

          if (this.locationActive.length == 0) {
            this.locationActive.push({ localidad: loc.localidad });
            isLocation = true;
          } else {
            this.locationActive.forEach((locExist) => {
              if (loc.localidad == locExist.localidad) isLocation = true;
            });
          }
          if (!isLocation)
            this.locationActive.push({ localidad: loc.localidad });
        });
      });
    this.show("Cargando lugares...");

    setTimeout(() => {
      if (this.dep != null) this.checkDistance = States.OK;

      this.geolocationSvc.posicion$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res != null) {
            this.sleep.forEach((calcDist) => {
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
      console.log(this.sleep);
    }, 2000);
  }

  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
