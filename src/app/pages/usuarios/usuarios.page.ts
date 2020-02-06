import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { DataService2 } from 'src/app/services/data-service';
import { GescolarUser } from 'src/app/models/data-models';

const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  data: any;
  constructor(
    public router: Router,
    public ds: DataService2,
    public authService: AuthService,
    public actionSheetController: ActionSheetController
  ) { }
  viewUser(page: string, i: number, edit: boolean) {
    console.log(page, i, edit);
    this.router.navigate([page, { id: i }]);
  }
  async ngOnInit() {
    // this.otro();
    const este = this;
    let user;
    this.ds.getUser().then((u) => {
      user = new GescolarUser(u);
    });
    console.log(user, este.ds.database);
    this.data = {Sedes:[]};
    for (const i in this.ds.database.sedes) {
      if (this.ds.database.sedes.hasOwnProperty(i)) {
        this.data.Sedes.push(this.ds.database.sedes[i].nombre);
      }
    }
    // verifico la existencia de los datos necesarios localmente o en internet si no estan locales
    // si no estan en ninguno de los medios, muestro el formulario vacio
    if (!this.ds.database.usuarios) {
      // console.log('No estan almacenados localmente, los descargaré');
      this.load().then((a) => {
        console.log(this.ds.database);
      });
    } else {
      // console.log('Si estan almacenados localmente');
      const filter = {nombre: 'Nombre1', sede: 'Celia'};
      console.log(this.ds.database.MultiFilter(este.ds.database.usuarios, filter));
    }
  }
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
