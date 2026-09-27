import { Component } from '@angular/core';
import { ActionInvoiceRequestComponent } from '../action-invoice-request/action-invoice-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { MatDialog } from '@angular/material/dialog';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-invoice-request-list',
  templateUrl: './invoice-request-list.component.html',
  styleUrls: ['./invoice-request-list.component.scss']
})
export class InvoiceRequestListComponent {
  rowClass: any;
  expenceForm: any;
  rowData: any;
  rowDataApproved: any;
  private gridApi!: GridApi<any>;

  constructor( private route: Router,private activeroute: ActivatedRoute,private fb: FormBuilder,private _empService: EmpRegistrationService,private _finaceService:FinaceService, public dialog: MatDialog, private leadService:LeadService) {
    this.rowClass = 'rowClass'
    this.expenceForm = this.fb.group({

      expense_type: new FormControl(),
     
    })
  }

  ngOnInit(): void {
    this.getAllData();
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'BR No',
      field: 'Br_Number', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      valueFormatter: 'JSON.parse(value)',
      minWidth:150,
    },
    // {
    //   headerName: 'Work Order',
    //   field: 'workOrder_no',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   valueFormatter: 'JSON.parse(value)',
    //   flex:1,
    //   minWidth:150,
    // },
    // {
    //   headerName: 'Associate Company',
    //   field: 'associated_company', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150,
    // },
    // {
    //   headerName: 'requested By',
    //   field: 'contact_owner', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150,
    // },
    {
      headerName: 'Net Amount',
      field: 'Net_amount', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Unit',
      field: 'Unit', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'statusInvoice', 
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
      field: 'Br_Number',
      flex:1,
      minWidth:150,
      cellRenderer: ActionInvoiceRequestComponent,
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


  getAllData(){
    this.leadService.getInvoiceListCopy().subscribe((res: any) => {
      this.rowData = res.data;
      
    })
  }
  onCellClicked(e: any) {
    
    
    // const dialogRef = this.dialog.open(EmpListDialogComponent, { width: '600px', data: { id: e.data.employee_id } });
    // dialogRef.afterClosed().subscribe(result => {
    //   
    // })
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;

      console.log(value);
      
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  clickMakeInvoice(){
    this.route.navigate(
      ['master/finance/account-receivable/invoice-request/manual-invoice'],
     
    );
  }
}
