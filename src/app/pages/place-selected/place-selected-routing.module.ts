import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceSelectedPage } from './place-selected.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceSelectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceSelectedPageRoutingModule {}
