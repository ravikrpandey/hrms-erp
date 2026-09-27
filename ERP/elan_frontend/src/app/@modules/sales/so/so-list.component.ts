import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../service/sales.service';
import { SoActionComponent } from './so-action/so-action.component';
import { FormControl } from '@angular/forms';
import { ViewReasonsComponent } from './view-reasons/view-reasons.component';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { Subject, takeUntil } from 'rxjs';
interface ProposalRow {
  [key: string]: any;
  grant_total_original: number;
  currency_id_original: number;
  grant_total: number;
  displayed_currency_id: number;
}
@Component({
  selector: 'app-so-list',
  templateUrl: './so-list.component.html',
  styleUrls: ['./so-list.component.scss'],
})
export class SoListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  role_master_id: any;
  selected = new FormControl(0);
currencyData:any;
  private destroy$ = new Subject<void>();
  selectedCurrency: any;
  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private $proposal: ProposalService,
    private activeroute: ActivatedRoute,
    private _authServie: AuthService,
    private _productionService: ProductionService,
    private _seles: SalesService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('EmpMainId');
    this.role_master_id = localStorage.getItem('role_master_id');
    if (this.loginUser) {
      this.getAllSalesOrderData(0);
    }
    // this.onTabClick(0);
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
    const selectedCurrencyId = this.selectedCurrency?.Currency_Convert_id || 1;

    this.rowData = this.rowData.map((row: ProposalRow) => {
      // Original amount ko naye selected currency mein convert karo
      const newDisplayAmount = this.convertCurrency(
        row.grant_total_original,        // Original amount (unchanged)
        row.currency_id_original,        // Original currency (unchanged)
        selectedCurrencyId               // New selected currency
      );

      return {
        ...row,
        grant_total: newDisplayAmount,
        displayed_currency_id: selectedCurrencyId
      };
    });
  }
