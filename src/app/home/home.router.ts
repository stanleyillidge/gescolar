import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeGuard } from '../guards/home.guard';
// import { UserDataResolver } from '../resolvers/user-data.resolver';
import { HomePage } from './home.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    // canActivate: [HomeGuard],
    // resolve: {
    //   userData: UserDataResolver
    // },
    children: [
      {
        path: 'inicio',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioPageModule),
            canActivate: [AngularFireAuthGuard]
          }
        ]
      },
      {
        path: 'page2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/page2/page2.module').then(
                m => m.Page2PageModule
              ),
              canActivate: [AngularFireAuthGuard]
          }
        ]
      },
      {
        path: 'page3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/page3/page3.module').then(
                m => m.Page3PageModule
              ),
              canActivate: [AngularFireAuthGuard]
          }
        ]
      },
      {
        path: 'page4',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/page4/page4.module').then(
                m => m.Page4PageModule
              ),
              canActivate: [AngularFireAuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/inicio',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
