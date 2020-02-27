import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtCulturePageRoutingModule } from './art-culture-routing.module';

import { ArtCulturePage } from './art-culture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtCulturePageRoutingModule
  ],
  declarations: [ArtCulturePage]
})
export class ArtCulturePageModule {}
