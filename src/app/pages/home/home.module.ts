import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ModalRatingPageModule } from '../modal-rating/modal-rating.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';


@NgModule({
  entryComponents:[
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalRatingPageModule,
    PipesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
