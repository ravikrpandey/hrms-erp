import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';
import { ProformaActionComponent } from '../proforma-action/proforma-action.component';
import { FormControl } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Subject, takeUntil } from 'rxjs';
// import { ActionViewProposalVersionComponent } from '../action-proposal/action-view-proposal-version/action-view-proposal-version.component';
interface ProposalRow {
  [key: string]: any;
  grant_total_original: number;
  currency_id_original: number;
  grant_total: number;
  displayed_currency_id: number;
}
@Component({
  selector: 'app-proforma-list',
  templateUrl: './proforma-list.component.html',
  styleUrls: ['./proforma-list.component.scss'],
})
export class ProformaListComponent {
  private gridApi!: GridApi<any>;
  rowData: any = [];
  rowClass: any;
  userLoginId: any;
  entity_id: any;
  selected = new FormControl(0);
  role_master_id: any;
  financial_year_id: any;
  dealer: boolean = false;
  // role_master_id:any;
  
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
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.role_master_id = localStorage.getItem('role_master_id');

    this.financial_year_id = localStorage.getItem('financial_id');
    if (this.userLoginId) {
      this.getProposalList(false);
      this._configurationalMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
        console.log(currency);
        if (!currency) return;
        this.selectedCurrency = currency;
        if (this.rowData?.length) {

          this.updateCurrencyRate();

        }

      });
    }
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
  getProposalList(event: boolean) {
    try {

      this.$proposal
        .getAllPI(
          this.entity_id,
          this.financial_year_id,
          this.userLoginId,
          this.role_master_id,
          event
        )
        .subscribe(
          (response: any) => {
            if (response) {
              this._configurationalMasterService.currencyData.next({ currency_id: 1 });
              

              this.rowData = this._configurationalMasterService.prepareRows(
                response.data,
                'grant_total',
                'currency_id',
                this.selectedCurrency?.Currency_Convert_id || 1,

              );

            }
          },
          (err) => {
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
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 0.4,
      minWidth: 70,
    },
    {
      headerName: 'Quotation No.',
      field: 'proposal_no',
      cellRenderer: this.customCellRenderer.bind(this),
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'proposal_no',
    },
    {
      headerName: 'Ver.',
      field: 'version',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 100, // ✅ more space
    },
    {
      headerName: 'PI. No.',
      field: 'pi_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'pi_number', // ✅ show full on hover
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      cellClass: 'grid-cell-centered',
      tooltipField: 'company_name',
      sortable: true,
      resizable: true,
      flex: 1.2,
      minWidth: 150,
    },
    {
      headerName: 'Created By',
      field: 'lead_owner',
      cellClass: 'grid-cell-centered',
      tooltipField: 'lead_owner',
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
      minWidth: 130,
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
    // {
    //   headerName: 'Status',
    //   field: 'approvel_status',
    //   cellClass: 'grid-cell-centered',
    //   tooltipField: 'salesReason',
    //   sortable: true,
    //   resizable: true,
    //   flex: 1,
    //   minWidth: 120,
    // },
    {
      headerName: 'Action',
      field: 'id',
      pinned: 'right',
      flex: 1,
      minWidth: 100,
      cellRenderer: ProformaActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
  activeTabEvent: any;

  onTabClick(event: any) {
    this.activeTabEvent = event + 1;
    if (event === 0) {
      this.getProposalList(false)
    } else if (event === 1) {
      this.getProposalList(true)
    }
  }
  // Custome render start
  clickIt(params: any) {
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        proposalId: params?.data?.proposal_id,
        version_id: params?.data?.version_id,
        proposalApprovelId: null,
        status: 'performance',
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
}
