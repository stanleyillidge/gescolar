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
  user: GescolarUser;
  constructor(
    public zone: NgZone,
    public ds: DataService2,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    private authService: AuthService
  ) {}
  ngOnInit() {
    const este = this;
    setTimeout(() => {
      this.menuCtrl.enable(true).then((r) => {
        console.log(r);
      });
      this.ds.initObservers();
      this.ds.getUser().then((u) => {
        este.user = new GescolarUser(u);
        este.test = true;
        console.log(este.user);
      });
    }, 300);
  }
  async inicio() {}
}
