import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'
import { by } from 'protractor';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  videoUrl: SafeResourceUrl;

  @Input() url;

  constructor(
    private domSanitizer: DomSanitizer,
    private modalCtrl: ModalController   
  ) {}

  ngOnInit() {
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl
      (this.url);
  }

  salir(){
    this.modalCtrl.dismiss();
  }

}
