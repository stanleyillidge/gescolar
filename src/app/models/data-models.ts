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
            Preescolar: boolean;
            BasicaPrimaria: boolean;
            BasicaSecundaria: boolean;
            EducacionBasicaAdultos: boolean;
            EducacionMedia: boolean;
            EducacionMediaAdultos: boolean;
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
            pais: string;
            departamento: string;
            municipio: string;
            direccion: string;
            telefono: number;
            coordenadas: {
            latitud: number;
            longitud: number;
            };
        };
        public dane: string;
        public jornadas: {
            mañana: boolean;
            tarde: boolean;
            nocturna: boolean;
            sabatina: boolean;
            unica: boolean;
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
    type roles =
        | 'super'
        | 'rector'
        | 'admin'
        | 'auxiliar'
        | 'coordinador'
        | 'docente'
        | 'estudiante';
    type documentoTipo =
        | 'Registro Civil'
        | 'Tarjeta de identidad'
        | 'cedula'
        | 'pasaporte'
        | 'cedula extrangera';
// ---- G-suite User ------------
    // https://developers.google.com/admin-sdk/directory/v1/reference/users#resource
    /*event:{
        name: {
            familyName: picho,
            givenName: perez
        },
        password: 123456789,
        primaryEmail: picho@lreginaldofischione.edu.co,
        organizations: [{
            title: Directivo(a) Docente,
            primary: true,
            customType: ,
            description: Coordinador
        }],
        // nuevos
        includeInGlobalAddressList: boolean, Indica si el perfil del usuario está visible
        orgUnitPath: string, La ruta completa de la organización principal se representa ( /).
        organizations: [{ // Lista de organizaciones El tamaño máximo es de 10Kb.
            name: string, // El nombre de la organización.
            title: string, // El título del usuario dentro de la organización, por ejemplo, 'miembro' o 'ingeniero'.
            primary: boolean, // Indica si esta es la organización principal del usuario.
            type: string, // El tipo de organización. Los valores aceptables son:  domain_only |  school |  unknown |  work
            customType: string, // Si el valor de type es custom, esta propiedad contiene el tipo personalizado.
            department: string, // Especifica el departamento dentro de la organización, como 'ventas' o 'ingeniería'
            symbol: string, // Símbolo de cadena de texto de la organización. Por ejemplo, el símbolo de texto para Google es GOOG.
            location: string, // La ubicación física de la organización.
            description: string, // La descripción de la organización.
            domain: string, // El dominio al que pertenece la organización.
            costCenter: string,
            fullTimeEquivalent: integer // El milipercent equivalente a tiempo completo dentro de la organización (100000 = 100%).
        }],
        relations: [{ // Una lista de las relaciones del usuario con otros usuarios. El tamaño máximo es de 2Kb.
            value: string, // El nombre de la persona con la que está relacionado el usuario
            type: string,
            customType: string // Si el valor de type es custom, esta propiedad contiene el tipo personalizado.
        }],
        addresses: [{ // A list of the user's addresses. Maximum allowed data size for this field is 10Kb.
            type: string, // custom | home | other | work
            customType: string, // Si la dirección type es custom, esta propiedad contiene el valor personalizado.
            sourceIsStructured: boolean,
            formatted: string,
            poBox: string, // El apartado de correos, si está presente.
            extendedAddress: string, // barrio
            streetAddress: string, // La dirección
            locality: string, // El pueblo o ciudad de la dirección.
            region: string, // La provincia o estado abreviado.
            postalCode: string, // El código postal o postal, si corresponde.
            country: string, // País.
            primary: boolean, // Si esta es la dirección principal del usuario
            countryCode: string // El código del país Utiliza el estándar ISO 3166-1 .
        }],
        phones: [{ // Una lista de los números de teléfono del usuario. El tamaño máximo es de 1Kb.
            value: string, // Un número de teléfono legible para humanos. Puede estar en cualquier formato de número de teléfono.
            primary: boolean, // Indica si este es el número de teléfono principal del usuario
            type: string,
            customType: string // Si el valor de type es custom, esta propiedad contiene el tipo personalizado.
        }],
        gender: { // El tamaño máximo es de 1Kb.
            type: string, //  female |  male |  other |  unknown
            customGender: string, // Género personalizado.
            addressMeAs: string // forma correcta de referirse al propietario, por ejemplo él / él / su o ellos / ellos / su.
        },
        customSchemas: { // objetos relacionados varios ejem: grados, grupos, etc
            (key): {
                (key): (value)
            }
        }
    } */
    interface GsuiteName {
        familyName: string;
        givenName: string;
        fullName?: string;
    }
    interface GsuiteOrganizations {
        title: roles; // rol en la plataforma
        primary: boolean; // true, si es el rol principal
        department: string; // dependencia según el rol
        description: string; // La descripción del rol
    }
    interface GsuiteRelations {
        value: string; // El nombre de la persona con la que está relacionado el usuario
        type:
            | 'admin_assistant'
            | 'assistant'
            | 'brother'
            | 'child'
            | 'custom'
            | 'domestic_partner'
            | 'dotted_line_manager'
            | 'exec_assistant'
            | 'father'
            | 'friend'
            | 'manager'
            | 'mother'
            | 'parent'
            | 'partner'
            | 'referred_by'
            | 'relative'
            | 'sister'
            | 'spouse';
        customType?: string; // Si el valor de type es custom, esta propiedad contiene el tipo personalizado.
    }
    interface GsuiteAddresses {
        type: string; // custom | home | other | work
        streetAddress: string; // La dirección
        extendedAddress: string; // el barrio
        locality: string; // El pueblo o ciudad de la dirección.
        region: string; // La provincia o estado abreviado.
        postalCode?: string; // El código postal o postal, si corresponde.
        country: string; // País.
        primary: boolean; // Si esta es la dirección principal del usuario.
    }
    interface GsuitePhones {
        value: string; // Un número de teléfono legible para humanos. Puede estar en cualquier formato de número de teléfono.
        primary: boolean; // Indica si este es el número de teléfono principal del usuario.
        type:
            | 'assistant'
            | 'callback'
            | 'car'
            | 'company_main'
            | 'custom'
            | 'grand_central'
            | 'home'
            | 'home_fax'
            | 'isdn'
            | 'main'
            | 'mobile'
            | 'other'
            | 'other_fax'
            | 'pager'
            | 'radio'
            | 'telex'
            | 'tty_tdd'
            | 'work'
            | 'work_fax'
            | 'work_mobile'
            | 'work_pager';
        customType?: string; // Si el valor de type es custom, esta propiedad contiene el tipo personalizado.
    }
    interface GsuiteGender {
        type: string; //  female |  male |  other |  unknown
        customGender?: string; // Género personalizado.
        addressMeAs?: string; // la forma correcta de referirse al propietario, por ejemplo él / él / su o ellos / ellos / su.
    }
    interface CustomSchemas {
        Identificacion: {
            tipo: documentoTipo;
            numero: number;
        };
    }
    export class GsuiteUser {
        // adaptador para crear usuarios con directory api de g-suite
        public id: string;
        public name: GsuiteName;
        public password: string;
        public primaryEmail: string;
        public organizations: GsuiteOrganizations[];
        public orgUnitPath: string; // sede, creadas prev en las unid organizativas de g suite
        includeInGlobalAddressList?: boolean;
        public relations: GsuiteRelations[];
        public addresses: GsuiteAddresses[];
        public phones: GsuitePhones[];
        public gender: GsuiteGender;
        public customSchemas: CustomSchemas;
        constructor(user: any) {
            this.id = ((user.id) ? user.id : '');
            this.name = user.name;
            this.password = user.password;
            this.primaryEmail = user.primaryEmail;
            this.organizations = user.organizations;
            this.orgUnitPath = user.orgUnitPath;
            this.includeInGlobalAddressList =  ((user.includeInGlobalAddressList) ? user.includeInGlobalAddressList : '');
            this.relations = user.relations;
            this.addresses = user.addresses;
            this.phones = user.phones;
            this.gender = user.gender;
            this.customSchemas = user.identificacion;
        }
    }
// ---- Firebase user -----------
    export class Claims {
        // en la Base de datos guardar por rol como key principal
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
    export class Usuario {
        // en la Base de datos guardar por rol como key principal
        public uid: string; // UID generado desde el Auth
        public rol: roles;
        public creacion: Date;
        public sede: string;
        public activo: boolean;
        public nombre: string;
        public documentoTipo: documentoTipo;
        public documentoNum: number;
        public telefono: string;
        public direccion: string;
        public barrio: string;
        public email: string;
        token?: string; // token de autorización para enviar y recibir Push Notifications
        password?: string;
        constructor(guser: GsuiteUser | any) {
            this.uid = guser.id;
            this.rol = guser.organizations[0].title;
            this.creacion = new Date();
            this.sede = guser.orgUnitPath;
            this.activo = true;
            this.nombre = guser.name.givenName + ' ' + guser.name.familyName;
            this.documentoTipo = guser.customSchemas.Identificacion.tipo;
            this.documentoNum = guser.customSchemas.Identificacion.numero;
            this.telefono = guser.phones[0].value;
            this.direccion = guser.addresses[0].streetAddress;
            this.barrio = guser.addresses[0].extendedAddress;
            this.email = guser.primaryEmail;
            this.token =  ((guser.token) ? guser.token : '');
            this.password =  ((guser.password) ? guser.password : '');
        }
    }
// ------------------------------
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
