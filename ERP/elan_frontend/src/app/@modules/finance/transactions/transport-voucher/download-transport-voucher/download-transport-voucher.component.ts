import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FinaceService } from 'src/app/@shared/services/finace.service - Copy (2)';
import { ActivatedRoute, Router } from '@angular/router';

declare function require(moduleName: string): any;
const html2pdf = require('html2pdf.js');

@Component({
  selector: 'app-download-transport-voucher',
  templateUrl: './download-transport-voucher.component.html',
  styleUrls: ['./download-transport-voucher.component.scss']
})
export class DownloadTransportVoucherComponent implements AfterViewInit, OnInit {
  @ViewChild('voucherContent', { static: false }) voucherContent!: ElementRef;

  isLoading: boolean = false;
  isPrinting: boolean = false;
  isViewLoaded: boolean = false;
  isDataLoading: boolean = true;

  voucherData = {
    voucherNumber: '',
    voucherDate: '',
    branch: '',
    financialYear: '',
    gstType: '',
    status: 'APPROVED',
    companyName: '',
    companyAddress: '',
    companyGstin: '',
    companyPan: '',
    transporterName: '',
    transporterGstin: '',
    transporterAddress: '',
    transporterInvoiceNo: '',
    natureOfTransaction: '',
    tdsNature: '',
    lorryDetails: [] as any[],
    chargesDetails: [] as any[],
    taxSummary: {
      taxableValue: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      gstType: '',
      totalGst: 0
    },
    paymentSummary: {
      grossTotal: 0,
      tds: 0,
      gstTotal: 0,
      lessAmount: 0,
      netPayable: 0,
      roundOff: 0,
      roundedPayable: 0
    },
    accountingEntries: [] as any[],
    narration: '',
    preparedBy: '',
    verifiedBy: '',
    approvedBy: '',
    printDate: new Date().toLocaleString()
  };

  currencySymbol: string = '₹';

