import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AuthService } from 'src/app/services/AuthService';
import { Claims, GescolarUser } from 'src/app/models/data-models';
import { DataService2 } from 'src/app/services/data-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  loading: HTMLIonLoadingElement;
  test = false;
  user: GescolarUser;
  constructor(
    public zone: NgZone,
    public ds: DataService2,
    public loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.inicio();
    const c = new Claims();
    c.Acudiente = true;
    console.log(c.Rol());
  }
  ngOnInit() {
  }
  inicio() {
    if (typeof this.ds.database === 'undefined') {
      console.log(this.ds.database);
      this.authService.estado().then(() => {
        console.log('Hola', this.ds.database);
        this.user = new GescolarUser(this.ds.database.authUser);
        console.log(this.user);
        this.test = true;
      });
    } else {
      console.log('Hola', this.ds.database);
      this.user = new GescolarUser(this.ds.database.authUser);
      console.log(this.user);
      this.test = true;
    }
  }
}
