import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { MinimapaComponent } from './minimapa/minimapa.component';
import { PreloadComponent } from './preload/preload.component';


@NgModule({
  exports: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
    PreloadComponent,
  ],
  declarations: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
    PreloadComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
