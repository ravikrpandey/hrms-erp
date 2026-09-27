import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ColDef } from 'ag-grid-community';
import { ThirdPartyService } from '../../services/third-party.service';
import { OrgTypeMasterFormComponent } from '../org-type-master/org-type-master-form/org-type-master-form.component';
import { OrgSetupFormDialogComponent } from './org-setup-form-dialog/org-setup-form-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-org-setup',
  templateUrl: './org-setup.component.html',
  styleUrls: ['./org-setup.component.scss'],
})
export class OrgSetupComponent implements OnInit {
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
      headerName: 'Organization',
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Org Type',
      field: 'orgTypeName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'No Of Users',
      field: 'userCount',
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      width: 100,
    },
    {
      headerName: 'Primary Contact',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellClass: 'grid-cell-centered',
      flex: 0.3,
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
          this.addOrg('edit');
        }

        if (action === 'delete') {
          this.deleteOrgType(event.data);
        }
      },
    },
  ];

  actions = [
    {
      label: 'Add Organization',
      icon: 'add',
      callback: this.addOrg.bind(this),
    },
  ];

  constructor(private dialog: MatDialog, private service: ThirdPartyService) { }

  ngOnInit(): void {
    this.getAllOrgSetups();
  }

  getAllOrgSetups() {
    this.service.getAllOrgSetups().subscribe((response: any) => {
      this.rowData = response.data;
    });
  }

  addOrg(type = 'add'): void {
    const dialogRef = this.dialog.open(OrgSetupFormDialogComponent, {
      width: '100%',
      height: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { data: this.selectedRow ? this.selectedRow : null, type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllOrgSetups();
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
        this.service.deleteOrgSetupById(row.id).subscribe((response: any) => {
          this.getAllOrgSetups();
        });
      }
    });
  }
}
