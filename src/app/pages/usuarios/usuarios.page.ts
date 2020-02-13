import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { DataService2 } from 'src/app/services/data-service';
import { GescolarUser } from 'src/app/models/data-models';

import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

/* interface Node {
  name: string;
  checked: boolean;
  indeterminate: boolean;
  children?: Node[];
} */
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
/* const TREE_DATA: Node[] = [
  {
    name: 'Fruit',
    checked: false,
    indeterminate: false,
    children: [
      {name: 'Apple',
      checked: false,
      indeterminate: false},
      {name: 'Banana',
      checked: false,
      indeterminate: false},
      {name: 'Fruit loops',
      checked: false,
      indeterminate: false},
    ]
  }, {
    name: 'Vegetables',
    checked: false,
    indeterminate: false,
    children: [
      {
        name: 'Green',
        checked: false,
        indeterminate: false,
        children: [
          {name: 'Broccoli',
          checked: false,
          indeterminate: false},
          {name: 'Brussels sprouts',
          checked: false,
          indeterminate: false},
        ]
      }, {
        name: 'Orange',
        checked: false,
        indeterminate: false,
        children: [
          {name: 'Pumpkins',
          checked: false,
          indeterminate: false},
          {name: 'Carrots',
          checked: false,
          indeterminate: false},
        ]
      },
    ]
  },
]; */
/* {
  'Fruit',
  {
    {'Apple'},
    {'Banana'},
    {'Fruit loops'},
  }
}, {
  'Vegetables',
  {
    {
      'Green',
      {
        {'Broccoli'},
        {'Brussels sprouts'},
      }
    }, {
      'Orange',
      {
        {'Pumpkins'},
        {'Carrots'},
      }
    },
  }
}, */
const TREE_DATA2 = {
  Fruits: {
    Apple: null,
    Berries: {
      'Blueberry': null,
      'Raspberry': ['fresas', 'moras']
    },
    Orange: null
  },
  Vegetables: {
    Greens: ['Broccoli', 'Brussels sprouts'],
    Oranges: {'Pumpkins': null, 'Carrots': null}
  },
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    'Fruit loops': {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  }
};


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  data: any;
  usuarios: any;
  treeControl = new NestedTreeControl<Node2>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node2>();
  nodo = 0;
  ruta: any = [];
  nivel = 0;
  keys: any[];
  loop = 0;
  constructor(
    public router: Router,
    public ds: DataService2,
    public authService: AuthService,
    public actionSheetController: ActionSheetController
  ) {
    // console.log(this.buildFileTree(TREE_DATA2, 0));
  }
  viewUser(page: string, i: number, edit: boolean) {
    console.log(page, i, edit);
    this.router.navigate([page, { id: i }]);
  }
  hasChild = (_: number, node: Node2) => !!node.children && node.children.length > 0;
  async ngOnInit() {
    const este = this;
    let user;
    this.ds.getUser().then((u) => {
      user = new GescolarUser(u);
    });
    // console.log(user, este.ds.database);
    // obtengo las sedes de la base de datos
    this.data = {Institucion:[]}; // defino el objeto sedes para cargar en el menu de arbol
    for (const i in this.ds.database.sedes) {
      if (this.ds.database.sedes.hasOwnProperty(i)) {
        this.data.Institucion.push(this.ds.database.sedes[i].nombre);
      }
    }
    this.dataSource.data = this.buildFileTree(this.data, 0);
    console.log(this.dataSource.data);
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
  }
  // --- tree component ---------------
    onChange(node: Node2) {
      console.log('onChange', node);
      const nodos = this.dataSource.data;
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
          this.iteraNodos(this.dataSource.data[keys[0]], keys, 0, checked);
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
