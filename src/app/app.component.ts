import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Subject, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeolocationService } from "./services/geolocation.service";
import { MeasuresService } from "./services/measures.service";

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
    private measures: MeasuresService
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

    this.geolocationSvc.checkGPSPermission();
    this.geolocationSvc.iniciarSubscriptionClock();

    setTimeout(() => {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }, 5000)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

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

  // if (localStorage.getItem("modoOscuro"))
  //     try {
  //       this.modo = JSON.parse(localStorage.getItem("modoOscuro"));
  //     } catch (error) {
  //       this.modo = false
  //     }
}
