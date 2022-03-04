import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Subject, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeolocationService } from "./services/geolocation.service";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  showSplash = true;
  modo: boolean;
  dyslexic: boolean;

  gps: any = null;

  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geolocationSvc: GeolocationService,
    private androidPermissions:AndroidPermissions,
    private locationAccuracy:LocationAccuracy,
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.unsubscribe$ = new Subject<void>();
    this.geolocationSvc.posicion$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      console.log(res);
      this.gps = res;
    });

//    this.geolocationSvc.checkGPSPermission();
//    this.geolocationSvc.iniciarSubscriptionClock();

/*    setTimeout(() => {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }, 5000)
*/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkGPSPermission();
      timer(3000).subscribe(() => (this.showSplash = false));
      this.checkDarkMode();
      this.modeDyslexic();
    });
  }

  checkDarkMode() {
    if (localStorage.getItem("modoOscuro") == "true") {
      try {
        document.body.classList.toggle("dark");
      } catch (error) {
        console.log(error);
      }
    }
  }

  modeDyslexic() {
    if (localStorage.getItem("dyslexic") == "true") {
      try {
        document.body.classList.toggle("dyslexic");
      } catch (error) {
        console.log(error);
      }
    }
  }


    //Compruebe si la aplicación tiene permiso de acceso GPS
    checkGPSPermission() {
        return this.androidPermissions
            .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            .then(
                (result) => {
                    if (result.hasPermission) {
                        //Si tiene permiso, muestre el diálogo 'Activar GPS'
                        this.geolocationSvc.gps = true;
                        this.askToTurnOnGPS();
                    } else {
                        //Si no tiene permiso pida permiso
                        this.requestGPSPermission();
                    }
                },
                (err) => {
                    console.log("Error checkGPS: ", err);
                }
            );
    }

    //Pide los permisos para el GPS julio
    async requestGPSPermission() {
        return await this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                console.log("canRequest", canRequest);
            } else {
                //Mostrar el diálogo 'Solicitud de permiso de GPS'
                this.androidPermissions.requestPermission( this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ).then(
                         // método de llamada para encender el GPS
                        () => { this.askToTurnOnGPS(); },
                        //Mostrar alerta si el usuario hace clic en "No, gracias"
                        (error) => {console.log("requestPermission. Error al solicitar permisos de ubicación ",error); }
                    );
            }
        });
    }

    async askToTurnOnGPS() {
        return await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then( 
                () => {
                  
                  this.geolocationSvc.gps = true; 
                }, // Cuando el GPS se activa hace la llamada para obtener coordenadas de ubicación precisas
                (error) => { console.log( "Error al solicitar permisos de ubicación " + JSON.stringify(error)); }
            );
    }

  // if (localStorage.getItem("modoOscuro"))
  //     try {
  //       this.modo = JSON.parse(localStorage.getItem("modoOscuro"));
  //     } catch (error) {
  //       this.modo = false
  //     }
}
