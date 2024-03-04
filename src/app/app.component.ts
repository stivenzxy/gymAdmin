import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { InactivityService } from 'src/shared/services/inactivity.service';

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
  
  constructor(private authService: AuthService, inactivityService: InactivityService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void { 
    this.authService.loading.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (!isLoading) {
        // Si no está cargando, espera 1 segundo antes de ocultar la pantalla de carga para asegurar una experiencia de usuario consistente
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
      this.cdRef.detectChanges();
    });
  }
}
