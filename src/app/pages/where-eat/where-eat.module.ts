import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { WhereEatPageRoutingModule } from './where-eat-routing.module';

import { WhereEatPage } from './where-eat.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    WhereEatPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [WhereEatPage]
})
export class WhereEatPageModule {}
