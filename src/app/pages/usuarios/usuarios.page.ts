import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { DataService2 } from 'src/app/services/data-service';
import { GescolarUser } from 'src/app/models/data-models';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

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
    const user = this.ds.getUser;
    console.log(user, este.ds.database);
    // verifico la existencia de los datos necesarios localmente o en internet si no estan locales
    // si no estan en ninguno de los medios, muestro el formulario vacio
    if (!this.ds.database.usuarios) {
      // console.log('No estan almacenados localmente, los descargaré');
      this.ds.roles.forEach(element => {
        this.ds.loadDatabaseChild(element)
        .then((a) => {
          // if (a) {este.showInstitucion(); } else { este.instOn = true; }
          console.log(a);
        });
      });
    } else {
      // console.log('Si estan almacenados localmente');
      const filter = {nombre: 'Nombre1', sede: 'Celia'};
      console.log(this.multiFilter(este.ds.database.usuarios, filter));
    }
  }
  multiFilter(obj, filters) {
    const array = Object.values(obj);
    return array.filter(o =>
        Object.keys(filters).every(k =>
            [].concat(filters[k]).some(v => o[k].toLowerCase().includes(v.toLowerCase()))));
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
