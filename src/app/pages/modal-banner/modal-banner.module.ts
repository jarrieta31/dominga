import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalBannerPageRoutingModule } from './modal-banner-routing.module';

import { ModalBannerPage } from './modal-banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalBannerPageRoutingModule
  ],
  declarations: [ModalBannerPage]
})
export class ModalBannerPageModule {}
