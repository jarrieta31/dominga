import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrbanCircuitPageRoutingModule } from './urban-circuit-routing.module';

import { UrbanCircuitPage } from './urban-circuit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UrbanCircuitPageRoutingModule
  ],
  declarations: [UrbanCircuitPage]
})
export class UrbanCircuitPageModule {}
