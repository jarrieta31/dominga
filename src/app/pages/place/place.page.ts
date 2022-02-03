import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { PlaceService } from "src/app/services/database/place.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Place } from "src/app/shared/place";
import distance from "@turf/distance";
import { Point } from "src/app/shared/point";
import { timer } from "rxjs";
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
  /**controla cuando descartar el spinner de carga */
  isLoading = false;
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  isFilterType = false;
  /**captura los datos del formulario de filtros */
  dataForm: any = "";
  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  isOpenType: boolean = false;
  /**se guardan los sliders de la pantalla lugares */
  sliderPlace: Slider[] = [];

  dist: number = this.databaseSvc.selectionDistance;
  dep: String = this.databaseSvc.selectionDepto;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  featureDepto: any[] = [];

  filterPlace() {
    this.dataForm = this.filterForm.value;
  }

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isFilterType) {
      this.isFilterType = false;
      this.isOpenType = false;
    }

    if (this.isOpenType) this.isOpenType = false;
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    this.isOpenType = !this.isOpenType;
    if (this.isFilterLocation) {
      this.isFilterLocation = false;
      this.isOpenLocation = false;
    }

    if (this.isOpenLocation) this.isOpenLocation = false;
  }

  changeLocation() {
    this.isOpenLocation = !this.isOpenLocation;
    this.isFilterLocation = !this.isFilterLocation;
    if (this.isOpenType) {
      this.isOpenType = false;
      this.isFilterType = false;
    }
  }

  changeType() {
    this.isOpenType = !this.isOpenType;
    this.isFilterType = !this.isFilterType;
    if (this.isOpenLocation) {
      this.isOpenLocation = false;
      this.isFilterLocation = false;
    }
  }

  getLocation(lng: number, lat: number) {
    return this.http.get(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        lng +
        "," +
        lat +
        ".json?access_token=pk.eyJ1IjoiY2FzYWRvbWluZ2EiLCJhIjoiY2s3NTlzajFoMDVzZTNlcGduMWh0aml3aSJ9.JcZFoGdIQnz3hSg2p4FGkA"
    );
  }

  /**endpoint de mapbox para calcular distancia entra dos puntos teniendo en cuenta las calles */
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
  async show(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: "bubbles",
    });

    this.loading.present().then(() => {
      if (this.isLoading) {
        this.loading.dismiss();
      }
    });
  }

  /**se ejecuta cada vez que se ingresa a la tab */
  ionViewWillEnter() {
    this.dist = this.databaseSvc.selectionDistance;
    this.dep = this.databaseSvc.selectionDepto;

    if (this.databaseSvc.selectionDepto != this.currentDepto) {
      this.currentDepto = this.databaseSvc.selectionDepto;
      this.dataForm = "";
    }

    this.unsubscribe$ = new Subject<void>();
    // this.isFilterLocation = false;
    // this.isFilterType = false;
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
      this.places = [];
      this.places = res;
      /**====================== localidades y categorías activas ==================================== */
      this.location = [];
      this.category = [];
      this.places.forEach((loc) => {
        let isLocation = false;
        let isCategory = false;
        if (this.location.length == 0) {
          this.location.push({ localidad: loc.localidad });
          isLocation = true;
        } else {
          this.location.forEach((locExist) => {
            if (loc.localidad == locExist.localidad) isLocation = true;
          });
        }

        if (this.category.length == 0) {
          this.category.push({ categoria: loc.tipo });
          isCategory = true;
        } else {
          this.category.forEach((catExist) => {
            if (loc.tipo == catExist.categoria) isCategory = true;
          });
        }
        if (!isLocation) this.location.push({ localidad: loc.localidad });
        if (!isCategory) this.category.push({ categoria: loc.tipo });
      });
      /**============================================================================== */

      this.isLoading = true;
    });
    this.show("Cargando lugares...");

    timer(1000, 3000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.posicion$ = this.geolocationSvc.getPosicionActual$();
        this.posicion$
          .pipe(
            tap((posicion) => {
              this.getLocation(posicion.longitud, posicion.latitud)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((dto: any) => {
                  this.featureDepto = [];
                  dto.features.forEach((res: any) => {
                    this.featureDepto.push(res.text);
                  });
                
                  let featureLen = this.featureDepto.length;
                 
                  let currentDepto = this.featureDepto[featureLen - 2];
                  
                  this.placeSvc.currentDpto = currentDepto
                });
              if (posicion != null) {
                //Subscripcion para ver la ruta
                this.places.forEach((calcDist) => {
                  this.getDistance(
                    posicion.longitud,
                    posicion.latitud,
                    calcDist.ubicacion.lng,
                    calcDist.ubicacion.lat
                  )
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((res) => {
                      this.distancia = res["routes"]["0"].distance / 1000;

                      this.hora = Math.trunc(
                        res["routes"]["0"].duration / 60 / 60
                      );
                      this.minuto = Math.trunc(
                        (res["routes"]["0"].duration / 60) % 60
                      );

                      let distFormat: string | number, placeDistance: string;
                      if (this.distancia >= 1) {
                        distFormat = parseFloat(String(this.distancia)).toFixed(
                          3
                        );
                        placeDistance = "Estás a " + distFormat;
                      } else {
                        distFormat = parseFloat(String(this.distancia)).toFixed(
                          2
                        );
                        placeDistance = "Estás a " + distFormat;
                      }

                      calcDist.distanciaNumber = this.distancia;
                      calcDist.distancia = placeDistance;
                      calcDist.hora = String(this.hora + " h");
                      calcDist.minuto = String(this.minuto + " min");
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
              }
            })
          )
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
        // this.places.forEach((calcDist) => {

        // });
      });
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /**Contador de visitas de Lugares */
  sumaVisitaLugar(lugar_id: string) {
    this.visitPlaceSvc.contadorVistasPlace(lugar_id);
  }
}
