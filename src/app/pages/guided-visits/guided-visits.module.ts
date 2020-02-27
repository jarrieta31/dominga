import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidedVisitsPageRoutingModule } from './guided-visits-routing.module';

import { GuidedVisitsPage } from './guided-visits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidedVisitsPageRoutingModule
  ],
  declarations: [GuidedVisitsPage]
})
export class GuidedVisitsPageModule {}
