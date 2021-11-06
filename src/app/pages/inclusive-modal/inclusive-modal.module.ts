import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InclusiveModalPageRoutingModule } from './inclusive-modal-routing.module';

import { InclusiveModalPage } from './inclusive-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InclusiveModalPageRoutingModule
  ],
  declarations: [InclusiveModalPage]
})
export class InclusiveModalPageModule {}
