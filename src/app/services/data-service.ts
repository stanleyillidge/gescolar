import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/storage';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
// Ionic Storage
import { Storage } from '@ionic/storage';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { LocalDatabase } from '../models/data-models';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';
import { GescolarUser, FirebaseUser } from '../models/data-models';

@Injectable()
export class DataService2 {
    // private _usuarios = new BehaviorSubject<GescolarUser[]>([]);
    // public productosObserver: ReplaySubject<any> = new ReplaySubject<any>();
    database: any;
    plataforma: any = {desktop: Boolean, android: Boolean};
    looper = 0;
    constructor(
        public platform: Platform,
        public alertController: AlertController,
        public toastController: ToastController,
        public router: Router,
        public loadingController: LoadingController,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        private webview: WebView,
        private fileTransfer: FileTransfer,
        private file: File,
        private storage: Storage
    ) {
        const este = this;
        this.plataforma.desktop = this.platform.is('desktop');
        this.plataforma.android = this.platform.is('android');
        this.plataforma.cordova = this.platform.is('cordova');
        // this.storage.clear(); // quitar cuando este en produccion
    }
    // ---- Database ----------------------------------------------
        async initDatabase(uid: string) {
            const este = this;
            if (this.plataforma.cordova) {
                this.checkDir();
            }
            await this.storage.get(uid).then(async (val) => {
                if (val) {
                    let datax = JSON.parse(val);
                    if (!this.IsJsonString(val)) {
                        datax = Object(JSON.stringify(val));
                    }
                    console.log('El usuario', uid, 'SI tiene datos almacenados localmente', datax);
                    this.database = datax;
                    this.database.authUser = new GescolarUser(datax.authUser);
                    console.log(datax);
                    return;
                } else {
                    console.log('El usuario', uid, 'NO tiene datos almacenados localmente');
                    // se obtiene la data completa del usuario que ingresa por primera vez
                    este.getFullUser(uid);
                    return;
                }
            });
        }
    // ---- Usuarios ----------------------------------------------
        getFullUser(uid: string) {
            const este = this;
            // firebase.database().ref(child)
            this.CloudFunctions('getFirebaseUser', uid).then((s: any) => {
                const geuser = new GescolarUser(new FirebaseUser(s.data));
                firebase.database().ref(geuser.rol).child(geuser.uid).once('value', u => {
                    console.log('Geuser que ingresa:', u.val());
                    este.database = {authUser: new GescolarUser(u.val())};
                    console.log('Database:', este.database);
                    este.storage.set(uid, JSON.stringify(este.database)).then(() => {
                        console.log('Datos de usuario guardados localmente');
                        return u.val();
                    });
                });
            }).catch(e => {});
        }
    // ---- Imagenes ----------------------------------------------
        public async download(producto: any) {// (i:any,index:any,item:any) {
            const este = this;
            // console.log(c + name + '.png',producto)
            if (this.plataforma.cordova && this.plataforma.android) {
                return await this.downloadFile(producto);
            } else {
                return producto.imagen;
            }
        }
        public async checkFileExists(producto: any) {
            const este = this;
            const name = producto.key;
            await this.file.checkFile(this.file.externalRootDirectory, 'inventarios/' + name + '.png')
            .then(_ => {
                // alert("A file with the same name already exists!");
                console.log('A file with the same name already exists!');
                return true;
            })
            // File does not exist yet, we can save normally
            .catch(err => {
                return false;
            });
        }
        public async downloadFile(producto: any) {
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            const este = this;
            const name = producto.key;
            const file = producto.imagen;
            const c = 'inventarios/';
            return await fileTransfer.download(file, este.file.externalRootDirectory + '/' + c + name + '.png')
            .then((entry) => {
                return este.webview.convertFileSrc(entry.nativeURL);
            })
            .catch((err) => {
                console.log(producto.key, 'Error saving file: ' + err.message);
                return producto.imagen;
            });
        }
        async checkDir() {
            const este = this;
            return await this.file.checkDir(this.file.externalRootDirectory, 'GestionEscolarPlus').then(() => {
                console.log('El directorio si existe');
            }).catch(
                // Directory does not exists, create a new one
                err => este.file.createDir(este.file.externalRootDirectory, 'GestionEscolarPlus', false)
                .then(response => {
                    // alert('New folder created:  ' + response.fullPath);
                    console.log('New folder created:  ' + response.fullPath);
                }).catch(error => {
                    // alert('It was not possible to create the dir "GestionEscolarPlus". Err: ' + err.message);
                    console.log('It was not possible to create the dir "GestionEscolarPlus". Err: ' + error.message);
                })
            );
        }
    // ---- Generales ---------------------------------------------
        page(page) {
            this.router.navigate(['/' + page]);
        }
        get Database() {
            return this.database;
        }
        iteraModelo(modelo: any, data: any) {
            // console.log(modelo,data)
            Object.keys(modelo).forEach(i => {
                // console.log('campo',i)
                if (typeof data[i] !== 'undefined') {
                    modelo[i] = data[i];
                }
            });
            return modelo;
        }
        getKeyByValue(objects, value, key) {
            for (const i in objects) {
                if (objects[i][key] == value) {
                    return objects[i].key;
                }
            }
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
        IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        capitalize(s) {
            if (typeof s !== 'string') { return ''; }
            return s.charAt(0).toUpperCase() + s.slice(1);
        }
        async presentAlert(titulo, mensaje) {
            const alert = await this.alertController.create({
            header: titulo,
            message: mensaje,
            buttons: ['OK']
            });
            await alert.present();
        }
        async presentToastWithOptions(message, duration, position) {
            const toast = await this.toastController.create({
            message,
            // showCloseButton: true,
            position,
            duration
            // closeButtonText: 'Done'
            });
            toast.present();
        }
    // ------------------------------------------------------------
}
