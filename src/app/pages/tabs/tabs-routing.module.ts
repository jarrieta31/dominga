import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "places",
        loadChildren: "../home/home.module#HomePageModule",
      },
      {
        path: "events",
        loadChildren: "../events/events.module#EventsPageModule",
      },
      {
        path: "sleep",
        loadChildren: "../where-sleep/where-sleep.module#WhereSleepPageModule",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
