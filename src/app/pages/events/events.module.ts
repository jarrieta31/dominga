import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { EventDetailPage } from '../event-detail/event-detail.page';
import { EventDetailPageModule } from '../event-detail/event-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    EventDetailPageModule
  ],
  declarations: [EventsPage],
  entryComponents: [
    EventDetailPage
  ]
})
export class EventsPageModule {}
