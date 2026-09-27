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
import { Chart } from 'chart.js/auto';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent {
  accountTypes: any[] = [];
  expandedMap: { [key: number]: boolean } = {};
  searchText: string = '';
  liabilityData: any;
  assetData: any;

  totalLiability: number = 0;
  totalAsset: number = 0;
  filteredLiability: any[] = [];
  filteredAsset: any[] = [];
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  expandCollapseAll: boolean = false;

  total_liability: any;
  total_asset: any;

  constructor(
    private http: HttpClient,
    private _finaceservice: FinaceService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.getPostingPeriodData();
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.prepareData();
      });
  }

  getPostingPeriodData() {
    this.prepareData();
  }

  convertAmount(amount: number): number {
    if (!amount) return 0;
    return this.currencyRate ? amount * this.currencyRate : amount;
  }

  convertTreeChildren(children: any[]): any[] {
    if (!children) return [];
    return children.map((child: any) => ({
      ...child,
      amount: this.convertAmount(child.amount),
      children: this.convertTreeChildren(child.children)
    }));
  }

  calculateTotal(node: any): number {
    if (!node) {
      return 0;
    }
    let total = this.convertAmount(Number(node.amount || 0));
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        total += this.calculateTotal(child);
      });
    }
    return total;
  }

  prepareData() {
    const entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getBalanceSheetList(entity_id).subscribe((res: any) => {
      if (res) {
        const rawData = res.data;
        this.accountTypes = rawData?.accountTypes?.map((type: any) => ({
          ...type,
          amount: this.convertAmount(type.amount),
          children: this.convertTreeChildren(type.children)
        })) || [];
        this.liabilityData = this.accountTypes.find(
          (x: any) => x.name === 'Liability'
        );
        this.assetData = this.accountTypes.find(
          (x: any) => x.name === 'Asset'
        );
        this.totalLiability = Math.abs(
          this.calculateTotal(this.liabilityData)
        );
        this.totalAsset = Math.abs(
          this.calculateTotal(this.assetData)
        );
        this.total_liability = this.convertAmount(rawData.liabilities);
        this.total_asset = this.convertAmount(rawData.assets);
        this.setDefaultExpand(this.liabilityData);
        this.setDefaultExpand(this.assetData);
        this.filteredLiability = [];
        this.filteredAsset = [];
        this.searchText = '';
        this.expandCollapseAll = false;
      }
    }, (err: any) => {
      this.toast.error(err.error?.message || 'Error loading balance sheet data');
    });
  }

  toggleNode(item: any): void {
    this.expandedMap[item.id] = !this.expandedMap[item.id];
  }

  setDefaultExpand(node: any): void {
    if (!node) return;
    this.expandedMap[node.id] = true;
    if (node.children?.length) {
      node.children.forEach((child: any) => {
        this.setDefaultExpand(child);
      });
    }
  }

  setCollapsed(node: any): void {
    if (!node) return;
    this.expandedMap[node.id] = false;
    if (node.children?.length) {
      node.children.forEach((child: any) => {
        this.setCollapsed(child);
      });
    }
  }

  onExpandCollapseAll(): void {
    if (this.expandCollapseAll) {
      this.setCollapsed(this.liabilityData);
      this.setCollapsed(this.assetData);
    } else {
      this.setDefaultExpand(this.liabilityData);
      this.setDefaultExpand(this.assetData);
    }
    this.filteredLiability = [...this.filteredLiability];
    this.filteredAsset = [...this.filteredAsset];
  }

  filterTree(nodes: any[], search: string): any[] {
    if (!nodes) return [];
    const result: any[] = [];
    for (const node of nodes) {
      const match = node.name?.toLowerCase().includes(search);
      let children: any[] = [];
      if (node.children?.length) {
        children = this.filterTree(node.children, search);
      }
      if (match || children.length) {
        this.expandedMap[node.id] = true;
        result.push({
          ...node,
          children
        });
      }
    }
    return result;
  }

  onSearch(): void {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.filteredLiability = [];
      this.filteredAsset = [];
      return;
    }
    this.filteredLiability = this.filterTree(
      this.liabilityData?.children || [],
      search
    );
    this.filteredAsset = this.filterTree(
      this.assetData?.children || [],
      search
    );
  }

  exportToExcel() {
    this.exportTableToExcel('tableID3', 'balance-sheet');
  }

  exportTableToExcel(tableID3: string, filename: string) {
    const table = document.getElementById(tableID3) as HTMLTableElement;
    if (!table) {
      console.error('Table not found!');
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Balance Sheet');
    const titleRow = worksheet.addRow([`Balance Sheet (${this.currencyCode || 'INR'})`]);
    titleRow.font = { bold: true, size: 15, underline: true };
    worksheet.mergeCells(`A1:C1`);
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);
    if (this.currencyRate && this.currencyRate !== 1) {
      const rateRow = worksheet.addRow([`Exchange Rate: 1 ${this.currencyCode || 'INR'} = ${this.currencyRate}`]);
      rateRow.font = { size: 10, italic: true };
      worksheet.mergeCells(`A${worksheet.rowCount}:C${worksheet.rowCount}`);
      worksheet.addRow([]);
    }
    const tables = document.querySelectorAll('.balance-table');
    let tableIndex = 0;
    tables.forEach((tableElement) => {
      const rows = tableElement.querySelectorAll('tr');
      if (tableIndex > 0) {
        worksheet.addRow([]);
      }
      const headerRow = worksheet.addRow([
        tableIndex === 0 ? 'Liabilities' : 'Assets',
        `Amount (${this.currencySymbol})`
      ]);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td, th');
        const excelRow = worksheet.addRow([]);
        cells.forEach((cell, i) => {
          let text = cell.textContent?.trim() || '';
          text = text.replace(/[₹$€£¥]/g, '').trim();
          const hasBoldTag =
            cell.innerHTML.toLowerCase().includes('<strong') ||
            cell.innerHTML.toLowerCase().includes('<b');
          const htmlCell = cell as HTMLElement;
          const alignment =
            htmlCell.classList.contains('text-end') || htmlCell.style.textAlign === 'right'
              ? 'right'
              : 'left';
          const cellValue = i === 1 && !isNaN(Number(text)) ? Number(text) : text;
          excelRow.getCell(i + 1).value = cellValue;
          excelRow.getCell(i + 1).alignment = { horizontal: alignment as ExcelJS.Alignment['horizontal'] };
          if (hasBoldTag || htmlCell.classList.contains('total-row') || htmlCell.tagName === 'TH') {
            excelRow.getCell(i + 1).font = { bold: true };
          }
          if (i === 1 && !isNaN(Number(text))) {
            excelRow.getCell(i + 1).numFmt = '#,##0.00';
          }
        });
      });
      tableIndex++;
    });
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow([
      'SUMMARY',
      ''
    ]);
    summaryRow.font = { bold: true, size: 12 };
    worksheet.mergeCells(`A${worksheet.rowCount}:B${worksheet.rowCount}`);
    const totalLiabilityRow = worksheet.addRow([
      `Total Liability (${this.currencySymbol})`,
      this.total_liability || 0
    ]);
    totalLiabilityRow.font = { bold: true };
    totalLiabilityRow.getCell(2).numFmt = '#,##0.00';
    const totalAssetRow = worksheet.addRow([
      `Total Asset (${this.currencySymbol})`,
      this.total_asset || 0
    ]);
    totalAssetRow.font = { bold: true };
    totalAssetRow.getCell(2).numFmt = '#,##0.00';
    const differenceRow = worksheet.addRow([
      `Difference (Asset - Liability) (${this.currencySymbol})`,
      (this.total_asset || 0) - (this.total_liability || 0)
    ]);
    differenceRow.font = { bold: true, color: { argb: 'FF0000FF' } };
    differenceRow.getCell(2).numFmt = '#,##0.00';
    worksheet.columns.forEach((col: any) => {
      col.width = 35;
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }
}
