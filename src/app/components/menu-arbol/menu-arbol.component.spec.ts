import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuArbolComponent } from './menu-arbol.component';

describe('MenuArbolComponent', () => {
  let component: MenuArbolComponent;
  let fixture: ComponentFixture<MenuArbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuArbolComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuArbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
