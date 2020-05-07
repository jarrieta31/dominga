import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { CircuitsPageRoutingModule } from './circuits-routing.module';

import { CircuitsPage } from './circuits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    CircuitsPageRoutingModule
  ],
  declarations: [CircuitsPage]
})
export class CircuitsPageModule {}
