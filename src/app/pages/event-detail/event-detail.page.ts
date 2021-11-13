import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { timer } from "rxjs";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { SellingPointsPage } from "../selling-points/selling-points.page";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.page.html",
  styleUrls: ["./event-detail.page.scss"],
})
export class EventDetailPage implements OnInit {
  @Input() id: number;
  @Input() fecha: string;
  @Input() titulo: string;
  @Input() descripcion: string;
  @Input() imagen: string;
  @Input() lugar: string;

  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  day: any;
  hours: any;
  minutes: any;
  seconds: any;
  source = timer(0, 1000);
  clock: any;

  constructor(
    private modalCtrl: ModalController,
    private browser: InAppBrowser
  ) {}

  ngOnInit() {
    this.clock = this.source.subscribe((t) => {
      this.now = new Date();
      this.end = new Date(this.fecha);
      this.showDate();
    });
  }

  /**
   * Cierra el modal del detalle del evento
   */
  salir() {
    this.modalCtrl.dismiss();
  }

  showDate() {
    let distance = this.end - this.now;
    if (distance > 0) {
      this.day = Math.floor(distance / this._day);
      this.hours = Math.floor((distance % this._day) / this._hour);
      this.minutes = Math.floor((distance % this._hour) / this._minute);
      this.seconds = Math.floor((distance % this._minute) / this._second);
    } else {
      this.day = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }

  openMap() {
    this.browser.create(
      "https://www.google.com/maps/search/?api=1&query=" + this.lugar,
      "_system"
    );
  }

  async openModalSellingPoint() {
    const modalSellingPoint = await this.modalCtrl.create({
      component: SellingPointsPage,
      cssClass: "modal-selling-point",
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {},
    });

    await modalSellingPoint.present();
  }
}
