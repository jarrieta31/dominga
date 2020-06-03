import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'places/:id',
    loadChildren: () => import('./pages/places/places.module').then( m => m.PlacesPageModule)
  },
  {
    path: 'map/:nombre',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then( m => m.FavoritePageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.module').then( m => m.InformationPageModule)
  },
  {
    path: 'more-options',
    loadChildren: () => import('./pages/more-options/more-options.module').then( m => m.MoreOptionsPageModule)
  },
  {
    path: 'modal-banner',
    loadChildren: () => import('./pages/modal-banner/modal-banner.module').then( m => m.ModalBannerPageModule)
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
    path: 'art-culture',
    loadChildren: () => import('./pages/art-culture/art-culture.module').then( m => m.ArtCulturePageModule)
  },
  {
    path: 'guided-visits',
    loadChildren: () => import('./pages/guided-visits/guided-visits.module').then( m => m.GuidedVisitsPageModule)
  },
  {
    path: 'sj-events',
    loadChildren: () => import('./pages/sj-events/sj-events.module').then( m => m.SjEventsPageModule)
  },
  {
    path: 'circuits',
    loadChildren: () => import('./pages/circuits/circuits.module').then( m => m.CircuitsPageModule)
  },
  {
    path: 'descripcion/:id',
    loadChildren: () => import('./pages/modal-info/modal-info.module').then( m => m.ModalInfoPageModule)
  },
  {
    path: 'Rural',
    loadChildren: () => import('./pages/rural-circuit/rural-circuit.module').then( m => m.RuralCircuitPageModule)
  },
  {
    path: 'Urbano',
    loadChildren: () => import('./pages/urban-circuit/urban-circuit.module').then( m => m.UrbanCircuitPageModule)
  },
  {
    path: 'modal-rating',
    loadChildren: () => import('./pages/modal-rating/modal-rating.module').then( m => m.ModalRatingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
