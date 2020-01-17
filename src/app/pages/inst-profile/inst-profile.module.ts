import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstProfilePageRoutingModule } from './inst-profile-routing.module';

import { InstProfilePage } from './inst-profile.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InstProfilePageRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    ComponentsModule
  ],
  declarations: [InstProfilePage]
})
export class InstProfilePageModule {}
