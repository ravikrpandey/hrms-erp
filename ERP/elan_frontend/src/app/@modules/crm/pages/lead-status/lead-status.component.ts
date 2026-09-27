import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ViewLeadStatusDialogComponent } from '../dialogs/view-lead-status-dialog/view-lead-status-dialog.component';
import { Location } from '@angular/common';
import { ActionLeadStatusComponent } from '../action/action-lead-status/action-lead-status.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html',
  styleUrls: ['./lead-status.component.scss'],
})
export class LeadStatusComponent implements OnInit, AfterViewInit {
  private gridApi!: GridApi<any>;
  rowData: Candidate[] = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  matBtnColor: Number = 1;
  userLoginId: any;
  entity_id: string | null;
  financial_year_id: string | null;

  constructor(
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private route : ActivatedRoute,
    private $crm: CrmService,
    private location: Location,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['followup'] === 'missed') {
        this.getLeadFormSetup(0);
      } else if(params['followup'] === 'upcoming'){
        this.getLeadFormSetup(2);
      }
      else {
        this.getLeadFormSetup(1);
      }
    });
    this.userLoginId = localStorage.getItem('EmpMainId')
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    if (this.userLoginId && !this.route.snapshot.queryParams['followup']) {
      this.getLeadFormSetup(1);  
    } else if(this.route.snapshot.queryParams['followup'] === 'missed'){
      this.getLeadFormSetup(0);
    }
    else {
      this.getLeadFormSetup(2);
    }
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // Get all start
  getLeadFormSetup(data: any) {
    try {
      this.matBtnColor = data;
      let loginId=localStorage.getItem('EmpMainId')
    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_year_id = localStorage.getItem('financial_id');
      this.$crm.getLeadData(data,loginId,entity_id,financial_year_id).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
          this.rowData?.map((item: any) => {
            item.leadStatus = item?.dynamic_fields?.status;
          })
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
      // flex: 1,
      width: 75,
    },

    {
      headerName: 'Contact Person Name',
      field: 'contact_person_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Lead Owner',
      field: 'lead_owner',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'dynamic_fields.status',
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
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionLeadStatusComponent,
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
    //
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellClicked(e: any) {
    return
    this.candidate_id = e.data.candidate_id;
    const dialogRef = this.dialog.open(ViewLeadStatusDialogComponent, {
      width: '500px',
      data: e.data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }

  goBack() {
    this.location.back()
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
