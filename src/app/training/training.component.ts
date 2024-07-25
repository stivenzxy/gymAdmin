import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent {
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/training.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
  };

  ngOnInit(): void {
    console.log('Training Component is running!');
  }

  animationCreated(animationItem: AnimationItem): void {}
}
