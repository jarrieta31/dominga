import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DomingaPageRoutingModule } from './dominga-routing.module';

import { DomingaPage } from './dominga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DomingaPageRoutingModule
  ],
  declarations: [DomingaPage]
})
export class DomingaPageModule {}
