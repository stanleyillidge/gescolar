import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Institucion, Sedes } from 'src/app/models/data-models';
import colombia from 'src/app/models/colombia.json';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DataService2 } from 'src/app/services/data-service';
import { AuthService } from 'src/app/services/AuthService';

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

  calendarioSelect: 'calendarioA' | 'calendarioB';
  generoSelect: 'mixto' | 'masculino' | 'femenino';
  nivelSelect: any;
  nivelsEns = new FormControl();
  nombre: any;
  razonSocial: any;
  mision: any;
  rut: any;
  nit: any;
  dane: any;

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
  nivelsEnList: Selector[] = [
    {value: 'Preescolar', viewValue: 'Preescolar'},
    {value: 'BasicaPrimaria', viewValue: 'Basica Primaria'},
    {value: 'BasicaSecundaria', viewValue: 'Basica Secundaria'},
    {value: 'EducacionMedia', viewValue: 'Educacion media'},
    {value: 'EducacionBasicaAdultos', viewValue: 'Educacion basica para adultos'},
    {value: 'EducacionMediaAdultos', viewValue: 'Educacion media para adultos'}
  ];

  myFormGroup: FormGroup;
  sedeTemplate = sede_template;

  jtemp: any = {};

  user: any;

  constructor(
    private plataforma: Platform,
    public ds: DataService2,
    public auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    // console.log(this.plataforma.is('android'));
    // console.log(this.plataforma.is('desktop'));
    // console.log(colombia);
  }
  async ngOnInit() {
    const este = this;
    this.myFormGroup = this.formBuilder.group({
      sedes: this.formBuilder.array([]),
    });
    this.user = await this.auth.getUser();
    if (!this.ds.database.institucion) {
      this.ds.initDatabase(this.user.uid).then(() => {
        // console.log(este.ds.database);
        this.ds.loadDatabase('institucion').then((a) => {
          console.log(este.ds.database.institucion);
          const key = Object.keys(este.ds.database.institucion);
          este.Path = ((este.ds.database.institucion[key[0]].escudo) ? este.ds.database.institucion[key[0]].escudo : este.Path);
          este.nombre = este.ds.database.institucion[key[0]].nombre;
          este.calendarioSelect = este.ds.database.institucion[key[0]].calendario;
          este.razonSocial = este.ds.database.institucion[key[0]].razonSocial;
          este.mision = este.ds.database.institucion[key[0]].mision;
          este.rut = este.ds.database.institucion[key[0]].rut;
          este.nit = este.ds.database.institucion[key[0]].nit;
          este.dane = este.ds.database.institucion[key[0]].dane;
          este.generoSelect = este.ds.database.institucion[key[0]].generoAtendido;
          const obj = este.ds.database.institucion[key[0]].nivelEnseñanza;
          const keys = [];
          for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
              if (obj[i]) {
                keys.push(i);
              }
            }
          }
          este.nivelsEns.setValue(keys);
          console.log('nivelEnseñanza', keys, este.nivelsEns.value);
        }).catch((e) => { console.log(e); });
        this.ds.loadDatabase('sedes').then((a) => {
          console.log(este.ds.database.sedes);
          for (const i in este.ds.database.sedes) {
            if (este.ds.database.sedes.hasOwnProperty(i)) {
              // const element = este.ds.database.sedes[i];
              este.addSede(este.ds.database.sedes[i]);
            }
          }
        }).catch((e) => { console.log(e); });
      });
    }
  }
  sedes(): FormArray {
    return this.myFormGroup.get('sedes') as FormArray;
  }
  newSede(sede?: Sedes): FormGroup {
    console.log(sede);
    return this.formBuilder.group({
      key: ((sede) ? sede.key : this.ds.newKey),
      Nombre: ((sede) ? sede.nombre : ''),
      Dane: ((sede) ? sede.dane : ''),
      departamento: ((sede) ? sede.departamento : this.formBuilder.array([])),
      municipio: ((sede) ? sede.municipio : this.formBuilder.array([])),
      Direccion: ((sede) ? sede.direccion : ''),
      Telefono: ((sede) ? sede.telefono : ''),
      jornadas: this.formBuilder.array([{
        mañana: ((sede) ? sede.jornadas.mañana : false),
        tarde: ((sede) ? sede.jornadas.tarde : false),
        nocturna: ((sede) ? sede.jornadas.nocturna : false),
        sabatina: ((sede) ? sede.jornadas.sabatina : false),
        unica: ((sede) ? sede.jornadas.unica : false),
      }]),
      skills: this.formBuilder.array([])
    });
  }
  addSede(sede?: Sedes) {
      this.sedes().push(this.newSede(sede));
      const key = this.myFormGroup.value.sedes.length - 1;
      this.municipiot[key] = false;
      this.departamento[key] = new FormControl();
      this.municipio[key] = new FormControl();
    // ---- jornadas ---------------
      const obj = this.myFormGroup.value.sedes[key].jornadas[0];
      const keys = [];
      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (obj[i]) {
            keys.push(i);
          }
        }
      }
      this.jornadas[key] = new FormControl(keys);
    // ---- departamento -----------
      if (sede) {
        if (sede.departamento) {
          this.departamento[key] = new FormControl(sede.departamento);
          const index = colombia.findIndex(a => a.departamento === sede.departamento);
          console.log(sede.departamento, index);
          this.addSedeDepartamento(key, colombia[index]);
          // this.departamento[key].setValue(sede.departamento);
          this.myFormGroup.value.sedes[key].departamento = sede.departamento;
          if (sede.municipio) {
            // this.municipio[key].setValue(sede.municipio);
            this.municipio[key] = new FormControl(sede.municipio);
            this.myFormGroup.value.sedes[key].municipio = sede.municipio;
          }
        }
      }
    // ------------------------------
      // this.jornadas.push(new FormControl());
      console.log(this.myFormGroup, this.jtemp, this.jornadas);
  }
  removeSede(sedeIndex: number) {
    this.borra(sedeIndex);
    this.sedes().removeAt(sedeIndex);
  }
  borra(sedeIndex: number) {
    console.log(sedeIndex, this.myFormGroup);
    const key = this.myFormGroup.value.sedes[sedeIndex].key;
    delete this.ds.database.sedes[key];
    delete this.jtemp[sedeIndex];
    delete this.jornadas[sedeIndex];
    delete this.departamento[sedeIndex];
    delete this.municipio[sedeIndex];
    // this.jornadas.splice(0, sedeIndex);
    console.log(this.ds.database, this.myFormGroup, this.jtemp, this.jornadas);
  }
  // -----------------------
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
    addNivelEns() {
      console.log(this.nivelsEns);
      this.nivelSelect = {
        Preescolar: false,
        BasicaPrimaria: false,
        BasicaSecundaria: false,
        EducacionMedia: false,
        EducacionBasicaAdultos: false,
        EducacionMediaAdultos: false
      };
      for (const i in this.nivelsEns.value) {
        if (this.nivelsEns.value.hasOwnProperty(i)) {
          this.nivelSelect[this.nivelsEns.value[i]] = !this.nivelSelect[this.nivelsEns.value[i]];
        }
      }
      // console.log(this.nivelSelect, this.nivelsEns.value);
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
    let institucion = new Institucion();
    let sedes = [];
    const key = Object.keys(this.ds.database.institucion);
    this.addNivelEns();
    institucion = {
      key: ((key) ? key[0] : ''),
      escudo: '',
      resolucionAprobacion: '',
      nombre: this.nombre,
      mision: this.mision,
      calendario: this.calendarioSelect,
      razonSocial: this.razonSocial,
      rut: this.rut,
      nit: this.nit,
      dane: this.dane,
      generoAtendido: this.generoSelect,
      nivelEnseñanza: this.nivelSelect
    };
    // console.log(institucion);
    let s = new Sedes();
    this.myFormGroup.value.sedes.forEach(sede => {
      // console.log(sede);
      s = {
        key: sede.key,
        nombre: sede.Nombre,
        departamento: sede.departamento,
        municipio: sede.municipio,
        direccion: sede.Direccion,
        telefono: sede.Telefono,
        dane: sede.Dane,
        jornadas: {
          mañana: sede.jornadas[0].mañana,
          tarde: sede.jornadas[0].tarde,
          nocturna: sede.jornadas[0].nocturna,
          sabatina: sede.jornadas[0].sabatina,
          unica: sede.jornadas[0].unica
        }
      };
      sedes.push(s);
    });
    console.log(this.myFormGroup, institucion, sedes);
    this.ds.infInstitucional(institucion, sedes).then((a) => {
      console.log(a);
    })
    .catch((e) => {
      console.log(e);
    });
  }
  onFile(e) {
    const este = this;
    this.imagen =  e.target.files[0] as Blob;
    this.ds.updateImg({nombre: 'logo', ubicacion: 'logo'}, this.imagen);

    const reader = new FileReader();

    reader.onload = function(e) {
      const src: any = reader.result;
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
