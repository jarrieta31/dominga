import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'home-menu', pathMatch: 'full' },
  {
    path: 'map/:nombre',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'where-sleep',
    loadChildren: () => import('./pages/where-sleep/where-sleep.module').then( m => m.WhereSleepPageModule)
  },
  {
    path: 'where-eat',
    loadChildren: () => import('./pages/where-eat/where-eat.module').then( m => m.WhereEatPageModule)
  },
  {
    path: 'descripcion/:id',
    loadChildren: () => import('./pages/modal-info/modal-info.module').then( m => m.ModalInfoPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'home-menu',
    loadChildren: () => import('./pages/home-menu/home-menu.module').then( m => m.HomeMenuPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'place',
    loadChildren: () => import('./pages/place/place.module').then( m => m.PlacePageModule)
  },
  {
    path: 'place-selected/:id',
    loadChildren: () => import('./pages/place-selected/place-selected.module').then( m => m.PlaceSelectedPageModule)
  },
  {
    path: 'artist',
    loadChildren: () => import('./pages/artist/artist.module').then( m => m.ArtistPageModule)
  },  {
    path: 'dominga',
    loadChildren: () => import('./pages/dominga/dominga.module').then( m => m.DomingaPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
