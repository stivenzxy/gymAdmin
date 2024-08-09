import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GoogleAuthService } from '../../shared/services/googleAuth.service';
import { Subscription } from 'rxjs';
import { SetAndUpdateUserInfoService } from 'src/shared/services/set-and-update-user-info.service';
import { Schools } from '../initform/programs.helper';
import Swal from 'sweetalert2';
import { LoginService } from 'src/shared/services/login.service';
import { School } from 'src/shared/models/entities/school';
import { UserData } from 'src/shared/models/entities/userData';
import { GoogleAuthData } from 'src/shared/models/entities/googleAuthData';
import { SetAndUpdateGymInfoService } from 'src/shared/services/set-and-update-gym-info.service';
import { GymData } from 'src/shared/models/entities/gymData';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

type EditableFields = 'field1' | 'field2' | 'field3' | 'field4' | 'field5';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  registerUserData!: GoogleAuthData; // data from google auth
  userSubscription!: Subscription; // subscription from google auth service (register section)
  loginDialogRef: MatDialogRef<LoginComponent> | null = null;

  loggedUsername!: string; // username from database in backend
  userDataToUpdate: UserData = {};
  schools: School[] = Schools; // array of School[] type {...systems engineering, maths, etc}

  loggedUserDataSubscription!: Subscription; //subscription from database info (login info)
  loggedUserData!: UserData; // data form database (login info)

  gymData: GymData = {};
  gymIdToUpdate: number | null = 1;

  field1!: string;
  field2!: string;
  field3!: string;
  field4!: string;
  field5!: number;

  isEditable = {
    field1: false,
    field2: false,
    field3: false,
    field4: false,
    field5: false,
  };

  // The status value is stored in postgres database
  permanentEditDisabled = {
    field1: false,
    field2: false,
    field3: false,
    field4: false,
    field5: false,
  };

  intervalId!: number;

  constructor(
    private preRegisterService: GoogleAuthService,
    private loginService: LoginService,
    private updateUserService: SetAndUpdateUserInfoService,
    private cdRef: ChangeDetectorRef,
    private updateGymService: SetAndUpdateGymInfoService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Only in Pre-Register Section
    this.userSubscription = this.preRegisterService.user.subscribe(
      (user: GoogleAuthData) => {
        if (user) {
          this.registerUserData = user;
          console.log('Data from google auth: ', this.registerUserData);
          this.cdRef.detectChanges();
        }
      }
    );

    this.loggedUserDataSubscription = this.loginService
      .getLoggedUserData()
      .subscribe((loggedUserData: UserData) => {
        if (loggedUserData) {
          this.loggedUserData = loggedUserData;
          this.loggedUsername = loggedUserData.username ?? '';
          this.cdRef.detectChanges();

          /*this.intervalId = window.setInterval(() => {
            console.log(this.loginService.getAccessToken());
          }, 1000);*/
        }

        if (loggedUserData && !loggedUserData?.is_admin) {
          this.getUserDataToUpdate();
          this.cdRef.detectChanges();
        } else if (loggedUserData && loggedUserData?.is_admin) {
          this.updateGymService.getGyms().subscribe((response: GymData[]) => {
            if (response[0].gym_id !== null) {
              this.gymIdToUpdate = response[0].gym_id ?? null;
              this.getGymData(this.gymIdToUpdate);
              console.log('gym: ', response);
            }
          });
        }
        console.log('Session Data: ', loggedUserData);
      });

    console.log('google Data: ', this.registerUserData);
  }

  getUserDataToUpdate() {
    const uid: string | undefined = this.loggedUserData?.uid;

    this.updateUserService.getUserData(uid).subscribe((data) => {
      this.userDataToUpdate = data;

      this.permanentEditDisabled.field1 = data.student_code_edited ?? false;
      this.permanentEditDisabled.field2 = data.program_edited ?? false;
      this.permanentEditDisabled.field3 = data.phone_edited ?? false;

      console.log('field1', this.permanentEditDisabled.field1);
      console.log('field2', this.permanentEditDisabled.field2);
      console.log('field3', this.permanentEditDisabled.field3);
      console.log(this.userDataToUpdate.program);
    });
  }

  private getGymData(gym_id: number | null) {
    if (gym_id !== null) {
      this.updateGymService.getGym(gym_id).subscribe((data: GymData) => {
        this.gymData = data;
        console.log(this.gymData);
      });
    }
  }

  get isUserInRegister(): boolean {
    return this.preRegisterService.isGoogleInfoAvaliable();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.loggedUserDataSubscription) {
      this.loggedUserDataSubscription.unsubscribe();
    }
  }

  get loggedAdmin(): boolean {
    return this.loginService.isAdminLoggedIn();
  }

  get loggedUser(): boolean {
    return this.loginService.isUserLoggedIn();
  }

  getDisplayName(): string {
    return this.registerUserData?.displayName ?? '';
  }

  getUsername(): string {
    return this.loggedUsername ?? '';
  }

  enableEdit(field: EditableFields) {
    this.isEditable[field] = true;
  }

  disableEdit(field: EditableFields) {
    this.isEditable[field] = false;
  }

  updateData(field: EditableFields) {
    const uid = this.loggedUserData?.uid;
    let dataToUpdate: UserData = {};

    switch (field) {
      case 'field1':
        dataToUpdate = { student_code: this.userDataToUpdate.student_code };
        break;
      case 'field2':
        dataToUpdate = { program: this.userDataToUpdate.program };
        break;
      case 'field3':
        dataToUpdate = { phone: this.userDataToUpdate.phone };
        break;
    }

    this.updateUserService.updateUserData(uid, dataToUpdate).subscribe({
      next: (response) => {
        this.permanentEditDisabled.field1 =
          response.student_code_edited ?? false;
        this.permanentEditDisabled.field2 = response.program_edited ?? false;
        this.permanentEditDisabled.field3 = response.phone_edited ?? false;
        Swal.fire({
          title: 'Dato actualizado correctamente!',
          text: 'Recordatorio: ya no podras volver a actualizar este campo',
          icon: 'success',
        });

        this.disableEdit(field);
      },
      error: (error) => {
        console.error('Error updating selected item', error);
      },
    });
  }

  updateGymData(field: EditableFields) {
    const gymId = this.gymIdToUpdate;
    let dataToUpdate: GymData = {};

    switch (field) {
      case 'field4':
        dataToUpdate = { name: this.gymData.name };
        break;
      case 'field5':
        dataToUpdate = { max_capacity: this.gymData.max_capacity };
        break;
    }

    if (gymId !== null) {
      this.updateGymService.updateGym(gymId, dataToUpdate).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Dato actualizado correctamente!',
            text: 'Recordatorio: ya no podrás volver a actualizar este campo',
            icon: 'success',
          });

          this.disableEdit(field);
        },
        error: (error) => {
          console.error('Error actualizando el campo seleccionado', error);
        },
      });
    }
  }

  openLoginDialog() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.loginDialogRef = this.dialog.open(LoginComponent, {
      disableClose: true
    });

    this.loginDialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loginDialogRef = null;
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }
}
