import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoLugarPage } from './info-lugar.page';

describe('InfoLugarPage', () => {
  let component: InfoLugarPage;
  let fixture: ComponentFixture<InfoLugarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoLugarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoLugarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
