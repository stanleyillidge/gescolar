import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Institucion } from 'src/app/models/data-models';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

export interface Selector {
  value: string;
  viewValue: string;
}
const Jornadas: string[] = [
  'mañana',
  'tarde',
  'nocturna',
  'sabatina',
  'unica'];
const j = {
    mañana: false,
    tarde: false,
    nocturna: false,
    sabatina: false,
    unica: false,
  };
const sede_template = [
  {
    type: 'text',
    label: 'Nombre',
  },
  {
    type: 'text',
    label: 'Dane'
  },
  {
    type: 'text',
    label: 'Direccion'
  },
  {
    type: 'text',
    label: 'Telefono'
  },
  {
    type: 'selectMult',
    label: 'jornadas',
    options: Jornadas
  },
  // {
  //   type: 'select',
  //   label: 'Jornadas',
  //   options: ['Jane Eyre', 'Pride and Prejudice', 'Wuthering Heights']
  // }
];

@Component({
  selector: 'app-inst-profile',
  templateUrl: './inst-profile.page.html',
  styleUrls: ['./inst-profile.page.scss'],
})
export class InstProfilePage implements OnInit {
  step = 0;
  Path = '/assets/images/logo0.png';
  imagen: File | Blob;
  institucion: Institucion;

  calendarioSelect: string;
  generoSelect: string;
  nivelSelect: string;
  nivelsEns = new FormControl();
  jornadas = new FormControl();

  calendarios: Selector[] = [
    {value: 'calendarioA', viewValue: 'Calendario A'},
    {value: 'calendarioB', viewValue: 'Calendario B'},
  ];
  generos: Selector[] = [
    {value: 'mixto', viewValue: 'Mixto'},
    {value: 'masculino', viewValue: 'Masculino'},
    {value: 'femenino', viewValue: 'Femenino'},
  ];
  nivelsEnList: string[] = ['Preescolar',
  'Basica Primaria',
  'Basica Secundaria',
  'Educacion media',
  'Educacion basica para adultos',
  'Educacion media para adultos'];

  myFormGroup: FormGroup;
  sedeTemplate = sede_template;

  jtemp: any = {};

  constructor(
    private plataforma: Platform,
    private formBuilder: FormBuilder
  ) {
    // console.log(this.plataforma.is('android'));
    // console.log(this.plataforma.is('desktop'));
  }
  ngOnInit() {
    this.myFormGroup = this.formBuilder.group({
      sedes: this.formBuilder.array([]) ,
    });
  }
  sedes(): FormArray {
    return this.myFormGroup.get('sedes') as FormArray;
  }
  newSede(): FormGroup {
    return this.formBuilder.group({
      Nombre: '',
      Dane: '',
      Direccion: '',
      Telefono: '',
      jornadas: this.formBuilder.array([]),
      skills: this.formBuilder.array([])
    });
  }
  addSede() {
    this.sedes().push(this.newSede());
  }
  removeSede(sedeIndex: number) {
    this.sedes().removeAt(sedeIndex);
  }
  // --- Jornadas ------------
    sedeJornadas(sedeIndex: number): FormArray {
      return this.sedes().at(sedeIndex).get('jornadas') as FormArray;
    }
    newJornada(sedeIndex: number, opt: any): FormGroup {
      if (!this.jtemp[sedeIndex]) {
        this.jtemp[sedeIndex] = j;
      }
      this.jtemp[sedeIndex][opt] = !this.jtemp[sedeIndex][opt];
      return this.formBuilder.group(this.jtemp[sedeIndex]);
    }
    addSedeJornada(sedeIndex: number, opt: any) {
      this.sedeJornadas(sedeIndex).removeAt(sedeIndex);
      this.sedeJornadas(sedeIndex).push(this.newJornada(sedeIndex, opt));
    }
    removeSedeJornada(sedeIndex: number, jornadaIndex: number) {
      this.sedeJornadas(sedeIndex).removeAt(jornadaIndex);
    }
  // -----------------------
  // --- Skills ------------
    sedeSkills(sedeIndex: number): FormArray {
      return this.sedes().at(sedeIndex).get('skills') as FormArray;
    }
    newSkill(): FormGroup {
      return this.formBuilder.group({
        skill: '',
        exp: '',
      });
    }
    addSedeSkill(sedeIndex: number) {
      this.sedeSkills(sedeIndex).push(this.newSkill());
    }
    removeSedeSkill(sedeIndex: number, skillIndex: number) {
      this.sedeSkills(sedeIndex).removeAt(skillIndex);
    }
  // -----------------------
  otro() {
    // const group = {};
    // form_template.forEach(input_template => {
    //   group[input_template.label] = new FormControl('');
    // });
    // this.myFormGroup = new FormGroup(group);
  }
  onSubmit() {
    console.log(this.myFormGroup.value);
  }
  onFile(e) {
    const este = this;
    this.imagen =  e.target.files[0] as File;

    const reader = new FileReader();

    reader.onload = function(e) {
      const src: any = e.target.result;
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
