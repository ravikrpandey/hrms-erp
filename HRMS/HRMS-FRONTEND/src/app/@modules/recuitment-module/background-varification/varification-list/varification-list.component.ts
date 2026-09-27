import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import moment from 'moment';
import { PdfBgComponent } from '../../candidate-profile/pdf-download/pdf-bg.component';
import { ActionComponent } from './action/action.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-varification-list',
  templateUrl: './varification-list.component.html',
  styleUrls: ['./varification-list.component.scss']
})
export class VarificationListComponent  implements OnInit, AfterViewInit {

  private gridApi!: GridApi<any>;
  rowData:any;
  rowData2:any;
  rowData1:any;
  personalIdData:any;
  propertyManager:any
  text:any;
  firstLastName:any;
  rowClass: any;
  assignAction:any;

  constructor(private emp_master:EmpMasterService,
    private empService : EmpRegistrationService,
    private recruitService: RecruitService,
    private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
      this.rowClass = 'rowClass'
     }

  ngOnInit(): void {
   
    // this.empService.grtEmployeeList().subscribe((res:any)=>{
    //   this.rowData1 = res.data;
    //   // 
    // })
    let data = {
      data: "any"
    }
    this.recruitService.listCandidate().subscribe((res:any)=>{
      
      this.rowData = res.data;
      console.log(this.rowData, 'rowData');
      
    })
    
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Candidate Name',
      field: 'candidate_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Email ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile_no',    
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'value[0].department',
      flex:1,
    },
    {
      headerName: 'Job Title',
      field: 'job_applied',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Application Date',
      field: 'application_date',
      valueFormatter: function(params: any) {
        return moment(params.value).format('DD/MM/YYYY');
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
    },
    {
      headerName: 'Uploaded Documents',
      field: 'others_documents',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
      minWidth:150,
      cellRenderer: PdfBgComponent,
    },
    {
      headerName: 'SPOC Name',
      field: 'spoc_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150,
    // },
    {
      headerName: 'Action',
      field: 'action',
      flex:1,
      cellRenderer: ActionComponent,
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

  dateFormatter(application_date: any) {
    return moment(application_date).format('DD/MM/YYYY');
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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(AppListDialogComponent,{width:'500px',data:{verifyId:e.data.candidtaes_v_Id}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}
