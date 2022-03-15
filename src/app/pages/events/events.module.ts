import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { EventDetailPage } from '../event-detail/event-detail.page';
import { EventDetailPageModule } from '../event-detail/event-detail.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    EventDetailPageModule,
    PipesModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [EventsPage],
  entryComponents: [
    EventDetailPage,
  ]
})
export class EventsPageModule {}
