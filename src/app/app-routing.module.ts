import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./public/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: 'lugar',
    loadChildren: () => import('./private/info-lugar/info-lugar.module').then( m => m.InfoLugarPageModule)
  },  {
    path: 'descripcion-lugar',
    loadChildren: () => import('./core/modals/descripcion-lugar/descripcion-lugar.module').then( m => m.DescripcionLugarPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes/*, { preloadingStrategy: PreloadAllModules }*/)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
