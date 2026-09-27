import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { IncomeStatementActionComponent } from '../income-statement-action/income-statement-action.component';
import { IncomeStatementService } from 'src/app/@shared/services/income-statement.service';
import { WorkFlowListPopupComponent } from '../work-flow-list-popup/work-flow-list-popup.component';

@Component({
  selector: 'app-income-statement-list',
  templateUrl: './income-statement-list.component.html',
  styleUrls: ['./income-statement-list.component.scss']
})
export class IncomeStatementListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', getRowHeight: this.getRowHeight.bind(this) };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  loginUser: any;
  assignAction: any;
  user_role: any;
  filter_fy: string | null;
  entity_id: string | null;
  login_id: any;
  page: any;
  approval_status: any;
  data: any;

  getRowHeight(params: any) {
    // Adjust this logic as per your requirements
    return 40; // Example: return a fixed height like 50px
  }

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private incomeService: IncomeStatementService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.page = params['page'];
      this.approval_status = this.page;
      if ( this.approval_status == 'list' || !this.approval_status)  this.approval_status = null;
      if ( this.approval_status == 'pending-for-approval' )  this.approval_status = 'PENDING';
      if ( this.approval_status == 'approved-by-me' )  this.approval_status = 'APPROVED';
      if ( this.approval_status == 'rejected' )  this.approval_status = 'REJECTED';
      let a: any = localStorage.getItem('signInUser');
      this.loginUser = JSON.parse(a);
      this.filter_fy = localStorage.getItem('financial_id');
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.user_role = this.loginUser.role;
      if ( this.user_role != 'Super Admin' ) {
        this.user_role = null;
      }
      this.login_id = this.loginUser['employee_id'];
      this.assignAction = this._rbackService.accessAssignAction();
      this.getAllIncome();
    });
    // this._configurationalMasterService.messageSubject.subscribe((id: any) => {
    //   this.collegeIdCopy = id;
    // });
    
  }

  redirect() {
    this.route.navigate(['/master/finance/income-statement/generate-income-statement'])
  }


  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Financial Year',
      field: 'financial_year',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Income Statement Type',
      field: 'income_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: IncomeStatementActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();

    this.isDeleteButtonVisible = this.selectedRows.length > 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));

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

  getAllIncome() {
    try {
      this.incomeService.getIncomeList(this.entity_id,this.login_id,this.user_role,this.filter_fy,this.approval_status).subscribe((response: any) => {
        if (response) {
          if ( response.data){
            this.rowData = response.data
            if ( this.approval_status == 'PENDING') {
              this.rowData = this.rowData.map((row:any) => {
                row.approveMode = true;
                return row;
              })
            }
          }else {
            this.rowData = [];
          }
        }
      }, (err: any) => {
        this.rowData = [];
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  onCellClicked = (e:any) => {
    try {
      this.incomeService.getIncomeApproval(e.data.id).subscribe((response: any) => {
        if (response) {
          this.data = response.data
          const dialogRef = this.dialog.open(WorkFlowListPopupComponent, {
            data:  this.data ,
            width: '30%',
          });
          dialogRef.afterClosed().subscribe((result) => {
          });
        }
      }, (err: any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
}
