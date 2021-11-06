import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InclusiveModalPage } from './inclusive-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InclusiveModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InclusiveModalPageRoutingModule {}
