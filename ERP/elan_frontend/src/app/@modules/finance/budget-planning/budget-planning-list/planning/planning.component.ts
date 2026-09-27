import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PlanningActionComponent } from './budget-planning-action/planning-action.component';
import { WorkFlowListPopComponent } from 'src/app/@modules/work-flow/work-flow-job/work-flow-list-pop/work-flow-list-pop.component';
@Component({
  selector: 'planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction: any;
  type:any='Opex';
  page : any;
  entity_id:any;
  approvel_status:any= null;
  user_id:any;
  filterTab = false;
  depList: any = [];
  show:any = false;
  dept_id:any;
  flag:any = false;
  activeTab = "Opex";
  fYearData: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private finance: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService

  ) {
    this.rowClass = 'rowClass';
  }
  

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    // this.getAllBudgetPlanning(this.type);
    this.entity_id = localStorage.getItem('selectedEntityId');
    let loginUser: any = localStorage.getItem('signInUser');
    this.user_id = JSON.parse(loginUser).employee_id;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.type = params.type;
      this.activeTab= this.type;
      this.page = params.page;
      this.flag = params.flag;
      if ( this.page != 'pending-for-approval' || this.show){
        this.filterTab = false;
      }else {
        this.filterTab = true;
      }
      if ( this.page == 'planning'){
        this.approvel_status=null;
      }
      if ( this.page == 'pending-for-approval'){
        this.approvel_status='PENDING';
      }
      if ( this.page == 'approved-by-me'){
        this.approvel_status='APPROVED';
      }
      if ( this.page == 'draft'){
        this.approvel_status='REJECTED';
      }
      this.getDepartmentWise(this.type);
      if ( params.dept_id ) {
        this.filterTab = true;
        this.fetchPending(params.dept_id)
      }
      this.getBudgetPlan(this.id)
      this.getAllBudgetPlanning(this.type,this.id);
    });
  }

  getBudgetPlan = (id : any) => {
    this.finance.getBudgetPlanById(id).subscribe((res: any) => {
      this.fYearData = res.data;
    })
  }

  public columnDefs = [
    {
      headerName: '',
      // headerCheckboxSelection: true,
      width:30,
      checkboxSelection: (params: any) => {
        if (params.data.approval_status === 'DRAFT') {
          return true;
        }
        return false;
      },
    },
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 30
    },
    {
      headerName: 'Category',
      field: 'budget_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Location',
      field: 'location',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },

    {
      headerName: 'Type Of Need',
      field: 'need_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Total Amount',
      field: 'total_Value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Action',
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: PlanningActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

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

  getDepartmentWise(type:any){
    this.finance.getDepartmentWise(this.entity_id,this.user_id,type,this.id).subscribe((res: any) => {
      this.depList = res.data;
    },(err: any) => {
      this.rowData = [];
    })
  }

  departmentView () {
    this.show = !this.show
  }

  fetchPending = (dept_id:any) => {
    this.show = true;
    this.dept_id = dept_id;
    this.getAllBudgetPlanning(this.type,this.id);
    // this.finance.getAllBudgetPlanning(this.type,this.id,this.entity_id,this.approvel_status,this.user_id,dept_id).subscribe((res: any) => {
    //   this.rowData = res.data;
    //   // this.route.navigate([`/master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type, page: this.page, show: this.show }})
    // },(err: any) => {
    //   this.rowData = [];
    // })
  }

  toggle(tab: string) {  
    this.activeTab = tab;
    let flag = false;
    if (this.page == 'pending-for-approval'){
      flag = true;
    }
    this.route.navigate([`/master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.activeTab, page: this.page  },skipLocationChange: true})
  }

  getAllBudgetPlanning(type:any,id:any) {
    if (this.page == 'pending-for-approval'){
      this.finance.getAllBudgetPlanning(type,this.id,this.entity_id,this.approvel_status,this.user_id,this.dept_id).subscribe((res: any) => {
        this.rowData = res.data;
        this.rowData.map((row:any) => {
          row.fYearId = this.id;
          row.type = this.type;
          row.page = this.page;
          row.dept_id = this.dept_id;
          return row
        })
      },(err: any) => {
        this.rowData = [];
      })
    }else{
      this.finance.getAllBudgetPlanning(type,this.id,this.entity_id,this.approvel_status,this.user_id).subscribe((res: any) => {
        this.rowData = res.data;
        this.rowData.map((row:any) => {
          row.fYearId = this.id;
          row.type = this.type;
          row.page = this.page;
          return row
        })
      },(err: any) => {
        this.rowData = [];
      })
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onCellClicked(e: any) {
    if ( this.page == 'draft' || this.page == 'planning'){
    const dialogRef = this.dialog.open(WorkFlowListPopComponent, {
      data: { id:e.data.workflow_id, from:"budget" },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  }

  redirect = () => {
    this.route.navigate(['master/finance/budget-planning/create-budget-planning'], { queryParams: { id: this.id },skipLocationChange: true})
  }

  cellClicked(e: any) {

    // const dialogRef = this.dialog.open(PrItemDilogComponent, { width: '400px', data: { cellData: e.data } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }
  onSubmit = () => {
    const selectedRows = this.gridApi.getSelectedRows();
    let data;
    data = selectedRows.map(row => {
      return { id : row.approval_id }
    })
    if ( data.length == 0 ){
      this.toaster.error("Select Atleast One Request")
      return;
    }
    let body = {approval_data: data}
    this.finance.bulkApprovalRequest(body).subscribe((res: any) => {
      this.toaster.success(res.message)
      this.getAllBudgetPlanning(this.type,this.id)
    }, err => {
      this.toaster.error(err.error.message)
    })
  }
}


