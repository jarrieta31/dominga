import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { VisitPlaceService } from "src/app/services/database/visit-place.service";
import { Place } from "../../shared/place";

import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { GeolocationService } from "../../services/geolocation.service";
import { Point } from "../../shared/point";
import distance from "@turf/distance";
import { NetworkService } from "../../services/network.service";
import { LoadingController } from "@ionic/angular";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  subsciptionNetwork: any; //Subscripcion para ver el estado de la conexión a internet
  isConnected = false; //verifica el estado de la conexion a internet
  items: Place[];
  items$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
  obsItems$ = this.items$.asObservable();
  posicion$: Observable<Point>;
  //casaDominga = { "longitud": "-56.7145", "latitud": "-34.340007" };
  subscripcionPosition: Subscription;
  backButtonSubscription: any;
  dataReturned: any;
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  lugarCercano$: Observable<Place>;
  //subscrictionLugarCercano: Subscription;
  //subscrictionUser: any;
  idUser: string;

  loading: any;

  constructor(
    private database: DatabaseService,
    private vpService : VisitPlaceService,
    private geolocationService: GeolocationService,
    private networkService: NetworkService,
    private loadingCtrl: LoadingController,
    private browser: InAppBrowser,
  ) {
    this.geolocationService.iniciarSubscriptionClock();
    this.geolocationService.iniciarSubscriptionMatch();
    this.posicion$ = this.geolocationService.getPosicionActual$();
  }

  su = this.database
    .getPlaces()
    .snapshotChanges()
    .subscribe((data) => {
      this.items = [];
      data.forEach((item) => {
        let a = item.payload.toJSON();
        a["$key"] = item.key;
        this.items.push(a as Place);
      });
      // Agrega las distancias calculadas desde casa dominga al array de lugares
      this.items.forEach((place) => {
        let options = { units: "kilometers" };
        let dist = distance(
          [place.ubicacion.lng, place.ubicacion.lat],
          [environment.casaDominga.longitud, environment.casaDominga.latitud],
          options
        );
        let distFormat;
        if (dist > 1) {
          distFormat = parseFloat(dist).toFixed(3);
          place.distancia = "Desde C. Dominga " + distFormat;
        } else {
          distFormat = parseFloat(dist).toFixed(2);
          place.distancia = "Desde C. Dominga " + distFormat;
        }
      });
      // Actualiza el observable de lugares con toda la información
      this.items$.next(this.items);
      this.subscripcionPosition = this.posicion$
        .pipe(
          tap((posicion) => {
            if (posicion != null) {
              this.items.forEach((place) => {
                console.log('posicion actual', posicion.latitud)
                let options = { units: "kilometers" };
                let dist = distance(
                  [place.ubicacion.lng, place.ubicacion.lat],
                  [posicion.longitud, posicion.latitud],
                  options
                );
                let distFormat;
                if (dist > 1) {
                  distFormat = parseFloat(dist).toFixed(3);
                  place.distancia = "Estás a " + distFormat;
                } else {
                  distFormat = parseFloat(dist).toFixed(2);
                  place.distancia = "Estás a " + distFormat;
                }
              });
              // Actualiza el observable de lugares con toda la información
              this.items$.next(this.items);
            }
          })
        )
        .subscribe();
    });

  ngOnInit() {
    $(document).ready(function () {
      var total = $(window).height();
      var height = document.getElementById("alto");
      //var menu = $(".menu").outerHeight(true);

      var altoSlider = height.clientWidth;
      altoSlider = altoSlider / 1.7 + 5 + 56;
      total = total - altoSlider;

      $(".cards").height(total);
    });

    //Chequea el estado de la conexion a internet
    this.subsciptionNetwork = this.networkService
      .getNetworkStatus()
      .subscribe((connected: boolean) => {
        this.isConnected = connected;
        if (!this.isConnected) {
          //alert('Por favor enciende tu conexión a Internet');
        }
      });

    this.show("Cargando datos...");
    //obtiene
    this.lugarCercano$ = this.geolocationService.getLugarCercano();
  }

  ngOnDestroy(): void {
    this.subsciptionNetwork.unsubscribe();
    this.subscripcionPosition.unsubscribe();
    //this.backButtonSubscription.unsubscribe();
    //this.subscrictionLugarCercano.unsubscribe();
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
      this.su;
      this.loading.dismiss();
    });
  }

  /**
   * Redirreción desde la imagen de Casa Dominga del home a la información del lugar
   */
  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

    sumaVisitaLugar(lugar_id : string ){
      this.vpService.contadorVistasPlace( lugar_id )
  }
}


 