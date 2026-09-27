import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { MatDrawer } from '@angular/material/sidenav';
import { CashBookActionComponent } from './cash-book-action/cash-book-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss']
})
export class CashBookComponent {

  private gridApi!: GridApi<any>;

  rowClass: any;
  cashBookForm: FormGroup;

  rowData: any[] = [];

  entity_id: any;
  department_id: any;
  department_name: any;

  bankCoaList: any[] = [];
  chartedAccount: any;

  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;

  @ViewChild('drawer') drawer!: MatDrawer;
  selectedForm: string = '';
  formTitle: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private toast: ToastrService,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {

    this.rowClass = 'rowClass';

    this.cashBookForm = this.fb.group({
      available_amount: new FormControl(null),
      chart_of_account: new FormControl(null),
      department_name: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    });
  }

  ngOnInit(): void {

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.department_id = localStorage.getItem("department_id");

    // ✅ Currency subscription
    this._configurationalmasterService.currency$
      .subscribe((currency: any) => {

        this.currencyData = currency;
        this.currencyCode = currency?.Currency_Type || 'INR';
        this.currencyRate = Number(currency?.rate) || 1;
        this.currencySymbol = currency?.symbols || '₹';

        this.columnDefs = this.getColumnDefs();

        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }

      });

    this.getCashBookData();
  }

  // =========================
  // ✅ CURRENCY HELPERS
  // =========================

  convertAmount(amount: number): number {
    if (!amount) return 0;
    return this.currencyRate ? amount * this.currencyRate : amount;
  }

  formatCurrency(amount: number): string {
    const converted = this.convertAmount(Number(amount || 0));
    return `${this.currencySymbol} ${converted.toFixed(2)}`;
  }

  // =========================
  // GRID COLUMNS
  // =========================

  columnDefs: any[] = [];

  getColumnDefs() {
    return [
      {
        headerName: 'S No.',
        valueGetter: 'node.rowIndex + 1',
        maxWidth: 80,
        cellClass: 'grid-cell-centered'
      },

      {
        headerName: 'Date',
        field: 'date',
        valueFormatter: (params: any) => {
          return moment(params.value).format('DD-MM-YYYY');
        }
      },

      {
        headerName: 'Reference',
        field: 'reference'
      },

      {
        headerName: 'Transaction Type',
        field: 'form_type'
      },

      {
        headerName: `Deposits (${this.currencySymbol})`,
        field: 'debit_amount',
        cellRenderer: (params: any) => {
          return this.formatCurrency(params.value);
        }
      },

      {
        headerName: `Withdrawals (${this.currencySymbol})`,
        field: 'credit_amount',
        cellRenderer: (params: any) => {
          return this.formatCurrency(params.value);
        }
      },

      {
        headerName: `Running Balance (${this.currencySymbol})`,
        field: 'balance',
        cellRenderer: (params: any) => {
          return this.formatCurrency(params.value);
        }
      },

    ];
  }

  // =========================
  // GRID READY
  // =========================

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }

  // =========================
  // CASH BOOK DATA
  // =========================

  getCashBookData() {

    this._finaceservice.getCashBookData(this.entity_id)
      .subscribe((response: any) => {

        if (response?.data) {

          let Account_list = response.data;

          let firstRowBalance = 0;

          for (let index = Account_list.length - 1; index >= 0; index--) {

            const element = Account_list[index];

            if (index === Account_list.length - 1) {
              element.balance =
                Number(element.debit_amount) - Number(element.credit_amount);
            } else {

              if (element.debit_amount > 0) {
                element.balance =
                  Number(Account_list[index + 1].balance) +
                  Number(element.debit_amount);
              } else {
                element.balance =
                  Number(Account_list[index + 1].balance) -
                  Number(element.credit_amount);
              }
            }

            if (index === 0) {
              firstRowBalance = element.balance;
            }
          }

          // ✅ Convert amounts using currency rate
          this.rowData = Account_list.map((item: any) => ({
            ...item,
            debit_amount: this.convertAmount(item.debit_amount || 0),
            credit_amount: this.convertAmount(item.credit_amount || 0),
            balance: this.convertAmount(item.balance || 0)
          }));
          //  let available_amount = this.rowData[0]?.balance
          //  console.log(typeof(this.rowData[0]?.balance),'kkk')
          this.cashBookForm.get('available_amount')?.setValue(
            this.formatCurrency(this.rowData[0]?.balance)
          );

        } else {
          this.rowData = [];
        }

      },
        (err: any) => {
          console.error(err);
        });

  }

  // =========================
  // BASIC FUNCTIONS
  // =========================

  goBack() {
    this.location.back();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // =========================
  // DRAWER (UNCHANGED)
  // =========================

  openForm(formType: string): void {
    this.selectedForm = formType;
    this.drawer.open();
  }
}
