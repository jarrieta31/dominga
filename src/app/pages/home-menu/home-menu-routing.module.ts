import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMenuPage } from './home-menu.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMenuPageRoutingModule {}
