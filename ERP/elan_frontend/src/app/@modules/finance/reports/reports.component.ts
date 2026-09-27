import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  company_id: any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  public columnDefs: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass';
    this.columnDefs = this.getColumnDefs();
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.columnDefs = this.getColumnDefs();
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }
        this.getTrialBalanceReport();
      });
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

  getColumnDefs() {
    return [
      {
        headerName: 'S.No.',
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        maxWidth: 85,
      },
      {
        headerName: 'Account',
        field: 'account_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: `Debit (${this.currencySymbol})`,
        field: 'total_debit_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.total_debit_amount ? params.data.total_debit_amount : 0;
        }
      },
      {
        headerName: `Credit (${this.currencySymbol})`,
        field: 'total_credit_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.total_credit_amount ? params.data.total_credit_amount : 0;
        }
      },
      {
        headerName: `Balance (${this.currencySymbol})`,
        field: 'balance',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.balance ? params.data.balance : 0;
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getTrialBalanceReport() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem('financial_id');
    this._finaceservice.getTrialBalanceReportList(entity_id, financial_id).subscribe((response: any) => {
      if (response && response.data) {
        this.rowData = response.data.map((item: any) => ({
          ...item,
          total_debit_amount: this.convertAmount(item.total_debit_amount || 0),
          total_credit_amount: this.convertAmount(item.total_credit_amount || 0),
          balance: this.convertAmount(item.balance || 0)
        }));
        this.calculateTotals();
      }
    }, (err: any) => {
      this.toast.error(err.error?.message || 'Error loading trial balance report');
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_debit_amount || 0), 0);
    this.totalCredit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_credit_amount || 0), 0);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onBtnExportDataAsExcel() {
    if (!this.rowData || this.rowData.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trial Balance Report');

    const titleRow = worksheet.addRow([`Trial Balance Report (${this.currencyCode || 'INR'})`]);
    titleRow.font = { bold: true, size: 15, underline: true };
    worksheet.mergeCells('A1:D1');
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    if (this.currencyRate && this.currencyRate !== 1) {
      const rateRow = worksheet.addRow([`Exchange Rate: 1 ${this.currencyCode || 'INR'} = ${this.currencyRate}`]);
      rateRow.font = { size: 10, italic: true };
      worksheet.mergeCells(`A${worksheet.rowCount}:D${worksheet.rowCount}`);
      worksheet.addRow([]);
    }

    const headers = [
      'S.No.',
      'Account',
      `Debit (${this.currencyCode})`,
      `Credit (${this.currencyCode})`,
      `Balance (${this.currencyCode})`
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { horizontal: 'center' };

    this.rowData.forEach((item: any, index: number) => {
      const row = worksheet.addRow([
        index + 1,
        item.account_name || '',
        item.total_debit_amount || 0,
        item.total_credit_amount || 0,
        item.balance || 0
      ]);

      row.getCell(3).numFmt = '#,##0.00';
      row.getCell(4).numFmt = '#,##0.00';
      row.getCell(5).numFmt = '#,##0.00';
    });

    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      '',
      'TOTALS',
      this.totalDebit || 0,
      this.totalCredit || 0,
      this.totalDebit - this.totalCredit || 0
    ]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    totalRow.getCell(3).numFmt = '#,##0.00';
    totalRow.getCell(4).numFmt = '#,##0.00';
    totalRow.getCell(5).numFmt = '#,##0.00';

    worksheet.columns.forEach((col: any) => {
      col.width = 20;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Trial-Balance-Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      this.toast.success('Trial Balance Report exported successfully');
    });
  }
}
