import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SjEventsPage } from './sj-events.page';

const routes: Routes = [
  {
    path: '',
    component: SjEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SjEventsPageRoutingModule {}
