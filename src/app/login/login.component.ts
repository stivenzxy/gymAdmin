import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LoginAdminService } from 'src/shared/services/login-admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
          if(response.success) { // success es la respuesta exitosa del backend
            alert('Inicio de sesión exitoso');
            this.router.navigate(['dashboard']);
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        },
        error: (error) => {
          alert('Error de conexion con el servidor' + error.message) // error al devolver la respuesta de django
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

