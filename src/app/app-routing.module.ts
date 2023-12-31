import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReserveComponent } from './reserve/reserve.component';
import { TrainingComponent } from './training/training.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { ReserveNowComponent } from './reserve-now/reserve-now.component';
import { ReserveHistoryComponent } from './reserve-history/reserve-history.component';import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { InitformComponent } from './initform/initform.component';
import { reserveHistoryGuard } from 'src/shared/guards/reserve-history.guard';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {
    path: 'reserve',
    component: ReserveComponent,
    children: [
      {path: '', redirectTo: 'now', pathMatch: 'full'}, // Redireccionar a 'now' por defecto
      {path: 'now', component: ReserveNowComponent},
      {path: 'history', component: ReserveHistoryComponent, canActivate: [reserveHistoryGuard]}
    ]
  },
  {path: 'training', component: TrainingComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent },
  {path: 'initform', component: InitformComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
