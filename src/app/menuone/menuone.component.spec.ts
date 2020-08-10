import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuoneComponent } from './menuone.component';

describe('MenuoneComponent', () => {
  let component: MenuoneComponent;
  let fixture: ComponentFixture<MenuoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuoneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
