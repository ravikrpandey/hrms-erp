import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
import { ActionComponent } from '../complaint/action/action.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.scss']
})
export class AdvancePaymentComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  getData:any
  getFormData:any
  public cellValue: any;
  advancePayment_form: any;
  assignAction: any;


  constructor(private _empService: EmpRegistrationService, 
    public dialog: MatDialog,
    private route: Router,
    private _lmsService:LmsServiceService,
    private _rbackService:RbacMasterService,
    private _commonService : CommonService
    ) {
    this.rowClass = 'rowClass'
   this.advancePayment_formFun();
  }

  advancePayment_formFun(){
    this.advancePayment_form = new FormGroup({
      requestAmout: new FormControl('', Validators.required),
      installment_period: new FormControl(''),
      remarks: new FormControl('', [Validators.required]),
      documents: new FormControl('', [Validators.required]),
    });
  }

  getAll(){
    this._commonService?.showLoader()
    this._lmsService.getAuther().subscribe((res:any)=>{
      this.rowData=res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this.rowData = []
      this._commonService?.hideLoader()
    })
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    localStorage.setItem("employee_id:", "undefined");
   this. getAll()
  }

  public columnDefs = [
    {
      headerName: 'Author Id',
      field: 'author_trainer_id',
      // valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130
    },
    {
      headerName: 'Author Name',
      field: 'author_name',
       sortable: true,
      columnNo:"1",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130
      // cellRenderer: this.customCellRendererFunc   
    },
    {
      headerName: 'Segment',
      field: 'segment_suv', 
      sortable: true,
      columnNo:"1",
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130
      // cellRenderer: this.customCellRendererFunc   
    },
    // {
    //   headerName: 'Position',
    //   field: 'position', 
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150
    // },
    {
      headerName: 'Category',
      field: 'category', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130
    },
    // {
    //   headerName: 'Course Name',
    //   field: 'course_name', 
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150
    // },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      flex:1,
      minWidth:130,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      sortable: true,
      flex:1,
      minWidth:130,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
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
      minWidth:130
    },
  
 {
      headerName: 'Action Button',
      field: 'autherId',
      flex:1,
      minWidth:130,
      cellRenderer: ActionComponent,
      cellRendererParams: {
       className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      
      } ,
      cellClass: "grid-cell-centered"
    }
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

  onCellClicked(e:any){

// const dialogRef = this.dialog.open(AutherViewComponent,{ width:'500px',data:{id:e.data.author_trainer_id}});
//       dialogRef.afterClosed().subscribe(result => {
        
//       })
  }
  // frameworkComponents = {
  //   ActionComponent: ActionComponent
  // };
  myFiles: any = [];
  fileList: any;
  onFileChange(event: any) {
    
    
    this.fileList = event.target.files;
    
  }
}

