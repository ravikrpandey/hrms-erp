import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import moment from 'moment';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { PdfDownloadComponent } from '../../candidate-profile/pdf-download/pdf-download.component';
// import { GrievanceDialogComponent } from '../grievance-dialog/grievance-dialog.component';
import { ActionsComponent } from '../actions/actions.component';
import { CandidaterespondComponent } from '../candidaterespond/candidaterespond.component';

@Component({
  selector: 'app-candidate-short-list',
  templateUrl: './candidate-short-list.component.html',
  styleUrls: ['./candidate-short-list.component.scss']
})
export class CandidateShortListComponent  implements OnInit {

  private gridApi!: GridApi<any>;
  rowData:any;
  rowData2:any;
  rowData1:any;
  personalIdData:any;
   propertyManager:any
  text:any;
  firstLastName:any;
  rowClass: any;
  loginUser: any;

  constructor(private emp_master:EmpMasterService,
    private empService : EmpRegistrationService,
    private _recrutmentService:RecruitService,
    public dialog: MatDialog) {
      this.rowClass = 'rowClass'
     }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
   
    // this.empService.grtEmployeeList().subscribe((res:any)=>{
    //   this.rowData1 = res.data;
    //   // 
    // })
    this._recrutmentService.candidateProfileShortlisted().subscribe((res:any)=>{
      this.rowData = res.result;
      // this.propertyManager = Array.from(this.rowData, (a: any) => `${a.registered_users[0]}`);
      // this.rowData1 = this.rowData[0].registered_users;
      
      // // this.rowData = this.rowData2.push(this.rowData1);
      // 
      
    })
    let entity_id = localStorage.getItem("selectedEntityId");
    this.empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.personalIdData = res.data;
      // this.reportingManager = JSON.parse(res.data.reporting_manager);
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.title} ${a.first_name} ${a.last_name}`);
      this.firstLastName = Array.from(this.personalIdData, (a: any) => `${a.first_name}`);
      this.text = this.firstLastName.toString();
      
    })
  }

  // addRow(){
  //   this.gridApi.applyTransaction({add: [{}]})
  //   
  // };

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'candidate_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Candidate Name ',
      field: 'condidate_name',
     sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      // valueFormatter: 'registered_users[0].first_name',
      valueFormatter: 'value[0].first_name',
    },
    {
      headerName: 'E-mail Id',
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
      field: 'mobile',    
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
      flex:1,
    },
    {
      headerName: 'Application Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      valueFormatter: function (params:any) {
        return moment(params.value).format('DD/MM/YYYY');
      }
    },
    {
      headerName: 'Uploaded Documents',
      field: 'upload_resume',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:155,
      cellRenderer: PdfDownloadComponent,

    },
    // {
    //   headerName: 'SPOC Name',
    //   field: 'spoc_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex:1,
    //   minWidth:150,
    // },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      cellStyle: function (params: any) {
        if (params.value.toLowerCase() == 'Shortlisted'.toLowerCase()) {
          return { color: 'green' };
        } else {
          return { color: 'orange' };
        }
      },
    },
    // {
    //   headerName: 'Action',
    //   field: 'candidate_id',
    //   cellRenderer: ActionsComponent,
    //   flex:1,
    //   minWidth:150,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false, 
    //   },
    // },
    // {
    //   headerName: 'Respond By',
    //   field: 'date',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   filter: "agDateColumnFilter",
    //   flex:1,
    //   minWidth:150,
    //   cellRenderer: CandidaterespondComponent,
   
    // },

  ];

  // rowData = [
  //   {
  //     employee_name: 'nana',
  //     group_name: 'a',
  //     Departmant_Name: 'yes',
  //     Grievance_type: 'user',
  //     Grievance_date: '11-12-2020',
  //     Manager_Name: 'Roshni',
  //     Grievance_Satus: 'undefine',
  //   },
  //   {
  //     employee_name: 'harsh',
  //     group_name: 'b',
  //     Departmant_Name: 'mindz',
  //     Grievance_type: 'nor',
  //     Grievance_date: '11-12-2020',
  //     Manager_Name: 'harshdip',
  //     Grievance_Satus: 'null',
  //   },

  // ]


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
  // onCellClicked(e: any) {
  //   
  // }
  // onCellClicked(e:any){
  //   
  //   const dialogRef = this.dialog.open(GrievanceDialogComponent,{width:'400px',data:{id:e.data.employee_grievance_id}});
  //     dialogRef.afterClosed().subscribe(result => {
  //       
  //     })
  // }

  // dateComparator(filterLocalDateAtMidnight: any, cellValue: any) {
  //   const dateAsString = cellValue;
  //   const dateParts = dateAsString.split("/");
  //   const cellDate = new Date(
  //     Number(dateParts[2]),
  //     Number(dateParts[1]) - 1,
  //     Number(dateParts[0])
  //   );
  //   if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
  //     return 0;
  //   }
  //   if (cellDate < filterLocalDateAtMidnight) {
  //     return -1;
  //   }
  //   if (cellDate > filterLocalDateAtMidnight) {
  //     return 1;
  //   }
  // }

}
