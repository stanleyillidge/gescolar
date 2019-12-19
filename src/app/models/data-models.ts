// ---- Basicos -----------------
    export class Institucion{ 
        public key: string
            public calendario: "calendarioA" | "calendarioB" | "calendarioC"
            public razonSocial: string
            public rut: string
            public nit: string
            public escudo: string // url hacia la img
            public dane: string
            public resolucionAprobacion: string // url hacia el doc
            public generoAtendIDo:"mixto" | "masculino" | "femenino"
            public nivelEnseñanza:{
                Preescolar: Boolean,
                BasicaPrimaria: Boolean,
                BasicaSecundaria: Boolean,
                EducacionBasicaAdultos: Boolean,
                EducacionMedia: Boolean,
                EducacionMediaAdultos: Boolean
            }
        constructor(){
            if(!this.key){
                this.key = ''
            }
            if(this.calendario){
                this.calendario = 'calendarioA'
            }
            if(this.razonSocial){
                this.razonSocial = ''
            }
            if(this.rut){
                this.rut = ''
            }
            if(this.nit){
                this.nit = ''
            }
            if(this.escudo){
                this.escudo = ''
            }
            if(this.dane){
                this.dane = ''
            }
            if(this.resolucionAprobacion){
                this.resolucionAprobacion = ''
            }
            if(this.generoAtendIDo){
                this.generoAtendIDo = 'mixto'
            }
            if(this.nivelEnseñanza){
                this.nivelEnseñanza = {
                    Preescolar: false,
                    BasicaPrimaria: false,
                    BasicaSecundaria: false,
                    EducacionBasicaAdultos: false,
                    EducacionMedia: false,
                    EducacionMediaAdultos: false
                }
            }
        }
    }
    export class Sedes {
        public key: string
            public nombre: string
            public geolocalizacion: {
                pais: String,
                departamento: String,
                municipio: String,
                direccion: String,
                telefono: Number,
                coordenadas:{
                    latitud: Number,
                    longitud: Number
                }
            }
            public dane: string
            public jornadas:{
                mañana: Boolean,
                tarde: Boolean,
                nocturna: Boolean,
                sabatina: Boolean,
                unica: Boolean
            }
        constructor(){
            if(!this.key){
                this.key = ''
            }
            if(!this.nombre){
                this.nombre = ''
            }
            if(!this.geolocalizacion){
                this.geolocalizacion = {
                    pais: '',
                    departamento: '',
                    municipio: '',
                    direccion: '',
                    telefono: 0,
                    coordenadas:{
                        latitud: 0,
                        longitud: 0
                    }
                }
            }
            if(!this.dane){
                this.dane = ''
            }
            if(!this.jornadas){
                this.jornadas = {
                    mañana: false,
                    tarde: false,
                    nocturna: false,
                    sabatina: false,
                    unica: false
                }
            }
        }
    }
    export class Usuario{ // en la Base de datos guardar por rol como key principal
        public key: string // UID generado desde el Auth
            public rol: "super" | "rector" | "admin" | "auxiliar" | "coordinador" | "docente" | "estudiante"
            public creacion: Date
            public sede: string
            public activo: boolean
            public nombre: string
            public documentoTipo: "registroCivil" | 'tarjetaIdentidad' | 'cedula' | 'pasaporte'
            public documentoNum: number
            public telefono: number
            public direccion: string
            public barrio: string
            public email: string
            public token: string // token de autorización para enviar y recibir Push Notifications
        constructor(){
            if(!this.key){
                this.key = ''
            }
            if(!this.rol){
                this.rol = 'estudiante'
            }
            if(!this.creacion){
                this.creacion = new Date()
            }
            if(!this.nombre){
                this.nombre = ''
            }
            if(!this.documentoTipo){
                this.documentoTipo = 'registroCivil'
            }
            if(!this.telefono){
                this.telefono = 0
            }
            if(!this.direccion){
                this.direccion = ''
            }
            if(!this.barrio){
                this.barrio = ''
            }
            if(!this.email){
                this.email = ''
            }
            if(!this.token){
                this.token = ''
            }
        }
    }
    export class AñoLectivo{
        public key: string
            public inicio: Date
            public fin: Date
            public activo: boolean
        constructor(){
            if(this.key){
                this.key = ''
            }
            if(this.inicio){
                this.inicio = new Date()
            }
            if(this.fin){
                this.fin = new Date()
            }
            if(this.activo){
                this.activo = false
            }
        }
    }
    export class InformacionFamiliar{
        public key: string
        constructor(){}
    }
    export class gestionDocumental{
        public key: string
        constructor(){}
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
        constructor(){}
    }
// ------------------------------