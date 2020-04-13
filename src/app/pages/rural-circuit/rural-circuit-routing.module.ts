import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuralCircuitPage } from './rural-circuit.page';

const routes: Routes = [
  {
    path: '',
    component: RuralCircuitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuralCircuitPageRoutingModule {}
