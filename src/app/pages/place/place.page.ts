import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { PlaceService } from "src/app/services/database/place.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Place } from "src/app/shared/place";
import distance from "@turf/distance";
import { Point } from "src/app/shared/point";
import { timer } from "rxjs";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
})
export class PlacePage {
  constructor(
    private browser: InAppBrowser,
    private placeSvc: PlaceService,
    private geolocationSvc: GeolocationService,
    private loadingCtrl: LoadingController
  ) {}

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
  /**subscription activa con los lugares del servicio*/
  sourcePlace: Subscription;
  distancia: string;
  posicion$: Observable<Point>;
  subscripcionPosition: Subscription;

  timerSubs: Subscription;

  timer$ = timer(0, 30000);

  /**instance del spinner de carga */
  loading: any;
  /**controla cuando descartar el spinner de carga */
  isLoading = false;

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
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
    this.show("Cargando lugares...");
    this.placeSvc.getPlaces();
    this.sourcePlace = this.placeSvc.places.subscribe((res) => {
      this.places = res;
      this.isLoading = true;
      this.timerSubs = this.timer$.subscribe(() => {
        this.places.forEach((calcDist) => {
          this.posicion$ = this.geolocationSvc.getPosicionActual$();
          this.subscripcionPosition = this.posicion$
            .pipe(
              tap((posicion) => {
                if (posicion != null) {
                  let options = { units: "kilometers" };
                  let dist = distance(
                    [calcDist.ubicacion.lng, calcDist.ubicacion.lat],
                    [posicion.longitud, posicion.latitud],
                    options
                  );
                  let distFormat: string | number,
                    placeDistance: string | number;
                  if (dist >= 1) {
                    distFormat = parseFloat(dist).toFixed(3);
                    placeDistance = "Estás a " + distFormat;
                  } else {
                    distFormat = parseFloat(dist).toFixed(2);
                    placeDistance = "Estás a " + distFormat;
                  }

                  calcDist.distancia = placeDistance;
                }
              })
            )
            .subscribe();
        });
      });
    });
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.sourcePlace.unsubscribe();
    this.timerSubs.unsubscribe();
    if(this.places.length > 0) {
      this.subscripcionPosition.unsubscribe();
    }
  }
}
