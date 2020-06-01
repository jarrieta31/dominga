import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sj-events',
  templateUrl: './sj-events.page.html',
  styleUrls: ['./sj-events.page.scss'],
})
export class SjEventsPage implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}
