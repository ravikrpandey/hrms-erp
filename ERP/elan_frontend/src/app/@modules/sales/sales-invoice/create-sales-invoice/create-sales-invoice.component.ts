import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { environment } from 'src/app/environments/environment';

import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PdfService } from 'src/app/@shared/services/pdf-conversion.service';
import * as numberToWords from 'number-to-words';
import * as QRCode from 'qrcode';
import { HttpClient } from '@angular/common/http';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';

@Component({
  selector: 'app-create-sales-invoice',
  templateUrl: './create-sales-invoice.component.html',
  styleUrls: ['./create-sales-invoice.component.scss'],
})
export class CreateSalesInvoiceComponent {
  cellValue: any;
  actionType: any;
  salesInvoiceForm: FormGroup;
  downloadPdf: boolean = false;
  assignAction: any;
  urlData: any;
  so_id: any;
  signedInvoiceData: any;
  irnNo: any;
  do_id: any;
  
  CDKData: any;
  qrCodeUrl: string = '';
  dataProductArray: any = [];
  totalCGST: number = 0;
  totalSGST: number = 0;
  totalIGST: number = 0;
  totalDiscount: number = 0;
  totalCGSTPercent: number = 0;
  totalSGSTPercent: number = 0;
  totalIGSTPercent: number = 0;
  grandTotal: number = 0;
  formattedTotalCGST: any;
  formattedTotalSGST: any;
  formattedTotalIGST: any;
  formattedTotalDiscount: any;
  formattedGrandTotal: any;
  formattedTotalCGSTPercent: any;
  formattedTotalSGSTPercent: any;
  formattedTotalIGSTPercent: any;
  totalCGSTforAdditionalCharge: any;
  totalSGSTforAdditionalCharge: any;
  totalIGSTforAdditionalCharge: any;
  salesInvoicesData: any;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _production: ProductionService,
    private _active: ActivatedRoute,
    private _salesService: SalesService,
    private _toaster: ToastrService,
    private fb: FormBuilder,
    private $common: CommonService,
    private pdfService: PdfService,
    private _commonService: CommonService,
    private http: HttpClient,
    private $crm: CrmService
  ) {}
  ngOnInit(): void {
    this.urlData = environment.servralUrl;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this._active.queryParams.subscribe((res: any) => {
      this.so_id = res.so_id;
      this.do_id = res.doId;
      this.actionType = res.actionType;
    });
    
    this.salesInvoiceForm = this.fb.group({});
    this.getSalesByProsalById();
    this.getCDKData(this.entity_id);
  }
  getAllData: any;
  filteredData: any;
  words_total: any;
  additionalChargeList: any[] = [];
  gstType:boolean=false;
  totalAdditionalChargeWithTax:number=0;
  getSalesByProsalById() {
    this._salesService
      .getSalesByProsalId(this.so_id, this.do_id)
      .subscribe((res: any) => {
        if (res) {
          
          this.getAllData = res.data;
          if(this.getAllData?.billing_branch_id!==this.getAllData?.customer_billing_state_id){
            this.gstType=true;
          }
          this.dataProductArray = res.data.productDetailList;
          this.additionalChargeList = res?.data?.charges;

          this.processProductDetails();
          ////////////////////////
          this._salesService
            .getSalesInvoiceData(
              this.getAllData.id,
              this.getAllData.so_id
            )
            .subscribe((res: any) => {
              if (res) {
                this.salesInvoicesData = res.data;
                if (
                  this.actionType === 'view-invoice-do' ||
                  this.actionType === 'view-invoice'
                ) {
                  this.salesInvoiceForm.addControl(
                    'sales_invoice_no',
                    new FormControl(this.salesInvoicesData?.sales_invoice_no)
                  );
                  this.salesInvoiceForm.addControl(
                    'sales_invoice_date',
                    new FormControl(this.salesInvoicesData?.sales_invoice_date)
                  );
                  this.salesInvoiceForm.addControl(
                    'do_no',
                    new FormControl(this.salesInvoicesData?.do_no)
                  );
                  
                  this.salesInvoiceForm.addControl(
                    'branch_name',
                    new FormControl(this.getAllData?.branch_name)
                  );
                }

              }
            });
          /////////
          if (this.actionType === 'create-invoice') {

            this.salesInvoiceForm.addControl(
              'sales_invoice_no',
              new FormControl(this.generateRandomPropWithDate())
            );
            this.salesInvoiceForm.addControl(
              'sales_invoice_date',
              new FormControl(new Date().toISOString().split('T')[0])
            );
            this.salesInvoiceForm.addControl(
              'do_no',
              new FormControl(this.getAllData.do_no)
            );
            this.salesInvoiceForm.addControl(
              'do_id',
              new FormControl(this.getAllData.id)
            );
            this.salesInvoiceForm.addControl(
              'so_id',
              new FormControl(this.getAllData.so_id)
            );
            this.salesInvoiceForm.addControl(
              'branch_name',
              new FormControl(this.getAllData?.branch_name)
            );
          }

        }
      });
  }
  get hasCgst() {
    return this.getAllData?.productDetailList?.some(
      (data: any) => data?.cgst != null
    );
  }
  get hasSgst() {
    return this.getAllData?.productDetailList?.some(
      (data: any) => data?.sgst != null
    );
  }
  get hasIgst() {
    return this.getAllData?.productDetailList?.some(
      (data: any) => data?.igst != null
    );
  }
  downloadData() {
    
    this.downloadPdf = true;
    
    this._production
      .downloadInvoicePDf(
        this.so_id,
        this.do_id,
        this.entity_id,
        this.urlData
      )
      .subscribe(
        (res: any) => {
          this.downloadPdf = false;
          window.open(
            this.urlData +
              '/api/v1/salesInvoiceDownload/' +
              res.pdfInvoiceResult,
            '_blank'
          );
        },
        (err: any) => {
          this.downloadPdf = false;
          this._toaster.error(err.error.message);
        }
      );
  }
  sendEmail() {
    // const dialogRef = this.dialog.open(SendEmailComponent, {
    //   width: '40%',
    //   height: '70%',
    //   position: { bottom: '10px', right: '10px' },
    //   panelClass: 'full-screen-modal',
    //   data: { id: this.proposal_id },
    // });
  }

  printPdf() {
    // const contentToPrint = document.getElementById('contentToDownload') as HTMLElement;
    // if (contentToPrint) {
    //   const printWindow = window.open('', '', 'height=600,width=800');
    //   printWindow!.document.write('<html><head><title>Print</title></head><body>');
    //   printWindow!.document.write(contentToPrint.innerHTML);
    //   printWindow!.document.write('</body></html>');
    //   printWindow!.document.close();
    //   printWindow!.print();
    //   setTimeout(() => {
    //     printWindow!.close();
    //   }, 500);
    // }

    this._production
      .downloadInvoicePDf(
        this.so_id,
        this.do_id,
        this.entity_id,
        this.urlData
      )
      .subscribe(
        (res: any) => {
          window.open(
            this.urlData +
              '/api/v1/salesInvoiceDownload/' +
              res.pdfInvoiceResult,
            '_blank'
          );
        },
        (err: any) => {
          this._toaster.error(err.error.message);
        }
      );
  }

  navigateBack() {
    if (
      this.actionType === 'create-invoice' ||
      this.actionType === 'view-invoice-do'
    ) {
      this.route.navigate(['/master/sales/view-order'], {
        queryParams: {
          proposalId: this.so_id,
          doId: this.do_id,
          actionType: 'view-details',
        },
      });
    } else if (this.actionType === 'view-invoice') {
      this.route.navigate(['/master/sales/approved-sales-invoice-list']);
    }
  }

  generateRandomPropWithDate() {
    if (this.actionType === 'create-invoice') {
      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return 'INV' + formattedDate + randomNumber;
    }
  }

  onSubmit() {
    let data = this.salesInvoiceForm?.value;
    if (this.salesInvoiceForm.status === 'INVALID') {
      this._toaster.error('Invalid details', 'Please try again');
      return;
    } else {
      this.$common?.showLoader();
      
      data.invoice_grand_total = this.formattedGrandTotal;
      data.sub_total = this.filteredData;
      data.sub_total_igst = this.formattedTotalIGST;
      data.sub_total_cgst = this.formattedTotalCGST;
      data.sub_total_sgst = this.formattedTotalSGST;
      
      this._salesService.createSalesInvoice(data).subscribe(
        (res: any) => {
          if (res) {
            this._toaster.success(res.message);
            this.$common?.hideLoader();
            this.route.navigate(['/master/sales/sales-invoice-list']);
          }
        },
        (err: any) => {
          if (err) {
            this._toaster.error('Something went wrong');
            this.$common?.hideLoader();
          }
        }
      );
    }
  }

  // generatePDF() {
  //   this.downloadPdf = true;
  //   setTimeout(() => {
  //     const now = new Date();
  //     const date = now.toISOString().split('T')[0];
  //     const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  //     const pdfFileName = `sales-invoice-${date}_${time}.pdf`;

  //     this.pdfService.downloadAsPDF('contentToDownload', pdfFileName);
  //     this.downloadPdf = false;
  //   }, 500);
  // }

  async getCDKData(entity_id: any) {
    await this.$crm.getCDKData(entity_id).subscribe({
      next: async (res) => {
        this.CDKData = res.data;
        this.getInvoiceIrnDataByDoId();
      },
      error(err) {},
    });
  }

  getInvoiceIrnDataByDoId() {
    this._salesService.getInvoiceIrnDataByDoId(this.do_id).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.signedInvoiceData = res.data;
          this.irnNo = this.signedInvoiceData.Irn;
          this.decryptSignedData(this.signedInvoiceData.SignedInvoice);
        }
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }

   formatDate(transportDate: string): string {
    if (!transportDate) return "N/A";
    return transportDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }

  decryptSignedData(signedInvoice: string) {
    const requestData = {
      GSTIN: this.CDKData?.GSTIN,
      CDKey: this.CDKData?.CDKey,
      EInvUserName: this.CDKData?.EInvUserName,
      EInvPassword: this.CDKData?.EInvPassword,
      EFUserName: this.CDKData?.EFUserName,
      EFPassword: this.CDKData?.EFPassword,
      data: signedInvoice,
    };

    this.http
      .post('https://EinvSandbox.webtel.in/v1.03/DecryptSignedData', requestData)
      .subscribe(
        (response: any) => {
          
          if (response[0].Status == '1') {
            console.log('Decrypted Data:', response);
            const invoiceData = JSON.parse(response[0].data);
            this.generateQRCode(invoiceData);
          }
        },
        (error: any) => {
          console.error('Error decrypting signed data', error);
        }
      );
  }

  generateQRCode(invoiceData: any) {
    const qrData = `
  Invoice No: ${invoiceData.DocDtls.No}\n
  Date: ${invoiceData.DocDtls.Dt}\n
  Seller: ${invoiceData.SellerDtls.LglNm}\n
  GSTIN: ${invoiceData.SellerDtls.Gstin}\n
  Buyer: ${invoiceData.BuyerDtls.LglNm}\n
  Buyer GSTIN: ${invoiceData.BuyerDtls.Gstin}\n
  Total Amount: ${invoiceData.ValDtls.TotInvVal}\n
  IRN: ${invoiceData.Irn}\n
  `.trim();

    QRCode.toDataURL(
      qrData,
      { errorCorrectionLevel: 'H' },
      (err: any, url: any) => {
        if (err) {
          console.error('Error generating QR code:', err);
          return;
        }
        this.qrCodeUrl = url;
      }
    );
  }
  totalGstAmount:number=0;
  grossTotal:number=0;
  netAmount:number=0;
  finalOfferAmount:number=0;
  processProductDetails() {
    this.totalCGST = 0;
    this.totalSGST = 0;
    this.totalIGST = 0;
    this.totalGstAmount = 0;
    this.grossTotal = 0;
  
    if (this.getAllData?.productDetailList?.length) {
      this.getAllData.productDetailList = this.getAllData.productDetailList.map((item: any) => {
        const price = parseFloat(item.price_per_unit) || 0;
        const discount = parseFloat(item.totalDiscountAmountPerQTY) || 0;
        const qty = parseInt(item.quantity) || 0;
  
        const baseAmount = price * qty;
        const amountAfterDiscount = baseAmount - discount;
  
       
        const cgstAmount = item?.cgst ? (item.cgst * amountAfterDiscount) / 100 : 0;
        const sgstAmount = item?.sgst ? (item.sgst * amountAfterDiscount) / 100 : 0;
        const igstAmount = item?.igst ? (item.igst * amountAfterDiscount) / 100 : 0;
  
        let customizationTotal = 0;
        let brandingTotal = 0;
  
        if (Array.isArray(item.customisation_data)) {
          item.customisation_data = item.customisation_data.map((cust: any) => {
            const custPrice = parseFloat(cust.price_per_unit) || 0;
            const custQty = parseInt(cust.quantity) || 0;
            const custDiscount = parseFloat(cust.totalDiscountAmountPerQTY) || 0;
            const custGstRate = parseFloat(cust.gst_rate) || 0;
  
            const custSubtotal = (custPrice * custQty) - custDiscount;
            const custGstAmount = (custSubtotal * custGstRate) / 100;
  
            customizationTotal += custSubtotal + custGstAmount;
            this.totalCGST += custGstRate ? custGstAmount / 2 : 0;
            this.totalSGST += custGstRate ? custGstAmount / 2 : 0;
  
            return {
              ...cust,
              custSubtotal,
              custGstAmount,
              totalWithGst: custSubtotal + custGstAmount
            };
          });
        }
        if (Array.isArray(item.branding_data)) {
          item.branding_data = item.branding_data.map((x: any) => {
            const brandPrice = parseFloat(x.price_per_unit) || 0;
            const brandQty = parseInt(x.quantity) || 0;
            const brandDiscount = parseFloat(x.totalDiscountAmountPerQTY) || 0;
            const brandGstRate = parseFloat(x.gst_rate) || 0;
  
            const brandSubtotal = (brandPrice * brandQty) - brandDiscount;
            const brandGstAmount = (brandSubtotal * brandGstRate) / 100;
  
            brandingTotal += brandSubtotal + brandGstAmount;
            this.totalCGST += brandGstRate ? brandGstAmount / 2 : 0;
            this.totalSGST += brandGstRate ? brandGstAmount / 2 : 0;
  
            return {
              ...x,
              brandSubtotal,
              brandGstAmount,
              totalWithGst: brandSubtotal + brandGstAmount
            };
          });
        }
  
        
        this.totalCGST += cgstAmount;
        this.totalSGST += sgstAmount;
        this.totalIGST += igstAmount;
  
       
        const totalItemPrice = amountAfterDiscount + cgstAmount + sgstAmount + igstAmount + customizationTotal + brandingTotal;
        this.grossTotal += totalItemPrice;
  
       
        const taxRate = (item?.cgst != null && item?.sgst != null)
          ? (item.cgst + item.sgst)
          : (item?.igst || 0);
  
        return {
          ...item,
          taxRate,
          cgstAmount,
          sgstAmount,
          igstAmount,
          finalPrice: amountAfterDiscount,
          totalWithGst: totalItemPrice
        };
      });
  
     
      this.totalGstAmount = this.totalCGST + this.totalSGST + this.totalIGST;
    }
    if (this.getAllData?.cashDiscountList.length > 0) {
      let totalDiscount = this.getAllData.cashDiscountList.reduce((sum: number, item: any) => {
        return sum + parseFloat(item.discount_amount || 0);
      }, 0);
      this.netAmount = this.grossTotal - totalDiscount;
    }else{
      this.netAmount = this.grossTotal ;

    }
    this.finalOfferAmount = this.netAmount + this.totalGstAmount;
    
    this.convertAmountToWords();
  }
  amountInWords:any
convertAmountToWords() {
  
  let amt =this.finalOfferAmount.toFixed(2)
  let num = parseFloat(amt);
  if (isNaN(num)) {
    this.amountInWords = '0';
    return;
  }

  let [rupees, paise] = amt.toString().split('.');

  let rupeeWords = this.convertNumberToWords(parseInt(rupees));
  let paiseWords = paise ? this.convertNumberToWords(parseInt(paise)) : 'Zero';

  this.amountInWords = `${rupeeWords} Rupees and ${paiseWords} Paise Only`;
}

convertNumberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = Math.floor(num)) === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
  if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + this.convertNumberToWords(num % 100) : '');
  if (num < 100000) return this.convertNumberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + this.convertNumberToWords(num % 1000) : '');
  if (num < 10000000) return this.convertNumberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + this.convertNumberToWords(num % 100000) : '');
  return this.convertNumberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + this.convertNumberToWords(num % 10000000) : '');
}
  getAlphabet(index: number): string {
    return String.fromCharCode(97 + index); 
  }
}
