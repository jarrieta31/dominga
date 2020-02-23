import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoLugarPage } from './info-lugar.page';

const routes: Routes = [
  {
    path: '',
    component: InfoLugarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoLugarPageRoutingModule {}
