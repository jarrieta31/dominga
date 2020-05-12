import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRatingPageRoutingModule } from './modal-rating-routing.module';

import { ModalRatingPage } from './modal-rating.page';
import { IonicRatingModule } from 'ionic-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRatingPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [ModalRatingPage]
})
export class ModalRatingPageModule {}
