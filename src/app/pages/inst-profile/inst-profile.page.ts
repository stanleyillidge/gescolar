import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

export interface Calendario {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-inst-profile',
  templateUrl: './inst-profile.page.html',
  styleUrls: ['./inst-profile.page.scss'],
})
export class InstProfilePage implements OnInit {
  step = 0;
  Path = '/assets/images/logo0.png';
  imagen: File | Blob;
  selectedValue: string;
  calendarios: Calendario[] = [
    {value: 'calendarioA', viewValue: 'Calendario A'},
    {value: 'calendarioB', viewValue: 'Calendario B'},
  ];
  constructor(
    private plataforma: Platform,
  ) {
    console.log(this.plataforma.is('android'));
    console.log(this.plataforma.is('desktop'));
  }
  ngOnInit() {
  }
  onFile(e) {
    const este = this;
    this.imagen = <File>e.target.files[0];

    const reader = new FileReader();

    reader.onload = function(e) {
      const src: any = e.target['result'];
      este.Path = src;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
}
