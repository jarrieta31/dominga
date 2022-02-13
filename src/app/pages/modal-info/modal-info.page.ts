import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Subject, Subscription } from "rxjs";
import { TextToSpeechService } from "src/app/services/text-to-speech.service";
import { TipoSputtr } from "src/app/shared/tipo-sputtr";
import { PlaceService } from "src/app/services/database/place.service";
import { takeUntil } from "rxjs/operators";
import { Place } from "src/app/shared/place";

@Component({
  selector: "app-modal-info",
  templateUrl: "./modal-info.page.html",
  styleUrls: ["./modal-info.page.scss"],
})
export class ModalInfoPage implements OnInit, OnDestroy {
  /**
   * Funcionalidad: Texto a Audio (TextToSpeech)
   * Variables globales
   */
  currentUrl: string;
  urlSuscription: Subscription;
  speaking: boolean = false;
  paused: boolean = false;
  escuchar: boolean = false;
  vr: string[] = ["1", "1.5", "2"]; //representa las velocidades de reproduccion
  spUttData: TipoSputtr = {
    rate: "1", //  Velocidad de Reproduccion: Rango 0.1 - 10, xDefecto 1
    text: "", // Texto a convertir a audio
  };

  private unsubscribe$ = new Subject<void>();

  place: Place = null;
  callTel: string = null;

  constructor(
    private router: Router,
    private callNumber: CallNumber,
    private browser: InAppBrowser,
    private tts: TextToSpeechService,
    private placeSvc: PlaceService
  ) {}

  ngOnInit() {
    /** Funcion que se suscribe al valor de la url. Funcionalidad: TextToSpeech */
    this.urlSuscribe();

    this.placeSvc.place_selected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.place = res;

        if (this.place.telefonos.length > 0) {
          this.place.telefonos.forEach((tel: String) => {
            this.callTel = tel["numero"];
          });
        }
      });

    if (this.place.web == null) {
      let elem: HTMLElement = document.getElementById("web");
      elem.setAttribute("style", "display:none");
    }

    if (this.place.facebook == null) {
      let elem: HTMLElement = document.getElementById("facebook");
      elem.setAttribute("style", "display:none");
    }

    if (this.place.instagram == null) {
      let elem: HTMLElement = document.getElementById("instagram");
      elem.setAttribute("style", "display:none");
    }

    if (this.place.whatsapp == null) {
      let elem: HTMLElement = document.getElementById("whatsapp");
      elem.setAttribute("style", "display:none");
    }

    if (this.callTel == null) {
      let elem: HTMLElement = document.getElementById("phone");
      elem.setAttribute("style", "display:none");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  callPhone() {
    this.callNumber
      .callNumber(this.callTel, true)
      .then((res) => console.log("Llamando!", res))
      .catch((err) => console.log("Error en llamada", err));
  }

  openWeb() {
    this.browser.create(this.place.web, "_system");
  }

  openFacebook() {
    this.browser.create(this.place.facebook, "_system");
  }

  //  >>>>>> Texto a Audio <<<<<<<<

  urlSuscribe() {
    this.urlSuscription = this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (
            this.tts.enReproduccion() &&
            event.url.search("descripcion") == -1
          )
            this.tts.detener();
          this.currentUrl = event.url;
        }
      });
  }

  limpiarTexto(text: string): string {
    let _txt: string;
    _txt = text.replace(/<[^>]*>?/g, "");
    return _txt;
  }

  pausarReproduccion() {
    this.tts.pausar();
    console.log(`estoy pausando`);
  }
  reanudarReproduccion() {
    this.tts.reanudar();
    console.log(`estoy reanudando`);
  }
  detenerReproduccion() {
    this.tts.detener();
    console.log(`estoy cancelando`);
  }

  reproducirDescripcion(texto: string) {
    this.spUttData.text = this.limpiarTexto(texto);
    this.tts.reproducir(this.spUttData);
  }

  velocidadReproduccion(v: string) {
    let largo = this.vr.length;
    let idx = this.vr.indexOf(v);
    if (idx === largo - 1) this.spUttData.rate = this.vr[0];
    else this.spUttData.rate = this.vr[idx + 1];
  }
}
