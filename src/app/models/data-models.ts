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
    type roles =
        | 'Super'
        | 'Rector'
        | 'Admin'
        | 'Auxiliar'
        | 'Coordinador'
        | 'Docente'
        | 'Estudiante'
        | 'Acudiente'; // los usuarios acudientes perteneceran a misma unid organizativa
    type documentoTipo =
        | 'Registro Civil'
        | 'Tarjeta de identidad'
        | 'cedula'
        | 'pasaporte'
        | 'cedula extrangera';
    export class GsuiteName {
        familyName: string;
        givenName: string;
        fullName?: string;
        constructor(a: any) {
            this.familyName = a.familyName;
            this.givenName = a.givenName;
            this.fullName = ((a.fullName) ? a.fullName : '');
        }
    }
    export class GsuiteOrganizations {
        title: roles; // rol en la plataforma
        primary: boolean; // true, si es el rol principal
        department: string; // dependencia según el rol
        description: string; // La descripción del rol
        constructor(a: any) {
            this.title = a.title;
            this.primary = true;
            this.department = a.department;
            this.description = a.description;
        }
    }
    export class GsuiteRelations {
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
        constructor(a: any) {
            this.value = a.value;
            this.type = a.type;
        }
    }
    export class GsuiteAddresses {
        type: 'custom' | 'home' | 'other' | 'work';
        streetAddress: string; // La dirección
        extendedAddress: string; // el barrio
        locality: string; // El pueblo o ciudad de la dirección.
        region: string; // La provincia o estado abreviado.
        postalCode?: string; // El código postal o postal, si corresponde.
        country: string; // País.
        primary: boolean; // Si esta es la dirección principal del usuario.
        constructor(a: any) {
            this.type = a.type;
            this.streetAddress = a.streetAddress;
            this.extendedAddress = a.extendedAddress;
            this.locality = a.locality;
            this.region = a.region;
            this.country = 'Colombia';
            this.primary = true;
        }
    }
    export class GsuitePhones {
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
        constructor(a: any) {
            this.value = a.value;
            this.primary = true;
            this.type = 'main';
        }
    }
    export class GsuiteGender {
        type: 'female' |  'male' |  'other' |  'unknown';
        customGender?: string; // Género personalizado.
        addressMeAs?: string; // la forma correcta de referirse al propietario, por ejemplo él / él / su o ellos / ellos / su.
        constructor(a: any) {
            this.type = a.type;
        }
    }
    export class CustomSchemas {
        'Datos_Estudiantes': {
            'Fecha_de_nacimiento': Date;
            'Tipo_de_documento': documentoTipo;
            'Numero_de_documento': string;
            Jornada: 'mañana' | 'tarde' | 'noche' | 'sabados';
            Grupo: string;
            Grado: string;
        };
        constructor(a: any) {
            this.Datos_Estudiantes = {
                Fecha_de_nacimiento: a.Fecha_de_nacimiento,
                Tipo_de_documento: a.Tipo_de_documento,
                Numero_de_documento: a.Numero_de_documento,
                Jornada: ((a.Jornada) ? a.Jornada : ''),
                Grado: ((a.Grado) ? a.Grado : ''),
                Grupo: ((a.Grupo) ? a.Grupo : '')
            };
        }
    }
    export class GsuiteUser {
        // adaptador para crear usuarios con directory api de g-suite
        public id?: string;
        public name: GsuiteName;
        public password: string;
        public primaryEmail: string;
        public organizations: GsuiteOrganizations[];
        public orgUnitPath: string; // sede, creadas prev en las unid organizativas de g suite
        includeInGlobalAddressList?: boolean;
        public relations?: GsuiteRelations[];
        public addresses: GsuiteAddresses[];
        public phones?: GsuitePhones[];
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
            this.relations = ((user.relations) ? user.relations : '');
            this.addresses = user.addresses;
            this.phones = ((user.phones) ? user.phones : '');
            this.gender = user.gender;
            this.customSchemas = user.customSchemas;
        }
        get Edad() {
            const today = new Date();
            const birthDate = new Date(this.customSchemas.Datos_Estudiantes.Fecha_de_nacimiento);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
    }
// ---- Firebase user -----------
    export class Relaciones extends GsuiteRelations {
        fecha: Date; // fecha de creacion
        uid: string; // uid del usuario 'acudiente' del 'estudiante'
        activo: boolean; // true, si es esta activo en la institución
        acudiente: boolean; // define si el acudiente
        constructor(a: any) {
            super(a);
            this.fecha = new Date();
            this.uid = a.uid;
            this.activo = a.activo;
            this.acudiente = true;
        }
    }
    export class Claims {
        // en la Base de datos guardar por rol como key principal
        public Super: boolean;
        public Rector: boolean;
        public Admin: boolean;
        public Auxiliar: boolean;
        public Coordinador: boolean;
        public Docente: boolean;
        public Estudiante: boolean;
        public Acudiente: boolean;
        constructor() {
            this.Super = false;
            this.Rector = false;
            this.Admin = false;
            this.Auxiliar = false;
            this.Coordinador = false;
            this.Docente = false;
            this.Estudiante = false;
            this.Acudiente = false;
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
        public fechaNacim: Date;
        public documentoTipo: documentoTipo;
        public documentoNum: string;
        public telefonos: GsuitePhones[];
        public direcciones: GsuiteAddresses[];
        public email: string;
        public relaciones?: Relaciones[];
        token?: string; // token de autorización para enviar y recibir Push Notifications
        password?: string;
        constructor(user: GsuiteUser | Usuario) {
            if (user instanceof GsuiteUser) {
                this.uid = user.id;
                this.rol = user.organizations[0].title;
                this.creacion = new Date();
                this.sede = user.orgUnitPath;
                this.activo = true;
                this.nombre = user.name.givenName + ' ' + user.name.familyName;
                this.fechaNacim = user.customSchemas.Datos_Estudiantes.Fecha_de_nacimiento;
                this.documentoTipo = user.customSchemas.Datos_Estudiantes.Tipo_de_documento;
                this.documentoNum = user.customSchemas.Datos_Estudiantes.Numero_de_documento;
                this.telefonos = user.phones;
                this.direcciones = user.addresses;
                this.email = user.primaryEmail;
            } else {
                this.uid = user.uid;
                this.rol = user.rol;
                this.creacion = user.creacion;
                this.sede = user.sede;
                this.activo = user.activo;
                this.nombre = user.nombre;
                this.fechaNacim = user.fechaNacim;
                this.documentoTipo = user.documentoTipo;
                this.documentoNum = user.documentoNum;
                this.telefonos = user.telefonos;
                this.direcciones = user.direcciones;
                this.email = user.email;
                this.token =  ((user.token) ? user.token : '');
                this.password =  ((user.password) ? user.password : '');
            }
        }
        get Edad() {
            const today = new Date();
            const birthDate = new Date(this.fechaNacim);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
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
            this.activo = true;
        }
    }
    export class Matricula {
        public año: string; // valor del AñoLectivo activo
            public uid: string; // UID generado desde el Auth
            public acudientes: Relaciones[];
            public grado: string;
            public grupo: string;
        constructor(uid: string, acud: Relaciones[], g: string, gr: string) {
            this.año = new Date().getFullYear().toString();
            this.uid = uid;
            this.acudientes = acud;
            this.grado = g;
            this.grupo = gr;
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
        public Matriculas: { [key: string]: Matricula };
        constructor() {
        }
    }
// ------------------------------
