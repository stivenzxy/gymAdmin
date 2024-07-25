import { Component, OnInit } from '@angular/core';
import { AnimationItem } from '@esm-bundle/lottie-web/esm/lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/loading-black.json', 
  };

  ngOnInit(): void {
    console.log('Loading Screen Component is running!');
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log('Loaded animation', animationItem);
  }
}