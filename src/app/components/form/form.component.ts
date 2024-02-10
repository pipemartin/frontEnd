import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  form: FormGroup;
  id: number | undefined;
  accion = 'Agregar';
  base64String: String | undefined
  listEmpleados: any[] = []
  listCargos: any []= []

  constructor(private fb: FormBuilder, private toastr: ToastrService,
    private _empleadoService: EmpleadoService,private sanitizer: DomSanitizer ) {
    this.form = this.fb.group({
      cedula: ['', [Validators.required,  Validators.maxLength(5), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      nombre: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(8)]],
      fechaIngreso: ['',Validators.required],
      fotoEmpleado: ['',Validators.required],
      cargo: ['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.obtenerCargos();
  }
  guardarEmpleado() {
    const fileInputElement = this.fileInput?.nativeElement as HTMLInputElement;
    const file = fileInputElement.files ? fileInputElement.files[0] : null;
    //console.log('Valor del archivo:', file);
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result?.toString().split(',')[1];
        const empleado: any = {
          cedula: parseInt(this.form.get('cedula')?.value),
          nombre: this.form.get('nombre')?.value,
          foto: this.base64String,
          fechaIngreso: this.form.get('fechaIngreso')?.value,
          cargoId: parseInt(this.form.get('cargo')?.value),
        }
        if(this.id == undefined) {
          // Agregamos una nueva tarjeta
            this._empleadoService.saveEmpleado(empleado).subscribe(data => {
              //this.toastr.success('La tarjeta fue registrada con exito!', 'Tarjeta Registrada');
              console.log(data)
              this.obtenerEmpleados();
              this.form.reset();
            }, error => {
              //this.toastr.error('Opss.. ocurrio un error','Error')
              console.log(error);
            })
        } else {
          empleado.id = this.id;
          // Editamos tarjeta
          this._empleadoService.updateEmpleado(this.id,empleado).subscribe(data => {
            this.form.reset();
            this.accion = 'Agregar';
            this.id = undefined;
            this.toastr.info('La tarjeta fue actualizada con exito!', 'Tarjeta Actualizada');
            this.obtenerEmpleados();
          }, error => {
            console.log(error);
          })
    
        }
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarEmpleado(id: number) {
    this._empleadoService.deleteEmpleado(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada con exito!','Tarjeta eliminada');
      this.obtenerEmpleados();
    }, error => {
      console.log(error);
    })
  }

  obtenerEmpleados() {
    this._empleadoService.getListEmpleados().subscribe(data => {
      console.log(data);
      // Suponiendo que empleado.imagen contiene la URL de la imagen
      this.listEmpleados = data;
    }, error => {
      console.log(error);
    })
  }
  obtenerCargos() {
    this._empleadoService.getListCargos().subscribe(data => {
      //console.log(data);
      this.listCargos = data;
    }, error => {
      console.log(error);
    })
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  editarEmpleado(empleado: any) {
    this.accion = 'Editar';
    this.id = empleado.id;

    this.form.patchValue({
      cedula: parseInt(empleado.cedula),
      nombre: empleado.nombre,
      fechaIngreso: empleado.fechaIngreso,
      cargoId: parseInt(empleado.cargoId),
    })
  }
}
