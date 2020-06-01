import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-guided-visits',
  templateUrl: './guided-visits.page.html',
  styleUrls: ['./guided-visits.page.scss'],
})
export class GuidedVisitsPage implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}
