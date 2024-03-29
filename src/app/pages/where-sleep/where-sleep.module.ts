import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { WhereSleepPageRoutingModule } from './where-sleep-routing.module';

import { WhereSleepPage } from './where-sleep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    WhereSleepPageRoutingModule
  ],
  declarations: [WhereSleepPage]
})
export class WhereSleepPageModule {}
