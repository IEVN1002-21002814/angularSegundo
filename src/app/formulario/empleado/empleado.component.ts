import { Component, numberAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';

interface Empleados{
  matricula:number;
  nombre:string;
  mail:string;
  edad:number;
  horas:number;
  horasPagadas?:number;
  horasExtra?:number;
  horasExtraPagadas?:number;
  total?:number;
}

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgFor],
  templateUrl: './empleado.component.html',
  styles: ``
})

export default class EmpleadoComponent {
  formGroup!:FormGroup;
  EmpleadosVista: Empleados[] = [];
  totalisiomo = 0;

  datos:Empleados={
    matricula: 0,
    nombre: '',
    mail:'',
    edad: 0,
    horas: 0,
  }

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void{
    this.formGroup=this.initForm();
  }
  initForm():FormGroup{
    return this.fb.group({
      matricula:[''],
      nombre:[''],
      mail:[''],
      edad:[0],
      horas:[0]
    })
  }

  onSubmit():void{
    const{matricula, nombre, mail, edad, horas} = this.formGroup.value;
    this.datos.matricula= matricula;
    this.datos.nombre= nombre;
    this.datos.mail= mail;
    this.datos.edad= edad;
    this.datos.horas= horas;
    
    let arregloEmpleados = [];
    /* VERIFICAR */
    const empleadosLocal = localStorage.getItem('empleados');
    if(empleadosLocal){
      console.log('Empleados si exite!');

      /* AGREGAR */
      arregloEmpleados = JSON.parse(empleadosLocal);
    }
    console.table(arregloEmpleados)
    arregloEmpleados.push(this.datos);

    /* GUARDAR */
    let empleadosJSON = JSON.stringify(arregloEmpleados);
    localStorage.setItem('empleados', empleadosJSON);
  }

  modificar(): void {
    const { matricula, nombre, mail, edad, horas } = this.formGroup.value;
    const EmLocal = localStorage.getItem('empleados');
    
    if (EmLocal) {
      let arrEm:Empleados[] = JSON.parse(EmLocal);
      let pos1 = '';

      for( let i in arrEm){
        let empleado = arrEm[i];
        if(matricula === empleado.matricula){
          pos1 = i;

          /* NOMBRE */
          if(nombre == ''){
            empleado.nombre = empleado.nombre
          }
          else{
            empleado.nombre = nombre;
          }
          /* MAIL */
          if(mail == ''){
            empleado.mail = empleado.mail
          }
          else{
            empleado.mail = mail;
          }
          /* EDAD */
          if(edad == 0 || edad == '' || edad == null){
            empleado.edad = empleado.edad
          }
          else{
            empleado.edad = edad;
          }
          /* HORAS */
          if(horas == 0 || horas == '' || horas == null){
            empleado.horas = empleado.horas
          }
          else{
            empleado.horas = horas;
          }
        }
        
      }

      if(pos1){
        alert('Empleado modificado correctamente.');
        localStorage.setItem('empleados', JSON.stringify(arrEm));
        this.imprimir();
      }
      else{
        alert('Empleado no encontrado.');
      } 

    }
  }

  eliminar(): void {
    const { matricula } = this.formGroup.value;
    const EmLocal = localStorage.getItem('empleados');

    if (EmLocal) {
      let arrEm:Empleados[] = JSON.parse(EmLocal);
      let posicion = '';
      let borrado:boolean = false; 

      for(let i in arrEm){
        let empleado = arrEm[i];
        if(matricula === empleado.matricula){
          posicion = i;
          borrado = true;
        }
      }

      if(borrado){
        let pos2:number = Number(posicion);
        arrEm.splice(pos2, 1); 
        alert('Empleado eliminado correctamente.');
        localStorage.setItem('empleados', JSON.stringify(arrEm));
        this.imprimir();
      }
      else{
        alert('Empleado no encontrado.');
      }             
    }
  }

  imprimir(): void {
    const temporal = localStorage.getItem('empleados');
    let emArrTOP:Empleados[] = [];
    if (temporal) {
      
      emArrTOP = JSON.parse(temporal);
      this.totalisiomo =0;

      for(let i in emArrTOP){
        let empleado = emArrTOP[i];
        let horasExtras = 0;

        let horaT = empleado.horas;
        if(horaT > 40){
          horasExtras = horaT - 40;
        }
        else{
          horasExtras = 0;
        }
        
        empleado.horasPagadas = (horaT - horasExtras) * 70;;
        empleado.horasExtra = horasExtras;
        empleado.horasExtraPagadas = horasExtras * 140;
        empleado.total =  empleado.horasPagadas + empleado.horasExtraPagadas;
        this.totalisiomo = this.totalisiomo + empleado.total;
      }
      this.EmpleadosVista = emArrTOP;
    }
  }

}
