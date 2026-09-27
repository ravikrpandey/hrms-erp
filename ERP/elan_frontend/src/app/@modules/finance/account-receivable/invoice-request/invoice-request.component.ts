import { Component, OnInit } from '@angular/core';
import {GridApi,GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionInvoiceRequestComponent } from './action-invoice-request/action-invoice-request.component';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-request',
  templateUrl: './invoice-request.component.html',
  styleUrls: ['./invoice-request.component.scss']
})

export class InvoiceRequestComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  hideInvoice: boolean = false;
  // route: any;
  pendingStatus:boolean=false;
  approvedStatus:boolean=false;
  rejectStatus:boolean=false;
  rowDataApproved: any;
  rowDataRejct: any;
  br_no: any;
  byData: any;
  expenceForm:any;
  constructor(private activeroute: ActivatedRoute,private fb: FormBuilder,private _empService: EmpRegistrationService,private _finaceService:FinaceService, public dialog: MatDialog, private leadService:LeadService, private route: Router) {
    this.rowClass = 'rowClass'
    this.expenceForm = this.fb.group({

      br_number: new FormControl(),
     
    })
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.br_no = params.brNumber;
    })


    localStorage.setItem("employee_id:", "undefined");
    // this._empService.getFinanceList().subscribe((res: any) => {
    //   this.rowData = res.result;
      
    // })
    // this.leadService.get_invoice_list().subscribe((res: any) => {
    //   this.rowData = res.data
      
    // })
    this.leadService.getInvoiceListCopy().subscribe((res: any) => {
      this.rowData = res.data;
      
    })
    this.pendingStatus=true;

    this.approvedRecivale();
    this.rejectRecivable();
    if(this.br_no){
      this.getByRecivable(this.br_no)
    }

    }


    getByRecivable(e: any) {
      this._finaceService.getByRecivable(e).subscribe((res: any) => {
        console.log(res, 'resss');
        this.byData = res.data;
        console.log(this.byData, 'this.byData');
      if(res.data.status==="Reject"){
        this.rejectStatus=true;
        this.pendingStatus=false;
       }else if(res.data.status==="Approved"){
        this.approvedStatus=true;
        this.pendingStatus=false;
       }
      })
    }
    approvedRecivale(){
      this._finaceService.getAllRecivableApproved().subscribe((res: any) => {
        this.rowDataApproved = res.data;
//         getAllRecivableApproved
// getAllRecivableReject
      })
    }

    rejectRecivable(){
      this._finaceService.getAllRecivableReject().subscribe((res: any) => {
        this.rowDataRejct = res.data
        
      })
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

  // approved
  public columnDefsApproved = [
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
      field: 'NetAmount', 
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
      field: 'status', 
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

  // reject

  public columnDefsReject = [
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
      field: 'NetAmount', 
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
      field: 'status', 
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
    //   
    // })
  }

  pending(){
    console.log();
    
    // this.pendingStatus=true;
    // this.approvedStatus=false;
    // this.rejectStatus=false;
    this.route.navigate(['master/finance/account-receivable/invoice-request/invoice-request-list'])

  }

  navigate(){
    this.route.navigate(["master/finance/account-receivable/invoice-request/make-manual-invoice"]);
  }
              
  approved(){
    // this.pendingStatus=false
    // this.approvedStatus=true;
    // this.rejectStatus=false;
    this.route.navigate(['master/finance/account-receivable/invoice-request/approved-invoice-list'])

}
reject(){
  // this.pendingStatus=false
  //   this.approvedStatus=false;
  //   this.rejectStatus=true;
    this.route.navigate(['master/finance/account-receivable/invoice-request/reject-invoice-list'])

}
}