  constructor(
    private location: Location,
    private _financeService: FinaceService,
    private _activated: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._activated.queryParams.subscribe((res: any) => {
      if (res.id) {
        this._financeService.getCompleteTransportVoucher(res.id).subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              this.patchVoucherData(response.data);
            }
            this.isDataLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading voucher:', error);
            this.isDataLoading = false;
            alert('Failed to load voucher data');
          }
        });
      } else {
        this.isDataLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.isViewLoaded = true;
  }

  patchVoucherData(data: any): void {
    const voucher = data.voucher;
    const charges = data.charges || [];
    const lorryDetails = data.lorryDetails || [];
    const summaries = data.summaries || {};

    if (voucher.currency && voucher.currency.symbol) {
      this.currencySymbol = voucher.currency.symbol;
    }

    this.voucherData.voucherNumber = voucher.voucher_number || '';
    this.voucherData.voucherDate = voucher.voucher_date || '';
    this.voucherData.branch = voucher.branch?.name || '';
    this.voucherData.financialYear = voucher.financial_year || '';
    this.voucherData.gstType = voucher.gst_type || '';
    this.voucherData.status = voucher.status || 'APPROVED';

    this.voucherData.companyName = voucher.entity?.name || '';
    this.voucherData.companyAddress = voucher.entity?.registered_office || '';
    this.voucherData.companyGstin = voucher.entity?.gstin || '';
    this.voucherData.companyPan = voucher.entity?.pan || '';

    this.voucherData.transporterName = voucher.transporter?.name || '';
    this.voucherData.transporterGstin = voucher.transporter?.gstin || '';
    this.voucherData.transporterAddress = voucher.transporter?.address || '';
    this.voucherData.transporterInvoiceNo = voucher.bill_invoice_number || '';
    this.voucherData.natureOfTransaction = voucher.tds?.nature_of_transaction || '';
    this.voucherData.tdsNature = voucher.tds?.nature || '';

    this.voucherData.lorryDetails = lorryDetails.map((lorry: any) => ({
      lrNo: lorry.lr_number || lorry.gatein?.lr_no || 'N/A',
      lrDate: this.formatDate(lorry.date),
      from: lorry.from || lorry.gatein?.from_location || '',
      to: lorry.to || lorry.gatein?.to_location || '',
      vehicleNo: lorry.vehicle_number || lorry.gatein?.vehicle_no || '',
      amount: lorry.gatein?.amount || 0
    }));

    this.voucherData.chargesDetails = charges.map((charge: any) => ({
      parentAccount: charge.parent_account?.name || '',
      account: charge.chart_account?.name || '',
      chargeName: charge.charges_name || '',
      amount: charge.amount || 0
    }));

    this.voucherData.taxSummary = {
      taxableValue: summaries.tax_summary?.taxable_value || 0,
      igst: summaries.tax_summary?.igst || 0,
      cgst: summaries.tax_summary?.cgst || 0,
      sgst: summaries.tax_summary?.sgst || 0,
      gstType: summaries.tax_summary?.gst_type || '',
      totalGst: summaries.tax_summary?.total_gst || 0
    };

    this.voucherData.paymentSummary = {
      grossTotal: summaries.payment_summary?.gross_total || 0,
      tds: summaries.payment_summary?.tds || 0,
      gstTotal: summaries.payment_summary?.gst_total || 0,
      lessAmount: summaries.payment_summary?.less_amount || 0,
      netPayable: summaries.payment_summary?.net_payable || 0,
      roundOff: summaries.payment_summary?.round_off || 0,
      roundedPayable: summaries.payment_summary?.rounded_payable || 0
    };

    this.voucherData.accountingEntries = this.generateAccountingEntries(
      this.voucherData.chargesDetails,
      this.voucherData.paymentSummary.netPayable,
      this.voucherData.transporterName
    );

    this.voucherData.narration = data.narration || this.generateNarration(
      this.voucherData.lorryDetails,
      this.voucherData.transporterName
    );

    this.voucherData.preparedBy = voucher.prepared_by || '';
    this.voucherData.verifiedBy = voucher.verified_by || '';
    this.voucherData.approvedBy = voucher.approved_by || '';
    this.voucherData.printDate = new Date().toLocaleString();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  generateAccountingEntries(charges: any[], netPayable: number, transporterName: string): any[] {
    const entries = [];
    charges.forEach(charge => {
      if (charge.amount > 0) {
        entries.push({
          ledger: charge.chargeName || 'Charges',
          debit: charge.amount,
          credit: null
        });
      }
    });
    entries.push({
      ledger: `Vendor - ${transporterName || 'Transporter'}`,
      debit: null,
      credit: netPayable
    });
    return entries;
  }

  generateNarration(lorryDetails: any[], transporterName: string): string {
    if (!lorryDetails || lorryDetails.length === 0) {
      return `Transport charges booked. Service provided by ${transporterName || 'Transporter'}.`;
    }
    const lrNumbers = lorryDetails.map(l => l.lrNo || 'N/A').filter(Boolean).join(' and ');
    const locations = lorryDetails.map(l => `${l.from} to ${l.to}`).join(', ');
    return `Being freight and transportation charges booked for ${lorryDetails.length} consignment(s) from ${locations}. LR No. ${lrNumbers || 'N/A'}. Transport service provided by ${transporterName || 'Transporter'}.`;
  }

  goBack(): void {
    this.location.back();
  }

  downloadPDF(): void {
    if (!this.isViewLoaded || !this.voucherContent) {
      alert('Please wait for the page to load completely.');
      return;
    }

    this.isLoading = true;
    const element = this.voucherContent.nativeElement;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Transport_Voucher_${this.voucherData.voucherNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        this.isLoading = false;
      })
      .catch((error: any) => {
        console.error('PDF Error:', error);
        this.isLoading = false;
        alert('Failed to generate PDF. Please try again.');
      });
  }

  printVoucher(): void {
    if (!this.isViewLoaded) {
      alert('Please wait for the page to load completely.');
      return;
    }

    this.isPrinting = true;
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
    }, 100);
  }

  getTotalTransportCharges(): number {
    return this.voucherData.lorryDetails.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  getTotalCharges(): number {
    return this.voucherData.chargesDetails.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  getTotalDebit(): number {
    return this.voucherData.accountingEntries.reduce((sum, item) => sum + (item.debit || 0), 0);
  }

  getTotalCredit(): number {
    return this.voucherData.accountingEntries.reduce((sum, item) => sum + (item.credit || 0), 0);
  }

  formatCurrency(amount: number): string {
    return `${this.currencySymbol} ${amount.toFixed(2)}`;
  }
}
