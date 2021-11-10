import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { SellingPointsPageModule } from '../selling-points/selling-points.module';
import { SellingPointsPage } from '../selling-points/selling-points.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule,
    SellingPointsPageModule
  ],
  declarations: [EventDetailPage],
  entryComponents: [ 
    SellingPointsPage
  ]
})
export class EventDetailPageModule {}
