import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Subject } from "rxjs";
import { PlaceService } from "src/app/services/database/place.service";
import { takeUntil } from "rxjs/operators";
import { Place } from "src/app/shared/place";

@Component({
  selector: "app-modal-info",
  templateUrl: "./modal-info.page.html",
  styleUrls: ["./modal-info.page.scss"],
})
export class ModalInfoPage implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  descripcionText: string;
  place: Place = null;
  telefonos: string[] = [];
  @ViewChild("descripcion", { static: true }) descripcionHtml: ElementRef;

  constructor(
    private callNumber: CallNumber,
    private browser: InAppBrowser,
    private placeSvc: PlaceService
  ) {}

  ngOnInit() {
    this.placeSvc.place_selected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.place = res;
        this.place.telefonos.forEach((tel: string) => {
          if (
            tel["numero"] !== null &&
            tel["numero"] !== undefined &&
            tel["numero"] !== "" &&
            tel["numero"] !== " "
          ) {
            this.telefonos.push(tel["numero"]);
          }
        });
      });

    if (
      this.place.web === null ||
      this.place.web === undefined ||
      this.place.web === "" ||
      this.place.web === " "
    ) {
      let elem: HTMLElement = document.getElementById("web");
      elem.setAttribute("style", "display:none");
    }

    if (
      this.place.facebook == null ||
      this.place.facebook === undefined ||
      this.place.facebook === "" ||
      this.place.facebook === " "
    ) {
      let elem: HTMLElement = document.getElementById("facebook");
      elem.setAttribute("style", "display:none");
    }

    if (
      this.place.instagram == null ||
      this.place.instagram === undefined ||
      this.place.instagram === "" ||
      this.place.instagram === " "
    ) {
      let elem: HTMLElement = document.getElementById("instagram");
      elem.setAttribute("style", "display:none");
    }

    if (
      this.place.whatsapp === null ||
      this.place.whatsapp === undefined ||
      this.place.whatsapp === "" ||
      this.place.whatsapp === " "
    ) {
      let elem: HTMLElement = document.getElementById("whatsapp");
      elem.setAttribute("style", "display:none");
    }

    if (this.telefonos.length === 0) {
      let elem: HTMLElement = document.getElementById("phone");
      elem.setAttribute("style", "display:none");
    }
  }

  ngAfterViewInit(): void {
    this.descripcionText = this.descripcionHtml.nativeElement.innerText;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  callPhone() {
    this.callNumber
      .callNumber(this.telefonos[0], true)
      .then((res) => console.log("Llamando!", res))
      .catch((err) => console.log("Error en llamada", err));
  }

  openWeb() {
    this.browser.create(this.place.web, "_system");
  }

  openFacebook() {
    this.browser.create(this.place.facebook, "_system");
  }
}
