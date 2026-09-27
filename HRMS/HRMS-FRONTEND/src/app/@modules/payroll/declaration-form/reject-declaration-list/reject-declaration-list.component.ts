import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { DeclarationFormActionComponent } from '../declaration-form-action/declaration-form-action.component';

@Component({
  selector: 'app-reject-declaration-list',
  templateUrl: './reject-declaration-list.component.html',
  styleUrls: ['./reject-declaration-list.component.scss']
})
export class RejectDeclarationListComponent {

  
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  login_id: string | null;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService:PayrollService,
    private toast:ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.login_id = localStorage.getItem('EmpMainId');
    this.getAllCreatedTaxslabList()
  }


  getAllCreatedTaxslabList() {
    this.payrollService.rejectListDeclration(this.login_id).subscribe((res: any) => {
      if (res && res.data) {
        // Assuming res.data is an array of objects
        // this.rowData = res.data.map((item: { concatenatedValue: string; min: any; max: any; }) => {
        //   // Concatenate values from field1 and field2 (you can replace with actual fields)
        //   item.concatenatedValue = `${item.min} - ${item.max}`;
        //   return item;
        // });
        this.rowData=res.data;
      }
    }, err => {
      // this.toast.error(err.error.message);
      this.rowData=[]
    });
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
      headerName: 'Company Branch',
      field:'company_branch',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Emp Code',
      field:'employee_code',
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
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 120,
      cellRenderer: DeclarationFormActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
   
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 120,
    //   cellRenderer: DeclarationFormActionComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false, // Hide attachment icon
    //   },
    //   cellClass: 'grid-cell-centered',
    // },
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
