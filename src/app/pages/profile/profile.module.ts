import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from 'src/app/material-module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    ComponentsModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
