import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalBannerPage } from './modal-banner.page';

const routes: Routes = [
  {
    path: '',
    component: ModalBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalBannerPageRoutingModule {}
