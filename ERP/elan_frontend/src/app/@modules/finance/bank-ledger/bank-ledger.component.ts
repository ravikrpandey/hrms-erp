import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bank-ledger',
  templateUrl: './bank-ledger.component.html',
  styleUrls: ['./bank-ledger.component.scss']
})
export class BankLedgerComponent implements OnInit {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { 
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true,
    pagination: true,
    paginationPageSize: 50,
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
  financial_year_id: any;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      company: new FormControl(null),
      currency: new FormControl(null),
      chart_of_account: new FormControl(null),
      currency_id: new FormControl(null),
      report_type: new FormControl('bank-ledger'),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      party_type: new FormControl(''),
      chart_account_id: new FormControl(null),
      product_id: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem("selectedEntityId");
    
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
   
        this.getJournalList();
      });

    this.getchartedAccount();
    
    const company_name = localStorage.getItem("company");
    const currency_id = localStorage.getItem("quotation_currency_id");
    const currency_name = localStorage.getItem("base_currency");
    this.JournalForm.patchValue({
      company: company_name,
      currency: currency_name,
      currency_id: currency_id,
    });
    
    this.getAllBankAccList();
    this.getJournalList();
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
    this._finaceservice.getBankAccountList(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.partyNameList = res.data;
        this.partyList1 = res?.data?.map((x: any) => x.account_name);
        this.partyList2 = this.partyNameList;
      }
    });
  }

  rowData1: any[] = [];

  getJournalList() {
    this.rowData = [];
    this.rowData1 = [];
    this.totalDebit = 0.00;
    this.totalCredit = 0.00;
    this.totalBalance = 0.00;
    
    let data = {
      ...this.JournalForm.value,
      financial_id: this.financial_year_id
    };
    
    this._finaceservice.filterVendorLedgerReport(data, this.entity_id).subscribe((response: any) => {
      if (response && response.data) {
        this.Account_list = response.data;
        
        this.Account_list.forEach((element: any, index: any) => {
 
          element.debit_amount = this.convertAmount(element.debit_amount);
          element.credit_amount = this.convertAmount(element.credit_amount);
          
          if (index == 0) {
            element['balance'] = Number(element.debit_amount) - Number(element.credit_amount);
          } else {
            if (element.debit_amount > 0) {
              element['balance'] = Number(this.Account_list[index - 1].balance) + Number(element.debit_amount);
            } else {
              element['balance'] = Number(this.Account_list[index - 1].balance) - Number(element.credit_amount);
            }
          }
          
          if (this.Account_list.length - 1 == index) {
            this.rowData = this.Account_list;

            let fromDate = this.JournalForm.get('from_date')?.value;
            let toDate = this.JournalForm.get('to_date')?.value;
            if (!fromDate && !toDate) {
              this.rowData1 = this.rowData;
              
              let currentDate = new Date();
              let currentYear = currentDate.getFullYear();
              let currentMonth = currentDate.getMonth();
              
              this.rowData1 = this.rowData.filter((row: any) => {
                let postingDate = new Date(row.date);
                return postingDate.getFullYear() === currentYear && postingDate.getMonth() === currentMonth;
              });
            } else {
              this.rowData1 = this.rowData;
            }
            this.calculateTotals();
          }
        });
      } else {
        this.rowData = [];
        this.rowData1 = [];
        this.totalDebit = 0.00;
        this.totalCredit = 0.00;
        this.totalBalance = 0.00;
      }
    }, (err: any) => {
      console.error("Error while fetching journal list:", err);
      this.toast.error(err.error?.message || 'Error loading bank ledger data');
    });
  }

  calculateTotals() {
    this.totalDebit = this.Account_list.reduce((sum: any, account: any) => sum + (account.debit_amount || 0), 0);
    this.totalCredit = this.Account_list.reduce((sum: any, account: any) => sum + (account.credit_amount || 0), 0);
    this.totalBalance = (this.totalDebit - this.totalCredit);
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
    this.getJournalList();
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
      minWidth: 160,
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
      headerName: 'Document Type',
      minWidth: 150,
      field: 'entry_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Document Number',
      minWidth: 170,
      field: 'journal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: `Debit (${this.currencySymbol})`,
      minWidth: 150,
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
      minWidth: 150,
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
      headerName: `Balance (${this.currencySymbol})`,
      minWidth: 150,
      field: 'balance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const amount = Math.abs(Number(params.value));
        if (!isNaN(amount) && amount !== 0) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      },
      valueGetter: (params: any) => {
        return params.data && params.data.balance ? params.data.balance : 0;
      }
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
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
    this.getJournalList();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getJournalList();
  }

  clearDate(control: any) {
    this.JournalForm.get(control)?.reset();
    this.getJournalList();
    if (control == 'from_date') {
      const from_date = this.JournalForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
    }
  }

  onPartyTypeChange(e: any) {
    this.getJournalList();
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
    let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.account_name));
    this.partyNameList = filteredVariable;
  }

  onPartyTypeNameSelect() {
    this.getJournalList();
  }

  onProductSelect() {
    this.getJournalList();
  }


  onBtnExportDataAsExcel() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bank Ledger');

    const titleRow = worksheet.addRow([`Bank Ledger (${this.currencyCode || 'INR'})`]);
    titleRow.font = { bold: true, size: 15, underline: true };
    worksheet.mergeCells(`A1:H1`);
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);

   
    if (this.currencyRate && this.currencyRate !== 1) {
      const rateRow = worksheet.addRow([`Exchange Rate: 1 ${this.currencyCode || 'INR'} = ${this.currencyRate}`]);
      rateRow.font = { size: 10, italic: true };
      worksheet.mergeCells(`A${worksheet.rowCount}:H${worksheet.rowCount}`);
      worksheet.addRow([]);
    }

   
    let fromDate = this.JournalForm.get('from_date')?.value;
    let toDate = this.JournalForm.get('to_date')?.value;
    if (!fromDate && !toDate) {
      fromDate = moment().startOf('month').format("YYYY-MM-DD");
      toDate = moment().endOf('month').format("YYYY-MM-DD");
    } else {
      fromDate = moment(fromDate).format("YYYY-MM-DD");
      toDate = moment(toDate).format("YYYY-MM-DD");
    }
    const dateRow = worksheet.addRow([`Period: ${fromDate} To ${toDate}`]);
    dateRow.font = { size: 10 };
    worksheet.mergeCells(`A${worksheet.rowCount}:H${worksheet.rowCount}`);
    worksheet.addRow([]);

    const headers = [
      'Date',
      'Debit Amount',
      'Debit Account',
      'Account Name',
      'Credit Account',
      'Credit Amount',
      'Document Type',
      'Document No'
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
        item.createdAt ? moment(item.createdAt).format("YYYY-MM-DD") : '',
        item.debit_amount || 0,
        item.account_name || '',
        item.parent_account_name || '',
        item.account_name || '',
        item.credit_amount || 0,
        item.entry_status || '',
        item.journal_no || ''
      ]);

     
      row.getCell(2).numFmt = '#,##0.00';
      row.getCell(6).numFmt = '#,##0.00';
    });

 
    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      'TOTALS',
      this.totalDebit || 0,
      '',
      '',
      '',
      this.totalCredit || 0,
      '',
      ''
    ]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    totalRow.getCell(2).numFmt = '#,##0.00';
    totalRow.getCell(6).numFmt = '#,##0.00';


    worksheet.columns.forEach((col: any) => {
      col.width = 20;
    });

 
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Bank-Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }


  onDownloadPdf() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    const doc = new jsPDF();

    const logoUrl = '../../../assets/company-logo.png';
    const logoWidth = 28;
    const logoHeight = 15;
    doc.addImage(logoUrl, 'PNG', 5, 5, logoWidth, logoHeight);

 
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const mectsTitle = "ELAN PRO";
    const pageWidth = doc.internal.pageSize.width;
    const mectsWidth = doc.getTextWidth(mectsTitle);
    const mectsX = (pageWidth - mectsWidth) / 2;
    doc.text(mectsTitle, mectsX, 18);


    doc.setFontSize(12);
    const title = `Bank Ledger (${this.currencySymbol})`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 26);

    let fromDate = this.JournalForm.get('from_date')?.value;
    let toDate = this.JournalForm.get('to_date')?.value;
    if (!fromDate && !toDate) {
      fromDate = moment().startOf('month').format("YYYY-MM-DD");
      toDate = moment().endOf('month').format("YYYY-MM-DD");
    } else {
      fromDate = moment(fromDate).format("YYYY-MM-DD");
      toDate = moment(toDate).format("YYYY-MM-DD");
    }


    if (this.currencyRate && this.currencyRate !== 1) {
      const rateText = `Exchange Rate: 1 ${this.currencyCode} = ${this.currencyRate}`;
      doc.setFontSize(8);
      doc.text(rateText, pageWidth - doc.getTextWidth(rateText) - 10, 14);
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
      'Debit Amount',
      'Debit Account',
      'Account Name',
      'Credit Account',
      'Credit Amount',
      'Document Type',
      'Document No'
    ];

    const rows = this.rowData1.map((row: any) => [
      moment(row.createdAt).format("YYYY-MM-DD"),
      `${this.currencySymbol} ${(row.debit_amount || 0).toFixed(2)}`,
      row.account_name || '',
      row.parent_account_name || '',
      row.account_name || '',
      `${this.currencySymbol} ${(row.credit_amount || 0).toFixed(2)}`,
      row.entry_status || '',
      row.journal_no || ''
    ]);

    const columnWidths = [18, 22, 25, 25, 25, 22, 20, 20];
    const startY = 32;

    doc.autoTable({
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
        7: { cellWidth: columnWidths[7] }
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


    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Debit: ${this.currencySymbol} ${(this.totalDebit || 0).toFixed(2)}`, 14, finalY);
    doc.text(`Total Credit: ${this.currencySymbol} ${(this.totalCredit || 0).toFixed(2)}`, 80, finalY);
    doc.text(`Total Balance: ${this.currencySymbol} ${(this.totalBalance || 0).toFixed(2)}`, 146, finalY);

    doc.save('Bank-Ledger.pdf');
  }
}