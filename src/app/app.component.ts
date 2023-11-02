import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'gymAdmin';

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  /*items: any[] = [];
  
  constructor(private http: HttpClient) {
    this.http.get('http://localhost:8000/api/items/').subscribe((data:any) => {
      this.items = data;
    });
  }*/
}
