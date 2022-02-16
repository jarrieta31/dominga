import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: 'app-selling-points',
  templateUrl: './selling-points.page.html',
  styleUrls: ['./selling-points.page.scss'],
})
export class SellingPointsPage implements OnInit {

  @Input() instagram: string;
  @Input() tickAntel: string;
  @Input() facebook: string;
  @Input() whatsapp: string;
  
  constructor(
    private modalCtrl: ModalController,
    private browser: InAppBrowser,
  ) { }

  ngOnInit() {
    console.log(this.instagram, this.tickAntel, this.facebook, this.whatsapp)
  }

  cancelar() {
    const modal = this.modalCtrl.dismiss()
  }

  openTickAntel() {
    this.browser.create(this.tickAntel, "_system");
  }

  openInstagram() {
    this.browser.create(this.instagram, "_system");
  }

  openFacebook() {
    this.browser.create(this.facebook, "_system");
  }

  openWhatsapp() {
    this.browser.create(this.whatsapp, "_system");
  }


}
