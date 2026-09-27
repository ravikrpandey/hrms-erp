import { Component, OnInit } from '@angular/core';
import {GridApi,GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';
import { ActionInvoiceRequestComponent } from '../invoice-request/action-invoice-request/action-invoice-request.component';
import { EInvoiceActionComponent } from './action/action.component';


@Component({
  selector: 'app-e-invoice',
  templateUrl: './e-invoice.component.html',
  styleUrls: ['./e-invoice.component.scss']
})

export class EInvoiceComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(private _empService: EmpRegistrationService, public dialog: MatDialog, private _finaceservice:FinaceService) {
    this.rowClass = 'rowClass'
  }
  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
    // this._empService.grtEmployeeList().subscribe((res: any) => {
    //   this.rowData = res.data;

    // })
    // this._finaceservice.getExpenseZoho().subscribe((res: any) => {
    //   this.rowData = res.result;

    // })
    this._finaceservice.getAllInvoice().subscribe((res: any) => {
      this.rowData = res.data;

    })
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      field: 'expense_zoho_data_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Invoice Id',
      field: 'invoiceId',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Associate Company',
      field: 'associated_company',
       sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    // {
    //   headerName: 'requested By',
    //   field: 'mobile_number',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150,
    // },
    {
      headerName: 'First name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Last name',
      field: 'last_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Mobile No',
      field: 'Mob_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Company Logo Cost',
      field: 'company_logo_cost',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
     {
      headerName: 'Action',
      field: 'expense_zoho_data_id',
      flex:1,
      minWidth:150,
      cellRenderer: EInvoiceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  onBtPrint() {
   window.print()
  }

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


    // const dialogRef = this.dialog.open(EmpListDialogComponent, { width: '600px', data: { id: e.data.employee_id } });
    // dialogRef.afterClosed().subscribe(result => {

    // })
    // this._finaceservice.passValue(e.data.expense_zoho_data_id);
    // const dialogRef = this.dialog.open(InvoicePdfComponent, { width: '900px',height:'550px',  data: { id: e.data.expense_zoho_data_id } });
    // dialogRef.afterClosed().subscribe(result => {
    //  })
  }

}
