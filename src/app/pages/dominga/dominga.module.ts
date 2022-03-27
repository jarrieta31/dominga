import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DomingaPageRoutingModule } from './dominga-routing.module';

import { DomingaPage } from './dominga.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DomingaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DomingaPage]
})
export class DomingaPageModule {}
