import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionComponent } from '../action/action.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-against-complaint',
  templateUrl: './against-complaint.component.html',
  styleUrls: ['./against-complaint.component.scss']
})
export class AgainstComplaintComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction:any;
  entity_id: string | null;
  financial_year_id: string | null;
  loginUser:any;
  constructor(
    public dialog: MatDialog,
    private route: Router,
    private recrutmentService: RecruitService,
    private emp_master:EmpMasterService,
    private _rbackService:RbacMasterService,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getComplaintList()
  }

  getComplaintList = () => {
    this._commonService?.showLoader()
    this.recrutmentService.getAll_against_complaint(this.loginUser?.employee_id).subscribe((res) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',

      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Complaint NO',
      field: 'complaint_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Complaint Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
      valueFormatter: (params:any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: 'Complaint Type',
      field: 'type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Employee Name',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Department / User Name',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
      valueGetter: (params:any) => params.data?.department_name || params.data?.employee_name || 'N/A',
    },
    {
      headerName: 'Status',
      field: 'complain_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Action',
      field: 'complaint_id',
      flex:1,
      minWidth:150,
      // cellRenderer:
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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
  createComplaint() {
    this.route.navigate(['master/ess/complaint-create']);
  }
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
  onCellClicked(e:any){


  }
}

