import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/AuthService';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Storage } from '@ionic/storage';
import { GescolarUser, FirebaseUser, FirebaseClaims } from './models/data-models';
import { DataService2 } from './services/data-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  firstTime: false;
  goPage: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public authService: AuthService,
    private storage: Storage,
    public ds: DataService2
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString('#f4f5f8'); // .styleDefault(); // .styleLightContent();
      // this.authService.estado();
      const este = this;
      this.storage.get('user').then((response) => {
        if (response) {
          this.goPage = 'login';
        } else {
          this.goPage = '';
        }
      });
      this.authService.afAuth.authState.subscribe(state => {
        // console.log(state);
        if (state) {
          firebase.database().ref('.info/connected').on('value', (snap) => {
            console.log(snap.val());
            if (snap.val() === true) {
              console.log('Estoy Online');
              // console.log('Database:' + este.ds.database);
              este.authService.onLoginSuccessWeb(state);
            } else {
              console.log('Estoy Offline');
              // console.log('Database: ' + este.ds.database);
              este.authService.onOffline(state);
            }
          });
        } else {
          this.router.navigate([this.goPage]);
        }
      });
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  page(page) {
    this.router.navigate([page]);
  }
  /* initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  } */
}
