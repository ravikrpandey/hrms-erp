import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


import { CommonService } from 'src/app/@shared/services/common.service';
import { MyListDialogComponent } from '../my-list-dialog/my-list-dialog.component';
import { ListActionComponent } from '../list-action/list-action.component';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ResignationStatusComponent } from '../../resignation-status/resignation-status.component';

@Component({
  selector: 'app-my-resignation-list',
  templateUrl: './my-resignation-list.component.html',
  styleUrls: ['./my-resignation-list.component.scss']
})
export class MyResignationListComponent {
  id:any

  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  staticData: any;
  employee_id: any;
  entity_id: number;
  userDetails: any;

  constructor(private emp_self_service: EmployeSelfService,
    private _commonService : CommonService, 
    private recruitService: RecruitService,
    private empMaster: EmpMasterService, private route: Router, private _rbackService: RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    let idEntity = localStorage.getItem('selectedEntityId')
    this.entity_id = Number(idEntity);
    console.log(this.entity_id, 'this.entity_id')
    var empData: any = localStorage.getItem('signInUser');
    const singleEmpData = JSON.parse(empData);
    this.userDetails = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    this.rowData = []
    this._commonService?.showLoader()
    this.getResignation();
    
  }

  getResignation = () => {
    this.id = localStorage.getItem('EmpMainId')
    this._commonService?.showLoader()
    this.recruitService
    .getResignation(this.id)
    .subscribe((params: any) => {
      this._commonService?.hideLoader()
      this.rowData = params.data
    },(err : any) => {
      this.rowData = []
      this._commonService?.hideLoader()
    });
  }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }
 public columnDefs = [

    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueFormatter: function (params: any) {
      //   return 'REQ00' + params.value;
      // },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Date',
      field: 'resign_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: 'Type',
    //   field: 'type_of_document',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150  
    // },
    // {
    //   headerName: 'Job Position ',
    //   field: 'Job_Position ',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150  
    // },
    {
      headerName: 'Notice Period',
      field: 'notice_period',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    
   
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150
    },


    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ListActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];



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
  navigate() {
    this.route.navigate(['master/ess/resignation/new-request-create'])
  }
  onCellClicked(e: any) {
    console.log(e, 'eeeeeee');

    const dialogRef = this.dialog.open(ResignationStatusComponent, { width: '450px', data: { allData: e.data, empId: this.employee_id } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

}
