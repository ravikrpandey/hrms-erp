import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';

import { ActivatedRoute, Router } from '@angular/router';
import { ActionComponent } from '../../../../@shared/action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ActionPostComponent } from './action-post/action-post.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-post-opening-list',
  templateUrl: './post-opening-list.component.html',
  styleUrls: ['./post-opening-list.component.scss']
})
export class PostOpeningListComponent implements OnInit, AfterViewInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData:any;
  getPostVaccancyData: any;
  assignAction:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _recruitmentService:RecruitService,
    private _rbackService:RbacMasterService,
    private dialog: MatDialog,
   ) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    this.getAllPostData();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'Job Id',
      field: 'job_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
    {
      headerName: 'Job Title',
      field: 'job_title_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
    // {
    //   headerName: 'Job Description',
    //   field: 'job_description', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    {
      headerName: 'Job Designation',
      field: 'job_role', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
   
    {
      headerName: 'Department',
      field: 'department', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
    // {
    //   headerName: 'Experience',
    //   field: 'experiance', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
   
    {
      headerName: 'No. of Position',
      field: 'number_of_position', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
    // {
    //   headerName: 'Location',
    //   field: 'location', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    // {
    //   headerName: 'Qualification',
    //   field: 'qualification', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    {
      headerName: 'Age-Range',
      field: 'candidate_age', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },
    {
      headerName: 'Status',
      field: 'status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,

    },

    {
      headerName: 'Action',
      field: 'job',
      flex:1,

      cellRenderer: ActionPostComponent,
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

  getAllPostData(){
this._recruitmentService.getPostVaccancy().subscribe((res:any)=>{
  this.rowData=res.result;
  
  
})
  }

  onCellClicked(e:any){}
}
