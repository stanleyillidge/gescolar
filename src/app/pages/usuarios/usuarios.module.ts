import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    ComponentsModule
  ],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
