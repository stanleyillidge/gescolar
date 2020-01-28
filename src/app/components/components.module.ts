import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { MenuArbolComponent } from './menu-arbol/menu-arbol.component';
import { DemoMaterialModule } from '../material-module';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';



@NgModule({
  declarations: [
    SlidesComponent,
    StartButtonComponent,
    MenuArbolComponent,
    UserAvatarComponent
  ],
  exports: [
    SlidesComponent,
    StartButtonComponent,
    MenuArbolComponent,
    UserAvatarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    DemoMaterialModule
  ]
})
export class ComponentsModule { }
