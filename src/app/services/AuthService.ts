import { Injectable, NgZone } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import { auth } from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { AuthUser, GescolarUser, FirebaseUser } from '../models/data-models';
import { DataService2 } from './data-service';


@Injectable()
export class AuthService {
    user: AuthUser;
    userData: any; // Save logged in user data
    estaAtenticado = false;
    loading: HTMLIonLoadingElement;
    test = false;

    constructor(
        public ds: DataService2,
        private platform: Platform,
        private google: GooglePlus,
        public alertController: AlertController,
        public afs: AngularFirestore,   // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public loadingController: LoadingController,
        public ngZone: NgZone // NgZone service to remove outside scope warning
    ) { }
    estado() {
      // --- Vefico el estado de la autenticación ---
      const este = this;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          console.log('Esta autenticado!', user.uid, user);
          este.router.navigate(['/home']);
          this.ds.CloudFunctions('getFirebaseUser', user.uid).then(s => {
            // s = JSON.parse(s);
            console.log('user', s.data);
            const fuser = new FirebaseUser(s.data);
            console.log('Fuser', fuser);
            const geuser = new GescolarUser(fuser);
            console.log('GEuser', geuser);
          }).catch(e => {});
        } else {
          console.log('No esta autenticado!');
          this.router.navigate(['/login']);
        }
      });
    }
    // Returns true when user is looged in and email is verified
    get isLoggedIn(): AuthUser {
        return this.user;
        // return (user !== null && user.emailVerified !== false) ? true : false;
    }
    // Sign in with G-suite Acount
    async login() {
        let params;
        console.log('cordova', this.platform.is('cordova'));
        console.log('desktop', this.platform.is('desktop'));
        if (this.platform.is('cordova')) {
          params = {
            webClientId: '395322918531-1qitkhfhp0ki8hv4msra3cp5dc8p7o1o.apps.googleusercontent.com',
            offline: true,
            scopes: 'profile email',
            hd: 'lreginaldofischione.edu.co'
          };
          this.google.login(params)
          .then((response) => {
            const { idToken, accessToken } = response;
            this.onLoginSuccess(idToken, accessToken);
          }).catch((error) => {
            console.log(error);
            alert('error:' + JSON.stringify(error));
          });
        } else if (this.platform.is('desktop')) {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
          provider.addScope('https://www.googleapis.com/auth/drive');
          provider.setCustomParameters({
              hd: 'lreginaldofischione.edu.co'
          }),
          this.afAuth.auth.signInWithPopup(provider)
          .then((response) => {
            this.test = true;
            console.log(response);
          }).catch((error) => {
            console.log(error);
            alert('error:' + JSON.stringify(error));
          });
        }
    }
    onLoginSuccess(accessToken, accessSecret) {
        const credential = accessSecret ? firebase.auth.GoogleAuthProvider
            .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
                .credential(accessToken);
        this.afAuth.auth.signInWithCredential(credential)
            .then((response) => {
            // this.router.navigate(["/profile"]);
            console.log(response);
            this.test = true;
            this.loading.dismiss();
        });

    }
    onLoginError(err) {
        console.log(err);
    }
    logout() {
        this.afAuth.auth.signOut().then(() => {
            // this.router.navigate(["/home"]);
            this.test = false;
        });
    }
    async presentAlert(titulo, mensaje) {
        const alert = await this.alertController.create({
          header: titulo,
          message: mensaje,
          buttons: ['OK']
        });
        await alert.present();
    }
}
