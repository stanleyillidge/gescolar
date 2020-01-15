import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController, MenuController } from '@ionic/angular';
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
  user: firebase.User;
  constructor(
    public zone: NgZone,
    public ds: DataService2,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.inicio();
    const c = new Claims();
    c.Acudiente = true;
    console.log(c.Rol());
  }
  async ionViewWillEnter() {
    this.menuCtrl.enable(true).then((r) => {
      console.log(r);
    });
    this.user = await this.authService.getUser();
    console.log(this.user);
    this.test = true;
  }
  ngOnInit() {
  }
  async inicio() {}
}
