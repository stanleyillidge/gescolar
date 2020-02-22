import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { DataService2 } from 'src/app/services/data-service';
import { GescolarUser } from 'src/app/models/data-models';

import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';

// --- Tree component -------
export class Estado {
  ruta: any;
  keys: any;
  nodo: number;
  item: number;
  checked: boolean;
  indeterminate: boolean;
  level: number;
  expandable: boolean;
}
export class Node2 {
  name: string;
  estado: Estado;
  children?: Node2[];
}
// --- Table ----------------
export class UserDataTable {
  nombre: string;
  email: string;
  cargo: string;
  telefono: string;
  position: number;
  constructor(a: any, pos: number) {
    this.nombre = a.nombre;
    this.email = a.email;
    this.cargo = a.rol;
    this.telefono = a.telefonos[0].value;
    this.position = pos;
  }
}
export interface Section {
  name: string;
  updated: Date;
}
// --------------------------

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  data: any;
  usuarios: any;
  // --- tree ----------------------
    treeControl = new NestedTreeControl<Node2>(node => node.children);
    treeData = new MatTreeNestedDataSource<Node2>();
    nodo = 0;
    ruta: any = [];
    nivel = 0;
    keys: any[];
    loop = 0;
  // --- Table ---------------------
    displayedColumns: string[] = ['select', 'nombre', 'email', 'cargo', 'telefono'];
    displayedColumnsT: string[] = ['select', 'nombre', 'email', 'cargo', 'telefono'];
    tableData: MatTableDataSource<UserDataTable>;
    selection = new SelectionModel<UserDataTable>(true, []);
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    users: any[];
    myInnerHeight = 0;
    states = [
      {name: 'Alabama', capital: 'Montgomery'},
      {name: 'Alaska', capital: 'Juneau'},
      {name: 'Arizona', capital: 'Phoenix'},
      {name: 'Arkansas', capital: 'Little Rock'},
      {name: 'California', capital: 'Sacramento'},
      {name: 'Colorado', capital: 'Denver'},
      {name: 'Connecticut', capital: 'Hartford'},
      {name: 'Delaware', capital: 'Dover'},
      {name: 'Florida', capital: 'Tallahassee'},
      {name: 'Georgia', capital: 'Atlanta'},
      {name: 'Hawaii', capital: 'Honolulu'},
      {name: 'Idaho', capital: 'Boise'},
      {name: 'Illinois', capital: 'Springfield'},
      {name: 'Indiana', capital: 'Indianapolis'},
      {name: 'Iowa', capital: 'Des Moines'},
      {name: 'Kansas', capital: 'Topeka'},
      {name: 'Kentucky', capital: 'Frankfort'},
      {name: 'Louisiana', capital: 'Baton Rouge'},
      {name: 'Maine', capital: 'Augusta'},
      {name: 'Maryland', capital: 'Annapolis'},
      {name: 'Massachusetts', capital: 'Boston'},
      {name: 'Michigan', capital: 'Lansing'},
      {name: 'Minnesota', capital: 'St. Paul'},
      {name: 'Mississippi', capital: 'Jackson'},
      {name: 'Missouri', capital: 'Jefferson City'},
      {name: 'Montana', capital: 'Helena'},
      {name: 'Nebraska', capital: 'Lincoln'},
      {name: 'Nevada', capital: 'Carson City'},
      {name: 'New Hampshire', capital: 'Concord'},
      {name: 'New Jersey', capital: 'Trenton'},
      {name: 'New Mexico', capital: 'Santa Fe'},
      {name: 'New York', capital: 'Albany'},
      {name: 'North Carolina', capital: 'Raleigh'},
      {name: 'North Dakota', capital: 'Bismarck'},
      {name: 'Ohio', capital: 'Columbus'},
      {name: 'Oklahoma', capital: 'Oklahoma City'},
      {name: 'Oregon', capital: 'Salem'},
      {name: 'Pennsylvania', capital: 'Harrisburg'},
      {name: 'Rhode Island', capital: 'Providence'},
      {name: 'South Carolina', capital: 'Columbia'},
      {name: 'South Dakota', capital: 'Pierre'},
      {name: 'Tennessee', capital: 'Nashville'},
      {name: 'Texas', capital: 'Austin'},
      {name: 'Utah', capital: 'Salt Lake City'},
      {name: 'Vermont', capital: 'Montpelier'},
      {name: 'Virginia', capital: 'Richmond'},
      {name: 'Washington', capital: 'Olympia'},
      {name: 'West Virginia', capital: 'Charleston'},
      {name: 'Wisconsin', capital: 'Madison'},
      {name: 'Wyoming', capital: 'Cheyenne'},
    ];
  // -------------------------------
  plataforma = {desktop: false, android: false, cordova: false};
  myInnerWidth: number;
  test: boolean;
  user: GescolarUser;
  f: number;
  constructor(
    public platform: Platform,
    public router: Router,
    public ds: DataService2,
    public authService: AuthService,
    public actionSheetController: ActionSheetController
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    // this.screenHeight = window.innerHeight;
    // this.screenWidth = window.innerWidth;
    const windowsize = ((event) ? event.target.innerWidth : window.innerWidth);
    this.myInnerWidth = (window.innerWidth * 0.015);
    console.log(windowsize);
    console.log(this.plataforma);
    console.log(this.myInnerWidth, this.myInnerHeight);
    // console.log(this.displayedColumnsT);
    const a = [];
    this.displayedColumnsT.forEach(element => {
      a.push(element);
    });
    this.displayedColumns = a;
    if (windowsize > 300 && windowsize < 500) {
      if (windowsize < 400) {
        this.f = window.innerWidth * 0.09;
      } else {
        this.f = 38;
      }
      this.myInnerHeight = window.innerHeight - (window.innerHeight * 0.27);
      this.plataforma.android = true;
      this.plataforma.cordova = true;
      this.plataforma.desktop = false;
      console.log(this.users);
      // this.hideColum('telefono');
      // this.hideColum('email');
      // this.hideColum('cargo');
    } else if (windowsize > 499 && windowsize < 800) {
      this.plataforma.android = false;
      this.plataforma.cordova = false;
      this.plataforma.desktop = true;
      this.hideColum('telefono');
      this.hideColum('email');
    } else if (windowsize > 799 && windowsize < 900) {
      this.plataforma.android = false;
      this.plataforma.cordova = false;
      this.plataforma.desktop = true;
      this.hideColum('telefono');
    }
  }
  hideColum(label: string) {
    const index = this.displayedColumns.indexOf(label);
    if (index > -1) {
      this.displayedColumns.splice(index, 1);
    }
  }
  viewUser(page: string, i: number, edit: boolean) {
    console.log(page, i, edit);
    this.router.navigate([page, { id: i }]);
  }
  hasChild = (_: number, node: Node2) => !!node.children && node.children.length > 0;
  ngOnInit() {
    const este = this;
    this.myInnerHeight = window.innerHeight - (window.innerHeight * 0.27);
    this.myInnerWidth = (window.innerWidth * 0.015);
    this.f = 40;
    this.plataforma.desktop = this.platform.is('desktop');
    this.plataforma.android = this.platform.is('android');
    this.plataforma.cordova = this.platform.is('cordova');
    setTimeout(() => {
      if (!this.ds.database) {
        console.log('initObserver');
        this.ds.initObservers();
      }
      this.ds.getUser().then((u) => {
        this.user = new GescolarUser(u);
        este.test = true;
      });
      // console.log(user, este.ds.database);
      // obtengo las sedes de la base de datos
      this.data = {Institucion:[]}; // defino el objeto sedes para cargar en el menu de arbol
      this.users = [];
      for (const i in this.ds.database.sedes) {
        if (this.ds.database.sedes.hasOwnProperty(i)) {
          this.data.Institucion.push(this.ds.database.sedes[i].nombre);
        }
      }
      this.treeData.data = this.buildFileTree(this.data, 0);
      let conta = 0;
      for (const i in this.ds.database.usuarios) {
        if (this.ds.database.usuarios.hasOwnProperty(i)) {
          this.users.push(new UserDataTable(this.ds.database.usuarios[i], conta));
          conta = conta + 1;
        }
      }
      this.tableData = new MatTableDataSource(this.users);
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
      console.log(this.treeData.data, this.tableData);
      this.onResize();
      // verifico la existencia de los datos necesarios localmente o en internet si no estan locales
      // si no estan en ninguno de los medios, muestro el formulario vacio
      if (!this.ds.database.usuarios) {
        // console.log('No estan almacenados localmente, los descargaré');
        this.load().then((a) => {
          // console.log(this.ds.database);
        });
      } else {
        // console.log('Si estan almacenados localmente');
        const filter = {nombre: 'Nombre1', sede: 'Celia'};
        // console.log(this.ds.database.MultiFilter(este.ds.database.usuarios, filter));
        this.ds.getDataBaseChildArray('usuarios').then((a) => {
          this.usuarios = a;
          // console.log(this.usuarios);
        });
      }
    }, 300);
  }
  // --- Table component --------------
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.tableData.filter = filterValue.trim().toLowerCase();

      if (this.tableData.paginator) {
        this.tableData.paginator.firstPage();
      }
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.tableData.data.length;
      return numSelected === numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.tableData.data.forEach(row => this.selection.select(row));
    }
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: UserDataTable): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
    rowSelect(row: any) {
      console.log(row);
      this.selection.toggle(row);
    }
  // --- Tree component ---------------
    onChange(node: Node2) {
      console.log('onChange', node);
      const nodos = this.treeData.data;
      const keys = ((node.estado.keys.length > 0) ? node.estado.keys : [node.estado.item]);
      this.loop = node.estado.keys.length - 1;
      this.deepNode(node, node.estado.checked);
      this.iteraNodos(nodos[keys[0]], keys, 0, node.estado.checked);
    }
    iteraNodos(node: Node2, keys: any[], i: number, checked: boolean) {
      const j = i + 1;
      if (keys.length === 1) {
        this.checkNode(node).then((t: boolean[]) => {
          // console.log('keys.length === 1 fewChecked', t[0], 'indeterminate', t[1] , 'allChecked', t[2]);
          this.accion(node, t);
          return;
        });
      } else if (i === this.loop) {
        this.checkNode(node).then((t: boolean[]) => {
          // console.log('i === this.loop fewChecked', t[0], 'indeterminate', t[1] , 'allChecked', t[2]);
          // console.log(i, this.loop, keys[i], node);
          this.accion(node, t);
          this.loop = this.loop - 1;
          if (this.loop === -1) { return; }
          this.iteraNodos(this.treeData.data[keys[0]], keys, 0, checked);
        });
      } else if (node.children[keys[j]]) {
        this.iteraNodos(node.children[keys[j]], keys, j, checked);
      }
    }
    accion(node: Node2, t: boolean[]) {
      node.estado.checked = t[0] && t[2];
      node.estado.indeterminate = false;
      if (t[2]) {
        node.estado.indeterminate = false;
      } else if (t[0] || t[1]) {
        node.estado.indeterminate = true;
      }
    }
    checkNode(node: Node2) {
      let fewChecked = false;
      let allChecked = true;
      let indeterminate = false;
      return new Promise((resolve) => {
        node.children.forEach(c => {
          fewChecked = (c.estado.checked || fewChecked);
          allChecked = (c.estado.checked && allChecked);
          indeterminate = (c.estado.indeterminate || indeterminate);
        });
        resolve([fewChecked, indeterminate, allChecked]);
      });
    }
    deepNode(node: Node2, checked: boolean) {
      for (const i in node.children) {
        if (node.children.hasOwnProperty(i)) {
          node.children[i].estado.checked = checked;
          node.children[i].estado.indeterminate = false;
          if (node.children[i]) {
            this.deepNode(node.children[i], checked);
          }
        }
      }
    }
    buildFileTree(obj: {[key: string]: any}, nivel: number): Node2[] {
      return Object.keys(obj).reduce<Node2[]>((accumulator, key, i) => {
        // console.log(key, i, nivel);
        const value = obj[key];
        const node = new Node2();
        node.estado = new Estado();
        node.estado.ruta = [];
        node.estado.keys = [];
        if (nivel === 0) {
          // console.log('nivel === 0', key, i, nivel);
          this.ruta = [];
          this.keys = [];
          this.nodo = i;
        }
        this.ruta.splice(nivel, this.nivel);
        this.keys.splice(nivel, this.nivel);
        this.ruta.forEach(e => {
          node.estado.ruta.push(e);
        });
        this.keys.forEach(k => {
          node.estado.keys.push(k);
        });
        node.estado.nodo = this.nodo;
        node.estado.item = i;
        node.name = key;
        node.estado.level = nivel;
        node.estado.checked = false;
        node.estado.expandable = false;
        node.estado.indeterminate = false;
  
        if (value != null) {
          if (typeof value === 'object') {
            node.estado.expandable = true;
            this.ruta.push(key);
            this.nivel = nivel;
            this.keys.push(i);
            // console.log(this.ruta + '');
            node.children = this.buildFileTree(value, nivel + 1);
          } else {
            node.name = value;
          }
        }
  
        return accumulator.concat(node);
      }, []);
    }
    onClick() {
      console.log('entro ok');
    }
  // ----------------------------------
  load() {
    return new Promise((resolve, reject) => {
      this.ds.roles.forEach(element => {
        this.ds.loadDatabaseChild(element)
        .then((a) => {
          // if (a) {este.showInstitucion(); } else { este.instOn = true; }
          console.log(a);
        });
        resolve(true);
      });
    });
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
