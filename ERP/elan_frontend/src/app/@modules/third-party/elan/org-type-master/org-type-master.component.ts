import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi } from 'ag-grid-community';
import { OrgTypeMasterFormComponent } from './org-type-master-form/org-type-master-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ThirdPartyService } from '../../services/third-party.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-org-type-master',
  templateUrl: './org-type-master.component.html',
  styleUrls: ['./org-type-master.component.scss'],
})
export class OrgTypeMasterComponent implements OnInit {
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
      width: 80,
    },
    {
      headerName: 'Name',
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
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
          this.addOrgType('edit');
        }

        if (action === 'delete') {
          this.deleteOrgType(event.data);
        }
      },
    },
  ];

  actions = [
    {
      label: 'Add Organization Type',
      icon: 'add',
      callback: this.addOrgType.bind(this),
    },
  ];

  constructor(private dialog: MatDialog, private service: ThirdPartyService) { }

  ngOnInit(): void {
    this.getAllOrgTypeMasters();
  }

  getAllOrgTypeMasters() {
    this.service.getAllOrgTypeMasters().subscribe((response: any) => {
      this.rowData = response.data;
    });
  }

  addOrgType(type = 'add'): void {
    const dialogRef = this.dialog.open(OrgTypeMasterFormComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { data: this.selectedRow ? this.selectedRow : null, type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllOrgTypeMasters();
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
        this.service.deleteOrgTypeMasterById(row.id).subscribe((response: any) => {
          this.getAllOrgTypeMasters();
        });
      }
    });
  }
}
