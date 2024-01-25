import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import player from 'lottie-web';
import { CookieService } from 'ngx-cookie-service';
import { LottieModule } from 'ngx-lottie';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { InitformComponent } from './initform/initform.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { ReserveHistoryComponent } from './reserve-history/reserve-history.component';
import { ReserveNowComponent } from './reserve-now/reserve-now.component';
import { ReserveComponent } from './reserve/reserve.component';
import { SettingsComponent } from './settings/settings.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TrainingComponent } from './training/training.component';
import { PenalizarComponent } from './penalizar/penalizar.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { KeysPipe } from './download-report/keys.pipe';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { MembsershipComponent } from './membsership/membsership.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AboutComponent } from './about/about.component';
import {MatButtonModule} from '@angular/material/button';

export function playerFactory() {
  return player;
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
    PenalizarComponent,
    ScheduleComponent,
    DownloadReportComponent,
    KeysPipe,
    LoadingScreenComponent,
    MembsershipComponent,
    AboutComponent,
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
    MatTooltipModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
