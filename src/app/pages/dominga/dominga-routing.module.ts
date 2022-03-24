import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomingaPage } from './dominga.page';

const routes: Routes = [
  {
    path: '',
    component: DomingaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DomingaPageRoutingModule {}
