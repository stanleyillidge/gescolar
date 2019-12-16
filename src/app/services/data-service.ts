import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/storage';
import { Router } from "@angular/router";
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
// Ionic Storage
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LocalDatabase, Producto, Bodega, Inventario, Usuario, Documento, ListaDetallada, Pago } from '../models/data-models';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';

@Injectable()
export class DataService {
    public ProductoObserver: ReplaySubject<any> = new ReplaySubject<any>();
    public BodegaObserver: ReplaySubject<any> = new ReplaySubject<any>();
    public InventarioObserver: ReplaySubject<any> = new ReplaySubject<any>();
    public UsuariosObserver: ReplaySubject<any> = new ReplaySubject<any>();
    // public productosObserver: ReplaySubject<any> = new ReplaySubject<any>();
    database: LocalDatabase;
    plataforma: any = {desktop:Boolean,android:Boolean};
    looper:number = 0;
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
        let este = this;
        this.plataforma.desktop = this.platform.is("desktop");
        this.plataforma.android = this.platform.is("android");
        this.plataforma.cordova = this.platform.is("cordova");
        this.storage.clear();// quitar cuando este en produccion
    }
    // ---- Database ----------------------------------------------
        async initDatabase(){
            let este = this
            if(this.plataforma.cordova){
                this.checkDir()
            }
            this.database = new LocalDatabase;
            await this.storage.get('database').then(async (val) => {
                if(val){
                    let datax = val;
                    if(!this.IsJsonString(val)){
                        datax = JSON.stringify(val);
                    }
                    await this.cargaModelos(JSON.parse(datax)).then((r)=>{
                        // console.log(r)
                        este.database = r
                        console.log('Si hay data',este.database);
                        este.databaseEvents('Bodegas')
                        // return true
                    })
                }else{
                    console.log('No hay datos almacenados');
                    this.decargaDatabase('bodegas').then(()=>{
                        este.decargaDatabase('productos').then(()=>{
                            este.decargaDatabase('usuarios').then(()=>{
                                este.decargaDatabase('documentos').then(()=>{
                                    este.decargaDatabase('listas').then(()=>{
                                        este.decargaDatabase('inventario').then(()=>{
                                            este.decargaDatabase('pagos').then(()=>{
                                                este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                                                    console.log('Database:',este.database)
                                                    return
                                                })
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    })
                    // return false
                }
                return
            });
        }
        async decargaDatabase(child: string){
            let este = this;
            const loading = await this.loadingController.create({
                spinner:"dots",//"lines",//"circles",//"bubbles",
                translucent: true,
                cssClass: 'backRed'
            });
            await loading.present();
            let modelo
            let campo = this.capitalize(child)
            await firebase.database().ref(child).once('value', function(snapshots){
                este.database[campo] = {}
                snapshots.forEach(snapshot=>{
                    switch (child) {
                        case 'productos':
                            modelo = new Producto();
                            break;
                        case 'bodegas':
                            modelo = new Bodega();
                            break;
                        case 'usuarios':
                            modelo = new Usuario();
                            break;
                        case 'documentos':
                            modelo = new Documento();
                            break;
                        case 'listas':
                            modelo = new ListaDetallada();
                            break;
                        case 'inventario':
                            modelo = new Inventario();
                            break;
                        case 'pagos':
                            modelo = new Pago();
                            break;
                        default:
                            break;
                    }
                    este.database[campo][snapshot.key] = este.iteraModelo(modelo, snapshot.val());
                    if((child == 'productos') || child == 'bodegas'){
                        este.download(este.database[campo][snapshot.key]).then(r=>{
                            // console.log(r)
                            este.database[campo][snapshot.key].imagen = r
                        })
                    }
                })
            }).then(()=>{
                este.databaseEvents(campo);
                loading.dismiss()
            });
        }
        get Database(){
            return this.database
        }
        iteraModelo(modelo: any, data: any) {
            // console.log(modelo,data)
            Object.keys(modelo).forEach(i => {
                // console.log('campo',i)
                if (typeof data[i] !== 'undefined') {
                    modelo[i] = data[i];
                }
            });
            return modelo
        }
        async cargaModelos(data){
            let este = this
            // console.log('Your data is', este.database);
            if(data.Productos){
                este.database.Productos = {}
                Object.keys(data.Productos).forEach(key=>{
                    const modelo = new Producto;
                    este.database.Productos[key] = este.iteraModelo(modelo, data.Productos[key]);
                })
                este.databaseEvents('Productos')
            }
            if(data.Bodegas){
                este.database.Bodegas = {}
                Object.keys(data.Bodegas).forEach(key=>{
                    const modelo = new Bodega;
                    este.database.Bodegas[key] = este.iteraModelo(modelo, data.Bodegas[key]);
                })
                este.databaseEvents('Bodegas')
            }
            if(data.Usuarios){
                este.database.Usuarios = {}
                Object.keys(data.Usuarios).forEach(key=>{
                    const modelo = new Usuario;
                    este.database.Usuarios[key] = este.iteraModelo(modelo, data.Usuarios[key]);
                })
                este.databaseEvents('Usuarios')
            }
            if(data.Documentos){
                este.database.Documentos = {}
                Object.keys(data.Documentos).forEach(key=>{
                    const modelo = new Documento;
                    este.database.Documentos[key] = este.iteraModelo(modelo, data.Documentos[key]);
                })
                este.databaseEvents('Documentos')
            }
            if(data.Listas){
                este.database.Listas = {}
                Object.keys(data.Listas).forEach(key=>{
                    const modelo = new ListaDetallada;
                    este.database.Listas[key] = este.iteraModelo(modelo, data.Listas[key]);
                })
                este.databaseEvents('Listas')
            }
            if(data.Inventario){
                este.database.Inventario = {}
                Object.keys(data.Inventario).forEach(key=>{
                    const modelo = new Inventario;
                    este.database.Inventario[key] = este.iteraModelo(modelo, data.Inventario[key]);
                })
                este.databaseEvents('Inventario')
            }
            if(data.Pagos){
                este.database.Pagos = {}
                Object.keys(data.Pagos).forEach(key=>{
                    const modelo = new Pago;
                    este.database.Pagos[key] = este.iteraModelo(modelo, data.Pagos[key]);
                })
                este.databaseEvents('Pagos')
            }
            return este.database
        }
        databaseEvents(campo:string){
            let este = this;
            let child = campo.toLowerCase();
            firebase.database().ref(child).limitToLast(1).on('child_added', function(added){
                este.eventos(added.val(),added.key,'added',campo)
            });
            firebase.database().ref(child).on('child_changed', function(change){
                este.eventos(change.val(),change.key,'change',campo)
            });
            firebase.database().ref(child).on('child_removed', function(removed){
                console.log('Evento','remover',campo)
                delete este.database[campo][removed.key]
                este.storage.set('database', JSON.stringify(este.database));
                switch (campo) {
                    case 'Productos':
                        este.ProductoObserver.next(este.database);
                        break;
                    case 'Bodegas':
                        este.BodegaObserver.next(este.database);
                        break
                    case 'Usuarios':
                        este.UsuariosObserver.next(este.database);
                        break
                    case 'Inventario':
                        este.InventarioObserver.next(este.database);
                        break;
                    case 'Documentos':
                        este.InventarioObserver.next(este.database);
                        break;
                    case 'Listas':
                        este.InventarioObserver.next(este.database);
                        break;
                    case 'Pagos':
                        este.InventarioObserver.next(este.database);
                        break;
                    default:
                        break;
                }
            });
        }
        eventos(data:any,key,tipo:String,campo:string){
            let este = this;
            console.log('Evento',tipo,campo,key,este.database[campo],data)
            let modelo
            let observer
            switch (campo) {
                case 'Productos':
                    modelo = new Producto();
                    observer = este.ProductoObserver;
                    break;
                case 'Bodegas':
                    modelo = new Bodega();
                    observer = este.BodegaObserver
                    break;
                case 'Usuarios':
                    modelo = new Usuario();
                    observer = este.UsuariosObserver
                    break
                case 'Inventario':
                    modelo = new Inventario();
                    observer = este.InventarioObserver
                    break
                case 'Documentos':
                    modelo = new Documento();
                    observer = este.InventarioObserver
                    break;
                case 'Listas':
                    modelo = new ListaDetallada();
                    observer = este.InventarioObserver
                    break;
                case 'Pagos':
                    modelo = new Pago();
                    observer = este.InventarioObserver
                    break;
                default:
                    break;
            }
            if(!este.database[campo][key]){
                este.database[campo][key] = este.iteraModelo(modelo,data);
            }
            console.log('Datbase a guardar',este.database)
            este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                observer.next(este.database);
            })
        }
    // ---- Imagenes ----------------------------------------------
        public async download(producto:any){//(i:any,index:any,item:any) {
            let este = this;
            // console.log(c + name + '.png',producto)
            if (this.plataforma.cordova && this.plataforma.android) {
                return await this.downloadFile(producto)
            }else{
                return producto.imagen
            }
        }
        public async checkFileExists(producto:any){
            let este = this;
            let name = producto.key;
            await this.file.checkFile(this.file.externalRootDirectory, 'inventarios/' + name + '.png')
            .then(_ => {
                // alert("A file with the same name already exists!");
                console.log("A file with the same name already exists!");
                return true
            })
            // File does not exist yet, we can save normally
            .catch(err =>{
                return false
            })
        }
        public async downloadFile(producto:any){
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            let este = this;
            let name = producto.key;
            let file = producto.imagen;
            let c = 'inventarios/';
            return await fileTransfer.download(file, este.file.externalRootDirectory + '/'+ c + name + '.png')
            .then((entry) => {
                return este.webview.convertFileSrc(entry.nativeURL);
            })
            .catch((err) =>{
                console.log(producto.key,'Error saving file: ' + err.message);
                return producto.imagen
            })
        }
        async checkDir(){
            let este = this;
            return await this.file.checkDir(this.file.externalRootDirectory, 'inventarios').then(()=>{
                console.log('El directorio si existe')
            }).catch(
                // Directory does not exists, create a new one
                err => este.file.createDir(este.file.externalRootDirectory, 'inventarios', false)
                .then(response => {
                    // alert('New folder created:  ' + response.fullPath);
                    console.log('New folder created:  ' + response.fullPath);
                }).catch(err => {
                    // alert('It was not possible to create the dir "inventarios". Err: ' + err.message);
                    console.log('It was not possible to create the dir "inventarios". Err: ' + err.message);
                })			
            );
        }
    // ---- Productos | Bodegas -----------------------------------
        async creaChild(formulario:any,imagen:any,accion:string,PushID:string,child:string) {
            let este = this
            const loading = await this.loadingController.create({
                // message: 'Trabajando...',
                spinner:"dots",
                translucent: true,
                cssClass: 'backRed'
            });
            await loading.present();
            if(accion == 'crear' || (imagen instanceof File) || (imagen instanceof Blob)){
                if(!PushID){ PushID = firebase.database().ref().push().key }
                await this.uploadImagen(formulario,imagen,PushID,child).then( u=>{
                    loading.dismiss();
                    return
                })
            }else{
                // console.log('Producto a ser guardado 1',formulario, PushID, imagen)
                await este.actualizaChild(formulario, PushID, imagen, child).then(()=>{
                    // ---- Guardo localmente ----------------------
                        este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                            loading.dismiss();
                            este.presentToastWithOptions('Termino correctamente',3000,'top')
                        });
                    // ---------------------------------------------
                })
            }
        }
        async uploadImagen(formulario:any,imagen:any,PushID:string,child:string){
            let este = this
            try{
                let nombre = formulario.nombre+'.'+imagen['type'].substr("image/".length);
                console.log('imagen',nombre,imagen)
                const imagenes = firebase.storage().ref(child).child(nombre)
                const metadata = {
                    contentType: imagen['type']
                };
                await imagenes.put(imagen,metadata).then(async function(snapshot) {
                    await imagenes.getDownloadURL().then(async function(url) {
                        console.log('Producto a ser guardado 0',child,formulario, PushID, url)
                        await este.actualizaChild(formulario, PushID, url, child).then(()=>{
                            // ---- Guardo localmente ----------------------
                            console.log('db',este.database)
                            este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                                return true
                            })
                            // ---------------------------------------------
                        })
                    }).catch(function(error) {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/object-not-found':
                                console.log('storage/object-not-found')
                                // File doesn't exist
                                break;
                    
                            case 'storage/unauthorized':
                                console.log('storage/unauthorized')
                                // User doesn't have permission to access the object
                                break;
                    
                            case 'storage/canceled':
                                console.log('storage/canceled')
                                // User canceled the upload
                                break;
                    
                            case 'storage/unknown':
                                console.log('storage/unknown')
                                // Unknown error occurred, inspect the server response
                                break;
                        }
                        return
                    });
                });
            }
            catch(error) {
                this.presentAlert('Error',error)
                console.error(error);
                return
            }
        }
        async actualizaChild(formulario: any, PushID: string, imagen: any, child: string){
            let este = this
            let modelo
            let observer
            let data
            const campo = this.capitalize(child)
            switch (child) {
                case 'productos':
                    modelo = new Producto();
                    observer = este.ProductoObserver;
                    if(este.database.Productos){
                        data = este.database.Productos
                    }else{
                        este.database.Productos = {}
                        data = este.database.Productos
                    }
                    break;
                case 'bodegas':
                    modelo = new Bodega();
                    observer = este.BodegaObserver;
                    // data = este.database.Bodegas
                    if(este.database.Bodegas){
                        data = este.database.Bodegas
                    }else{
                        este.database.Bodegas = {}
                        data = este.database.Bodegas
                    }
                    break;
                
                default:
                    break;
            }
            if(!imagen){
                imagen = data[PushID].imagen
            }
            // ---- Actualizo la data local antes de escribirlo --------
                console.log('actualiza',campo,formulario,PushID,imagen,modelo,data)
                data[PushID] = este.iteraModelo(modelo, formulario);
                data[PushID].key = PushID
                data[PushID].imagen = imagen;
                data[PushID].creacion = new Date();

                este.database[campo][PushID] = data[PushID];
                console.log('ojo entro!',data[PushID]);
            // ---- Actualizacion de los datos -------------
                await firebase.database().ref(child)
                .child(PushID).update(data[PushID]).then(a=>{
                    este.presentToastWithOptions('Termino correctamente',3000,'top')
                    return
                }).catch(error=>{
                    este.presentAlert('Error',error)
                    console.error(error);
                    return
                })
            // ---------------------------------------------
        }
    // ---- Usuarios ----------------------------------------------
        async CloudFunctionUsuarios(usuario,accion){
            let este = this;
            let funcion = "creaUsuarios"
            if(accion != 'crear'){
                funcion = "actualizaUsuarios"
            }
            this.CloudFunctions(funcion,usuario).then(function(a:any){
                console.log('rta',a)
                let modelo = new Usuario();
                if(!este.database.Usuarios){
                    este.database.Usuarios = {}
                    este.databaseEvents('Usuarios')
                }
                if(a.data){
                    usuario.key = a.data;
                    este.database.Usuarios[a.data] = este.iteraModelo(modelo, usuario);
                    este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                        este.UsuariosObserver.next(este.database);
                        este.presentToastWithOptions('Termino correctamente',3000,'top')
                    })
                }
                return true
            }).catch(e=>{
                console.log('error',e)
            })
        }
    // ---- Documentos --------------------------------------------
        async creaIngreso(doc: Documento,listas: any){
            let este = this;
            const loading = await this.loadingController.create({
                // message: 'Trabajando...',
                spinner:"dots",
                translucent: true,
                cssClass: 'backRed'
            });
            await loading.present();
            if(!this.database.Listas){
                this.database.Listas = {}
            }
            if(!this.database.Documentos){
                this.database.Documentos = {}
            }
            if(!this.database.Inventario){
                this.database.Inventario = {}
            }
            this.database.Documentos[doc.key] = doc;
            let index = ''
            let rem = []
            const data = {}
            index = 'documentos/'+doc.key
            data[index] = doc;
            for(let i in listas){
                index = 'listas/'+i
                data[index] = listas[i];
                this.database.Listas[i] = listas[i];
                const VolumenOcupado = this.database.Listas[i].Ocupacion(this.database);
                // console.log(this.database.Bodegas[listas[i].bodega].espacioDisponible,VolumenOcupado)
                switch (doc.tipo) {
                    case 'compra':
                        this.database.Bodegas[listas[i].bodega].espacioDisponible -= Number(VolumenOcupado);
                        index = 'bodegas/'+listas[i].bodega+'/espacioDisponible'
                        data[index] = this.database.Bodegas[listas[i].bodega].espacioDisponible;
                        let test = false;
                        for(let j in this.database.Inventario){ // se verifica si el producto se encuentra en bodega y se actualiza la cantidad
                            if(this.database.Inventario[j].producto == listas[i].producto && this.database.Inventario[j].bodega == listas[i].bodega){
                                this.database.Inventario[j].cantidad += listas[i].cantidad;
                                index = 'inventario/'+j
                                data[index] = this.database.Inventario[j];
                                test = true;
                                break
                            }
                        }
                        if(!test){ // Si no existe una pareja producto-bodega se genera un nuevo ingreso al inventario
                            const key = firebase.database().ref().push().key;
                            const modelo = new Inventario();
                            this.database.Inventario[key] = this.iteraModelo(modelo,listas[i])
                            // this.database.Inventario[key] = new Inventario();
                            // this.database.Inventario[key].key = key;
                            // this.database.Inventario[key].bodega = listas[i].bodega;
                            // this.database.Inventario[key].ingreso = listas[i].creacion;
                            // this.database.Inventario[key].producto = listas[i].producto;
                            // this.database.Inventario[key].tipo = 'producto';
                            // this.database.Inventario[key].cantidad = listas[i].cantidad;
                            // this.database.Inventario[key].precio = listas[i].precio;
                            // this.database.Inventario[key].costo = listas[i].costo;
                            // this.database.Inventario[key].proveedor = listas[i].proveedor;
                            // this.database.Inventario[key].usuario = listas[i].usuario;
                            // this.database.Inventario[key].documento = listas[i].documento;
                            index = 'inventario/'+key
                            data[index] = this.database.Inventario[key];
                        }
                      break;
                    case 'venta':
                            this.database.Bodegas[listas[i].bodega].espacioDisponible += Number(VolumenOcupado);
                            index = 'bodegas/'+listas[i].bodega+'/espacioDisponible'
                            data[index] = this.database.Bodegas[listas[i].bodega].espacioDisponible;
                            for(let j in this.database.Inventario){ // se verifica si el producto se encuentra en bodega y se actualiza la cantidad
                                if(this.database.Inventario[j].producto == listas[i].producto && this.database.Inventario[j].bodega == listas[i].bodega){
                                    this.database.Inventario[j].cantidad -= listas[i].cantidad;
                                    index = 'inventario/'+j
                                    data[index] = this.database.Inventario[j];
                                    if(this.database.Inventario[j].cantidad == 0){
                                        rem.push(j)
                                    }
                                    break;
                                }
                            }
                      break;
                    default:
                      break;
                }
            }
            console.log(doc, listas, data)
            await firebase.database().ref().update(data).then(async a=>{
                await este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                    for(let j in rem){
                        console.log('Borrando el inventario',rem[j])
                        delete este.database.Inventario[j];
                        firebase.database().ref('inventario/'+rem[j]).remove()
                    }
                    loading.dismiss();
                    este.presentToastWithOptions('Documento ok',3000,'top')
                    este.InventarioObserver.next(este.database)
                    return true
                })
            }).catch(error=>{
                loading.dismiss()
                este.presentAlert('Error Doc',error)
                console.error(error);
                return
            })
        }
        async actualizaDoc(doc:Documento){
            let este = this;
            const loading = await this.loadingController.create({
                // message: 'Trabajando...',
                spinner:"dots",
                translucent: true,
                cssClass: 'backRed'
            });
            await loading.present();
            doc.modificacion = new Date();
            this.database.Documentos[doc.key] = doc;
            await firebase.database().ref('documentos/').child(doc.key)
            .update(doc).then(async a=>{
                await este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                    loading.dismiss()
                    este.presentToastWithOptions('Documento actualizado',3000,'top')
                    este.InventarioObserver.next(este.database)
                    return true
                })
            }).catch(error=>{
                loading.dismiss()
                este.presentAlert('Error actualiza Doc',error)
                console.error(error);
                return
            })
        }
        async pagos(pago:Pago){
            let este = this;
            pago.valor = Number(this.database.Documentos[pago.documento].abonos) + Number(pago.abono);
            if(pago.valor > this.database.Documentos[pago.documento].valor){
                let mensaje = 'Debe digitar un valor menor al total adeudado para realizar el proceso de pago';
                this.presentAlert('Error',mensaje);
                return
            }
            pago.key = firebase.database().ref().push().key;
            let data = {
                key: pago.key,
                fecha: pago.fecha,
                documento: pago.documento,
                valor: pago.valor,
                abono: pago.abono,
                usuario: pago.usuario
             };
            data['estado'] = 'pendiente';
            if(data.valor == this.database.Documentos[pago.documento].valor){
                data['estado'] = 'pagado';
            }
            console.log('Pago a ser realizado',data)
            this.CloudFunctions('pagos',data).then(p=>{
                este.database.Pagos[data.key] = data;
                este.database.Documentos[data.documento].abonos = data.valor;
                este.database.Documentos[data.documento].estado = data['estado'];
                este.storage.set('database', JSON.stringify(este.database)).then(()=>{
                    este.presentToastWithOptions('Pago realizado correctamente',3000,'top')
                    console.log('Pago terminado',data.documento,este.database)
                    // este.InventarioObserver.next(este.database);
                })
            }).catch(e=>{
                console.log('error',e)
            })
        }
    // ---- Generales ---------------------------------------------
        getKeyByValue(objects, value,key) { 
            for(let i in objects){
                if(objects[i][key] == value){
                    return objects[i].key
                }
            }
        }
        async CloudFunctions(funcion:string,data:any): Promise<any>{
            let este = this;
            const loading = await this.loadingController.create({
                // message: 'Trabajando...',
                spinner:"dots",
                translucent: true,
                cssClass: 'backRed'
            });
            await loading.present();
            let CloudFunction = firebase.functions().httpsCallable(funcion);
            return await CloudFunction(data).then(function(rta) {
                // Read result of the Cloud Function.
                console.log('Respuesta de '+funcion+':',rta);
                loading.dismiss();
                return rta
            }).catch(function(error) {
                console.log('Usuario error: ',error);
                let titulo = 'Error'
                let mensaje = error.message
                loading.dismiss();
                este.presentAlert(titulo,mensaje)
                return error
            })
        }
        IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        capitalize(s){
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        async presentAlert(titulo,mensaje) {
            const alert = await this.alertController.create({
            header: titulo,
            message: mensaje,
            buttons: ['OK']
            });
            await alert.present();
        }
        async presentToastWithOptions(message,duration,position) {
            const toast = await this.toastController.create({
            message: message,
            // showCloseButton: true,
            position: position,
            duration: duration
            // closeButtonText: 'Done'
            });
            toast.present();
        }
    // ------------------------------------------------------------
}