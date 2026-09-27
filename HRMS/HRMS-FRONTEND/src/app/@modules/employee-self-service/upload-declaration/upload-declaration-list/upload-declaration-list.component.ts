import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { UploadDeclarationActionComponent } from '../upload-declaration-action/upload-declaration-action.component';

@Component({
  selector: 'app-upload-declaration-list',
  templateUrl: './upload-declaration-list.component.html',
  styleUrls: ['./upload-declaration-list.component.scss']
})
export class UploadDeclarationListComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[]=[];
  user_id:any;
  entity_id:any = null;
  financial_year_id:any = null;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService:PayrollService,
    private toast:ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    debugger
    let lg: any = localStorage.getItem('signInUser');
 
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_year_id = localStorage.getItem("financial_id");
    let loginUser = JSON.parse(lg);

    this.user_id = loginUser.employee_id


    this.getAllUploaddeclarationlist(this.user_id);
  }


  getAllUploaddeclarationlist(id:any) {
    let data={
      login_id :id,
      entity_id:this.entity_id,
      financial_year:this.financial_year_id
    }
    try {
      this.payrollService.getAllUploaddeclarationlist(data).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data
        }
      }, (err: any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
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
      headerName: 'Employee Id',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },


    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Financial Year',
      field: 'financial_year_range',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Saving Amount',
      field: 'saving_amout',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },


    {
      headerName: 'Remarks',
      field: 'remark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
   
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 120,
      cellRenderer: UploadDeclarationActionComponent,
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

  }

}
