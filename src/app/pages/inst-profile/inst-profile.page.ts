import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Institucion } from 'src/app/models/data-models';
import colombia from 'src/app/models/colombia.json';
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
    type: 'jornada',
    label: 'jornadas',
    options: Jornadas
  },
  {
    type: 'departamento',
    label: 'departamento',
    options: colombia
  },
  {
    type: 'municipio',
    label: 'municipio',
    options: colombia
  }
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
  nombre: any;
  jornadas: any = [];
  departamento: any = [];
  municipio: any = [];
  municipiot: any = [];
  mIndex: any = [];

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
    // console.log(colombia);
  }
  ngOnInit() {
    this.myFormGroup = this.formBuilder.group({
      sedes: this.formBuilder.array([]),
    });
  }
  sedes(): FormArray {
    return this.myFormGroup.get('sedes') as FormArray;
  }
  newSede(): FormGroup {
    return this.formBuilder.group({
      Nombre: '',
      Dane: '',
      departamento: this.formBuilder.array([]),
      municipio: this.formBuilder.array([]),
      Direccion: '',
      Telefono: '',
      jornadas: this.formBuilder.array([{
        mañana: false,
        tarde: false,
        nocturna: false,
        sabatina: false,
        unica: false,
      }]),
      skills: this.formBuilder.array([])
    });
  }
  addSede() {
    this.sedes().push(this.newSede());
    this.jornadas[this.myFormGroup.value.sedes.length - 1] = new FormControl();
    this.departamento[this.myFormGroup.value.sedes.length - 1] = new FormControl();
    this.municipio[this.myFormGroup.value.sedes.length - 1] = new FormControl();
    this.municipiot[this.myFormGroup.value.sedes.length - 1] = false;
    // this.jornadas.push(new FormControl());
    console.log(this.myFormGroup, this.jtemp, this.jornadas);
  }
  removeSede(sedeIndex: number) {
    this.sedes().removeAt(sedeIndex);
    this.borra(sedeIndex);
  }
  borra(sedeIndex: number) {
    delete this.jtemp[sedeIndex];
    delete this.jornadas[sedeIndex];
    delete this.departamento[sedeIndex];
    delete this.municipio[sedeIndex];
    // this.jornadas.splice(0, sedeIndex);
    console.log(this.jtemp, this.jornadas);
  }
  // --- Jornadas ------------
    sedeJornadas(sedeIndex: number): FormArray {
      return this.sedes().at(sedeIndex).get('jornadas') as FormArray;
    }
    addSedeJornada(sedeIndex: number, opt: any) {
      this.myFormGroup.value.sedes[sedeIndex].jornadas[0][opt] = !this.myFormGroup.value.sedes[sedeIndex].jornadas[0][opt];
      console.log(sedeIndex, opt);
      console.log(this.jtemp, this.myFormGroup);
    }
    addSedeDepartamento(sedeIndex: number, opt: any) {
      this.myFormGroup.value.sedes[sedeIndex].departamento = opt.departamento;
      this.municipiot[sedeIndex] = true;
      this.mIndex[sedeIndex] = opt.id;
    }
    addSedemunicipio(sedeIndex: number, opt: any) {
      this.myFormGroup.value.sedes[sedeIndex].municipio = opt;
    }
    removeSedeJornada(sedeIndex: number, jornadaIndex: number) {
      this.sedeJornadas(sedeIndex).removeAt(jornadaIndex);
      this.borra(sedeIndex);
      // [2].value[""0""]
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
  onSubmit(i: number) {
    // console.log(this.myFormGroup.value.sedes[i]);
    console.log(this.myFormGroup);
    console.log(this.jtemp, this.jornadas);
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
