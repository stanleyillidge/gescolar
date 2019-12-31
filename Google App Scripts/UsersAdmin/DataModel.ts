// ---- Data Models ------------
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
        constructor(a) {
            this.familyName = a.familyName;
            this.givenName = a.givenName;
            this.fullName = ((a.familyName) ? (a.givenName + ' ' + a.familyName) : '');
        }
    }
    export class GsuiteOrganizations {
        title: roles; // rol en la plataforma
        primary: boolean; // true, si es el rol principal
        department: string; // dependencia según el rol
        description: string; // La descripción del rol
        constructor(a) {
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
        constructor(a) {
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
        constructor(a) {
            this.type = 'home';
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
        constructor(a) {
            this.value = a.value;
            this.primary = true;
            this.type = 'main';
        }
    }
    export class GsuiteGender {
        type: 'female' |  'male' |  'other' |  'unknown';
        customGender?: string; // Género personalizado.
        addressMeAs?: string; // la forma correcta de referirse al propietario, por ejemplo él / él / su o ellos / ellos / su.
        constructor(a) {
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
// -----------------------------
    export class GsuiteUser {
        // adaptador para crear usuarios con directory api de g-suite
        public id?: string;
        public name: GsuiteName;
        public password: string;
        public primaryEmail: string;
        public organizations: GsuiteOrganizations[];
        public orgUnitPath: string; // sede, creadas prev en las unid organizativas de g suite
        public relations?: GsuiteRelations[];
        public addresses: GsuiteAddresses[];
        public phones?: GsuitePhones[];
        public gender: GsuiteGender;
        public customSchemas: CustomSchemas;
        includeInGlobalAddressList?: boolean;
        constructor(user: any) {
            this.name = user.name;
            this.password = user.password;
            this.primaryEmail = user.primaryEmail;
            this.organizations = user.organizations;
            this.orgUnitPath = user.orgUnitPath;
            this.includeInGlobalAddressList =  ((user.includeInGlobalAddressList) ? user.includeInGlobalAddressList : false);
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
        constructor(guser: GsuiteUser | any) {
            this.uid = guser.id;
            this.rol = guser.organizations[0].title;
            this.creacion = new Date();
            this.sede = guser.orgUnitPath;
            this.activo = true;
            this.nombre = guser.name.givenName + ' ' + guser.name.familyName;
            this.fechaNacim = guser.customSchemas.Datos_Estudiantes.Fecha_de_nacimiento;
            this.documentoTipo = guser.customSchemas.Datos_Estudiantes.Tipo_de_documento;
            this.documentoNum = guser.customSchemas.Datos_Estudiantes.Numero_de_documento;
            this.telefonos = guser.phones;
            this.direcciones = guser.addresses;
            this.email = guser.primaryEmail;
            this.token =  ((guser.token) ? guser.token : '');
            this.password =  ((guser.password) ? guser.password : '');
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
// ------------------------------
