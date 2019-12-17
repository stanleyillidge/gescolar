import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DataService } from './services/data-service';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import * as firebase from 'firebase/app';

import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

// esta cuenta esta ligada al correo stanley.illidge@lreginaldofischione.edu.co y la eleve a Blaze (pago por uso)
var firebaseConfig = {
  apiKey: "AIzaSyCdCTYPL1-PPQb3rpOi5Ls_oGoMfPjvXG8",
  authDomain: "g-escolar-plus-demo.firebaseapp.com",
  databaseURL: "https://g-escolar-plus-demo.firebaseio.com",
  projectId: "g-escolar-plus-demo",
  storageBucket: "g-escolar-plus-demo.appspot.com",
  messagingSenderId: "395322918531",
  appId: "1:395322918531:web:aaf5e5a050a3743d2e7db6",
  measurementId: "G-DM69H5H8BG"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataService,
    FileTransfer,
    File,
    WebView,
    GooglePlus
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
