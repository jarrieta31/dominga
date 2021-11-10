import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellingPointsPageRoutingModule } from './selling-points-routing.module';

import { SellingPointsPage } from './selling-points.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellingPointsPageRoutingModule
  ],
  declarations: [SellingPointsPage]
})
export class SellingPointsPageModule {}
