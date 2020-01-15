import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstProfilePage } from './inst-profile.page';

const routes: Routes = [
  {
    path: '',
    component: InstProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstProfilePageRoutingModule {}
