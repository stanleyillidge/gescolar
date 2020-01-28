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

import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';


@Injectable()
export class AuthService {
    user: GescolarUser;
    userData: any; // Save logged in user data
    estaAtenticado = false;
    loading: HTMLIonLoadingElement;
    test = false;
    authState = new BehaviorSubject(false);
    // private _usuario = new BehaviorSubject<GescolarUser[]>([]);
    // readonly usuario = this._usuario.asObservable();

    constructor(
        public ds: DataService2,
        private platform: Platform,
        private google: GooglePlus,
        public alertController: AlertController,
        public afs: AngularFirestore,   // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public loadingController: LoadingController,
        private storage: Storage,
        public zone: NgZone // NgZone service to remove outside scope warning
    ) { }
    // ---- Usuarios ----------------------------------------------
      getFullUser(uid: string) {
        const este = this;
        return new Promise((resolve, reject) => {
          this.CloudFunctions('getFirebaseUser', uid).then((s: any) => {
            const geuser = new GescolarUser(new FirebaseUser(s.data));
            firebase.database().ref(geuser.rol).child(geuser.uid).once('value', u => {
              // console.log('Geuser que ingresa:', u.val());
              este.user = new GescolarUser(u.val());
              // console.log('Usuario:', este.user);
              este.storage.set('user', JSON.stringify(este.user)).then(() => {
                  console.log('Datos de usuario guardados localmente', este.user);
                  resolve(u.val());
              });
            });
          }).catch((e) => {
            console.log(e);
            este.presentAlert('Error', e);
            reject(false);
          });
        });
      }
      getUser(): Promise<firebase.User> {
        return this.afAuth.authState.pipe(first()).toPromise();
      }
      // Returns true when user is looged in and email is verified
      get isLoggedIn(): GescolarUser {
        return this.user;
        // return (user !== null && user.emailVerified !== false) ? true : false;
      }
      isAuthenticated() {
        return this.authState.value;
      }
      ifLoggedIn() {
        this.storage.get('user').then((response) => {
          if (response) {
            this.authState.next(true);
          }
        });
      }
    // -------------------------------------------------------------
    // Sign in with G-suite Acount
    async login() {
      let params;
      const este = this;
      console.log('cordova', this.platform.is('cordova'));
      console.log('android', this.platform.is('android'));
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
        /* .then(() => {
          return this.afAuth.auth.getRedirectResult().then( result => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            const token = result.credential['accessToken'];
            // The signed-in user info.
            const user = result.user;
            console.log(token, user);
            este.getFullUser(user.uid).then(() => {
              este.ds.initDatabase(user.uid).then(() => {
                este.zone.run(() => {
                  este.router.navigate(['/home']);
                  este.authState.next(true);
                });
              });
            });
          }).catch((error) => {
            // Handle Errors here.
            este.presentAlert('Error', error.message);
          });
        }); */
        .then((response) => {
          this.test = true;
          console.log(response);
          this.getFullUser(response.user.uid).then(() => {
            este.ds.initDatabase(response.user.uid).then(() => {
              este.zone.run(() => {
                este.router.navigate(['/home']);
                este.authState.next(true);
              });
            });
          });
        }).catch((error) => {
          console.log(error);
          alert('error:' + JSON.stringify(error));
        });
      }
    }
    onLoginSuccess(accessToken, accessSecret) {
      const este = this;
      const credential = accessSecret ? firebase.auth.GoogleAuthProvider
          .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
              .credential(accessToken);
      this.afAuth.auth.signInWithCredential(credential)
        .then((response) => {
        console.log(response);
        this.test = true;
        this.storage.get('user').then((u) => {
          if (u) {
            este.ds.initDatabase(response.user.uid).then(() => {
              este.zone.run(() => {
                este.router.navigate(['home/inicio']);
                este.authState.next(true);
              });
            });
          } else {
            this.getFullUser(response.user.uid).then(() => {
              este.ds.initDatabase(response.user.uid).then(() => {
                este.zone.run(() => {
                  este.router.navigate(['home/inicio']);
                  este.authState.next(true);
                });
              });
            });
          }
        });
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
    async CloudFunctions(funcion: string, data: any): Promise<any> {
      const este = this;
      const loading = await this.loadingController.create({
          // message: 'Trabajando...',
          spinner: 'dots',
          translucent: true,
          cssClass: 'backRed'
      });
      await loading.present();
      const CloudFunction = firebase.functions().httpsCallable(funcion);
      return await CloudFunction(data).then((rta) => {
          // Read result of the Cloud Function.
          // s = JSON.parse(s);
          console.log('Respuesta de ' + funcion + ':', rta);
          loading.dismiss();
          return rta;
      }).catch((error) => {
          console.log('Usuario error: ', error);
          const titulo = 'Error';
          const mensaje = error.message;
          loading.dismiss();
          este.presentAlert(titulo, mensaje);
          return error;
      });
  }
}
