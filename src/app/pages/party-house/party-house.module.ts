import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { PartyHousePageRoutingModule } from './party-house-routing.module';

import { PartyHousePage } from './party-house.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartyHousePageRoutingModule,
    PipesModule
  ],
  declarations: [PartyHousePage]
})
export class PartyHousePageModule {}
