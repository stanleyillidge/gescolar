import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';



@NgModule({
  declarations: [SlidesComponent, StartButtonComponent],
  exports: [SlidesComponent, StartButtonComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule { }
