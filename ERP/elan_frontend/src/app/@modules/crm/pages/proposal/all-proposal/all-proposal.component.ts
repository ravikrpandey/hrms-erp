import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';
import { ActionViewProposalVersionComponent } from '../action-proposal/action-view-proposal-version/action-view-proposal-version.component';
import { FormControl } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Subject, takeUntil } from 'rxjs';
interface ProposalRow {
  [key: string]: any;
  grant_total_original: number;
  currency_id_original: number;
  grant_total: number;
  displayed_currency_id: number;
}
@Component({
  selector: 'app-all-proposal',
  templateUrl: './all-proposal.component.html',
  styleUrls: ['./all-proposal.component.scss'],
})
export class AllProposalComponent implements OnInit {
  private gridApi!: GridApi<any>;
  rowData: any = [];
  rowClass: any;
  currentTab: 'dealerCustomer' | 'elanProCustomer' = 'elanProCustomer';
  userLoginId: any;
  selected = new FormControl(0);
  private destroy$ = new Subject<void>();
  selectedCurrency: any;


  constructor(
    private $proposal: ProposalService,
    private location: Location,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId');
    if (this.userLoginId) {
      this.getProposalList(1, this.dealer);
    }
    this._configurationalMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
      console.log(currency);
      if (!currency) return;
      this.selectedCurrency = currency;
      if (this.rowData?.length) {

        this.updateCurrencyRate();

      }

    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateCurrencyRate() {

    this.rowData =
      this._configurationalMasterService.prepareRows(
        this.rowData,
        'grant_total',
        'currency_id',
        this.selectedCurrency.Currency_Convert_id,
        
      );
  }
 
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // Get all start
 
  getProposalList(proposal_status: any, dealer: boolean) {
    try {
      let data: any = 'All Proposal';
      this.$proposal
        .getAllProposalList(proposal_status, 'status', this.userLoginId, data, dealer)
        .subscribe(
          (response: any) => {
            if (response) {
              this.rowData = response.data;
              

              this._configurationalMasterService.currencyData.next({ currency_id: 1 });
              this.rowData =
                this._configurationalMasterService.prepareRows(
                  response.data,
                  'grant_total',
                  'currency_id',
                  this.selectedCurrency?.Currency_Convert_id || 1,

                );

            }
          },
          (err) => {
            if (err.error.code === 404) {
              this.rowData = [];
              return;
            }
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end
  

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 0.6,
      minWidth: 70,
    },
    {
      headerName: 'Quotation No.',
      field: 'proposal_no',
      cellRenderer: this.customCellRenderer.bind(this),
      tooltipField: 'proposal_no',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Ver.',
      field: 'version',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 0.5,
      minWidth: 80,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      tooltipField: 'company_name',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1.2,
      minWidth: 150,
    },
    {
      headerName: 'Created By',
      field: 'lead_owner',
      tooltipField: 'lead_owner',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Quotation Amount',
      field: 'grant_total',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params: any) => {
        if (params.value != null) {

          return `${this.selectedCurrency?.symbols || '₹'} ${Number(params.value).toLocaleString('en-IN')}`;
        }
        return '';
      },
    },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
        return '';
      },
    },
    {
      headerName: 'Follow-Up Date',
      field: 'follow_up_date',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
          }
        }
        return 'N.A.';
      },
    },
    {
      headerName: 'Action',
      field: 'id',
      cellRenderer: ActionViewProposalVersionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      flex: 0.8,
      minWidth: 150,
      pinned: 'right', // keeps action column visible
    },
  ];
  activeTabEvent: any;
  onTabClick(event: any) {
    this.activeTabEvent = event + 1;
    if (event === 0) {
      this.getProposalList(event + 1, this.dealer);
    } else if (event === 1) {
      this.getProposalList(event + 1, this.dealer);
    } else if (event === 2) {
      this.getProposalList(event + 1, this.dealer);
    } else if (event === 3) {
      this.getProposalList(event + 1, this.dealer);
    } else if (event === 4) {
      this.getProposalList(event + 1, this.dealer);
    } else {
      this.getProposalList(event + 1, this.dealer);
    }
  }
  // Custome render start
  clickIt(params: any) {
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        proposalId: params?.data?.id,
        version_id: params?.data?.version_id,
        proposalApprovelId: null,
      },
    });
  }

  customCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;
  }
  // Custome render end

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  goBack() {
    this.location.back();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  dealer: boolean = false;
  setTab(tab: 'dealerCustomer' | 'elanProCustomer') {
    this.currentTab = tab;
    if (tab == 'dealerCustomer') {
      this.dealer = true;
      this.getList(tab, this.dealer);
    } else {
      this.dealer = false;
      this.getList(tab, this.dealer);
    }
  }
  getList(tab: any, dealer: boolean) {
    try {

      let data: any = tab;
      this.getProposalList(this.activeTabEvent, dealer);

    } catch (error) {
      console.log(error);
    }
  }
}
