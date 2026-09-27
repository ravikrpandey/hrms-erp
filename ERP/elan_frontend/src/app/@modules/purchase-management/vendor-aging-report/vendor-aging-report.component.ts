import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { GridApi, GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-vendor-aging-report',
  templateUrl: './vendor-aging-report.component.html',
  styleUrls: ['./vendor-aging-report.component.scss']
})
export class VendorAgingReportComponent implements OnInit {

  private gridApi!: GridApi<any>;
  private gridColumnApi!: any;
  private detailGridApi!: GridApi<any>;
  private detailGridColumnApi!: any;

  filterForm: FormGroup;
  isLoading: boolean = false;
  showDetailView: boolean = false;
  selectedVendor: any = null;

  rowData: any[] = [];
  detailRowData: any[] = [];
  vendors: any[] = [];
  paymentTermsList: any[] = [];

  totalOutstanding: number = 0;
  totalCurrent: number = 0;
  totalOverdue: number = 0;

  currencySymbol: string = '₹';
  currencyCode: string = 'INR';
  currencyRate: number = 1;
  entity_id: any;

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      width: 70,
      cellClass: 'grid-cell-centered',
      pinned: 'left'
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Vendor Code',
      field: 'vendor_code',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'GSTIN',
      field: 'gst_in',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      width: 150,
      cellClass: 'grid-cell-centered',
      valueFormatter: (params: any) => params.value || '-'
    },
    {
      headerName: 'Payment Terms',
      field: 'payment_terms',
      sortable: true,
      resizable: true,
      width: 140,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: ICellRendererParams) => {
        const terms = params.value;
        return `<span class="payment-terms-badge">${terms || 'N/A'}</span>`;
      }
    },
    {
      headerName: 'Current',
      field: 'current_amount',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-right amount-current',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.current_amount) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: '1-30 Days',
      field: 'days_1_30',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-right amount-days-1-30',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.days_1_30) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: '31-60 Days',
      field: 'days_31_60',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-right amount-days-31-60',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.days_31_60) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: '61-90 Days',
      field: 'days_61_90',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-right amount-days-61-90',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.days_61_90) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Over 90 Days',
      field: 'days_over_90',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-right amount-days-over-90',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.days_over_90) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Total Outstanding',
      field: 'total_outstanding',
      sortable: true,
      resizable: true,
      width: 150,
      cellClass: 'grid-cell-right amount-total',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_outstanding) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value),
      cellStyle: { 'font-weight': 'bold', 'color': '#1976d2' }
    },
    {
      headerName: 'Invoices',
      field: 'total_invoices',
      sortable: true,
      resizable: true,
      width: 100,
      cellClass: 'grid-cell-centered',
      valueGetter: (params: any) => parseInt(params.data.total_invoices) || 0
    },
    {
      headerName: 'Action',
      field: 'vendor_id',
      sortable: false,
      resizable: true,
      width: 100,
      cellRenderer: (params: ICellRendererParams) => {
        return `
          <button class="action-btn" data-id="${params.data.vendor_id}" data-name="${params.data.vendor_name}">
            <i class="material-icons" style="font-size: 20px; color: #1976d2; vertical-align: middle;">visibility</i>
          </button>
        `;
      },
      cellClass: 'grid-cell-centered',
      pinned: 'right'
    }
  ];

  detailColumnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      width: 70,
      cellClass: 'grid-cell-centered'
    },
    {
      headerName: 'Invoice No',
      field: 'invoice_number',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 150,
      cellStyle: { 'font-weight': '500' }
    },
    {
      headerName: 'Invoice Date',
      field: 'invoice_date',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      valueFormatter: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : '-'
    },
    {
      headerName: 'Due Date',
      field: 'due_date',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      valueFormatter: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : '-'
    },
    {
      headerName: 'Payment Terms',
      field: 'payment_terms',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: ICellRendererParams) => {
        const terms = params.value;
        return `<span class="payment-terms-badge">${terms || 'N/A'}</span>`;
      }
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      width: 140,
      cellClass: 'grid-cell-right',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_amount) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Amount Paid',
      field: 'paid_amount',
      sortable: true,
      resizable: true,
      width: 140,
      cellClass: 'grid-cell-right',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.paid_amount) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Outstanding',
      field: 'outstanding_amount',
      sortable: true,
      resizable: true,
      width: 140,
      cellClass: 'grid-cell-right amount-total',
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.outstanding_amount) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params) => this.formatCurrency(params.value),
      cellStyle: { 'font-weight': 'bold', 'color': '#1976d2' }
    },
    {
      headerName: 'Days Overdue',
      field: 'days_overdue',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: ICellRendererParams) => {
        const days = parseFloat(params.value) || 0;
        if (days > 0) {
          return `<span style="color: #f44336; font-weight: 600;">${days}</span>`;
        }
        return `<span>${days}</span>`;
      }
    },
    {
      headerName: 'Aging Bucket',
      field: 'aging_bucket',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: ICellRendererParams) => {
        const bucket = params.value || 'Current';
        const color = this.getAgingBucketColor(bucket);
        return `<span class="bucket-badge ${color}">${bucket}</span>`;
      }
    },
    {
      headerName: 'Status',
      field: 'payment_status',
      sortable: true,
      resizable: true,
      width: 130,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: ICellRendererParams) => {
        const status = params.value || 'Pending';
        const color = this.getPaymentStatusColor(status);
        return `<span class="status-badge ${color}">${status}</span>`;
      }
    }
  ];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.filterForm = this.fb.group({
      vendor_id: [null],
      from_date: [null],
      to_date: [null],
      aging_bucket: ['all'],
      payment_term_id: [null]
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (currency) {
          this.currencyRate = Number(currency.rate) || 1;
          this.currencySymbol = currency.symbols || '₹';
          this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';

          if (this.rowData.length > 0) {
            this.refreshData();
          }
        }
      });

    this.getPaymentTermsList();
    this.loadVendorAgingReport();
  }

  convertCurrency(amount: number): number {
    if (!amount || isNaN(amount)) return 0;
    return this.roundToTwoDecimals(amount * this.currencyRate);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  getPaymentTermsList(): void {
    this._configurationalMasterService.getPaymentTermsList(this.entity_id).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data) {
          this.paymentTermsList = res.data;
        }
      },
      error: (error) => {
        console.error('Error loading payment terms:', error);
      }
    });
  }

  loadVendorAgingReport(): void {
    this.isLoading = true;
    const params = this.filterForm.value;
    params.entity_id = this.entity_id;

    this._configurationalMasterService.getVendorAgingReport(params).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data && res.data.length > 0) {
          this.rowData = res.data.map((item: any) => ({
            ...item,
            total_outstanding: parseFloat(item.total_outstanding) || 0,
            current_amount: parseFloat(item.current_amount) || 0,
            days_1_30: parseFloat(item.days_1_30) || 0,
            days_31_60: parseFloat(item.days_31_60) || 0,
            days_61_90: parseFloat(item.days_61_90) || 0,
            days_over_90: parseFloat(item.days_over_90) || 0,
            total_invoices: parseInt(item.total_invoices) || 0,
            payment_terms: item.payment_terms || 'N/A'
          }));
          this.calculateTotals();
          this.toast.success('Report loaded successfully');
        } else {
          this.rowData = [];
          this.toast.warning('No data found');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading aging report:', error);
        this.toast.error('Failed to load report');
        this.isLoading = false;
      }
    });
  }

  loadVendorDetails(vendorId: number): void {
    this.isLoading = true;
    const params = {
      entity_id: this.entity_id,
      from_date: this.filterForm.value.from_date,
      to_date: this.filterForm.value.to_date
    };

    this._configurationalMasterService.getVendorAgingDetails(vendorId, params).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data && res.data.length > 0) {
          this.detailRowData = res.data.map((item: any) => ({
            ...item,
            total_amount: parseFloat(item.total_amount) || 0,
            outstanding_amount: parseFloat(item.outstanding_amount) || 0,
            paid_amount: parseFloat(item.paid_amount) || 0,
            days_overdue: parseFloat(item.days_overdue) || 0,
            payment_terms: item.payment_terms || 'N/A'
          }));
          this.showDetailView = true;
          this.toast.success('Vendor details loaded');
        } else {
          this.detailRowData = [];
          this.toast.warning('No details found');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor details:', error);
        this.toast.error('Failed to load vendor details');
        this.isLoading = false;
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.gridApi) {
      this.gridApi.addEventListener('cellClicked', (event: any) => {
        if (event.colDef.field === 'vendor_id') {
          const vendorId = event.data.vendor_id;
          this.viewVendorDetails(vendorId);
        }
      });
    }
    setTimeout(() => {
      this.gridColumnApi?.autoSizeAllColumns();
    }, 200);
  }

  onDetailGridReady(params: GridReadyEvent): void {
    this.detailGridApi = params.api;
    this.detailGridColumnApi = params.columnApi;
    setTimeout(() => {
      this.detailGridColumnApi?.autoSizeAllColumns();
    }, 200);
  }

  viewVendorDetails(vendorId: number): void {
    this.selectedVendor = this.rowData.find(v => v.vendor_id === vendorId);
    this.loadVendorDetails(vendorId);
  }

  backToSummary(): void {
    this.showDetailView = false;
    this.selectedVendor = null;
    this.detailRowData = [];
    this.loadVendorAgingReport();
  }

  calculateTotals(): void {
    const data = this.rowData;
    this.totalOutstanding = data.reduce((sum, item) => {
      const amount = parseFloat(item.total_outstanding) || 0;
      return sum + this.convertCurrency(amount);
    }, 0);
    this.totalCurrent = data.reduce((sum, item) => {
      const amount = parseFloat(item.current_amount) || 0;
      return sum + this.convertCurrency(amount);
    }, 0);
    this.totalOverdue = data.reduce((sum, item) => {
      const amount1 = parseFloat(item.days_1_30) || 0;
      const amount2 = parseFloat(item.days_31_60) || 0;
      const amount3 = parseFloat(item.days_61_90) || 0;
      const amount4 = parseFloat(item.days_over_90) || 0;
      return sum + this.convertCurrency(amount1 + amount2 + amount3 + amount4);
    }, 0);
  }

  formatCurrency(amount: number): string {
    if (!amount || isNaN(amount)) return `${this.currencySymbol} 0.00`;
    return `${this.currencySymbol} ${amount.toFixed(2)}`;
  }

  getAgingBucketColor(bucket: string): string {
    const bucketMap: {[key: string]: string} = {
      'Current': 'green',
      '1-30 Days': 'lightgreen',
      '31-60 Days': 'yellow',
      '61-90 Days': 'orange',
      'Over 90 Days': 'red'
    };
    return bucketMap[bucket] || 'grey';
  }

  getPaymentStatusColor(status: string): string {
    const statusMap: {[key: string]: string} = {
      'Fully Paid': 'green',
      'Overdue': 'red',
      'Pending': 'orange'
    };
    return statusMap[status] || 'grey';
  }

  applyFilter(): void {
    this.loadVendorAgingReport();
  }

  resetFilters(): void {
    this.filterForm.reset({
      vendor_id: null,
      from_date: null,
      to_date: null,
      aging_bucket: 'all',
      payment_term_id: null
    });
    this.loadVendorAgingReport();
    this.toast.info('Filters reset');
  }

  refreshData(): void {
    this.loadVendorAgingReport();
  }

  onFilterTextBoxChanged(): void {
    const searchText = (document.getElementById('filter-text-box') as HTMLInputElement)?.value || '';
    this.gridApi?.setQuickFilter(searchText);
  }

  onDetailFilterTextBoxChanged(): void {
    const searchText = (document.getElementById('detail-filter-text-box') as HTMLInputElement)?.value || '';
    this.detailGridApi?.setQuickFilter(searchText);
  }

  onPageSizeChanged(): void {
    const value = (document.getElementById('page-size') as HTMLSelectElement)?.value;
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(value));
    }
  }

  exportToExcel(): void {
    try {
      this.isLoading = true;

      // Prepare data for export
      const exportData = this.rowData.map((item, index) => ({
        'S.No.': index + 1,
        'Vendor Name': item.vendor_name || '-',
        'Vendor Code': item.vendor_code || '-',
        'GSTIN': item.gst_in || '-',
        'Payment Terms': item.payment_terms || 'N/A',
        'Current': this.formatCurrency(this.convertCurrency(item.current_amount || 0)),
        '1-30 Days': this.formatCurrency(this.convertCurrency(item.days_1_30 || 0)),
        '31-60 Days': this.formatCurrency(this.convertCurrency(item.days_31_60 || 0)),
        '61-90 Days': this.formatCurrency(this.convertCurrency(item.days_61_90 || 0)),
        'Over 90 Days': this.formatCurrency(this.convertCurrency(item.days_over_90 || 0)),
        'Total Outstanding': this.formatCurrency(this.convertCurrency(item.total_outstanding || 0)),
        'Total Invoices': item.total_invoices || 0
      }));

      // Add summary row
      const summaryRow:any = {
        'S.No.': '',
        'Vendor Name': 'TOTAL',
        'Vendor Code': '',
        'GSTIN': '',
        'Payment Terms': '',
        'Current': this.formatCurrency(this.totalCurrent),
        '1-30 Days': this.formatCurrency(this.totalOverdue),
        '31-60 Days': '',
        '61-90 Days': '',
        'Over 90 Days': '',
        'Total Outstanding': this.formatCurrency(this.totalOutstanding),
        'Total Invoices': this.rowData.reduce((sum, item) => sum + (item.total_invoices || 0), 0)
      };

      exportData.push(summaryRow);

      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 8 },  // S.No.
        { wch: 30 }, // Vendor Name
        { wch: 15 }, // Vendor Code
        { wch: 20 }, // GSTIN
        { wch: 15 }, // Payment Terms
        { wch: 15 }, // Current
        { wch: 15 }, // 1-30 Days
        { wch: 15 }, // 31-60 Days
        { wch: 15 }, // 61-90 Days
        { wch: 15 }, // Over 90 Days
        { wch: 20 }, // Total Outstanding
        { wch: 15 }  // Total Invoices
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Vendor Aging Report');

      // Generate Excel file
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Download file
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = `Vendor_Aging_Report_${moment().format('DD-MM-YYYY')}.xlsx`;
      link.click();

      this.toast.success('Excel exported successfully');
      this.isLoading = false;

    } catch (error) {
      console.error('Error exporting Excel:', error);
      this.toast.error('Failed to export Excel');
      this.isLoading = false;
    }
  }

  exportToPDF(): void {
    try {
      this.isLoading = true;

      const doc = new jsPDF('l', 'mm', 'a4');

      // Add title
      doc.setFontSize(16);
      doc.text('Vendor Aging Report', 14, 15);

      // Add subtitle with date
      doc.setFontSize(10);
      doc.text(`Generated on: ${moment().format('DD-MM-YYYY HH:mm:ss')}`, 14, 22);
      doc.text(`Currency: ${this.currencyCode} (Rate: ${this.currencyRate})`, 14, 28);

      // Prepare table data
      const tableData = this.rowData.map((item, index) => [
        (index + 1).toString(),
        item.vendor_name || '-',
        item.vendor_code || '-',
        item.gst_in || '-',
        item.payment_terms || 'N/A',
        this.formatCurrency(this.convertCurrency(item.current_amount || 0)),
        this.formatCurrency(this.convertCurrency(item.days_1_30 || 0)),
        this.formatCurrency(this.convertCurrency(item.days_31_60 || 0)),
        this.formatCurrency(this.convertCurrency(item.days_61_90 || 0)),
        this.formatCurrency(this.convertCurrency(item.days_over_90 || 0)),
        this.formatCurrency(this.convertCurrency(item.total_outstanding || 0)),
        (item.total_invoices || 0).toString()
      ]);

      // Add summary row
      const totalInvoices = this.rowData.reduce((sum, item) => sum + (item.total_invoices || 0), 0);
      tableData.push([
        '',
        'TOTAL',
        '',
        '',
        '',
        this.formatCurrency(this.totalCurrent),
        '',
        '',
        '',
        '',
        this.formatCurrency(this.totalOutstanding),
        totalInvoices.toString()
      ]);

      // Generate table
      autoTable(doc, {
        head: [[
          'S.No.', 'Vendor Name', 'Vendor Code', 'GSTIN', 'Payment Terms',
          'Current', '1-30 Days', '31-60 Days', '61-90 Days', 'Over 90 Days',
          'Total Outstanding', 'Invoices'
        ]],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25, halign: 'right' },
          6: { cellWidth: 25, halign: 'right' },
          7: { cellWidth: 25, halign: 'right' },
          8: { cellWidth: 25, halign: 'right' },
          9: { cellWidth: 25, halign: 'right' },
          10: { cellWidth: 30, halign: 'right' },
          11: { cellWidth: 20, halign: 'center' }
        },
        // didDrawPage: function(data) {
        //   // Footer
        //   const pageCount = doc.internal.getNumberOfPages();
        //   const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        //   doc.setFontSize(8);
        //   doc.text(
        //     `Page ${pageNumber} of ${pageCount}`,
        //     doc.internal.pageSize.width / 2,
        //     doc.internal.pageSize.height - 10,
        //     { align: 'center' }
        //   );
        // }
      });

      // Save PDF
      doc.save(`Vendor_Aging_Report_${moment().format('DD-MM-YYYY')}.pdf`);

      this.toast.success('PDF exported successfully');
      this.isLoading = false;

    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.toast.error('Failed to export PDF');
      this.isLoading = false;
    }
  }
}
