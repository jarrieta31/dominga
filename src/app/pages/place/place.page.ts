import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
} from "@angular/core";
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
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacePage {
  constructor(
    private browser: InAppBrowser,
    private placeSvc: PlaceService,
    private geolocationSvc: GeolocationService,
    private databaseSvc: DatabaseService,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private http: HttpClient //private cd: ChangeDetectorRef
  ) {}

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
  distancia: string | number;
  hora: string | number;
  minuto: string | number;
  posicion$: Observable<Point>;

  currentDepto: String = this.databaseSvc.selectionDepto;

  /**instance del spinner de carga */
  loading: any;
  /**controla cuando descartar el spinner de carga */
  isLoading = false;

  isFilter = false;
  /**captura los datos del formulario de filtros */
  dataForm: string = "";

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });

  distancePlace: MapboxDirections = ""; //Buscador de direcciones para indicar recorrido

  filterPlace() {
    this.dataForm = this.filterForm.value;
    console.log(this.dataForm);
  }

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
  }

  changeFilter() {
    this.isFilter = !this.isFilter;
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
    if (this.databaseSvc.selectionDepto != this.currentDepto) {
      this.currentDepto = this.databaseSvc.selectionDepto;
      this.filterForm.reset();
      this.dataForm = "";
    }

    this.unsubscribe$ = new Subject<void>();
    this.isFilter = false;
    this.placeSvc.getPlaces();

    this.placeSvc.places.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.places = res;
      //this.cd.markForCheck();
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

    timer(1000, 10000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.places.forEach((calcDist) => {
          //Crea el objeto direction para agregarlo al mapa
          // this.distancePlace = new MapboxDirections({
          //   accessToken: environment.mapBoxToken,
          //   unit: "metric",
          //   profile: "mapbox/driving-traffic",
          // });
          // this.distancePlace.setOrigin([
          //   calcDist.ubicacion.lng,
          //   calcDist.ubicacion.lat,
          // ]);
          this.posicion$ = this.geolocationSvc.getPosicionActual$();
          this.posicion$
            .pipe(
              tap((posicion) => {
                // this.distancePlace.setDestination([
                //   posicion.longitud,
                //   posicion.latitud,
                // ]);
                // this.getLocation(posicion.longitud, posicion.latitud)
                //   .pipe(takeUntil(this.unsubscribe$))
                //   .subscribe((dto) => {
                //     console.log("sub4");
                //     this.placeSvc.currentDpto = dto.features[2].text;
                //   });
                if (posicion != null) {
                  //Subscripcion para ver la ruta

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

                      calcDist.distancia = placeDistance;
                      calcDist.hora = String(this.hora + " h");
                      calcDist.minuto = String(this.minuto + " min");
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
        });
        //this.cd.markForCheck();
      });
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
