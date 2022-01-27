import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';


@NgModule({
  exports: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
  ],
  declarations: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
