import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Page4Page } from './page4.page';

describe('Page4Page', () => {
  let component: Page4Page;
  let fixture: ComponentFixture<Page4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Page4Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Page4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
