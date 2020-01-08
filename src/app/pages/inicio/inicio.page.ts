import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AuthService } from 'src/app/services/AuthService';
import { Claims } from 'src/app/models/data-models';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  loading: HTMLIonLoadingElement;
  test = false;
  constructor(
    public loadingController: LoadingController,
    private authService: AuthService
  ) {
    const c = new Claims();
    c.Acudiente = true;
    console.log(c.Rol);
  }
  ngOnInit() {
  }
  logout() {
    this.authService.logout();
  }
}
