import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterEventPageRoutingModule } from './filter-event-routing.module';

import { FilterEventPage } from './filter-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FilterEventPageRoutingModule
  ],
  declarations: [FilterEventPage]
})
export class FilterEventPageModule {}
