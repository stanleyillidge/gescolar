import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/AuthService';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Storage } from '@ionic/storage';
// import { DataService2 } from './services/data-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public authService: AuthService,
    private storage: Storage,
    // public ds: DataService2
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      // this.authService.estado();
      this.authService.afAuth.authState.subscribe(state => {
        console.log(state);
        if (state) {
          this.router.navigate(['/home']);
        } else {
          this.storage.get('user').then((response) => {
            if (response) {
              this.router.navigate(['/login']);
            } else {
              this.router.navigate(['']);
            }
          });
        }
      });
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  page(page) {
    this.router.navigate(['/' + page]);
  }
  /* initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  } */
}
