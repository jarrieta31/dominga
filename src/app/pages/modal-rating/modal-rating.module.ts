import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRatingPageRoutingModule } from './modal-rating-routing.module';

import { ModalRatingPage } from './modal-rating.page';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRatingPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModalRatingPage]
})
export class ModalRatingPageModule {}
