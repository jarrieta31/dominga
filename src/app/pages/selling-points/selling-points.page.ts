import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selling-points',
  templateUrl: './selling-points.page.html',
  styleUrls: ['./selling-points.page.scss'],
})
export class SellingPointsPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  cancelar() {
    const modal = this.modalCtrl.dismiss()
  }

}
