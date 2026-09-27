import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { ProfileActionsComponent } from '../actions/actions.component';
import { PdfDownloadComponent } from '../pdf-download/pdf-download.component';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-candidate-profile-list',
  templateUrl: './candidate-profile-list.component.html',
  styleUrls: ['./candidate-profile-list.component.scss'],
})
export class CandidateProfileListComponent implements OnInit, AfterViewInit {
  private gridApi!: GridApi<any>;
  rowData: Candidate[]=[];
  candidate_id?: number;
  assignAction:any;
  
  constructor(
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService:RbacMasterService,
  ) {}

  ngOnInit(): void {
    let userLoginId:any = localStorage.getItem('EmpMainId')
    if (userLoginId) {
    this.recruitService.candidateProfileList(userLoginId).subscribe((res: any) => {
      console.log(res);
      
      this.rowData = res.data;
    }); 
    }
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      field: 'candidate_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex:1,
    }, 
    {
      headerName: 'Candidate Name',
      field: 'condidate_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
    },
    {
      headerName: 'E-mail ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
    },
    {
      headerName: 'Job Title', //this field was job applied
      field: 'job_applied',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
    },
    {
      headerName: 'Resume',
      field: 'upload_resume',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      cellRenderer: PdfDownloadComponent,
      flex:1,
    },
    {
      headerName: 'Assigned Hiring Manager',
      field: 'assigned_hiring_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
      minWidth:154
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex:1,
      minWidth:150,
      cellStyle: function (params: any) {
        if (params.value.toLowerCase() == 'Reviewed'.toLowerCase()) {
          return { color: 'green' };
        } else {
          return { color: 'orange' };
        }
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      flex:1,
      cellRenderer: ProfileActionsComponent,
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
    // 
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellClicked(e: any) {
    this.candidate_id = e.data.candidate_id;
    
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: { id: this.candidate_id },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      
    });
  }
}

export interface Candidate {
  candidate_id: number;
  condidate_name: string;
  email: string;
  mobile: string;
  assigned_hiring_manager: string;
  status: string;
  updatedAt: string;
  upload_resume: string;
}