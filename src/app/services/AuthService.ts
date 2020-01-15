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
    private _usuario = new BehaviorSubject<GescolarUser[]>([]);
    readonly usuario = this._usuario.asObservable();

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
    estado() {
      // --- Vefico el estado de la autenticación ---
      const este = this;
      return new Promise((resolve, reject) => {
        this.afAuth.auth.onAuthStateChanged(user => {
          if (user) {
            this.ds.initDatabase(user.uid).then((r: any) => {
              console.log('rta', r);
              console.log('Hola', this.ds.database);
              if (r.rta) {
                this._usuario.next(Object.assign({}, this.ds.database).usuario);
                // este.zone.run(() => {
                console.log('Esta autenticado!', user.uid, user);
                resolve({rta: true});
                // });
              } else {
                este.getFullUser(user.uid).then((s: any) => {
                  console.log('Echo', s);
                  resolve({rta: true});
                });
              }
            });
          } else {
            console.log('No esta autenticado!');
            resolve({rta: false});
          }
        });
      });
    }
    // ---- Usuarios ----------------------------------------------
      async getFullUser(uid: string) {
        const este = this;
        return new Promise((resolve, reject) => {
          this.ds.CloudFunctions('getFirebaseUser', uid).then((s: any) => {
            const geuser = new GescolarUser(new FirebaseUser(s.data));
            firebase.database().ref(geuser.rol).child(geuser.uid).once('value', u => {
                console.log('Geuser que ingresa:', u.val());
                // console.log(este.authService.usuario);
                // este.authService.user = new GescolarUser(u.val());
                este.ds.database = {authUser: new GescolarUser(u.val())};
                console.log('Database:', este.ds.database);
                este.storage.set(uid, JSON.stringify(este.ds.database)).then(() => {
                  console.log('Datos de usuario guardados localmente');
                  return u.val();
                });
            });
          }).catch(e => {});
        });
      }
      getUser(): Promise<firebase.User> {
        return this.afAuth.authState.pipe(first()).toPromise();
      }
    // -------------------------------------------------------------
    // Returns true when user is looged in and email is verified
    get isLoggedIn(): GescolarUser {
        return this.user;
        // return (user !== null && user.emailVerified !== false) ? true : false;
    }
    // Sign in with G-suite Acount
    async login() {
        let params;
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
        } else if (this.platform.is('desktop') || this.platform.is('android')) {
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
            this.zone.run(() => {
              this.router.navigate(['/home']);
            });
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
            console.log(response);
            this.test = true;
            this.loading.dismiss();
            this.zone.run(() => {
              this.router.navigate(['/home']);
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
}
