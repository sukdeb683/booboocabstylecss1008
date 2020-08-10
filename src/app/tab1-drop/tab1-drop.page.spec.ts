import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab1DropPage } from './tab1-drop.page';

describe('Tab1DropPage', () => {
  let component: Tab1DropPage;
  let fixture: ComponentFixture<Tab1DropPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1DropPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1DropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
