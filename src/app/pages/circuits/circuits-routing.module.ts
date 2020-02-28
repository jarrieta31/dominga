import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircuitsPage } from './circuits.page';

const routes: Routes = [
  {
    path: '',
    component: CircuitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircuitsPageRoutingModule {}
