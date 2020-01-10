import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AuthService } from 'src/app/services/AuthService';
import { Claims, GescolarUser } from 'src/app/models/data-models';
import { DataService2 } from 'src/app/services/data-service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  loading: HTMLIonLoadingElement;
  test = false;
  user: GescolarUser;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  constructor(
    public ds: DataService2,
    public loadingController: LoadingController,
    private authService: AuthService
  ) {
    const c = new Claims();
    c.Acudiente = true;
    console.log(c.Rol());
  }
  ngOnInit() {
    this.user = new GescolarUser(this.ds.database.authUser);
    console.log(this.user);
  }
}
