import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  exports: [
    RatingComponent
  ],
  declarations: [
    RatingComponent
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
