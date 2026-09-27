import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionInvoiceRequestComponent } from '../../invoice-request/action-invoice-request/action-invoice-request.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { ActionManualInvoiceComponent } from '../action-manual-invoice/action-manual-invoice.component';

@Component({
  selector: 'app-panding-manual-invoice',
  templateUrl: './panding-manual-invoice.component.html',
  styleUrls: ['./panding-manual-invoice.component.scss']
})
export class PandingManualInvoiceComponent {
  rowClass: any;
  expenceForm: FormGroup;
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
      field: 'br_number', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      valueFormatter: 'JSON.parse(value)',
      minWidth:150,
    },
   
    {
      headerName: 'Net Amount',
      field: 'total_amount', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Associated Company',
      field: 'associatedCompany', 
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
      field: 'manual_invoice_status', 
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
      field: 'br_number',
      flex:1,
      minWidth:150,
      cellRenderer: ActionManualInvoiceComponent,
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
    this.leadService.pandingManualInvoice().subscribe((res: any) => {
      this.rowData = res.data;
      console.log('test',this.rowData);
      
      
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
