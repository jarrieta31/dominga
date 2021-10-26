import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterEventPage } from './filter-event.page';

const routes: Routes = [
  {
    path: '',
    component: FilterEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterEventPageRoutingModule {}
