import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InitformService } from 'src/shared/services/initform.service';
import Swal from 'sweetalert2';
import { facultades } from './programs.helper';
@Component({
  selector: 'app-initform',
  templateUrl: './initform.component.html',
  styleUrls: ['./initform.component.scss']
})

export class InitformComponent implements OnInit, OnDestroy{
  facultades = facultades;
  extraDataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private initform: InitformService
    ) { 
    this.extraDataForm = this.fb.group({
      programa: ['', [Validators.required]],
      codigo: ['', [Validators.required]]
    })
  }

  submitExtraData() {
    if (this.extraDataForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás cambiar estos datos después de enviarlos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.initform.submitExtraData(this.extraDataForm.value).subscribe({
            next: (response: any) => {
              if (response.success) {
                console.log('Datos enviados correctamente!');
                Swal.fire({
                  title: 'Su usuario ha sido añadido con exito',
                  confirmButtonText: "Aceptar",
                  icon: "success"
                }).then((response) => {
                  if(response.isConfirmed){
                    window.location.reload();
                  }
                });
              } else {
                // Manejo de una respuesta no exitosa del servidor
                Swal.fire({
                  title: 'Ups!...',
                  text: response.message || 'Ha ocurrido un error',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
              }
            },
            error: (error) => {
              // Manejo de errores de conexión o del lado del cliente
              Swal.fire({
                title: 'Error al enviar los datos',
                text: error.message || 'Error desconocido',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          });
        }
      });
    } else {
      // Si el formulario no es válido, marca todos los controles como tocados para mostrar los mensajes de error
      Object.keys(this.extraDataForm.controls).forEach(field => {
        const control = this.extraDataForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  

  ngOnInit(): void {}
  ngOnDestroy(): void {}

}
