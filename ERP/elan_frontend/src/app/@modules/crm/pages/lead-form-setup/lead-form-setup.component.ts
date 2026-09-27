import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ProfileDialogComponent } from 'src/app/@modules/hrms/recuitment-module/candidate-profile/profile-dialog/profile-dialog.component';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ActionLeadFormSetupStatusComponent } from '../action/action-lead-form-setup-status/action-lead-form-setup-status.component';
import { ActionLeadFormSetupMandatoryComponent } from '../action/action-lead-form-setup-mandatory/action-lead-form-setup-mandatory.component';
import { ActionLeadFormSetupComponent } from '../action/action-lead-form-setup/action-lead-form-setup.component';
import { AddLeadFormSetupDialogComponent } from '../dialogs/add-lead-form-setup-dialog/add-lead-form-setup-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lead-form-setup',
  templateUrl: './lead-form-setup.component.html',
  styleUrls: ['./lead-form-setup.component.scss'],
})
export class LeadFormSetupComponent implements OnInit, AfterViewInit {
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowData: any = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  userLoginId: any;
  entityId: string | null;
  financial_year_id: string | null;

  constructor(
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private $crm: CrmService,
    private location: Location,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    if (this.userLoginId) {
      this.getLeadFormSetup();
    }
  }

  // Get all start
  getLeadFormSetup() {
    try {
      this.$crm.getLeadFormSetup(this.entityId,this.financial_year_id).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Field Type',
      field: 'field_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Field Name',
      field: 'field_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionLeadFormSetupStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleChangeStatus(data),
      },
    },
    {
      headerName: 'Mandatory',
      field: 'mandatory',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionLeadFormSetupMandatoryComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleChangeStatus(data),
      },
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionLeadFormSetupComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleActionData(data),
      },
    },
  ];

  handleChangeStatus(data: any) {
    this.getLeadFormSetup();
  }

  handleActionData(data: any) {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
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

  onCellClicked(e: any) {
    return
    // this.candidate_id = e.data.candidate_id;
    // const dialogRef = this.dialog.open(ProfileDialogComponent, {
    //   width: '400px',
    //   data: { id: this.candidate_id },
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {

    // });
  }

  // Add modal open start
  openAddModal() {
    const dialogRef = this.dialog.open(AddLeadFormSetupDialogComponent, {
      width: '600px',
      data: { id: this.candidate_id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getLeadFormSetup();
    });
  }
  // Add modal open end

  goBack() {
    this.location.back();
  }

  onAgGridEvent(event: any) {
    this.getLeadFormSetup();
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
