import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-add-gst-io-report',
  templateUrl: './add-gst-io-report.component.html',
  styleUrls: ['./add-gst-io-report.component.scss']
})
export class AddGstIoReportComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  company_id: any;
  
  GstSalesInvoiceData: any[] = [];
  searchText: string = '';
  
  GstPurchaseInvoiceData: any[] = [];
  searchText1: string = '';
  
  total_base_amount: number = 0;
  total_gst: number = 0;
  total_amount: number = 0;
  
  purchase_total_base_amount: number = 0;
  purchase_total_gst: number = 0;
  purchase_total_amount: number = 0;
  
  total_gst_payable: number = 0;
  entity_id: any;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  private isUpdatingCurrency: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private multiplyWithPrecision(value: number, multiplier: number): number {
    return this.roundToTwoDecimals(value * multiplier);
  }

  private divideWithPrecision(value: number, divisor: number): number {
    if (divisor === 0) return 0;
    return this.roundToTwoDecimals(value / divisor);
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate);
        this.currencySymbol = currency.symbols || '₹';
        
        this.updateDisplayValues();

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.getInputOutputGstReport();
  }

  updateDisplayValues() {
    if (this.GstSalesInvoiceData.length > 0) {
      this.GstSalesInvoiceData = this.GstSalesInvoiceData.map(item => ({
        ...item,
        base_amount: this.multiplyWithPrecision(item.base_amount_inr || 0, this.currencyRate),
        total_amount: this.multiplyWithPrecision(item.total_amount_inr || 0, this.currencyRate),
        igst_amount: this.multiplyWithPrecision(item.igst_amount_inr || 0, this.currencyRate),
        cgst_amount: this.multiplyWithPrecision(item.cgst_amount_inr || 0, this.currencyRate),
        sgst_amount: this.multiplyWithPrecision(item.sgst_amount_inr || 0, this.currencyRate),
        gst_input: this.multiplyWithPrecision(item.gst_input_inr || 0, this.currencyRate),
        total_balance: this.multiplyWithPrecision(item.total_balance_inr || 0, this.currencyRate)
      }));
    }

    if (this.GstPurchaseInvoiceData.length > 0) {
      this.GstPurchaseInvoiceData = this.GstPurchaseInvoiceData.map(item => ({
        ...item,
        base_amount: this.multiplyWithPrecision(item.base_amount_inr || 0, this.currencyRate),
        total_amount: this.multiplyWithPrecision(item.total_amount_inr || 0, this.currencyRate),
        igst_amount: this.multiplyWithPrecision(item.igst_amount_inr || 0, this.currencyRate),
        cgst_amount: this.multiplyWithPrecision(item.cgst_amount_inr || 0, this.currencyRate),
        sgst_amount: this.multiplyWithPrecision(item.sgst_amount_inr || 0, this.currencyRate),
        gst_input: this.multiplyWithPrecision(item.gst_input_inr || 0, this.currencyRate),
        total_balance: this.multiplyWithPrecision(item.total_balance_inr || 0, this.currencyRate)
      }));
    }

    this.calculateTotals();
    this.calculateGSTTotals();
    this.calculateGSTPayable();
  }

  getInputOutputGstReport() {
    this._finaceservice.getInputOutputGstReport(this.entity_id).subscribe(
      (res: any) => {
        console.log('Full API Response:', res);
        
        if (res && res.code === 200 && res.data) {
          const responseData = res.data;
          if (responseData.inputGstReport) {
            this.GstPurchaseInvoiceData = responseData.inputGstReport.map((item: any) => {
              const baseAmount = parseFloat(item.base_amount) || 0;
              const totalAmount = parseFloat(item.total_amount) || 0;
              const igstAmount = parseFloat(item.igst) || 0;
              const cgstAmount = parseFloat(item.cgst) || 0;
              const sgstAmount = parseFloat(item.sgst) || 0;
              const gstInput = parseFloat(item.gst_total) || 0;
              const totalBalance = parseFloat(item.gst_total) || 0;

              return {
                posting_date: item.posting_date || '',
                vendor_name: item.vendor_name || 'N/A',
                invoiceNo: item.document_number || '',
                base_amount_inr: baseAmount,
                total_amount_inr: totalAmount,
                igst_amount_inr: igstAmount,
                cgst_amount_inr: cgstAmount,
                sgst_amount_inr: sgstAmount,
                gst_input_inr: gstInput,
                total_balance_inr: totalBalance,
                base_amount: this.multiplyWithPrecision(baseAmount, this.currencyRate),
                total_amount: this.multiplyWithPrecision(totalAmount, this.currencyRate),
                igst_amount: this.multiplyWithPrecision(igstAmount, this.currencyRate),
                cgst_amount: this.multiplyWithPrecision(cgstAmount, this.currencyRate),
                sgst_amount: this.multiplyWithPrecision(sgstAmount, this.currencyRate),
                gst_input: this.multiplyWithPrecision(gstInput, this.currencyRate),
                total_balance: this.multiplyWithPrecision(totalBalance, this.currencyRate),
                debit_amount: item.debit_amount,
                credit_amount: item.credit_amount,
                document_number: item.document_number,
                vendor_id: item.vendor_id,
                party_type: item.party_type
              };
            });
            console.log('GST Input Data:', this.GstPurchaseInvoiceData);
          } else {
            this.GstPurchaseInvoiceData = [];
            console.log('No Input GST Data available');
          }
          
          if (responseData.outputGstReport) {
            this.GstSalesInvoiceData = responseData.outputGstReport.map((item: any) => {
              const baseAmount = parseFloat(item.base_amount) || 0;
              const totalAmount = parseFloat(item.total_amount) || 0;
              const igstAmount = parseFloat(item.igst) || 0;
              const cgstAmount = parseFloat(item.cgst) || 0;
              const sgstAmount = parseFloat(item.sgst) || 0;
              const gstInput = parseFloat(item.gst_total) || 0;
              const totalBalance = parseFloat(item.gst_total) || 0;

              return {
                irn_date: item.posting_date || '',
                company_name: item.company_name || item.customer_name || 'N/A',
                sales_invoice_no: item.document_number || '',
                irn_no: item.document_number || '',
                base_amount_inr: baseAmount,
                total_amount_inr: totalAmount,
                igst_amount_inr: igstAmount,
                cgst_amount_inr: cgstAmount,
                sgst_amount_inr: sgstAmount,
                gst_input_inr: gstInput,
                total_balance_inr: totalBalance,
                base_amount: this.multiplyWithPrecision(baseAmount, this.currencyRate),
                total_amount: this.multiplyWithPrecision(totalAmount, this.currencyRate),
                igst_amount: this.multiplyWithPrecision(igstAmount, this.currencyRate),
                cgst_amount: this.multiplyWithPrecision(cgstAmount, this.currencyRate),
                sgst_amount: this.multiplyWithPrecision(sgstAmount, this.currencyRate),
                gst_input: this.multiplyWithPrecision(gstInput, this.currencyRate),
                total_balance: this.multiplyWithPrecision(totalBalance, this.currencyRate)
              };
            });
            console.log('GST Output Data:', this.GstSalesInvoiceData);
          } else {
            this.GstSalesInvoiceData = [];
            console.log('No Output GST Data available');
          }
          
          this.calculateTotals();
          this.calculateGSTTotals();
          this.calculateGSTPayable();
          
          if (this.GstPurchaseInvoiceData.length === 0 && this.GstSalesInvoiceData.length === 0) {
            this.toast.warning('No GST data found for this entity');
          } else {
            this.toast.success('GST data loaded successfully');
          }
        } else {
          this.toast.warning('No data received from server');
        }
      },
      (error: any) => {
        console.error('Error fetching GST data:', error);
        this.toast.error('Failed to load GST Report data');
      }
    );
  }

  filteredGstSalesInvoiceData() {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.GstSalesInvoiceData;
    }
    const searchTextLower = this.searchText.toLowerCase().trim();
    return this.GstSalesInvoiceData.filter(item => {
      const customerName = item.company_name ? item.company_name.toLowerCase() : '';
      const salesInvoiceNo = item.sales_invoice_no ? item.sales_invoice_no.toLowerCase() : '';
      const irnNo = item.irn_no ? item.irn_no.toLowerCase() : '';
      return (
        customerName.includes(searchTextLower) ||
        salesInvoiceNo.includes(searchTextLower) ||
        irnNo.includes(searchTextLower)
      );
    });
  }

  filteredGstPurchaseInvoiceData() {
    if (!this.searchText1 || this.searchText1.trim() === '') {
      return this.GstPurchaseInvoiceData;
    }
    const searchTextLower = this.searchText1.toLowerCase().trim();
    return this.GstPurchaseInvoiceData.filter(item => {
      const vendorName = item.vendor_name ? item.vendor_name.toLowerCase() : '';
      const invoiceNo = item.invoiceNo ? item.invoiceNo.toLowerCase() : '';
      return (
        vendorName.includes(searchTextLower) ||
        invoiceNo.includes(searchTextLower)
      );
    });
  }

  calculateTotals() {
    this.total_base_amount = this.GstSalesInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.base_amount) || 0), 0
    );
    this.total_gst = this.GstSalesInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.gst_input) || 0), 0
    );
    this.total_amount = this.GstSalesInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.total_amount) || 0), 0
    );
    
    this.total_base_amount = this.roundToTwoDecimals(this.total_base_amount);
    this.total_gst = this.roundToTwoDecimals(this.total_gst);
    this.total_amount = this.roundToTwoDecimals(this.total_amount);
  }

  calculateGSTTotals() {
    this.purchase_total_base_amount = this.GstPurchaseInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.base_amount) || 0), 0
    );
    this.purchase_total_gst = this.GstPurchaseInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.gst_input) || 0), 0
    );
    this.purchase_total_amount = this.GstPurchaseInvoiceData.reduce(
      (sum, row) => sum + (parseFloat(row.total_balance) || 0), 0
    );
    
    this.purchase_total_base_amount = this.roundToTwoDecimals(this.purchase_total_base_amount);
    this.purchase_total_gst = this.roundToTwoDecimals(this.purchase_total_gst);
    this.purchase_total_amount = this.roundToTwoDecimals(this.purchase_total_amount);
  }

  calculateGSTPayable() {
    this.total_gst_payable = this.purchase_total_gst;
    this.total_gst_payable = this.roundToTwoDecimals(this.total_gst_payable);
  }

  getCurrencySymbol() {
    return this.currencySymbol;
  }

  getCurrencyCode() {
    return this.currencyCode;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(value));
    }
  }

  onFilterTextBoxChanged() {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  }

  back() {
    this.location.back();
  }
}