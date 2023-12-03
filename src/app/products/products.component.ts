import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/products.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true
    }
  };

  ngOnInit(): void {}

  animationCreated(animationItem: AnimationItem): void { }
}
