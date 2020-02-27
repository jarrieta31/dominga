import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtCulturePage } from './art-culture.page';

const routes: Routes = [
  {
    path: '',
    component: ArtCulturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtCulturePageRoutingModule {}
