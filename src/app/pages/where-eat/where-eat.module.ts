import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { WhereEatPageRoutingModule } from './where-eat-routing.module';

import { WhereEatPage } from './where-eat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    WhereEatPageRoutingModule
  ],
  declarations: [WhereEatPage]
})
export class WhereEatPageModule {}
