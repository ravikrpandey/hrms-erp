import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { OfferLetterService } from 'src/app/@shared/services/service/recruitment/offer-letter.service';
import { OfferLetterActionComponent } from '../offer-letter-action/offer-letter-action.component';

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.scss']
})
export class OfferLetterComponent {


  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  assignAction: any;
  entity_id: string | null;
  user_id: any;
  userDetails: any = {};
  navWidth: number = 0;
  jd_id: any;
  constructor(
    private route: ActivatedRoute,
    private _rbackService: RbacMasterService,
    private $offerLetter: OfferLetterService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);

    this.getpendingforapproval_offerletter('ALL');
  }


  profileDetails: any = {};
  getpendingforapproval_offerletter(selection_status: any) {
    let selectedEntityId = localStorage.getItem("selectedEntityId");
    let financial_year_id = localStorage.getItem("financial_id");
    let user_id = localStorage.getItem('EmpMainId');
    let query = {
      entity_id: selectedEntityId,
      financial_year_id: financial_year_id,
      user_id: user_id,
      offer_status: selection_status,
    }
    this.$offerLetter.getAll_offerletters(query).subscribe((res: any) => {
      if (res) {
        this.rowData = res?.data;
        if (this.actionType == 'Pending for Approval') {
          this.rowData?.map((item: any) => item.actionFor = 'approval')
        }
        else {
          this.rowData?.map((item: any) => item.actionFor = 'view')
        }

      }
    })
  }

  openNav() {
    this.navWidth = 400;
  }

  closeNav() {
    this.navWidth = 0;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
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
      headerName: 'Reference Number',
      field: 'reference_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Candidate Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueGetter: (params: any) => `${params.data.first_name} ${params.data.last_name}`
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Position',
      field: 'designation_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: OfferLetterActionComponent,
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
  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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
    // this.jobIdNew = e.data.id;
  }

  actionType: any;
  tabChange(event: MatTabChangeEvent): void {
    let label = event?.tab?.textLabel;
    if (label == "All Offers") {
      this.getpendingforapproval_offerletter('ALL');
    }
    else if (label == "Pending for Approval") {
      this.getpendingforapproval_offerletter('PENDING');
    }
    else if (label == "Approved Offers") {
      this.getpendingforapproval_offerletter('APPROVED');
    }
    else {
      this.getpendingforapproval_offerletter('REJECTED');
    };
    this.actionType = label;
  }

  tabs: any[] = [
    { label: 'All Offers' },
    { label: 'Pending for Approval' },
    { label: 'Approved Offers' },
    { label: 'Draft Offers' },
  ];

}