import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { LottieModule } from 'ngx-lottie';
import { environment } from 'src/environments/environment.firebase';
import { AboutComponent } from './about/about.component';
import { ActiveMembershipListComponent } from './active-membership-list/active-membership-list.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { KeysPipe } from './download-report/keys.pipe';
import { HeaderComponent } from './header/header.component';
import { InitformComponent } from './initform/initform.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoginComponent } from './login/login.component';
import { MembsershipComponent } from './membsership/membsership.component';
import { PenalizeComponent } from './penalize/penalize.component';
import { ProductsComponent } from './products/products.component';
import { ReserveHistoryComponent } from './reserve-history/reserve-history.component';
import { ReserveNowComponent } from './reserve-now/reserve-now.component';
import { ReserveComponent } from './reserve/reserve.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SettingsComponent } from './settings/settings.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TrainingComponent } from './training/training.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import {MatInputModule} from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { JwtInterceptorService } from 'src/shared/services/jwt/jwt-interceptor.service';
import { ErrorInterceptorService } from 'src/shared/services/jwt/error-interceptor.service';
import { NotFoundComponent } from './not-found/not-found.component';
//import lottie from '@esm-bundle/lottie-web';
import lottie from '@esm-bundle/lottie-web/esm/lottie.js';

export function playerFactory() {
  return lottie;
}

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ProductsComponent,
    SettingsComponent,
    ReserveComponent,
    TrainingComponent,
    ReserveNowComponent,
    ReserveHistoryComponent,
    HeaderComponent,
    LoginComponent,
    InitformComponent,
    PenalizeComponent,
    ScheduleComponent,
    DownloadReportComponent,
    KeysPipe,
    LoadingScreenComponent,
    MembsershipComponent,
    AboutComponent,
    ActiveMembershipListComponent,
    RegisteredUsersComponent,
    NotFoundComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OverlayModule,
    CdkMenuModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatDialogModule,
    MatIconModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),

    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,

    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