getCurrencyById(currencyId: number): any {
  return this.currencyData?.find(
    (c: any) => c.Currency_Convert_id === currencyId
  ) || null;
}
convertCurrency(
  amount: number,
  fromCurrencyId: number,
  toCurrencyId: number
): number {
  
  // Agar same currency hai to return as-is
  if (fromCurrencyId === toCurrencyId) {
    return Number(amount);
  }
  
  // From currency ki rate
  const fromCurrency = this.getCurrencyById(fromCurrencyId);
  const fromRate = Number(fromCurrency?.rate || 1);
  
  // To currency ki rate
  const toCurrency = this.getCurrencyById(toCurrencyId);
  const toRate = Number(toCurrency?.rate || 1);
  
  // Validation
  if (fromRate === 0 || toRate === 0) {
    console.warn(`Invalid rate - From: ${fromRate}, To: ${toRate}`);
    return Number(amount.toFixed(2));
  }
  
 
  const convertedAmount = (amount / fromRate) * toRate;
  
  return Number(convertedAmount.toFixed(2));
}
  tabIndex: any;
  onTabClick(event: any) {
     if (!this.gridApi) {
    return;
  }
    this.tabIndex = event;
    const isActionColumnExists = this.columnDefs.some(
      (col) => col.field === 'id'
    );

    if (event === 0 || event === 1 || event === 2) {
      if (!isActionColumnExists) {
        const actionColumn = {
          headerName: 'Action',
          field: 'id',
          cellRenderer: SoActionComponent,
          cellClass: 'grid-cell-centered',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          flex: 1,
          minWidth: 200,
          pinned: 'right',
        } as any;

        this.columnDefs.push(actionColumn);
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    } else {
      if (isActionColumnExists) {
        this.columnDefs = this.columnDefs.filter((col) => col.field !== 'id');
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    }
    if (event === 0) {
      this.getAllSalesOrderData(event);
    } else if (event === 1) {
      this.columnDefs.push();
      this.getAllSalesOrderData(event);
      // this.getAllPartiallyList();
    } else if (event === 2) {
      this.getAllSalesOrderData(event);
    } else if (event === 3) {
      // this.columnDefs.pop();
      // this.gridApi.setColumnDefs(this.columnDefs);
      this.getAllSalesOrderData(event);
    } else {
    }
  }
  getAllSalesOrderData(status: any) {
    try {
      this._seles
        .getAllSOList(this.loginUser, this.role_master_id, status)
        .subscribe(
          (response: any) => {
            if (response) {
              // this.rowData = response.data;
               this._configurationalMasterService.currencyData.next({ currency_id: 1 });
              this.selectedCurrency = this.getCurrencyById(1) || {
                Currency_Convert_id: 1,
                rate: 1,
                name: 'INR'
              };
              this.currencyData = response.currencyData;
              this.rowData = response.data.map((x: any) => {
                const originalCurrencyId = x.currency_id || 1;
                const originalAmount = Number(x.grant_total || 0);

                // Load time: original currency se selected currency mein convert karo
                const displayAmount = this.convertCurrency(
                  originalAmount,
                  originalCurrencyId,
                  this.selectedCurrency.Currency_Convert_id
                );

                return {
                  ...x,
                  grant_total_original: originalAmount,      // Database se yeh value
                  currency_id_original: originalCurrencyId,   // Original currency
                  grant_total: displayAmount,                 // Display ke liye
                  displayed_currency_id: this.selectedCurrency.Currency_Convert_id
                };
              });
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
  getAllPartiallyList() {
    try {
      this._seles
        .getAllPartiallyList(this.loginUser, this.role_master_id)
        .subscribe(
          (response: any) => {
            if (response) {
              this.rowData = response.data;
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
      headerName: 'PI. No.',
      field: 'pi_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
      headerName: 'Grand Total',
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
        return !isNaN(date.getTime())
          ? date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : '';
      },
    },
    {
      headerName: 'Delay Status',
      field: 'salesReason',
      cellClass: 'grid-cell-centered',
      tooltipField: 'salesReason',
      sortable: true,
      resizable: true,
      flex: 2,
      minWidth: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return 'N.A.';
        let color = '#6c757d'; // default gray
        if (params.value.toLowerCase().includes('approved')) color = 'green';
        else if (params.value.toLowerCase().includes('pending'))
          color = 'orange';
        else if (params.value.toLowerCase().includes('rejected')) color = 'red';

        return `<span style="
        color: ${color};
        font-weight: 600;
        cursor: pointer;
      ">${params.value}</span>`;
      },
      onCellClicked: (params: any) => {
        if (params.colDef.field === 'salesReason') {
          this.openDialog(params.data);
          console.log('Status clicked:', params.value);
        }
      },
    },
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   cellRenderer: SoActionComponent,
    //   cellClass: 'grid-cell-centered',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex: 1,
    //   minWidth: 300,
    //   pinned: 'right',
    // },
  ];

  customCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.color = 'green';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;
  }

  clickIt(params: any) {
    this._seles
      .getSalesByProsalId(params?.data?.proposal_id, params?.data?.do_id)
      .subscribe(
        (res: any) => {
          if (res) {
            this.route.navigate(['master/sales/view-order'], {
              queryParams: {
                proposalId: params?.data?.proposal_id,
                doId: params?.data?.do_id,
                actionType: 'view-details',
              },
            });
          }
        },
        (err: any) => {
          this.toast.warning(err.error.message);
        }
      );
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.onTabClick(this.selected.value || 0);
  }

  productionData: any;
  getAllProductionData() {
    this._productionService
      .getAllProductionData()
      .subscribe((response: any) => {
        this.productionData = [];
      });
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }

  openDialog(params: any) {
    this.dialog.open(ViewReasonsComponent, {
      width: '600px',
      height: '400px',
      data: { data: params, tab: this.tabIndex },
    });
  }

  historyOfSO() {
    this.route.navigate(['/master/sales/so/so-history'], {
      queryParams: { so_history: 0 },
    });
  }
}
