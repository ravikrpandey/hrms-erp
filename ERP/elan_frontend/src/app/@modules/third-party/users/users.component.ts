import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ColDef } from 'ag-grid-community';
import { ThirdPartyService } from '../services/third-party.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  private gridApi!: GridApi<any>;
  rowData: any = [];
  selectedRow: any;

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.3,
      minWidth: 60,
    },
    {
      headerName: 'User Name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        return `${params.data.first_name} ${params.data.last_name}`;
      }
    },
    {
      headerName: 'Email',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Phone',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellClass: 'grid-cell-centered',
      flex: 1,
      width: 50,
    },
    {
      headerName: 'Action',
      minWidth: 150,
      cellRenderer: () => `
    <div class="edd-del">
      <span role="button" class="material-icons action-icon" data-action="edit" title="Edit">
        edit
      </span>
      <span role="button" class="material-icons action-icon" data-action="delete" title="Delete">
        delete
      </span>
    </div>
  `,
      onCellClicked: (event: any) => {
        const action = event.event?.target?.dataset?.action;

        if (!action) return;

        if (action === 'edit') {
          this.selectedRow = event.data;
          this.addUser('edit');
        }

        if (action === 'delete') {
          this.deleteOrgType(event.data);
        }
      },
    },
  ];

  actions = [
    {
      label: 'Add Users',
      icon: 'add',
      callback: this.addUser.bind(this),
    },
  ];

  constructor(private dialog: MatDialog, private service: ThirdPartyService, private accessCtrl: AccessControlService) { }

  ngOnInit(): void {
    this.getAllOrgUsers();
  }

  getAllOrgUsers() {
    this.service.getAllOrgUsers(this.accessCtrl.getUser()?.organization_id!).subscribe((response: any) => {
      this.rowData = response.data;
    });
  }

  addUser(type = 'add'): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '100%',
      height: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { data: this.selectedRow ? this.selectedRow : null, type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllOrgUsers();
      }
    });
  }

  deleteOrgType(row: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteOrgUser(row.employee_id).subscribe((response: any) => {
          this.getAllOrgUsers();
        });
      }
    });
  }
}
