import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RequestActionComponent } from '../my-request-manpower/request-action/request-action.component';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';


@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.scss']
})
export class RejectComponent {
  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  employee_id: any;

  constructor(private empl_self: EmployeSelfService, private empMaster: EmpMasterService, private route: Router, private _rbackService: RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    var empData: any = localStorage.getItem('signInUser');
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    this.rowData = []
    this.empMaster.getLoggedInListHelpDesk(localStorage.getItem('EmpMainId')).subscribe((res: any) => {
      const aa = res.data
      const newArray = aa.map((item: any, index: any) => ({ ...item, index: index + 1 }));
      this.rowData = newArray
      console.log(this.rowData, "rowdata");
    })

    this.approvedData();
  }

  approvedData() {
    let selectedEntityId = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let data = {
      employee_id: Number(this.employee_id),
      entity_id: Number(selectedEntityId),
    }
    this.empl_self.getAllRejectRequest(data).subscribe((res: any) => {
      console.log(res, 'ressss');
      this.rowData = res.data
    })
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }
  public columnDefs = [

    {
      headerName: 'S.No',
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
      headerName: 'Request ID',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: function (params: any) {
        return 'REQ00' + params.value;
      },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
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
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Sub Department Name',
      field: 'area_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: ' Date',
    //   field: 'createdAt',
    //   valueFormatter: function (params: any) {
    //     return moment.utc(params.value).format('DD/MM/YYYY');
    //   },
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex:1,
    //   minWidth:150  
    // },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Status',
      field: 'approvel_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Action',
      field: 'helpDiskId',
      flex: 1,
      minWidth: 150,
      cellRenderer: RequestActionComponent,
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
    this.route.navigate(['master/ess/manpower-request/new-request-create'])
  }
  onCellClicked(e: any) {
    // console.log(e,'eeeeeee');

    // const dialogRef = this.dialog.open(AppListDialogComponent,{width:'400px',data:{helpDiskViewId:e.data.employee_helpDesk_id,index:e.data.index}});
    //   dialogRef.afterClosed().subscribe(result => {

    //   })
  }
}
