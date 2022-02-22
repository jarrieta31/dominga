import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { MinimapaComponent } from './minimapa/minimapa.component';


@NgModule({
  exports: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
  ],
  declarations: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
