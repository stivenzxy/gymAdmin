import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userSource = new BehaviorSubject<any>(null);

  // Observable para el usuario
  public currentUser = this.userSource.asObservable();

  constructor() {}

  // Método para cambiar el usuario
  changeUser(user: any) {
    this.userSource.next(user);
  }
}
