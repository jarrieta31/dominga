import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { PlaceService } from "src/app/services/database/place.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Place } from "src/app/shared/place";
//import distance from "@turf/distance";
import { Point } from "src/app/shared/point";
import { LoadingController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { DatabaseService } from "src/app/services/database.service";
import { VisitPlaceService } from "src/app/services/database/visit-place.service";
import { Slider } from "src/app/shared/slider";
import { SlidesService } from "src/app/services/database/slides.service";

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
})
export class PlacePage {
  constructor(
    private geolocationSvc: GeolocationService,
    private visitPlaceSvc: VisitPlaceService,
    private loadingCtrl: LoadingController,
    private databaseSvc: DatabaseService,
    private placeSvc: PlaceService,
    private browser: InAppBrowser,
    private http: HttpClient,
    private fb: FormBuilder,
    private sliderSvc: SlidesService
  ) {}

  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  /**Configuración de slider mini galeria */
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**guarda los lugares activos en la subscription del servicio */
  places: Place[] = [];
  /**guarda las localidades con lugares publicados */
  location: any[] = [];
  /**guarda los tipos de lugares */
  category: any[] = [];
  /**guarda la distancia del usuario a cada lugar en tiempo real */
  distancia: string | number;
  /**cantidad de horas para llegar a cada lugar */
  hora: string | number;
  /**cantidad de minutos para llegar a cada lugar */
  minuto: string | number;
  /**guarda la posición actual del usuario */
  posicion$: Observable<Point>;
  /**departamente seleccionado actualmente */
  currentDepto: String = this.databaseSvc.selectionDepto;
  /**instance del spinner de carga */
  loading: any;
  /**captura los datos del formulario de filtros */
  dataForm: any = "";
  /**se guardan los sliders de la pantalla lugares */
  sliderPlace: Slider[] = [];
  /**filtro seleccionado, distancia o departamento */
  dist: number = null;
  dep: String = null;
  /**chequea si en el array de lugares hay algo para mostrar en pantalla, si no lo hay se muestra msgEmptyPlace */
  checkDistance: boolean = false;
  /**mensaje para mostrar en pantalla si no hay lugares para mostrar */
  msgEmptyPlace: String = null;
  /**formulario que obtiene datos para filtrar */
  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });
  /**control la apertura de filtros */
  isFilterLocation: boolean = false;
  isFilterType: boolean = false;
  /**guardan filtos seleccionados */
  optionLocation: String = null;
  optionType: String = null;
  /**url load  */
  preloadImage: String = "/assets/load.gif"

  filterPlace() {
    this.dataForm = this.filterForm.value;

    if (this.isFilterLocation) this.isFilterLocation = false;
    if (this.isFilterType) this.isFilterType = false;

    this.optionLocation = this.dataForm.localidad;
    this.optionType = this.dataForm.tipo;

    if (this.dataForm.localidad === "") this.optionLocation = "localidad";
    if (this.dataForm.tipo === "") this.optionType = "tipo";
  }

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    if (this.isFilterType) this.isFilterType = false;
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    if (this.isFilterLocation) this.isFilterLocation = false;
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

  /**
   * Spinner de carga
   * @param message - mensaje de spinner
   */
  // async show(message: string) {
  //   this.loading = await this.loadingCtrl.create({
  //     message,
  //     spinner: "bubbles",
  //   });

  //   this.loading.present();
  // }

  // loadImage() {
  //   this.loading.dismiss();
  // }

  /** Devuelve una lista de localidades */
  get localidades() {
    const placeLoc = this.places;
    let localidades: string[] = [];
    if (placeLoc.length > 0) {
      placeLoc.forEach((pl) => {
        if (localidades.indexOf(pl.localidad) == -1) {
          localidades.push(pl.localidad);
        }
      });
    }
    return localidades;
  }

  /** Devuelve una lista de tipos */
  get tipos() {
    const placeTipo = this.places;
    let tipos: string[] = [];
    if (placeTipo.length > 0) {
      placeTipo.forEach((pl) => {
        if (tipos.indexOf(pl.tipo) == -1) {
          tipos.push(pl.tipo);
        }
      });
    }
    return tipos;
  }

  /**retorna true si se selecciono Distancia como filtro principal */
  get selectdistancia() {
    return localStorage.getItem("distanceActivo") ? true : false;
  }

  /**se ejecuta cada vez que se ingresa a la tab */
  ionViewWillEnter() {
    if (
      localStorage.getItem("deptoActivo") != undefined &&
      localStorage.getItem("deptoActivo") != null
    ) {
      this.dist = null;
      this.dep = localStorage.getItem("deptoActivo");
      this.msgEmptyPlace =
        "No hay lugares para mostrar en el departamento de " + this.dep;
    } else if (
      localStorage.getItem("distanceActivo") != undefined &&
      localStorage.getItem("distanceActivo") != null
    ) {
      this.dep = null;
      this.dist = parseInt(localStorage.getItem("distanceActivo"));
      this.msgEmptyPlace =
        "No hay lugares para mostrar en el rango de " + this.dist + " km";
    }

    // this.show("Cargando lugares...");

    if (localStorage.getItem("deptoActivo") != this.currentDepto) {
      this.currentDepto = localStorage.getItem("deptoActivo");
      this.filterForm.reset();
      this.dataForm = "";
      this.optionLocation = "localidad";
      this.optionType = "tipo";
    }

    this.unsubscribe$ = new Subject<void>();
    this.placeSvc.getPlaces();
    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "lugares") this.sliderPlace.push(item);
        });
      });

    this.placeSvc.places.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.places = res;
    });

    setTimeout(() => {
      // if (this.places.length == 0) this.loading.dismiss();
      // else if (this.dep == null && this.checkDistance == false)
      //   this.loading.dismiss();

      this.geolocationSvc.posicion$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res != null) {
            this.places.forEach((calcDist) => {
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

            // this.distancePlace.on("route", (e: { route: any }) => {
            //   let routes = e.route;
            //   //console.log(routes)
            //   this.distancia = parseFloat(
            //     routes.map((r: { distance: number }) => r.distance / 1000)
            //   );
            //   this.hora = parseFloat(
            //     routes.map((r: { duration: number }) =>
            //       Math.trunc(r.duration / 60 / 60)
            //     )
            //   );
            //   this.minuto = parseFloat(
            //     routes.map((r: { duration: number }) =>
            //       Math.trunc((r.duration / 60) % 60)
            //     )
            //   );

            //   console.log(calcDist.distancia);
            // });
            // let options = { units: "kilometers" };
            // let dist = distance(
            //   [calcDist.ubicacion.lng, calcDist.ubicacion.lat],
            //   [posicion.longitud, posicion.latitud],
            //   options
            // );
          } else this.checkDistance = true;
        });
    }, 2000);
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.isFilterLocation = false;
    this.isFilterType = false;
    this.checkDistance = false;
  }

  /**Contador de visitas de Lugares */
  sumaVisitaLugar(lugar_id: string) {
    this.visitPlaceSvc.contadorVistasPlace(lugar_id);
  }
}
