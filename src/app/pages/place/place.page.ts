import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { PlaceService } from "src/app/services/database/place.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Place } from "src/app/shared/place";
import distance from "@turf/distance";
import { Point } from "src/app/shared/point";

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
})
export class PlacePage {
  constructor(
    private browser: InAppBrowser,
    private placeSvc: PlaceService,
    private geolocationSvc: GeolocationService
  ) {}

  /**Configuración de slider mini galeria */
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  /**Guarda los lugares activos en la subscription del servicio */
  places: Place[] = [];
  /**Subscription activa con los lugares del servicio*/
  sourcePlace: Subscription;
  private distancia$: BehaviorSubject<string> = new BehaviorSubject<string>(
    "vacio"
  );
  // obsDistancia$ = this.distancia$.asObservable();
  distancia: string;
  posicion$: Observable<Point>;
  subscripcionPosition: Subscription;
  distancia_cd: string;

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
  }

  ionViewWillEnter() {
    this.placeSvc.getPlaces();
    this.sourcePlace = this.placeSvc.places.subscribe((res) => {
      this.places = res;

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
                let distFormat: string | number, placeDistance: string | number;
                if (dist >= 1) {
                  distFormat = parseFloat(dist).toFixed(3);
                  placeDistance = "Estás a " + distFormat;
                } else {
                  distFormat = parseFloat(dist).toFixed(2);
                  placeDistance = "Estás a " + distFormat;
                }

                calcDist.distancia = placeDistance;

                this.distancia$.next(placeDistance);
              }
            })
          )
          .subscribe();
      });
    });
  }

  ionViewDidLeave() {
    this.sourcePlace.unsubscribe();
  }
}
