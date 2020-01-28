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
import { GescolarUser, FirebaseUser, Institucion, Sedes, LocalDatabase, AuthUser } from '../models/data-models';

@Injectable()
export class DataService2 {
    // private _usuarios = new BehaviorSubject<GescolarUser[]>([]);
    // public productosObserver: ReplaySubject<any> = new ReplaySubject<any>();
    database: LocalDatabase = {};
    nodos: string[] = ['institucion', 'sedes'];
    observer: { [key: string]: ReplaySubject<any> } = {};
    uid: string;
    user: GescolarUser; // firebase.User;
    plataforma: any = {desktop: Boolean, android: Boolean};
    looper = 0;
    // modelos = {
    //     institucion: new Institucion(),
    //     sedes: new Sedes()
    // };
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
        // this.storage.clear(); // quitar cuando este en produccion
        this.getAuthUser();
        this.plataforma.desktop = this.platform.is('desktop');
        this.plataforma.android = this.platform.is('android');
        this.plataforma.cordova = this.platform.is('cordova');
    }
    // ---- Database ----------------------------------------------
        async initDatabase(uid: string) {
            const este = this;
            this.uid = uid;
            return new Promise((resolve, reject) => {
                if (this.plataforma.cordova) {
                    this.checkDir();
                }
                this.storage.get('user').then(async (u) => {
                    this.user = new GescolarUser(u);
                    this.storage.get(uid).then(async (val) => {
                        if (val) {
                            let datax = JSON.parse(val);
                            if (!this.IsJsonString(val)) {
                                datax = Object(JSON.stringify(val));
                            }
                            // console.log('El usuario', uid, 'SI tiene datos almacenados localmente', datax);
                            this.database = datax;
                            this.database.authUser = new AuthUser(datax.authUser);
                            if (!this.database.authUser.historial) {
                                // console.log('No tiene historial');
                                this.database.authUser.historial = [{inicio: new Date()}];
                            } else {
                                // console.log('Si tiene historial');
                                this.database.authUser.historial.push({inicio: new Date()});
                            }
                            // inicializo los nodos
                            this.initObservers();
                            console.log(este.database);
                            resolve({rta: true});
                        } else {
                            // console.log('El usuario', uid, 'NO tiene datos almacenados localmente');
                            // se obtiene la data completa del usuario que ingresa por primera vez
                            este.database.authUser =  new AuthUser(this.user);
                            if (!this.database.authUser.historial) {
                                // console.log('No tiene historial');
                                this.database.authUser.historial = [{inicio: new Date()}];
                            } else {
                                // console.log('Si tiene historial');
                                this.database.authUser.historial.push({inicio: new Date()});
                            }
                            console.log(este.database);
                            este.storage.set(uid, JSON.stringify(este.database)).then(() => {
                                resolve({rta: true});
                            });
                            // reject({rta: false});
                        }
                    });
                });
            });
        }
        getDatabase(child?: string) {
            const este = this;
            return new Promise((resolve, reject) => {
                if (Object.entries(this.database).length === 0 && this.database.constructor === Object) {
                    // si la base de datos esta vacia verificamos en el alamacenamiento local
                    this.initDatabase(this.user.uid).catch((e) => {
                        console.log(e);
                        this.presentAlert('Error', e);
                        reject(false);
                    });
                }
                // console.log('De haber una solicitud especifica, la verifico');
                if (child) {
                    if (!this.database[child]) {
                        this.loadDatabase(child).then((a) => {
                            if (a) {
                                resolve(true);
                            } else { resolve(false); }
                        }).catch((e) => {
                            console.log(e);
                            this.presentAlert('Error', e);
                            reject(false);
                        });
                    } else { resolve(true); }
                }
            });
        }
        loadDatabase(child: string) {
            const este = this;
            return new Promise((resolve, reject) => {
                firebase.database().ref(child).once('value', (db) => {
                    // console.log(db.val());
                    if (db.val()) {
                        este.database[child] = {};
                        const obj = db.val();
                        const keys = Object.keys(obj);
                        keys.forEach(key => {
                            // console.log(obj[key], key);
                            este.database[child][key] = este.modelo(child, obj[key]);
                        });
                        este.storage.set(este.database.authUser.uid, JSON.stringify(este.database)).then(() => {
                            // console.log('Child', child, ' fue guardado localmente');
                            este.databaseEvents('institucion');
                            este.databaseEvents('sedes');
                            resolve(true);
                        });
                    } else {
                        console.log('No hay datos');
                        resolve(false);
                    }
                }).catch((e) => { reject(e); });
            });
        }
        databaseEvents(campo: string) {
            const este = this;
            const child = campo.toLowerCase();
            firebase.database().ref(child).limitToLast(1).on('child_added', (added) => {
                este.eventos(added.val(), added.key, 'added', campo);
            });
            firebase.database().ref(child).on('child_changed', (change) => {
                este.eventos(change.val(), change.key, 'change', campo);
            });
            firebase.database().ref(child).on('child_removed', (removed) => {
                console.log('Evento', 'remover', campo);
                delete este.database[campo][removed.key];
                este.creaObserver(campo);
                este.observer[campo].next(este.database);
            });
        }
        eventos(data: any, key: string, tipo: string, campo: string) {
            const este = this;
            console.log('Evento', tipo, campo, key, este.database[campo], data);
            if (!este.database[campo]) { este.database[campo] = {}; }
            // if (!este.database[campo][key]) { este.modelo(campo, data); }
            este.database[campo][key] = este.modelo(campo, data);
            // console.log('Database a guardar1', este.database);
            este.creaObserver(campo);
            este.observer[campo].next(este.database);
            este.storage.set(este.database.authUser.uid, JSON.stringify(este.database)).then(() => {
                // console.log('Child', campo, ' fue guardado localmente');
                // console.log('Database', este.database);
            });
        }
        creaObserver(campo: string) {
            const este = this;
            if (!este.observer) {
                este.observer = {};
                este.observer[campo] = new ReplaySubject<any>();
            } else if (!(este.observer[campo] instanceof ReplaySubject)) {
                // console.log('Se creó el observer');
                este.observer[campo] = new ReplaySubject<any>();
            }
        }
        initObservers() {
            this.nodos.forEach(campo => {
                this.creaObserver(campo);
            });
        }
        modelo(a: string, data: any) {
            switch (a) {
                case 'institucion':
                    return new Institucion(data);
                    break;
                case 'sedes':
                    return new Sedes(data);
                    break;
                default:
                    break;
            }
        }
    // ---- Institucionales ---------------------------------------
        infInstitucional(institucion: Institucion, sedes: Sedes[]) {
            const este = this;
            return new Promise((resolve, reject) => {
                if (!this.database.institucion) {
                    if (!institucion.key) {
                        institucion.key = firebase.database().ref().push().key;
                    }
                }
                if (this.database.logo) { institucion.escudo = this.database.logo; }
                institucion = new Institucion(institucion);
                this.database.institucion[institucion.key] = institucion;
                const key = Object.keys(este.database.institucion);
                firebase.database().ref('institucion')
                .child(this.database.institucion[key[0]].key).update(institucion).then(() => {
                    // console.log('institucion actualizada correctamente');
                }).catch((e) => {
                    console.log('Error actualizando institución', e, institucion);
                    const error = ['Error actualizando institución', e, institucion];
                    reject(error);
                });
                if (!this.database.sedes) {
                    this.database.sedes = {};
                }
                sedes.forEach(sede => {
                    // if (!sede.key) {
                    //     sede.key = firebase.database().ref().push().key;
                    // }
                    this.database.sedes[sede.key] = sede;
                });
                console.log('Data a ser guardada', this.database, institucion);
                firebase.database().ref('sedes').set(this.database.sedes).then(() => {
                    // console.log('La sede', sede, 'actualizada correctamente');
                    este.storage.set(este.database.authUser.uid, JSON.stringify(este.database)).then(() => {
                        resolve('institucion actualizada correctamente');
                    });
                }).catch((e) => {
                    console.log('Error actualizando sede', e, this.database.sedes);
                    const error = ['Error actualizando sede', e, this.database.sedes];
                    reject(error);
                });
            });
        }
    // ---- Imagenes ----------------------------------------------
        async updateImg(data: any, archivo: Blob | ArrayBuffer | Uint8Array) {
            const este = this;
            const loading = await this.loadingController.create({
                message: 'Guardando archivo...'
            });
            await loading.present();
            const nombre = data.nombre + '.' + archivo['type'].substr('image/'.length);
            // console.log('archivo', nombre, archivo);
            const imagenes = firebase.storage().ref(data.ubicacion).child(nombre);
            const metadata = {
                contentType: archivo['type']
            };
            await imagenes.put(archivo, metadata).then(async (snapshot) => {
                await imagenes.getDownloadURL().then(async (url) => {
                    este.database.logo = url;
                    console.log('Archivo almacenado:', nombre, archivo, url);
                    loading.dismiss();
                // ---- Guardo localmente ----------------------
                    /* este.storage.set(este.database.authUser.uid, JSON.stringify(este.database)).then(() => {
                        loading.dismiss();
                    }); */
                // ---------------------------------------------
                    return;
                }).catch((error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/object-not-found':
                            console.log('storage/object-not-found');
                            // File doesn't exist
                            break;
                        case 'storage/unauthorized':
                            console.log('storage/unauthorized');
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            console.log('storage/canceled');
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            console.log('storage/unknown');
                            // Unknown error occurred, inspect the server response
                            break;
                    }
                    return;
                });
            });
        }
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
        get getUser(): GescolarUser {
            return this.user;
            // return (user !== null && user.emailVerified !== false) ? true : false;
        }
        getAuthUser() {
            return new Promise((resolve, reject) => {
                this.storage.get('user').then(async (u) => {
                    if (u) {
                        // console.log(JSON.parse(u));
                        this.user = new GescolarUser(JSON.parse(u));
                        resolve(this.user);
                    }
                });
            });
        }
        getFullUser(uid: string) {
            const este = this;
            return new Promise((resolve, reject) => {
                this.CloudFunctions('getFirebaseUser', uid).then((s: any) => {
                    const geuser = new GescolarUser(new FirebaseUser(s.data));
                    firebase.database().ref(geuser.rol).child(geuser.uid).once('value', u => {
                        // console.log('Geuser que ingresa:', u.val());
                        este.database.authUser = new GescolarUser(u.val());
                        // este.database.authUser.historial.push({inicio: new Date()}); // ojo guardar en internet tambien
                        // console.log('Database:', este.database);
                        este.storage.set(uid, JSON.stringify(este.database)).then(() => {
                            // console.log('Datos de usuario guardados localmente');
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
        get newKey() {
            return firebase.database().ref().push().key;
        }
        iteraModelo(modelo: any, data: any) {
            // console.log(modelo, data);
            Object.keys(modelo).forEach(i => {
                // console.log('campo', i);
                if (typeof data[i] !== 'undefined') {
                    modelo[i] = data[i];
                }
            });
            return modelo;
        }
        getKeyByValue(objects, value, key) {
            for (const i in objects) {
                if (objects[i][key] === value) {
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
                // console.log('Respuesta de ' + funcion + ':', rta);
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
