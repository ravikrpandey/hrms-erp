import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { debounceTime } from 'rxjs/operators';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ✅ Moved interface to the top before the component
interface BudgetEntry {
  date: string;
  debit_amount: any | null;
  credit_amount: any | null;
  department_name: string;
  region_name: string;
  account_name: string;
  entry_status: string;
  financial_year: any;
  cost_center_code: string;
  cost_center_name: string;
  budget_amount: any;
  amount: string | any;
  utilizedBudget?: any;
  remainingBudget?: any;
  exceededBudget?: any;
  runningBalance?: any; // ✅ ADDED
  document_number?: string;
  vendor_name?: string;
  branch_name?: string;
  warehouse_name?: string;
  // Store original values for reference
  _original_debit?: any;
  _original_credit?: any;
  _original_budget?: any;
  _original_utilized?: any;
  _original_remaining?: any;
  _original_running?: any;
}

@Component({
  selector: 'app-cost-center-ledger',
  templateUrl: './cost-center-ledger.component.html',
  styleUrls: ['./cost-center-ledger.component.scss']
})
export class CostCenterLedgerComponent implements OnInit {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { 
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true,
    pagination: true,
    paginationPageSize: 10,
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
  productList: any[] = [];
  costCentre1: any[] = [];
  costCentre2: any[] = [];
  costCentreList: any[] = [];
  warehouseList: any[] = [];
  warehouse1: any[] = [];
  warehouse2: any[] = [];
  branchListData: any[] = [];
  branchListData1: any[] = [];
  branchListData2: any[] = [];
  vendorListData: any[] = [];
  customerListData: any[] = [];
  vendorListData1: any[] = [];
  vendorListData2: any[] = [];
  customerListData1: any[] = [];
  customerListData2: any[] = [];
  financial_id: any;
  party_Value: any;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  departmentList: any[] = [];
  departmentList1: any[] = [];
  departmentList2: any[] = [];
  rowData1: any[] = [];
  totalBudget: number = 0;
  totalUtilized: number = 0;
  totalRemaining: number = 0;

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

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private inventoryService: InventoryManagementService,
    private branchService: CrmService,
    private vendorService: VendorManagementService,
    private _finaceService: FinaceService,
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      report_type: new FormControl('cost-center-ledger'),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      party_type: new FormControl('VENDOR'),
      cost_center_id: new FormControl(null),
      warehouse_id: new FormControl(null),
      branch_id: new FormControl(null),
      vendor_id: new FormControl(null),
      customer_id: new FormControl(null),
      department_id: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    
    this.filterControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      if (this.filteredAccountsList) {
        this.chartedAccount = this.filteredAccountsList.filter((account: any) =>
          account.account_name.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
     
        if (this.gridApi) {
          this.gridApi.refreshCells();
        }
       
        this.getCostCenterLedger();
      });

    this.getAll_Cost_Center();
    this.getAllWarehouseList();
    this.branchList();
    this.vendorList();
    this.customerList();
    this.getDepartmentList();

    const company_name = localStorage.getItem("company");
    const currency_id = localStorage.getItem("quotation_currency_id");
    const currency_name = localStorage.getItem("base_currency");
    this.JournalForm.patchValue({
      company: company_name,
      currency: currency_name,
      currency_id: currency_id,
    });

    this.getCostCenterLedger();
  }

  convertAmount(amount: number): number {
    if (!amount) return 0;
    return this.currencyRate ? amount * this.currencyRate : amount;
  }

  formatCurrency(amount: number): string {
    const convertedAmount = this.convertAmount(amount);
    if (!convertedAmount && convertedAmount !== 0) {
      return `${this.currencySymbol} 0.00`;
    }
    return `${this.currencySymbol} ${convertedAmount.toFixed(2)}`;
  }

  getAllBankAccList() {
    this._finaceservice.get_All_Bank_Acc_List().subscribe((res: any) => {
      if (res && res.data) {
        this.partyNameList = res.data;
        this.partyList1 = res?.data?.map((x: any) => x.account_names);
        this.partyList2 = this.partyNameList;
      }
    });
  }

  costCenterFilter(e: any) {
    const aa = e;
    let filteredVariable = this.costCentre2.filter((item: any) => aa.includes(item.cost_center_name));
    this.costCentreList = filteredVariable;
  }

  warehouseFilter(event: any) {
    this.warehouseList = this.warehouse2.filter((item: any) =>
      event.includes(item.name)
    );
  }

  branchFilter(event: any) {
    this.branchListData = this.branchListData2.filter((item: any) =>
      event.includes(item.branch_name)
    );
  }

  vendorFilter(event: any) {
    this.vendorListData = this.vendorListData2.filter((item: any) =>
      event.includes(item.vendor_name)
    );
  }

  customerFilter(event: any) {
    this.customerListData = this.customerListData2.filter((item: any) =>
      event.includes(item.company_name)
    );
  }

  departmentFilter(e: any) {
    const aa = e;
    let filteredVariable = this.departmentList2.filter((item: any) => aa.includes(item.department_name));
    this.departmentList = filteredVariable;
  }

  getAll_Cost_Center() {
    this._finaceservice.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.costCentreList = res?.data;
        this.costCentre1 = this.costCentreList.map((res: any) => res?.cost_center_name);
        this.costCentre2 = this.costCentreList;
      }
    });
  }

  getAllWarehouseList() {
    this.inventoryService.getAllWarehouseList(this.entity_id, this.financial_id).subscribe((res: any) => {
      if (res && res.data) {
        this.warehouseList = res?.data;
        this.warehouse1 = this.warehouseList.map((res: any) => res?.name);
        this.warehouse2 = this.warehouseList;
      }
    });
  }

  branchList() {
    this.branchService.branchSetup_get().subscribe((res: any) => {
      if (res && res.data) {
        this.branchListData = res.data;
        this.branchListData1 = this.branchListData.map(
          (item: any) => item.branch_name
        );
        this.branchListData2 = [...this.branchListData];
      }
    });
  }

  vendorList() {
    this.vendorService.getAllVerifyVendor(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.vendorListData = res.data;
        this.vendorListData1 = this.vendorListData.map(
          (item: any) => item.vendor_name
        );
        this.vendorListData2 = [...this.vendorListData];
      }
    });
  }

  customerList() {
    this._finaceService.getGParty(this.party_Value = 'CUSTOMER').subscribe((res: any) => {
      if (res && res.data) {
        this.customerListData = res?.data;
        this.customerListData1 = this.customerListData.map(
          (item: any) => item.company_name
        );
        this.customerListData2 = [...this.customerListData];
      }
    });
  }

  getDepartmentList() {
    this.departmentList = [];
    this.departmentList1 = [];
    this.departmentList2 = [];
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.departmentList = res?.data;
        this.departmentList1 = this.departmentList.map((res: any) => res?.department_name);
        this.departmentList2 = this.departmentList;
      }
    });
  }

  onDepartmentSelect(data: any) {
    let id = data?.dept_id;
    let ids = this.JournalForm.get('department_id')?.value;
    let payload = {
      department_id: ids
    };
    this.costCentreList = [];
    this.costCentre1 = [];
    this.costCentre2 = [];
    this.getCostCenterLedger();
  }

  // ✅ UPDATED: Simplified version - uses backend values directly
  getCostCenterLedger() {
    this.rowData = [];
    this.rowData1 = [];

    this._finaceservice.getCostCenterLedger(this.JournalForm.value, this.entity_id).subscribe(
      (response: any) => {
        if (response?.data) {
          const data: BudgetEntry[] = response.data;

          // ✅ Store original values and apply currency conversion
          data.forEach(entry => {
            // Store original values from backend
            entry._original_debit = entry.debit_amount;
            entry._original_credit = entry.credit_amount;
            entry._original_budget = entry.budget_amount;
            entry._original_utilized = entry.utilizedBudget;
            entry._original_remaining = entry.remainingBudget;
            entry._original_running = entry.runningBalance;

            // Apply currency conversion for display
            entry.debit_amount = this.convertAmount(Number(entry.debit_amount) || 0);
            entry.credit_amount = this.convertAmount(Number(entry.credit_amount) || 0);
            entry.budget_amount = this.convertAmount(Number(entry.budget_amount) || 0);
            entry.utilizedBudget = this.convertAmount(Number(entry.utilizedBudget) || 0);
            entry.remainingBudget = this.convertAmount(Number(entry.remainingBudget) || 0);
            entry.runningBalance = this.convertAmount(Number(entry.runningBalance) || 0);
          });

          this.rowData = data;

          // Filter by date range
          const fromDate = this.JournalForm.get('from_date')?.value;
          const toDate = this.JournalForm.get('to_date')?.value;

          if (!fromDate && !toDate) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            this.rowData1 = this.rowData.filter((row: any) => {
              const postingDate = new Date(row.date);
              return postingDate.getFullYear() === currentYear && postingDate.getMonth() === currentMonth;
            });
          } else {
            this.rowData1 = this.rowData;
          }

          this.calculateTotals();

          // ✅ Refresh grid if available
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData1);
          }

        } else {
          this.rowData = [];
          this.rowData1 = [];
          this.totalDebit = 0;
          this.totalCredit = 0;
          this.totalBalance = 0;
          this.totalBudget = 0;
          this.totalUtilized = 0;
          this.totalRemaining = 0;
        }
      },
      (err: any) => {
        console.error("Error while fetching journal list:", err);
        this.toast.error(err.error?.message || 'Error loading cost center ledger data');
      }
    );
  }

  // ✅ UPDATED: Calculate totals from the data
  calculateTotals() {
    this.totalDebit = this.rowData1.reduce(
      (sum: number, item: any) => sum + Number(item.debit_amount || 0),
      0
    );
  
    this.totalCredit = this.rowData1.reduce(
      (sum: number, item: any) => sum + Number(item.credit_amount || 0),
      0
    );
  
    if (this.rowData1.length > 0) {
      const firstRow = this.rowData1[0];
      const lastRow = this.rowData1[this.rowData1.length - 1];
  
      this.totalBudget = Number(firstRow.budget_amount || 0);
      this.totalUtilized = Number(lastRow.utilizedBudget || 0);
      this.totalRemaining = Number(lastRow.remainingBudget || 0);
    } else {
      this.totalBudget = 0;
      this.totalUtilized = 0;
      this.totalRemaining = 0;
    }
  }

  getchartedAccount() {
    this._finaceservice.getchartedAccount(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.chartedAccount = res.data;
        this.filteredAccountsList = this.chartedAccount;
      }
    });
  }

  onAccountChange() {
    this.getCostCenterLedger();
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup?.get('from_date')?.value;
    const toDate = formGroup?.get('to_date')?.value;
    if (fromDate && toDate && fromDate > toDate || !fromDate && toDate) {
      formGroup?.get('to_date')?.setErrors({ invalidDateRange: true });
      this.JournalForm.patchValue({
        to_date: '',
      });
    } else {
      formGroup?.get('to_date')?.setErrors(null);
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      minWidth: 60,
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'date',
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      headerName: 'Cost-Center Code',
      minWidth: 150,
      field: 'cost_center_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Cost Center Name',
      minWidth: 170,
      field: 'cost_center_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Branch',
      minWidth: 160,
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Warehouse',
      minWidth: 160,
      field: 'warehouse_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Type',
      minWidth: 160,
      field: 'entry_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Vendor',
      minWidth: 160,
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Customer',
      minWidth: 160,
      field: 'entry',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Transaction Ref No',
      minWidth: 170,
      field: 'document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Account',
      minWidth: 170,
      field: 'account_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: `Debit (${this.currencySymbol})`,
      minWidth: 160,
      field: 'debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.debit_amount ? params.data.debit_amount : 0;
      }
    },
    {
      headerName: `Credit (${this.currencySymbol})`,
      minWidth: 160,
      field: 'credit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.credit_amount ? params.data.credit_amount : 0;
      }
    },
    {
      headerName: `Budget Amount (${this.currencySymbol})`,
      field: 'budget_amount',
      minWidth: 160,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.budget_amount ? params.data.budget_amount : 0;
      }
    },
    {
      headerName: `Utilized Budget (${this.currencySymbol})`,
      field: 'utilizedBudget',
      minWidth: 160,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.utilizedBudget ? params.data.utilizedBudget : 0;
      }
    },
    {
      headerName: `Remaining Budget (${this.currencySymbol})`,
      minWidth: 160,
      field: 'remainingBudget',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.remainingBudget ? params.data.remainingBudget : 0;
      }
    },
    {
      headerName: `Running Balance (${this.currencySymbol})`,
      minWidth: 160,
      field: 'runningBalance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.runningBalance ? params.data.runningBalance : 0;
      }
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    if (this.rowData1) {
      this.gridApi.setRowData(this.rowData1);
    }
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  goBack() {
    this.location.back();
  }

  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.JournalForm.patchValue({ to_date: '' });
    this.getCostCenterLedger();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getCostCenterLedger();
  }

  clearDate(control: any) {
    this.JournalForm.get(control)?.reset();
    this.getCostCenterLedger();
    if (control == 'from_date') {
      const from_date = this.JournalForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
    }
    if (control === 'branch_id') {
      this.branchListData = [...this.branchListData2];
    }
    if (control == 'department_id') {
      this.JournalForm.get(control)?.setValue([]);
    }
    if (control === 'vendor_id') {
      this.vendorListData = [...this.vendorListData2];
    }
    if (control === 'customer_id') {
      this.customerListData2 = [...this.customerListData2];
    }
    if (control === 'cost_center_id') {
      this.getAll_Cost_Center();
    }
  }

  onPartyTypeChange(e: any) {
    this.getCostCenterLedger();
    let party = e.value;
    this.partyNameList = [];
    if (party) {
      this._finaceservice.get_Party_Name_List(party, this.entity_id).subscribe((res: any) => {
        if (res && res.data) {
          this.partyNameList = res.data;
          this.partyList1 = res?.data?.map((x: any) => x.party_name);
          this.partyList2 = this.partyNameList;
        }
      });
    }
  }

  partyFilter(e: any) {
    let aa = e;
    let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.account_names));
    this.partyNameList = filteredVariable;
  }

  onPartyTypeNameSelect() {
    this.getCostCenterLedger();
  }

  onProductSelect() {
    this.getCostCenterLedger();
  }

  onBtnExportDataAsExcel() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cost Center Ledger');

    const titleRow = worksheet.addRow([`Cost Center Ledger (${this.currencyCode || 'INR'})`]);
    titleRow.font = { bold: true, size: 15, underline: true };
    worksheet.mergeCells(`A1:M1`);
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    if (this.currencyRate && this.currencyRate !== 1) {
      const rateRow = worksheet.addRow([`Exchange Rate: 1 ${this.currencyCode || 'INR'} = ${this.currencyRate}`]);
      rateRow.font = { size: 10, italic: true };
      worksheet.mergeCells(`A${worksheet.rowCount}:M${worksheet.rowCount}`);
      worksheet.addRow([]);
    }

    let fromDate = this.JournalForm.get('from_date')?.value;
    let toDate = this.JournalForm.get('to_date')?.value;
    if (!fromDate && !toDate) {
      fromDate = moment().startOf('year').format("YYYY-MM-DD");
      toDate = moment().endOf('year').format("YYYY-MM-DD");
    } else {
      fromDate = moment(fromDate).format("YYYY-MM-DD");
      toDate = moment(toDate).format("YYYY-MM-DD");
    }
    const dateRow = worksheet.addRow([`Period: ${fromDate} To ${toDate}`]);
    dateRow.font = { size: 10 };
    worksheet.mergeCells(`A${worksheet.rowCount}:M${worksheet.rowCount}`);
    worksheet.addRow([]);

    const headers = [
      'Date',
      'Cost Center Code',
      'Cost Center Name',
      'Amount',
      'Transaction Ref No',
      'Account',
      'Department',
      'Region',
      'Type',
      'Budget Amount',
      'Utilized Budget',
      'Remaining Budget',
      'Running Balance'
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { horizontal: 'center' };

    this.rowData1.forEach((item: any) => {
      const row = worksheet.addRow([
        item.date ? moment(item.date).format("YYYY-MM-DD") : '',
        item.cost_center_code || '',
        item.cost_center_name || '',
        item.amount || 0,
        item.document_number || '',
        item.account_name || '',
        item.department_name || '',
        item.region_name || '',
        item.entry_status || '',
        item.budget_amount || 0,
        item.utilizedBudget || 0,
        item.remainingBudget || 0,
        item.runningBalance || 0
      ]);

      row.getCell(4).numFmt = '#,##0.00';
      row.getCell(10).numFmt = '#,##0.00';
      row.getCell(11).numFmt = '#,##0.00';
      row.getCell(12).numFmt = '#,##0.00';
      row.getCell(13).numFmt = '#,##0.00';
    });

    worksheet.columns.forEach((col: any) => {
      col.width = 18;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Cost-Center-Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }

  onDownloadPdf() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const doc = new jsPDF('landscape');
    const logoUrl = '../../../../assets/icons/mects-logo-1.png';
    const logoWidth = 28;
    const logoHeight = 15;
    doc.addImage(logoUrl, 'PNG', 5, 5, logoWidth, logoHeight);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const mectsTitle = "MECTS";
    const pageWidth = doc.internal.pageSize.width;
    const mectsWidth = doc.getTextWidth(mectsTitle);
    const mectsX = (pageWidth - mectsWidth) / 2;
    doc.text(mectsTitle, mectsX, 18);

    doc.setFontSize(12);
    const title = `Cost Center Ledger (${this.currencySymbol})`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 26);

    if (this.currencyRate && this.currencyRate !== 1) {
      const rateText = `Exchange Rate: 1 ${this.currencyCode} = ${this.currencyRate}`;
      doc.setFontSize(8);
      doc.text(rateText, pageWidth - doc.getTextWidth(rateText) - 10, 14);
    }

    let fromDate = this.JournalForm.get('from_date')?.value;
    let toDate = this.JournalForm.get('to_date')?.value;
    if (!fromDate && !toDate) {
      fromDate = moment().startOf('year').format("YYYY-MM-DD");
      toDate = moment().endOf('year').format("YYYY-MM-DD");
    } else {
      fromDate = moment(fromDate).format("YYYY-MM-DD");
      toDate = moment(toDate).format("YYYY-MM-DD");
    }

    const dateRange = `Period: ${fromDate} To ${toDate}`;
    const dateRangeWidth = doc.getTextWidth(dateRange);
    const marginRight = 6;
    const marginLeft = 15;
    const dateRangeX = pageWidth - dateRangeWidth - marginRight + marginLeft;
    doc.setFontSize(8);
    doc.text(dateRange, dateRangeX, 22);

    const columns = [
      'Date',
      'CC Code',
      'CC Name',
      'Amount',
      'Trans Ref',
      'Account',
      'Department',
      'Region',
      'Type',
      'Budget',
      'Utilized',
      'Remaining',
      'Balance'
    ];

    const rows = this.rowData1.map((row: any) => [
      row.date ? moment(row.date).format("YYYY-MM-DD") : '',
      row.cost_center_code || '',
      row.cost_center_name || '',
      `${this.currencySymbol} ${(row.amount || 0).toFixed(2)}`,
      row.document_number || '',
      row.account_name || '',
      row.department_name || '',
      row.region_name || '',
      row.entry_status || '',
      `${this.currencySymbol} ${(row.budget_amount || 0).toFixed(2)}`,
      `${this.currencySymbol} ${(row.utilizedBudget || 0).toFixed(2)}`,
      `${this.currencySymbol} ${(row.remainingBudget || 0).toFixed(2)}`,
      `${this.currencySymbol} ${(row.runningBalance || 0).toFixed(2)}`
    ]);

    const columnWidths = [20, 20, 25, 20, 20, 25, 20, 20, 20, 20, 20, 20, 20];
    const startY = 32;

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: startY,
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
        6: { cellWidth: columnWidths[6] },
        7: { cellWidth: columnWidths[7] },
        8: { cellWidth: columnWidths[8] },
        9: { cellWidth: columnWidths[9] },
        10: { cellWidth: columnWidths[10] },
        11: { cellWidth: columnWidths[11] },
        12: { cellWidth: columnWidths[12] }
      },
      theme: 'grid',
      margin: { top: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      didDrawCell: (data: any) => {
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save('Cost-Center-Ledger.pdf');
  }
}