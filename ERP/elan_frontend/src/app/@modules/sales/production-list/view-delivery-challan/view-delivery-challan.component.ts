import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { environment } from 'src/app/environments/environment';
import { SendEmailComponent } from '../send-email/send-email.component';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';
import { ToWords } from 'to-words';
import * as numberToWords from 'number-to-words';
@Component({
  selector: 'app-view-delivery-challan',
  templateUrl: './view-delivery-challan.component.html',
  styleUrls: ['./view-delivery-challan.component.scss']
})
export class ViewDeliveryChallanComponent {
  cellValue: any;
  assignAction: any;
  salesInvoicesData: any;
  urlData: any;
  actionType: any
  so_id: any;
  additionalChargeList: any[] = [];
  do_id: any;
  dataProductArray: any = [];
  totalCGST: number = 0;
  totalSGST: number = 0;
  totalIGST: number = 0;
  hasCgst = false;
hasSgst = false;
hasIgst = false;

  totalDiscount: number = 0;
  totalCGSTPercent: number = 0;
  totalSGSTPercent: number = 0;
  totalIGSTPercent: number = 0;
  grandTotal: number = 0;
  netAmount: number = 0;
  grossTotal: number = 0;
  totalGstAmount: number = 0;
  finalOfferAmount: number = 0;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _production: ProductionService,
    private _active: ActivatedRoute,
    private _salesService: SalesService,
    private _toaster: ToastrService
  ) { }
  ngOnInit(): void {
    this.urlData = environment.servralUrl;
    this.entity_id = localStorage.getItem('selectedEntityId')
    this._active.queryParams.subscribe((res: any) => {
      this.so_id = res.sales_id;
      this.do_id = res.doId
      this.actionType = res.actionType;
    });
    this.getSalesByProsalById();
  }
  getAllData: any;
  filteredData: any;
  words_total: any;
  totalAdditionalChargeWithTax: any = 0;
  getSalesByProsalById() {
    
    this._salesService
      .getSalesByProsalId(this.so_id, this.do_id)
      .subscribe((res: any) => {

        if (res) {
          this.getAllData = res.data;
          
          this.dataProductArray = res.data.productDetailList;
          this.additionalChargeList = res?.data?.charges;
          this.processProductDetails();
          this.getGst();

          ////////
          this._salesService
            .getSalesInvoiceData(
              this.getAllData.id,
              this.getAllData.so_id
            )
            .subscribe((res: any) => {
              if (res) {

                this.salesInvoicesData = res.data
                console.log(this.salesInvoicesData, "this.salesInvoicesData=res")
              }
            });



        }
      });
  }
  getGst() {
    const productList = this.getAllData?.productDetailList || [];
  
    this.hasCgst = productList.some((item: any) => item?.cgst != null);
    this.hasSgst = productList.some((item: any) => item?.sgst != null);
    this.hasIgst = productList.some((item: any) => item?.igst != null);
  
    console.log('GST Status:', {
      CGST: this.hasCgst,
      SGST: this.hasSgst,
      IGST: this.hasIgst
    });
  }
  
  printPdf() {
    // window.print();
    this._production.downloadPDf(this.so_id, this.do_id, this.entity_id, this.urlData).subscribe(
      (res: any) => {
        window.open(
          this.urlData + '/api/v1/salesOrderDownload/' + res.fileName,
          '_blank'
        );
      },
      (err: any) => {
        this._toaster.error(err.error.message);
      }
    );
  }

  downloadPdf: boolean = false;
  downloadData() {
    this.downloadPdf = true;
    this._production.downloadPDf(this.so_id, this.do_id, this.entity_id, this.urlData).subscribe(
      (res: any) => {
        this.downloadPdf = false;
        window.open(
          this.urlData + '/api/v1/salesOrderDownload/' + res.fileName,
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
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '40%',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.so_id },
    });
  }



  createInvoiceForDO() {
    this.route.navigate(['/master/sales/create-sales-invoice'], {
      queryParams: {
        so_id: this.so_id,
        doId: this.do_id,
        actionType: 'create-invoice',
      },
    });
  }
  viewInvoiceForDO() {
    this.route.navigate(['/master/sales/create-sales-invoice'], {
      queryParams: {
        proposalId: this.so_id,
        doId: this.do_id,
        actionType: 'view-invoice-do',
      },
    });
  }

  
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
