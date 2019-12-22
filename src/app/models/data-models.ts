// ---- Basicos -----------------
    export class Institucion {
        public key: string;
            public calendario: 'calendarioA' | 'calendarioB' | 'calendarioC';
            public razonSocial: string;
            public rut: string;
            public nit: string;
            public escudo: string; // url hacia la img
            public dane: string;
            public resolucionAprobacion: string; // url hacia el doc
            public generoAtendIDo: 'mixto' | 'masculino' | 'femenino';
            public nivelEnseñanza: {
                Preescolar: boolean,
                BasicaPrimaria: boolean,
                BasicaSecundaria: boolean,
                EducacionBasicaAdultos: boolean,
                EducacionMedia: boolean,
                EducacionMediaAdultos: boolean
            };
        constructor() {
            this.key = '';
            this.calendario = 'calendarioA';
            this.razonSocial = '';
            this.rut = '';
            this.nit = '';
            this.escudo = '';
            this.dane = '';
            this.resolucionAprobacion = '';
            this.generoAtendIDo = 'mixto';
            this.nivelEnseñanza = {
                Preescolar: false,
                BasicaPrimaria: false,
                BasicaSecundaria: false,
                EducacionBasicaAdultos: false,
                EducacionMedia: false,
                EducacionMediaAdultos: false
            };
        }
    }
    export class Sedes {
        public key: string;
            public nombre: string;
            public geolocalizacion: {
                pais: string,
                departamento: string,
                municipio: string,
                direccion: string,
                telefono: number,
                coordenadas: {
                    latitud: number,
                    longitud: number
                };
            };
            public dane: string;
            public jornadas: {
                mañana: boolean,
                tarde: boolean,
                nocturna: boolean,
                sabatina: boolean,
                unica: boolean
            };
        constructor() {
            this.key = '';
            this.nombre = '';
            this.geolocalizacion = {
                pais: '',
                departamento: '',
                municipio: '',
                direccion: '',
                telefono: 0,
                coordenadas: {
                    latitud: 0,
                    longitud: 0
                }
            };
            this.dane = '';
            this.jornadas = {
                mañana: false,
                tarde: false,
                nocturna: false,
                sabatina: false,
                unica: false
            };
        }
    }
    type roles = 'super' | 'rector' | 'admin' | 'auxiliar' | 'coordinador' | 'docente' | 'estudiante';
    type documentoTipo = 'registroCivil' | 'tarjetaIdentidad' | 'cedula' | 'pasaporte';
    export class Claims { // en la Base de datos guardar por rol como key principal
        public super: boolean;
        public rector: boolean;
        public admin: boolean;
        public auxiliar: boolean;
        public coordinador: boolean;
        public docente: boolean;
        public estudiante: boolean;
        constructor() {
            this.super = false;
            this.rector = false;
            this.admin = false;
            this.auxiliar = false;
            this.coordinador = false;
            this.docente = false;
            this.estudiante = false;
        }
    }
    export class Usuario { // en la Base de datos guardar por rol como key principal
        public key: string; // UID generado desde el Auth
            public rol: roles;
            public creacion: Date;
            public sede: string;
            public activo: boolean;
            public nombre: string;
            public documentoTipo: documentoTipo;
            public documentoNum: number;
            public telefono: number;
            public direccion: string;
            public barrio: string;
            public email: string;
            public token: string; // token de autorización para enviar y recibir Push Notifications
            password?: string;
        constructor() {
            this.key = '';
            this.rol = 'estudiante';
            this.creacion = new Date();
            this.sede = '';
            this.activo = false;
            this.nombre = '';
            this.documentoTipo = 'registroCivil';
            this.documentoNum = 0;
            this.telefono = 0;
            this.direccion = '';
            this.barrio = '';
            this.email = '';
            this.token = '';
        }
    }
    export class AñoLectivo {
        public key: string;
            public inicio: Date;
            public fin: Date;
            public activo: boolean;
        constructor() {
            this.key = '';
            this.inicio = new Date();
            this.fin = new Date();
            this.activo = false;
        }
    }
    export class InformacionFamiliar {
        public key: string;
        constructor() {
            this.key = '';
        }
    }
    export class GestionDocumental {
        public key: string;
        constructor() {
            this.key = '';
        }
    }
// ---- Data Base ---------------
    export class LocalDatabase {
        // public Usuarios: { [key: string]: Usuario };
        // public Bodegas: { [key: string]: Bodega };
        // public Documentos: { [key: string]: Documento };
        // public Listas: { [key: string]: ListaDetallada };
        // public Productos: { [key: string]: Producto };
        // public Inventario: { [key: string]: Inventario };
        // public Pagos: { [key: string]: Pago };
        constructor() {}
    }
// ------------------------------
