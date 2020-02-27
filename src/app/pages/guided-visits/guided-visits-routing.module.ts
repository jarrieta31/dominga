import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuidedVisitsPage } from './guided-visits.page';

const routes: Routes = [
  {
    path: '',
    component: GuidedVisitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidedVisitsPageRoutingModule {}
