import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { LoginAdminService } from 'src/shared/services/login-admin.service';
import { SetAndUpdateUserInfoService } from 'src/shared/services/set-and-update-user-info.service';
import { facultades } from '../initform/programs.helper';
import Swal from 'sweetalert2';


type EditableFields = 'field1' | 'field2' | 'field3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{

  userData: any;
  userSubscription!: Subscription;
  adminUsername!: string;
  user: any = {};
  facultades = facultades;


  field1!: string;
  field2!: string;
  field3!: string;
  isEditable = {
      field1: false,
      field2: false,
      field3: false,
  };

  permanentEditDisabled = { // hay que almacenar este estado en la db para asegurarse de que solo se edite una vez
    field1: false,
    field2: false,
    field3: false,
  };  

  constructor(private authService: AuthService, private adminService: LoginAdminService, 
    private updateService: SetAndUpdateUserInfoService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userData = user;
      this.cdRef.detectChanges();
    });

    const adminData = this.adminService.getUserData();
    if(adminData) {
      this.adminUsername = adminData.username;
    }

    if(this.userData){
      this.getUserDataToUpdate();
    }
  }

  getUserDataToUpdate(){
    const uid = this.userData?.uid;
    this.updateService.getUserData(uid).subscribe(data => {
      this.user = data;

      this.permanentEditDisabled.field1 = data.codigo_estudiantil_editado;
      this.permanentEditDisabled.field2 = data.programa_editado;
      this.permanentEditDisabled.field3 = data.telefono_editado;
      console.log('field1',this.permanentEditDisabled.field1)
      console.log('field2',this.permanentEditDisabled.field2)
      console.log('field3',this.permanentEditDisabled.field3)
    });
  }

  get isLoggedUser(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

  get loggedAdmin() : boolean {
    return this.adminService.isLoggedIn();
  }

  getDisplayName(): string {
    return this.userData?.displayName ?? '';
  }

  getAdminName(): string {
    return this.adminUsername ?? '';
  }

  enableEdit(field: EditableFields) {
    this.isEditable[field] = true;
  }

  disableEdit(field: EditableFields){
    this.isEditable[field] = false;
  }

  updateData(field: EditableFields) {
    const uid = this.userData?.uid;
    let dataToUpdate = {};

    switch (field) {
      case 'field1':
        dataToUpdate = { codigo_estudiantil: this.user.codigo_estudiantil };
        break;
      case 'field2': 
        dataToUpdate = { programa: this.user.programa };
        break; 
      case 'field3':
        dataToUpdate = { telefono: this.user.telefono };
        break;
    }

  this.updateService.updateUserData(uid, dataToUpdate).subscribe({
      next: (response) => {
        ///console.log(response.codigo_estudiantil_editado);
        this.permanentEditDisabled.field1 = response.codigo_estudiantil_editado;
        this.permanentEditDisabled.field2 = response.programa_editado;
        this.permanentEditDisabled.field3 = response.telefono_editado;
        Swal.fire({
          title: 'Dato actualizado correctamente!',
          text: 'Recordatorio: ya no podras volver a actualizar este campo',
          icon: 'success'
        });
        console.log(response.message);
        this.disableEdit(field);
        //this.permanentEditDisabled[field] = true;
      },
      error: (error) => {
        console.error('Error al actualizar el item seleccionado', error);
      }
    })
  }
}