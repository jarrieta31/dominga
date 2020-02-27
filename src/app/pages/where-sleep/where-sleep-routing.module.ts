import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhereSleepPage } from './where-sleep.page';

const routes: Routes = [
  {
    path: '',
    component: WhereSleepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhereSleepPageRoutingModule {}
