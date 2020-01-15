import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstProfilePage } from './inst-profile.page';

describe('InstProfilePage', () => {
  let component: InstProfilePage;
  let fixture: ComponentFixture<InstProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
