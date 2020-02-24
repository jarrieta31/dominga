import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescripcionLugarPage } from './descripcion-lugar.page';

const routes: Routes = [
  {
    path: '',
    component: DescripcionLugarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescripcionLugarPageRoutingModule {}
