// ---- Basicos -----------------
    export class Usuario{ // en la Base de datos guardar por rol como key principal
        public key: string // UID generado desde el Auth
            public rol: 'admin' | 'empleado' | 'proveedor' | 'cliente'
            public creacion: Date
            public nombre: string
            public cedula: string
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
                this.rol = 'empleado'
            }
            if(!this.creacion){
                this.creacion = new Date()
            }
            if(!this.nombre){
                this.nombre = ''
            }
            if(!this.cedula){
                this.cedula = ''
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
    export class Bodega {
        public key: string // PushID de la bodega
            public creacion: Date
            public nombre: string
            public codigo: string // ID unico para identificar la bodega
            public cantidad: number // numero total de productos, se calcula con base al inventario
            public descripcion: string
            public imagen: string
            public largo: number // largo en metros[m] de la bodega
            public ancho: number // ancho en metros[m] de la bodega
            public alto: number // alto en metros[m] de la bodega
            public espacioDisponible: number // espacioDisponible en metros[m] de la bodega
        constructor() {
            if(!this.creacion){
                this.creacion = new Date()
            }
            if (!this.imagen) {
                this.imagen = "/assets/shapes.svg";
            }
            if (!this.nombre) {
                this.nombre = "";
            }
            if (!this.codigo) {
                this.codigo = "";
            }
            if (!this.cantidad) {
                this.cantidad = 0;
            }
            if (!this.espacioDisponible) {
                this.espacioDisponible = (this.alto * this.largo * this.ancho);
            }
            if (!this.descripcion) {
                this.descripcion = "";
            }
            if (!this.key) {
                this.key = "";
            }
            if(!this.largo){
                this.largo = 0
            }
            if(!this.ancho){
                this.ancho = 0
            }
            if(!this.alto){
                this.alto = 0
            }
        }
        get Capacidad(){
            return (this.alto * this.largo * this.ancho)
        }
    }
    export class Producto {
        // [ seria necesario crear un producto base nuevo para cada presentación del producto ej: cerveza corona 355ml y cerveza corona 207ml]
        public key: string // PushID del Producto
            public creacion: Date
            public nombre: string // nombre del producto
            public tipo: 'consumible' | 'mueble' | 'producto'
            public imagen: string
            public descripcion: string
            public disponibilidad: boolean
            public largo: number // largo en metros[m] del empaque del producto
            public ancho: number // ancho en metros[m] del empaque del producto
            public alto: number // alto en metros[m] del empaque del producto
            public cantidad: number // numero total de unidades de producto dentro del empaque
            public precio: number // precio de venta del producto [ solo el admin puede definirlo ]
            public descuento: number // porcentaje de descuento unitario [ solo el admin puede definirlo ]
        constructor() { 
            if(!this.key){
                this.key = ''
            }
            if (!this.imagen) {
                this.imagen = "/assets/shapes.svg";
            }
            if(!this.creacion){
                this.creacion = new Date()
            }
            if(!this.nombre){
                this.nombre = ''
            }
            if(!this.tipo){
                this.tipo = 'producto'
            }
            if(!this.imagen){
                this.imagen = ''
            }
            if(!this.descripcion){
                this.descripcion = ''
            }
            if(!this.disponibilidad){
                this.disponibilidad = true
            }
            if(!this.largo){
                this.largo = 0
            }
            if(!this.ancho){
                this.ancho = 0
            }
            if(!this.alto){
                this.alto = 0
            }
            if(!this.cantidad){
                this.cantidad = 0
            }
            if(!this.precio){
                this.precio = 0
            }
            if(!this.descuento){
                this.descuento = 0
            }
        }
        get Tamaño(){
            return ((this.alto * this.largo * this.ancho)/1)
        }
    }
    export class Documento{
        public key: string // PushID del documento
            public tipo: 'compra' | 'venta' | 'traslado' | 'notaDebito' | 'notaCredito'
            public creacion: Date
            public estado: 'pagado' | 'pendiente' | 'anulado'
            public modificacion: Date | null
            public observacion: string | null
            public numProductos: number // Numero total de productos relacionados en el documento
            public proveedor: string // PushID del proveedor
            public comprador: string // PushID del comprador al que va dirigida
            public usuario: string // PushID del empleado que realiza el documento
            public valor: number // monto total de todos los productos relacionnados en el documentos
            public abonos: number
        constructor() {
            if(!this.tipo){
                this.tipo = 'compra'
            }
            if(!this.creacion){
                this.creacion = new Date
            }
            if(!this.estado){
                this.estado = 'pendiente'
            }
            if(!this.numProductos){
                this.numProductos = 0
            }
            if(!this.proveedor){
                this.proveedor = ''
            }
            if(!this.comprador){
                this.comprador = ''
            }
            if(!this.usuario){
                this.usuario = ''
            }
            if(!this.valor){
                this.valor = 0
            }
            if(!this.abonos){
                this.abonos = 0
            }
            if(!this.key){
                this.key = ''
            }
            if(!this.modificacion){
                this.modificacion = null
                this.observacion = null
            }
        }
    }
    export class ListaDetallada {
        // se incluiran los productos uno a uno con un PushID para cada ingreso
        public key: string // PushID del producto en la lista
            public tipo: 'compra' | 'venta' | 'traslado' | 'notaDebito' | 'notaCredito'
            public estado: 'pagado' | 'pendiente' | 'anulado'
            public creacion: Date
            public nombre: string // nombre del producto
            public bodega: string // PushID de la bodega
            public documento: string // PushID del documento al cual pertenece el elemento
            public proveedor: string // PushID del vendedor // campo heredado del documento
            public comprador: string // PushID del comprador al que va dirigida // campo heredado del documento
            public usuario: string // PushID del empleado que realiza el documento // campo heredado del documento
            public producto: string // PushID del Producto relacionado en el documento
            public precio: number // precio de venta unitario del producto en ese momento // campo heredado del Producto
            public costo: number // precio de compra del producto
            public descuento: number // porcentaje de descuento unitario otorgado por el vendedor // campo heredado del Producto
            public cantidad: number // cantidad total de productos de la misma denominación
        constructor() {
            if (this.tipo == 'compra') {
                    this.costo = 0
                }else if (this.tipo == 'venta') {
                    this.precio = 0
            }
            if(!this.creacion){
                this.creacion = new Date();
            }
            if(!this.nombre){
                this.nombre = ''
            }
            if(!this.bodega){
                this.bodega = ''
            }
            if(!this.documento){
                this.documento = ''
            }
            if(!this.proveedor){
                this.proveedor = ''
            }
            if(!this.comprador){
                this.comprador = ''
            }
            if(!this.usuario){
                this.usuario = ''
            }
            if(!this.producto){
                this.producto = ''
            }
            if(!this.precio){
                this.precio = 0
            }
            if(!this.costo){
                this.costo = 0
            }
            if(!this.descuento){
                this.descuento = 0
            }
            if(!this.cantidad){
                this.cantidad = 0
            }
            if(!this.key){
                this.key = ''
            }
        }
        get Total(){
            if (this.tipo =='compra') {
                return (this.costo * (1 - this.descuento) * this.cantidad)
            }else if (this.tipo =='venta'){
                return (this.precio * (1 - this.descuento) * this.cantidad)
            }
        }
        Ocupacion(data: LocalDatabase){
            return data.Productos[this.producto].Tamaño * this.cantidad;
        }
    }
    export class Inventario {
        // entradas efectivas al inventario
        public key: string // PushID del inventario
            public bodega: string // PushID de la bodega
            public ingreso: Date
            public salida: Date | null
            public traslado: Date | null
            public producto: string // PushID del Producto
            public vencimiento: Date // nuemero de dias[d] que el tiene el producto para ser consumible [cron job]
            public tipo: 'consumible' | 'mueble' | 'producto' // campo heredado del Producto
            public cantidad: number // campo heredado de la ListaDetallada
            public precio: number // campo heredado del Producto
            public costo: number // precio de compra del producto en el documento
            public serie: string // codigo de barras del embalaje
            public proveedor: string // PushID del proveedor // campo heredado del documento
            public usuario: string // PushID del empleado que realiza el documento // campo heredado del documento
            public documento: string // PushID del documento
        constructor() {
            if(!this.bodega){
                this.bodega = ''
            }
            if(!this.ingreso){
                this.ingreso = new Date();
            }
            if(!this.salida){
                this.salida = null
            }
            if(!this.traslado){
                this.traslado = null
            }
            if(!this.producto){
                this.producto = ''
            }
            if(!this.vencimiento){
                this.vencimiento = new Date();
            }
            if(!this.tipo){
                this.tipo = 'producto'
            }
            if(!this.cantidad){
                this.cantidad = 0
            }
            if(!this.precio){
                this.precio = 0
            }
            if(!this.costo){
                this.costo = 0
            }
            if(!this.serie){
                this.serie = ''
            }
            if(!this.proveedor){
                this.proveedor = ''
            }
            if(!this.usuario){
                this.usuario = ''
            }
            if(!this.documento){
                this.documento = ''
            }
            if(!this.key){
                this.key = ''
            }
        }
        Ocupacion(data: LocalDatabase){
            return data.Productos[this.producto].Tamaño * this.cantidad;
        }
    }
    export class Pago {
        public key: string // PushID del pago
            public documento: string // PushID del documento
            public fecha: Date
            public valor: number // total abonado hasta la fecha del mov
            public abono: number // valor abonado en la fecha del mov
            public usuario: string // PushID del empleado que realiza el documento // campo heredado del documento
        constructor() {
            if(!this.key){
                this.key = ''
            }
            if(!this.documento){
                this.documento = ''
            }
            if(!this.fecha){
                this.fecha = new Date();
            }
            if(!this.valor){
                this.valor = 0
            }
            if(!this.abono){
                this.abono = 0
            }
            if(!this.usuario){
                this.usuario = ''
            }
        }
    }
// ---- Data Base ---------------
    export class LocalDatabase {
        public Usuarios: { [key: string]: Usuario };
        public Bodegas: { [key: string]: Bodega };
        public Documentos: { [key: string]: Documento };
        public Listas: { [key: string]: ListaDetallada };
        public Productos: { [key: string]: Producto };
        public Inventario: { [key: string]: Inventario };
        public Pagos: { [key: string]: Pago };
        constructor(){}
    }
// ------------------------------