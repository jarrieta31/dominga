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
import { AccessibilityPage } from '../accessibility/accessibility.page';
import { AccessibilityPageModule } from '../accessibility/accessibility.module';

@NgModule({
	entryComponents: [
	VideoPage,
  AccessibilityPage
	],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule,
    ComponentsModule,
    PipesModule,
    VideoPageModule,
    AccessibilityPageModule
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}
