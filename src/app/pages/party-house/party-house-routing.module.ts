import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartyHousePage } from './party-house.page';

const routes: Routes = [
  {
    path: '',
    component: PartyHousePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartyHousePageRoutingModule {}
