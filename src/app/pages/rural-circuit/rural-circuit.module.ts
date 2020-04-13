import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuralCircuitPageRoutingModule } from './rural-circuit-routing.module';

import { RuralCircuitPage } from './rural-circuit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuralCircuitPageRoutingModule
  ],
  declarations: [RuralCircuitPage]
})
export class RuralCircuitPageModule {}
