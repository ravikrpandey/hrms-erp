import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { BankActionComponent } from '../bank-action/bank-action.component';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent {

  accountTypes: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  totalDebit: number = 0;
  totalCredit: number = 0;
  financial_id: any;
  entity_id: any;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  rowData1: any[] = [];
  expandCollapseAll: boolean = false;

  constructor(
    private http: HttpClient,
    private _finaceservice: FinaceService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.prepareData();
  }

  ngOnInit(){
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.prepareData();
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

  private prepareData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    this._finaceservice.getTrialBalanceList(entity_id, financial_id).subscribe((res: any) => {
      if (res) {
        const convertNodeAmounts = (node: any): any => {
          if (!node) return node;
          return {
            ...node,
            debit: this.convertAmount(node.debit || node.debit_amount || 0),
            credit: this.convertAmount(node.credit || node.credit_amount || 0),
            debit_amount: this.convertAmount(node.debit_amount || 0),
            credit_amount: this.convertAmount(node.credit_amount || 0),
            children: node.children?.map((child: any) => convertNodeAmounts(child)) || []
          };
        };

        this.accountTypes = res?.data?.accountTypes?.map((item: any) => convertNodeAmounts(item)) || [];
        this.filteredData = JSON.parse(JSON.stringify(this.accountTypes));
        this.rowData1 = this.flattenTreeForExport(this.filteredData);
        this.totalDebit = this.convertAmount(Number(res?.data?.totals?.total_debit || 0));
        this.totalCredit = this.convertAmount(Number(res?.data?.totals?.total_credit || 0));
        this.setExpanded(this.filteredData);
      }
    }, (err: any) => {
      this.toast.error(err.error?.message || 'Error loading trial balance data');
    });
  }

  flattenTreeForExport(nodes: any[], level: number = 0): any[] {
    const result: any[] = [];
    nodes.forEach((node: any) => {
      result.push({
        account_name: node.name || '',
        debit_amount: node.debit || 0,
        credit_amount: node.credit || 0,
        parent_account_name: '',
        level: level
      });
      if (node.children && node.children.length > 0) {
        result.push(...this.flattenTreeForExport(node.children, level + 1));
      }
    });
    return result;
  }

  onSearch(): void {
    if (!this.searchText?.trim()) {
      this.filteredData = JSON.parse(JSON.stringify(this.accountTypes));
      this.setExpanded(this.filteredData);
      return;
    }

    this.filteredData = this.accountTypes
      .map((item: any) => this.filterTree(item, this.searchText.toLowerCase()))
      .filter((item: any) => item !== null);
  }

  filterTree(node: any, search: string): any {
    if (!node) {
      return null;
    }

    const matched = node.name?.toLowerCase().includes(search);
    let filteredChildren: any[] = [];

    if (node.children?.length) {
      filteredChildren = node.children
        .map((child: any) => this.filterTree(child, search))
        .filter((child: any) => child !== null);
    }

    if (matched || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren
      };
    }

    return null;
  }

  toggleNode(item: any): void {
    item.expanded = !item.expanded;
  }

  setExpanded(nodes: any[]): void {
    nodes.forEach((node: any) => {
      node.expanded = true;
      if (node.children?.length) {
        this.setExpanded(node.children);
      }
    });
  }

  setCollapsed(nodes: any[]): void {
    nodes.forEach((node: any) => {
      node.expanded = false;
      if (node.children?.length) {
        this.setCollapsed(node.children);
      }
    });
  }

  onExpandCollapseAll(): void {
    if (this.expandCollapseAll) {
      this.setCollapsed(this.filteredData);
    } else {
      this.setExpanded(this.filteredData);
    }
    this.filteredData = [...this.filteredData];
  }

  onBtnExportDataAsExcel() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trial Balance');

    const titleRow = worksheet.addRow([`Trial Balance (${this.currencyCode || 'INR'})`]);
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
      'Account Name',
      'Debit Amount',
      'Credit Amount',
      'Level'
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
      const indent = '    '.repeat(item.level || 0);
      const row = worksheet.addRow([
        `${indent}${item.account_name || ''}`,
        item.debit_amount || 0,
        item.credit_amount || 0,
        item.level || 0
      ]);

      row.getCell(2).numFmt = '#,##0.00';
      row.getCell(3).numFmt = '#,##0.00';
    });

    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      'TOTALS',
      this.totalDebit || 0,
      this.totalCredit || 0,
      ''
    ]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    totalRow.getCell(2).numFmt = '#,##0.00';
    totalRow.getCell(3).numFmt = '#,##0.00';

    worksheet.columns.forEach((col: any) => {
      col.width = 20;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Trial-Balance_${new Date().toISOString().split('T')[0]}.xlsx`);
      this.toast.success('Trial Balance exported successfully');
    });
  }
}
