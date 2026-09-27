import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { EsiActionComponent } from '../esi-action/esi-action.component';

@Component({
  selector: 'app-esi-list',
  templateUrl: './esi-list.component.html',
  styleUrls: ['./esi-list.component.scss']
})
export class EsiListComponent {
    rowClass: any;
    private gridApi!: GridApi<any>;
    rowData: any[] = [];
    isEsiExists: boolean = false;

    constructor(
      public dialog: MatDialog,
      private router: Router,
      private payrollService:PayrollService,
      private toast:ToastrService
    ) {
      this.rowClass = 'rowClass';
    }
    ngOnInit(): void {
      this.getAllCreatedESIList()
    }


    getAllCreatedESIList(){
    this.payrollService.getAllCreatedESIList().subscribe((res:any) => {
      if (res && res.data) {
          this.rowData = res.data;
          this.isEsiExists = this.rowData.length > 0;
        }
    },err => {
      this.toast.error(err.error.message)
    })
  }

  
  
    public columnDefs = [
      {
        headerName: 'S No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'ESI ID',
        field: 'id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      // {
      //   headerName: 'ESI No.',
      //   field: 'esi_number',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      // },
      {
        headerName: 'Employee Contribution',
        field: 'employee_contribution',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Employer Contribution',
        field: 'employer_contribution',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
     
      {
        headerName: 'Action',
        field: 'employee_id',
        flex: 1,
        minWidth: 120,
        cellRenderer: EsiActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
        cellClass: 'grid-cell-centered',
      },
    ];

  

  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
  
    }
    onPageSizeChanged() {
      var value = (document.getElementById('page-size') as HTMLInputElement)
        .value;
      this.gridApi.paginationSetPageSize(Number(value));
    }
  
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  

    onCellClicked(e: any) {
  
      // const dialogRef = this.dialog.open(EmpListDialogComponent, {
      //   width: '600px',
      //   data: { id: e.data.employee_id },
      // });
      // dialogRef.afterClosed().subscribe((result) => {
  
      // });
    }

}
