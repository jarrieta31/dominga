import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistPageRoutingModule } from './artist-routing.module';

import { ArtistPage } from './artist.page';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { VideoPageModule } from '../video/video.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistPageRoutingModule,
    ReactiveFormsModule,
    VideoPageModule,
    PipesModule,
    ComponentsModule,
  ],
  declarations: [ArtistPage]
})
export class ArtistPageModule {}
