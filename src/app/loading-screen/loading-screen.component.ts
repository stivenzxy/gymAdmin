import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/loading-animation.json', 
  };

  ngOnInit(): void {}

  animationCreated(animationItem: AnimationItem): void {
    // Acciones adicionales
    console.log('Animación cargada', animationItem);
  }
}
