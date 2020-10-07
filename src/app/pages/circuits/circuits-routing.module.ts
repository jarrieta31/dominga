import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircuitsPage } from './circuits.page';

//Guard que bloque el acceso a usuarios sin iniciar sesión


const routes: Routes = [
  {
    path: '',
    component: CircuitsPage,
    canActivate: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircuitsPageRoutingModule {}
