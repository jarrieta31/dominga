import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoLugarPageRoutingModule } from './info-lugar-routing.module';

import { InfoLugarPage } from './info-lugar.page';
import { DescripcionLugarPage } from '../../core/modals/descripcion-lugar/descripcion-lugar.page'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoLugarPageRoutingModule
  ],
  declarations: [
  	InfoLugarPage,
  	DescripcionLugarPage
  	],
  entryComponents: [
  	DescripcionLugarPage
  	]
})
export class InfoLugarPageModule {}
