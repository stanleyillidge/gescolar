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

import { GescolarUser } from '../models/data-models';


@Injectable()
export class AuthService {
    user: GescolarUser;
    userData: any; // Save logged in user data
    estaAtenticado = false;
    loading: HTMLIonLoadingElement;
    test = false;

    constructor(
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
        this.platform.ready().then(() => {
            this.afAuth.auth.onAuthStateChanged(user => {
              if (user) {
                console.log('Esta autenticado!', user);
                this.router.navigate(['/home']);
              } else {
                console.log('No esta autenticado!');
                this.router.navigate(['/login']);
              }
            });
        });
    }
    // Returns true when user is looged in and email is verified
    get isLoggedIn(): GescolarUser {
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
