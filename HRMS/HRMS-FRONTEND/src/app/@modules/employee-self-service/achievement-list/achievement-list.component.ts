import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CellClickedEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams,
  PaginationNumberFormatterParams,
} from 'ag-grid-community';

import { RecruitService } from '../../../@shared/services/recruitment.service';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Router } from '@angular/router';
// import { ActionComponent } from '../../../../@shared/action';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit , AfterViewInit{
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction:any;
  // rowData:any;

  constructor(
    private _empService: EmpRegistrationService, private recruitService: RecruitService, private _rbackService:RbacMasterService,
    private route: Router,public dialog: MatDialog,  private toast: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.recruitService.getAchievementList().subscribe((res: any) => {
      this.rowData = res.data;
      
    });
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  columnDefs = [
    {
      headerName: 'Achievement ID',
      field: 'achievement_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Name',
      field: 'achievements',
      sortable: true,
      resizable: true,
      flex:1,
      minWidth:150,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Achievement Date',
      field: 'achieve_date',
      sortable: true,
      flex:1,
      minWidth:150,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Note',
      field: 'notes',
      flex:1,
      minWidth:150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },

    {
      headerName: 'Action',
      field: 'achievement_id',
      flex:1,
      minWidth:150,
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

  // rowData= [
  //   {
  //     serial_no: 'test',
  //     name: 'test',
  //     achivement: 'test',
  //     note: 'test',
  //     action: 'buttons',
  //   },
  // ];


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
  gridOptions = {
    // Add event handlers
  };
  achivement() {
    this.route.navigate(['master/ess/achievement-create']);
  }

  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(AppListDialogComponent,{width:'550px',data:{achivementId:e.data.achievement_id}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}
