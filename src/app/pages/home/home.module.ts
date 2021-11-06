import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HomePageRoutingModule } from "./home-routing.module";

import { HomePage } from "./home.page";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { InclusiveModalPageModule } from "../inclusive-modal/inclusive-modal.module";
import { InclusiveModalPage } from "../inclusive-modal/inclusive-modal.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PipesModule,
    InclusiveModalPageModule,
  ],
  declarations: [HomePage],
  entryComponents: [InclusiveModalPage],
})
export class HomePageModule {}
