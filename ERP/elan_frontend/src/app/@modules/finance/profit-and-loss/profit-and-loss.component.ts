import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { BankActionComponent } from '../bank-action/bank-action.component';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { CommonService } from 'src/app/@shared/services/common.service';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.scss']
})
export class ProfitAndLossComponent implements OnInit {

  profitLossData: any;
  revenueFromOperations: number = 0;
  otherIncome: number = 0;
  totalIncome: number = 0;
  costOfGoodsSold: number = 0;
  employeeBenefitExpense: number = 0;
  otherExpenses: number = 0;
  totalExpenses: number = 0;
  ebitda: number = 0;
  financeCost: number = 0;
  depreciationExpense: number = 0;
  profitBeforeTax: number = 0;
  profitForYear: number = 0;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  @ViewChild('barChart') private barChartRef: any;
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowClass: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  public columnDefs;
  rowData: any;
  JournalForm: FormGroup;
  getDataPath = (data: any) => {
    return data.hierachy;
  };
  autoGroupColumnDef = {
    headerName: 'Account',
    field: 'name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 250,
    valueGetter: (params: any) => {
      return params.data.name;
    },
    cellRendererParams: {
      suppressCount: true,
    },
  };
  totalDebit: number = 0.00;
  totalCredit: number = 0.00;
  fisical_year_id: any;
  fisicalYear: any;
  totalProfitLoss: number = 0.00;
  barChart: any;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private _finaceservice: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private fb: FormBuilder,
    private toast: ToastrService,
  ) {
    this.JournalForm = this.fb.group({
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    })
    this.rowClass = 'rowClass';
    this.columnDefs = [
      {
        headerName: `Amount (${this.currencySymbol})`,
        field: 'amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = params.value;
          if (amount != null) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
      },
    ];
    this.getPostingPeriodData();
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.prepareData();
        if (this.gridApi) {
          this.gridApi.refreshCells();
        }
      })
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
    this.prepareData();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.prepareData();
  }

  clearDate(control: any) {
    this.JournalForm.get(control)?.reset();
    this.prepareData();
    if (control == 'from_date') {
      const from_date = this.JournalForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createBarChart();
  }

  getPostingPeriodData() {
    this.prepareData();
  }

  filterAccountList() {
    const entity_id: any = localStorage.getItem('selectedEntityId');
    const financial_id = localStorage.getItem('financial_id');
    this._finaceservice.getFilterTrialBalanceList(entity_id, financial_id).subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
      }
    }, (err: any) => {
      this.toast.error(err.error.message);
    });
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getTotalDebit() {
    return Math.abs(this.totalDebit);
  }

  getTotalCredit() {
    return Math.abs(this.totalCredit);
  }

  getTotalProfit() {
    return Math.abs(this.totalProfitLoss);
  }

  totalrevenues: number = 0.00;
  totalstaffCosts: number = 0.00;
  totaloperatingExpenses: number = 0.00;
  totalAmortization: number = 0.00;
  totalnonOperationalExp: number = 0.00;
  totalfinancialIncome: number = 0.00;
  totalfinancialExpenss: number = 0.00;
  totaltax: number = 0.00;
  totalOperationResult: number = 0.00;
  financialResult: number = 0.00;
  resultBeforeTax: number = 0.00;
  netResults: number = 0.00;
  excelHeader: any = '';
  monthName: any;

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

  prepareData() {
    this.totalrevenues = 0.00;
    this.totalstaffCosts = 0.00;
    this.totaloperatingExpenses = 0.00;
    this.totalAmortization = 0.00;
    this.totalnonOperationalExp = 0.00;
    this.totalfinancialIncome = 0.00;
    this.totalfinancialExpenss = 0.00;
    this.totaltax = 0.00;
    this.totalOperationResult = 0.00;
    this.financialResult = 0.00;
    this.resultBeforeTax = 0.00;
    this.netResults = 0.00;
    const entity_id = localStorage.getItem("selectedEntityId");
    this.totalCredit = 0;
    this.totalDebit = 0;
    this.totalProfitLoss = 0;
    this.rowData = [];
    let data = {
      from_date: this.JournalForm.get('from_date')?.value,
      to_date: this.JournalForm.get('to_date')?.value
    }
    if (data?.from_date && data?.to_date) {
      let fromdate = moment(data?.from_date).format("YYYY-MM-DD");
      let todate = moment(data?.to_date).format("YYYY-MM-DD");
      this.monthName = moment(data?.from_date).format("MMMM");
      this.excelHeader = `em ${fromdate} to ${todate}`
    } else {
      this.excelHeader = '';
      this.monthName = '';
    }
    const financial_id = localStorage.getItem('financial_id');
    this._finaceservice.getProfitAndLossList(entity_id, financial_id).subscribe({
      next: (res: any) => {
        this.profitLossData = res?.data?.accountTypes || [];
        const convertNodeAmounts = (node: any): any => {
          if (!node) return node;
          return {
            ...node,
            amount: this.convertAmount(node.amount),
            children: node.children?.map((child: any) => convertNodeAmounts(child)) || []
          };
        };
        this.profitLossData = this.profitLossData.map((item: any) => convertNodeAmounts(item));
        const tradingIncome = this.findNodeByName(this.profitLossData, 'Trading Income');
        const tradingExpenses = this.findNodeByName(this.profitLossData, 'Trading Expenses');
        const pnlIncome = this.findNodeByName(this.profitLossData, 'P & L Income');
        const pnlExpenses = this.findNodeByName(this.profitLossData, 'P & L Expenses');
        this.revenueFromOperations = Math.abs(this.calculateNodeTotal(tradingIncome));
        this.otherIncome = Math.abs(this.calculateNodeTotal(pnlIncome));
        this.totalIncome = this.revenueFromOperations + this.otherIncome;
        this.costOfGoodsSold = Math.abs(this.calculateNodeTotal(tradingExpenses));
        this.otherExpenses = Math.abs(this.calculateNodeTotal(pnlExpenses));
        this.totalExpenses = this.costOfGoodsSold + this.otherExpenses;
        this.profitBeforeTax = this.totalIncome - this.totalExpenses;
        this.profitForYear = this.profitBeforeTax;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  calculateNodeTotal(node: any): number {
    if (!node) {
      return 0;
    }
    if (!node.children || node.children.length === 0) {
      return Number(node.amount || 0);
    }
    let total = 0;
    node.children.forEach((child: any) => {
      total += this.calculateNodeTotal(child);
    });
    return total;
  }

  findNodeByName(nodes: any[], name: string): any {
    for (const node of nodes) {
      if (node.name && node.name.trim().toUpperCase() === name.trim().toUpperCase()) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNodeByName(node.children, name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  getNestedAmount(node: any): number {
    if (!node) {
      return 0;
    }
    let total = Number(node.amount || 0);
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        total += this.getNestedAmount(child);
      });
    }
    return total;
  }

  excelReportData: any[] = [];
  categoryData: any = []

  addChildToSubcategory(parentid: number, newChild: { id: number; name: string }) {
    const findAndAddChild = (data: any) => {
      for (const item of data) {
        if (item.id === parentid) {
          item.children = item.children || [];
          item.children.push(newChild);
          return true;
        }
        if (item.children && findAndAddChild(item.children)) {
          return true;
        }
      }
      return false;
    };
    findAndAddChild(this.categoryData);
    this.prepareData();
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profit And Loss');
    const titleRow = worksheet.addRow([`Statement of Profit And Loss Account (${this.currencyCode || 'INR'})`]);
    titleRow.font = { bold: true, size: 15, underline: true };
    worksheet.mergeCells(`A1:B1`);
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);
    if (this.currencyRate && this.currencyRate !== 1) {
      const rateRow = worksheet.addRow([`Exchange Rate: 1 ${this.currencyCode || 'INR'} = ${this.currencyRate}`]);
      rateRow.font = { size: 10, italic: true };
      worksheet.mergeCells(`A${worksheet.rowCount}:B${worksheet.rowCount}`);
      worksheet.addRow([]);
    }
    const headers = worksheet.addRow(['Particulars', `Amount (${this.currencyCode})`]);
    headers.font = { bold: true };
    headers.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headers.alignment = { horizontal: 'center' };
    const rowsData = [
      { label: 'Revenue from operations', value: this.revenueFromOperations, isBold: false },
      { label: 'Other Income', value: this.otherIncome, isBold: false },
      { label: 'Total Income', value: this.totalIncome, isBold: true },
      { label: 'Trading Expenses', value: this.costOfGoodsSold, isBold: false },
      { label: 'Other Expenses', value: this.otherExpenses, isBold: false },
      { label: 'Total Expenses', value: this.totalExpenses, isBold: true },
      { label: 'Profit/(Loss) before tax', value: this.profitBeforeTax, isBold: true },
      { label: 'Profit/(Loss) for the year', value: this.profitForYear, isBold: true }
    ];
    rowsData.forEach((row) => {
      const excelRow = worksheet.addRow([row.label, row.value]);
      excelRow.getCell(1).alignment = { horizontal: 'left' };
      excelRow.getCell(2).alignment = { horizontal: 'right' };
      excelRow.getCell(2).numFmt = '#,##0.00';
      if (row.isBold) {
        excelRow.getCell(1).font = { bold: true };
        excelRow.getCell(2).font = { bold: true };
      }
    });
    worksheet.addRow([]);
    const totalRow = worksheet.addRow(['Net Profit / Loss', this.profitForYear]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    totalRow.getCell(2).numFmt = '#,##0.00';
    totalRow.getCell(2).alignment = { horizontal: 'right' };
    worksheet.columns.forEach((col: any) => {
      col.width = 35;
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Profit_And_Loss_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }

  createBarChart() {
    const ctx = this.barChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2024-2025'],
        datasets: [
          {
            barThickness: 80,
            barPercentage: 0.5,
            label: "Income",
            data: [this.totalDebit],
            backgroundColor: '#cc74c1'
          },
          {
            barThickness: 80,
            barPercentage: 0.5,
            label: "Expense",
            data: [Math.abs(this.totalCredit)],
            backgroundColor: '#6095f0'
          },
          {
            barThickness: 80,
            barPercentage: 0.5,
            label: "Profit",
            data: [this.totalProfitLoss],
            backgroundColor: '#68a66e'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

const flattenChildrenRecursively = (data: any,
  parent = null,
  childHierachy: any = null
) => {
  let newData: any = [];
  if (data) {
    data.forEach((initialRow: any) => {
      let parentHierachy: any = [];
      initialRow.hierachy = parentHierachy;
      if (parent) {
        initialRow.parent = parent;
        parentHierachy = [...childHierachy];
        initialRow.hierachy = parentHierachy;
      }
      parentHierachy.push(initialRow.name);
      newData.push(initialRow);
      if (initialRow.children) {
        newData = [
          ...newData,
          ...flattenChildrenRecursively(
            initialRow.children,
            initialRow,
            parentHierachy
          ),
        ];
      }
    });
  }
  return newData;
};

const flattenChildrenRecursively1 = (data: any,
  parent = null,
  childHierachy: any = null
) => {
  let newData: any = [];
  if (data) {
    data.forEach((initialRow: any) => {
      let parentHierachy: any = [];
      initialRow.hierachy = parentHierachy;
      if (parent) {
        initialRow.parent = parent;
        parentHierachy = [...childHierachy];
        initialRow.hierachy = parentHierachy;
      }
      parentHierachy.push(initialRow.name);
      newData.push(initialRow);
      if (initialRow.children) {
        newData = [
          ...newData,
          ...flattenChildrenRecursively(
            initialRow.children,
            initialRow,
            parentHierachy
          ),
        ];
      }
    });
  }
  return newData;
};
