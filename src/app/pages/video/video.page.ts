import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'
import { by } from 'protractor';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  videoUrl: SafeResourceUrl;

  constructor(
    private domSanitizer: DomSanitizer    
  ) {}

  ngOnInit() {
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl
      ("https://www.youtube.com/watch?v=ZhIsAZO5gl0&list=RDwCCfc2vAuDU&index=6");
  }

}
