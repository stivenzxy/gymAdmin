import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'gymAdmin';

  isSideNavCollapsed = false;
  screenWidth = 0;
  isLoading: boolean = true;

  onToggleSideNav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      // Simula la espera de carga
      setTimeout(() => {
        this.isLoading = false; // Oculta la pantalla de carga
      }, 1200); // Espera 1 segundo antes de ocultar la pantalla de carga
    });
  }


}
