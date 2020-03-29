import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircuitsPage } from './circuits.page';

//Guard que bloque el acceso a usuarios sin iniciar sesión
import { AuthGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CircuitsPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircuitsPageRoutingModule {}
