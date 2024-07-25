import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Membership } from 'src/shared/models/entities/membershipData';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { MembershipResponse } from 'src/shared/models/responses/membershipResponse';
import { MembershipService } from 'src/shared/services/membership.service';
import Swal from 'sweetalert2';
import { MembsershipComponent } from '../membsership/membsership.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface MembershipIdRequest {
  membership_id: number;
}

@Component({
  selector: 'app-active-membership-list',
  templateUrl: './active-membership-list.component.html',
  styleUrls: ['./active-membership-list.component.scss'],
})
export class ActiveMembershipListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Membership>();

  displayedColumns: string[] = [
    'studentCode',
    'username',
    'startDate',
    'endDate',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private membershipService: MembershipService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllMemberships();
    this.dataSource.filterPredicate = this.createFilter();
  }

  getAllMemberships() {
    this.membershipService.getMemberships().subscribe({
      next: (response: MembershipResponse) => {
        if (response.success) {
          console.log(response.memberships);
          //this.membershipList = response.memberships;
          this.dataSource.data = response.memberships;
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else {
          console.error('Error obtaining memberships');
        }
      },
      error: (error: MembershipResponse) => {
        console.error('Error getting memberships. Error details: ', error);
      },
    });
  }

  cancelMembership(membership: Membership) {
    console.log(membership.membership_id);

    const body: MembershipIdRequest = {
      membership_id: membership.membership_id,
    };

    Swal.fire({
      title: '¿Deseas cancelar la membresia?',
      text: `El usuario ${membership.user.username} perdera los beneficios premium`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.membershipService.cancelMembership(body).subscribe({
          next: (response: HttpDjangoResponse) => {
            if (response.success) {
              Swal.fire({
                title: 'Membresia cancelada con exito!',
                text: 'Este usuario ya no hace parte del plan premium del gimnasio',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.dataSource.data = this.dataSource.data.filter(
                    (m: Membership) =>
                      m.membership_id !== membership.membership_id
                  );
                }
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: response.message || 'Ha ocurrido un error',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
          },
          error: (error: HttpDjangoResponse) => {
            Swal.fire({
              title: 'Error al enviar los datos',
              text: error.message || 'Error desconocido',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }

  openPreviousDialog() {
    const dialogRef = this.dialog.open(MembsershipComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngAfterViewInit() {
    if (this.dataSource.data.length) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: Membership, filter: string) => boolean {
    return (data: Membership, filter: string): boolean => {
      const searchTerms = filter.trim().toLowerCase().split(' ');
      const dataStr =
        `${data.user.student_code} ${data.user.username}`.toLowerCase();

      return searchTerms.every((term) => dataStr.includes(term));
    };
  }
}
