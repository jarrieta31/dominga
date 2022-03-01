import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-text-to-speech',
    templateUrl: './text-to-speech.component.html',
    styleUrls: ['./text-to-speech.component.scss'],
})

export class TextToSpeechComponent implements OnInit {

    @Input('texto') texto: string;
    viewImage = true;
    rate: number = 1;

    constructor(
        private tts: TextToSpeech,
        private platform: Platform,
        private loading: LoadingController,
    ) { }

    ngOnInit(): void {
        if (this.platform.is("ios") || this.platform.is("iphone")) {
            this.rate = 1.4
        }
    }

    ngOnDestroy(): void {
        this.stopTextToSpeech()
    }

    async presentLoading() {
        const loading = await this.loading.create({
            cssClass: 'my-custom-class',
            message: 'Por favor aguarde, procesando texto',
            duration: 2000
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();
        console.log('Loading dismissed!');
    }

    async playTextToSpeech() {
        this.presentLoading();
        this.viewImage = false;
        this.tts.speak({ text: this.texto, locale: 'es-AR', rate: this.rate })
            .then(() => { this.viewImage = true })
            .catch((reason: any) => console.log(reason));
    }

    stopTextToSpeech() {
        this.viewImage = true;
        this.tts.speak({ text: "", locale: 'es-AR', rate: 1 })
            .then(() => console.log('Done'))
            .catch((reason: any) => console.log(reason));
    }

}