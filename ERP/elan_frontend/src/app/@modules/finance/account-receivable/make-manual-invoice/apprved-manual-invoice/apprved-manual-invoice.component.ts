import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { ActionInvoiceRequestComponent } from '../../invoice-request/action-invoice-request/action-invoice-request.component';
import { ActionApprovedComponent } from '../action-approved/action-approved.component';

@Component({
  selector: 'app-apprved-manual-invoice',
  templateUrl: './apprved-manual-invoice.component.html',
  styleUrls: ['./apprved-manual-invoice.component.scss']
})
export class ApprvedManualInvoiceComponent {
  private gridApi!: GridApi<any>;
  rowClass: any;
  expenceForm: any;
  rowData: any;
  rowDataApproved: any;


  constructor(private activeroute: ActivatedRoute,private fb: FormBuilder,private _empService: EmpRegistrationService,private _finaceService:FinaceService, public dialog: MatDialog, private leadService:LeadService) {
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
      cellRenderer: ActionApprovedComponent,
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
    this.leadService.get_all_approve_data().subscribe((res: any) => {
      this.rowDataApproved = res.data;
//         getAllRecivableApproved
// getAllRecivableReject
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
}
