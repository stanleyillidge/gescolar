import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  loading: HTMLIonLoadingElement;
  test: boolean = false;
  constructor(
    private router: Router,
    private platform: Platform,
    private google: GooglePlus,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth
  ) {}
  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...'
    });
  }

  async presentLoading(loading) {
    await loading.present();
  }

  async login() {
    let params;
    if (this.platform.is('android')) {
      params = {
        webClientId: '395322918531-1qitkhfhp0ki8hv4msra3cp5dc8p7o1o.apps.googleusercontent.com',
        offline: true,
        scopes: "profile email"
      }
    }
    else {
      params = {}
    }
    this.google.login(params)
      .then((response) => {
        const { idToken, accessToken } = response
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error)
        alert('error:' + JSON.stringify(error))
      });
  }
  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.auth.signInWithCredential(credential)
      .then((response) => {
        // this.router.navigate(["/profile"]);
        this.test = true;
        this.loading.dismiss();
      })

  }
  onLoginError(err) {
    console.log(err);
  }
  logout() {
    this.fireAuth.auth.signOut().then(() => {
      // this.router.navigate(["/home"]);
      this.test = false;
    })
  }
}
/* googleLogin() {
  this.platform.is("cordova") ? this.nativeGoogleLogin() : this.webGoogleLogin()
}
signOut() {
  this.afAuth.auth.signOut()
}
nativeGoogleLogin() {
  return r.__awaiter(this, void 0, void 0, function*() {
      try {
          const e = yield this.gplus.login({
              webClientId: "379796768157-f9k52v85ncgb65ire6735a7s9ask16ob.apps.googleusercontent.com",
              offline: !0,
              scopes: "profile email"
          });
          return yield this.afAuth.auth.signInWithCredential(i.auth.GoogleAuthProvider.credential(e.idToken))
      } catch (t) {
          console.log(t)
      }
  })
}
webGoogleLogin() {
  return r.__awaiter(this, void 0, void 0, function*() {
      try {
          const e = new i.auth.GoogleAuthProvider;
          e.setCustomParameters({
              hd: "lreginaldofischione.edu.co"
          }),
          yield this.afAuth.auth.signInWithPopup(e)
      } catch (t) {
          console.log(t)
      }
  })
} */