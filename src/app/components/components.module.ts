import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { MenuArbolComponent } from './menu-arbol/menu-arbol.component';
import { DemoMaterialModule } from '../material-module';



@NgModule({
  declarations: [
    SlidesComponent,
    StartButtonComponent,
    MenuArbolComponent
  ],
  exports: [
    SlidesComponent,
    StartButtonComponent,
    MenuArbolComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    DemoMaterialModule
  ]
})
export class ComponentsModule { }
