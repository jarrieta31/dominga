import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { InformationPageRoutingModule } from './information-routing.module';

import { InformationPage } from './information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    InformationPageRoutingModule
  ],
  declarations: [InformationPage]
})
export class InformationPageModule {}
