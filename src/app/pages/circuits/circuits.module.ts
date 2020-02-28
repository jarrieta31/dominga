import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CircuitsPageRoutingModule } from './circuits-routing.module';

import { CircuitsPage } from './circuits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CircuitsPageRoutingModule
  ],
  declarations: [CircuitsPage]
})
export class CircuitsPageModule {}
