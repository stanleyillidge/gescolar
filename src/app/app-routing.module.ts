import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './services/auth-guard.service';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const adminOnly = () => hasCustomClaim('Admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['items']);
const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./index/index.module').then(m => m.IndexPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('src/app/pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'inst-profile',
    loadChildren: () => import('./pages/inst-profile/inst-profile.module').then( m => m.InstProfilePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
