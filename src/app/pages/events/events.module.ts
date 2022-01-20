import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { EventDetailPage } from '../event-detail/event-detail.page';
import { EventDetailPageModule } from '../event-detail/event-detail.module';
import { FilterEventPageModule } from '../filter-event/filter-event.module';
import { FilterEventPage } from '../filter-event/filter-event.page';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CircuitsPageModule } from '../circuits/circuits.module';

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    EventDetailPageModule,
    FilterEventPageModule,
    PipesModule,
    ReactiveFormsModule, 
    CircuitsPageModule
  ],
  declarations: [EventsPage],
  entryComponents: [
    EventDetailPage,
    FilterEventPage,
  ]
})
export class EventsPageModule {}
