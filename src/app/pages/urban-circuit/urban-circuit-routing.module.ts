import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UrbanCircuitPage } from './urban-circuit.page';

const routes: Routes = [
  {
    path: '',
    component: UrbanCircuitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrbanCircuitPageRoutingModule {}
