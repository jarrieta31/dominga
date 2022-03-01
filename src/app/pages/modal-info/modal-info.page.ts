import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  callTel: string = null;
  @ViewChild('descripcion', { static: true }) descripcionHtml: ElementRef;

  constructor(
    private callNumber: CallNumber,
    private browser: InAppBrowser,
    private placeSvc: PlaceService,
  ) { }

  ngOnInit() {
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

  ngAfterViewInit(): void {
    this.descripcionText = this.descripcionHtml.nativeElement.innerText
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
}
