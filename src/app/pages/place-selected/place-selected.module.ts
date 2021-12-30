import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceSelectedPageRoutingModule } from './place-selected-routing.module';

import { PlaceSelectedPage } from './place-selected.page';
import { VideoPageModule } from '../video/video.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceSelectedPageRoutingModule,
    VideoPageModule,
  ],
  declarations: [PlaceSelectedPage]
})
export class PlaceSelectedPageModule {}
