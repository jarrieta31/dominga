import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SjEventsPageRoutingModule } from './sj-events-routing.module';

import { SjEventsPage } from './sj-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SjEventsPageRoutingModule
  ],
  declarations: [SjEventsPage]
})
export class SjEventsPageModule {}
