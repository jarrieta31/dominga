import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescripcionLugarPageRoutingModule } from './descripcion-lugar-routing.module';

import { DescripcionLugarPage } from './descripcion-lugar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescripcionLugarPageRoutingModule
  ],
  declarations: [DescripcionLugarPage]
})
export class DescripcionLugarPageModule {}
