import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor() { }

  getRandomRecommendations(recommendations: string[], recommendationsPerView: number): string[] {
    const mixRecommendations = [...recommendations].sort(() => 0.5 - Math.random());
    return mixRecommendations.slice(0, recommendationsPerView);
  }
}
