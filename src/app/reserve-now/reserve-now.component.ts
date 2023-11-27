import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecomendacionesService } from '../../shared/services/recomendations.service';
import { recomendaciones } from './recomendaciones';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-reserve-now',
  templateUrl: './reserve-now.component.html',
  styleUrls: ['./reserve-now.component.scss']
})

export class ReserveNowComponent implements OnInit, OnDestroy{
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/reserve-recomendations.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true
    }
  };

  loginForm: FormGroup;
  recomendacionAleatoria: string = '';
  private intervalId: any;

  constructor(private fb: FormBuilder, private recomendacionesService: RecomendacionesService) {
    this.loginForm = this.fb.group({
      programa: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      cantHoras: ['', [Validators.required, Validators.max(12)]],
      fecha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Handle the form submission
    } else {
      // Si el formulario no es válido, marca todos los controles como tocados para mostrar los mensajes de error
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  
  ngOnInit() {
    this.intervalId = setInterval(() => this.cargarRecomendaciones(), 10000);
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones(): void {
    const recomendacionesAleatorias = this.recomendacionesService.obtenerRecomendacionesAleatorias(recomendaciones, 1);;
    this.recomendacionAleatoria = recomendacionesAleatorias[0] || '¡Disfruta tu día!';
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  animationCreated(animationItem: AnimationItem): void { }

}
