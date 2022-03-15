import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { MinimapaComponent } from './minimapa/minimapa.component';
import { PreloadComponent } from './preload/preload.component';
import { PreloadListComponent } from './preload-list/preload-list.component';
import { PreloadDetailsComponent } from './preload-details/preload-details.component';


@NgModule({
  exports: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
    PreloadComponent,
    PreloadListComponent,
    PreloadDetailsComponent
  ],
  declarations: [
    RatingComponent,
    MenuComponent,
    TextToSpeechComponent,
    MinimapaComponent,
    PreloadComponent,
    PreloadListComponent,
    PreloadDetailsComponent
  ],
  imports: [
    CommonModule, 
    IonicModule  
  ]
})
export class ComponentsModule { }
