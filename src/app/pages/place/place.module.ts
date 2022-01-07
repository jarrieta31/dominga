import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacePageRoutingModule } from './place-routing.module';

import { PlacePage } from './place.page';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    PlacePageRoutingModule,
    PipesModule,
  ],
  declarations: [PlacePage]
})
export class PlacePageModule {}
