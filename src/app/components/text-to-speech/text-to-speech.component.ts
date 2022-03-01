import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss'],
})

export class TextToSpeechComponent implements OnInit {

  @Input('texto') texto: string;

  constructor(
    private tts: TextToSpeech,
    private platform: Platform,
  ) { }

  ngOnInit(): void {

  }

  playTextToSpeech() {
    let rate: number;
    if (this.platform.is("ios") || this.platform.is("iphone")) {
      rate = 1.4
    } else { rate = 1 };
    console.log(this.texto)
    this.tts.speak({ text: this.texto, locale: 'es-AR', rate: rate })
      .then(() => console.log('Done'))
      .catch((reason: any) =>
        console.log(reason)
      );
  }

  stopTextToSpeech() {
    this.tts.speak({ text: "", locale: 'es-AR', rate: 1 })
      .then(() => console.log('Done'))
      .catch((reason: any) => console.log(reason));
  }
}