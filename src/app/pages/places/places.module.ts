import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { VideoPage } from '../../pages/video/video.page';
import { VideoPageModule } from '../../pages/video/video.module';

@NgModule({
	entryComponents: [
	VideoPage
	],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule,
    ComponentsModule,
    PipesModule,
    VideoPageModule
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}
