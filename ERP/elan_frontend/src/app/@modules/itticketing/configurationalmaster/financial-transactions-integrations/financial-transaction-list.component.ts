import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { AddCustomerComponent } from '../customer-type-master/add-customer/add-customer.component';
import { CustomerActionComponent } from '../customer-type-master/customer-action/customer-action.component';
import { CustomerTypeStatusComponent } from '../customer-type-master/customer-type-status/customer-type-status.component';
import { AddFinancialTransactionsIntegrationsComponent } from './add-financial-transactions-integrations/add-financial-transactions-integrations.component';

@Component({
  selector: 'app-financial-transaction-list',
  templateUrl: './financial-transaction-list.component.html',
  styleUrls: ['./financial-transaction-list.component.scss']
})
export class FinancialTransactionListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  dropVal: any = [{ name: 'Yes', value: true }, { name: 'No', value: false }]
  entity_id: any;

  financial_year_id: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private activeRoute: ActivatedRoute,
    private shortcutService: ShortcutService,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {


    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getListType()
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });

  }

  getListType = () => {
    this._configurationalMasterService.getFinacialTransactionIntegrationList().subscribe((res: any) => {
      this.rowData = res.data.reverse();
    }, (err: any) => {
      this.rowData = []
    });
  }
  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Module Name',
      field: 'menu_master_name',
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
      headerName: 'Mapping Account',
      field: 'mapping_component',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
     
    },
    {
      headerName: 'Credit / Debit',
      field: 'debitCredit',
      
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,

    
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


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  openDialog() {
this.route.navigate(['/master/configurational-master/financial-transactions-integrations/add-financial-transactions-integrations'])


  }

  // onCellClicked(e: any) {
  // }
  // isShortcutVisible() {
  //   return this.shortcutService.isShortcutVisible();
  // }
}
