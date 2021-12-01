import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMenuPageRoutingModule } from './home-menu-routing.module';

import { HomeMenuPage } from './home-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMenuPageRoutingModule
  ],
  declarations: [HomeMenuPage]
})
export class HomeMenuPageModule {}
