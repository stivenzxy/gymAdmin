import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LoginAdminService } from 'src/shared/services/login-admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  adminForm: FormGroup;

  constructor(private router: Router,private fb: FormBuilder,private authService: AuthService, private loginAdmin: LoginAdminService) { 
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }

  submitDataAdmin(){
    if(this.adminForm.valid) {
      //alert('Datos enviados!');
      this.loginAdmin.submitDataAdmin(this.adminForm.value).subscribe({
        next: (response: any) => {
          if(response.success) {
            //alert('Inicio de sesión exitoso: ' + response.message);
            this.loginAdmin.saveUserData(response.data);
            Swal.fire({
              title: response.message,
              text: 'Bienvenido!, usted ha ingresado con privilegios de administrador',
              confirmButtonText: "Aceptar",
              icon: "success"
            }).then((result) => {
              if(result.isConfirmed) {
                window.location.reload();
              }
            });
          } else {
            alert('Error: ' + response.message);
          }
        },
        error: (error) => {
          if(error.error && error.error.message) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000, // Duración del toast en milisegundos
              timerProgressBar: true,
              icon: 'error',
              title: error.error.message,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });            
          } else {
            alert('Error de conexión con el servidor: ' + error.message);
          }
        }
      })
    } else {
      Object.keys(this.adminForm.controls).forEach(field => {
        const control = this.adminForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  
}

