import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  exports: [
    RatingComponent,
    MenuComponent,
  ],
  declarations: [
    RatingComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
