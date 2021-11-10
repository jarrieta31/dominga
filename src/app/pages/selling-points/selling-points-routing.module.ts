import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellingPointsPage } from './selling-points.page';

const routes: Routes = [
  {
    path: '',
    component: SellingPointsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellingPointsPageRoutingModule {}
