import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PaymentProgramDialogComponent } from '../payment-program-dialog/payment-program-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GrnServiceService } from 'src/app/@modules/purchase-management/services/grn-service.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-payment-program-list',
  templateUrl: './payment-program-list.component.html',
  styleUrls: ['./payment-program-list.component.scss']
})
export class PaymentProgramListComponent {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = {
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true
  };
  selectedLeadList: any = [];
  userLoginId: any;
  chartedAccount: any;
  JournalForm: FormGroup;
  rowData: any;
  Account_list: any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalBalance: number = 0;
  filterControl = new FormControl();
  filteredAccountsList: any;
  entity_id: any;
  partyNameList: any[] = [];
  partyList1: any[] = [];
  partyList2: any[] = [];

  // Currency related properties
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;

  // Initialize columnDefs as empty array
  public columnDefs: any[] = [];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private GrnService: GrnServiceService,
    private dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      company: new FormControl(null),
      currency: new FormControl(null),
      chart_of_account: new FormControl(null),
      currency_id: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      party_type: new FormControl('VENDOR'),
      party_type_id: new FormControl(null),
      payment_status: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");

    // Subscribe to currency changes
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';

        // Update column definitions with new currency
        this.columnDefs = this.getColumnDefs();

        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }

        // Refresh data to show new currency
        this.getAllGRNInvoice();
      });

    this.filterControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.chartedAccount = this.filteredAccountsList.filter((account: any) =>
        account.account_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    const company_name = localStorage.getItem("company");
    const currency_id = localStorage.getItem("quotation_currency_id");
    const currency_name = localStorage.getItem("base_currency");
    this.JournalForm.patchValue({
      company: company_name,
      currency: currency_name,
      currency_id: currency_id,
      party_type: 'VENDOR'
    });

    this.onPartyTypeChange('VENDOR');

    // Initialize columns with default currency
    this.columnDefs = this.getColumnDefs();
    this.getAllGRNInvoice();
  }

  // Method to format currency for display
  formatCurrency(value: any): string {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return `${this.currencySymbol} 0.00`;
    const convertedValue = numValue * this.currencyRate;
    return `${this.currencySymbol} ${convertedValue.toFixed(2)}`;
  }

  // Method to get original INR value for payload
  getINRValue(value: any): number {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return 0;
    // Convert back to INR if currency rate is applied
    return this.currencyRate !== 0 ? numValue / this.currencyRate : numValue;
  }

  // Get column definitions with currency formatting
  getColumnDefs(): any[] {
    return [
      {
        minWidth: 40,
        maxWidth: 60,
        checkboxSelection: (params: any) => {
          return params.data?.payment_status != 'PAID';
        },
        headerCheckboxSelection: true,
        sortable: false,
        resizable: true,
        cellClass: 'grid-cell-centered',
      },
      {
        field: 'S.No',
        minWidth: 100,
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered ',
        flex: 1,
      },
      {
        headerName: 'Invoice Number',
        field: 'invoiceNo',
        minWidth: 160,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Name',
        field: 'vendor_name',
        minWidth: 150,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: `Amount (${this.currencyCode})`,
        minWidth: 150,
        field: 'total_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Paid Amount (${this.currencyCode})`,
        minWidth: 150,
        field: 'paid_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Due Amount (${this.currencyCode})`,
        minWidth: 150,
        field: 'amount_due',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: 'Due Status',
        field: 'payment_status',
        minWidth: 150,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Date',
        field: 'invoiceDate',
        minWidth: 150,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
    ];
  }

  rowDataDirect: any = [];
  totalInvoiceAmount: any = {
    total_amount: 0,
    paid_amount: 0,
    amount_due: 0
  };

  getAllGRNInvoice() {
    
    this.totalInvoiceAmount = {
      total_amount: 0,
      paid_amount: 0,
      amount_due: 0
    };
    let financial_id = localStorage.getItem("financial_id");
    let employee_id = localStorage.getItem("EmpMainId");

    this.GrnService.getAllCompletedInvoice(
      financial_id,
      this.entity_id,
      employee_id,
      this.JournalForm.value
    ).subscribe({
      next: (res: any) => {
        this.rowDataDirect = res.data;
        if (!this.rowDataDirect || !this.rowDataDirect.length) {
          this.rowDataDirect = [];
          this.JournalForm.get('party_type_id')?.reset();
          return this.toast.warning('No invoices Found!');
        }
        this.totalInvoiceAmount = {
          total_amount: res.totalAmount?.total_amount || 0,
          paid_amount: res.totalAmount?.paid_amount || 0,
          amount_due: res.totalAmount?.amount_due || 0
        };
      },
      error: (err) => {
        console.log(err);
        this.toast.error('Please select the Party Name');
      },
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // Set initial columns
    this.gridApi.setColumnDefs(this.columnDefs);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  selectedIds: number[] = [];
  selectedRowsData: any = [];

  onSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    console.log(selectedRows, 'selectedRows');
    this.selectedRowsData = selectedRows;
    this.selectedIds = selectedRows.map((row: any) => row.id);
  }

  goBack() {
    this.location.back();
  }

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  noOfDay: any;
  todate: any;
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');

  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.JournalForm.patchValue({ to_date: '' });
    this.getAllGRNInvoice();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getAllGRNInvoice();
  }

  clearDate(control: any) {
    if (control === 'party_type') {
      this.JournalForm.patchValue({
        party_type: 'VENDOR'
      });
      this.onPartyTypeChange('VENDOR');
      return;
    }
    this.JournalForm.get(control)?.reset();
    this.getAllGRNInvoice();
  }

  onPartyTypeChange(party: any) {
    this.rowDataDirect = [];
    this.JournalForm.get('party_type_id')?.reset();
    this.partyNameList = [];

    this._finaceservice.get_Party_Name_List(party, this.entity_id)
      .subscribe((res: any) => {
        this.partyNameList = res.data || [];
        this.partyList1 = res?.data?.map((x: any) => x.party_name) || [];
        this.partyList2 = this.partyNameList;
      });
  }

  getListFilteredData(val: any) {
    this.getAllGRNInvoice();
  }

  partyFilter(e: any) {
    let aa = e;
    let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.party_name));
    this.partyNameList = filteredVariable;
  }

  onPartyTypeNameSelect() {
    this.getAllGRNInvoice();
  }

  openDialog() {
    if (!this.selectedRowsData || !this.selectedRowsData.length) {
      return this.toast.error('Please Select Invoice from the list');
    } else {
      // Prepare data in INR for payload
      const selectedDataInINR = this.selectedRowsData.map((row: any) => ({
        ...row,
        total_amount: this.getINRValue(row.total_amount),
        paid_amount: this.getINRValue(row.paid_amount),
        amount_due: this.getINRValue(row.amount_due)
      }));

      const dialogRef = this.dialog.open(PaymentProgramDialogComponent, {
        width: '45%',
        data: selectedDataInINR
      });

      dialogRef.afterClosed().subscribe((result) => {
        // Refresh data after dialog closes
        if (result) {
          this.getAllGRNInvoice();
        }
      });
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
}
