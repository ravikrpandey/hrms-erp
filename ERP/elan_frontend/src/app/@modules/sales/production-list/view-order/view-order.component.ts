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
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent {
  cellValue: any;
  assignAction: any;
  salesInvoicesData: any;
  urlData: any;
  so_id: any;
  additionalChargeList: any[] = [];
  do_id: any;
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
      this.so_id = res.so_id;
      this.do_id = res.doId
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

          let additionalChargeBaseTotal = 0;
          let additionalChargeTaxTotal = 0;

          this.additionalChargeList.forEach((charge: any) => {
            const baseAmount = parseFloat(charge.amount || '0');
            const taxPercent = parseFloat(charge.tax_rate || '0');

            const taxAmount = (baseAmount * taxPercent) / 100;

            additionalChargeBaseTotal += baseAmount;
            additionalChargeTaxTotal += taxAmount;
            this.totalAdditionalChargeWithTax += baseAmount ;
          });

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

          //////////////////
          this.totalCGST = 0;
          this.totalSGST = 0;
          this.totalIGST = 0;
          this.totalDiscount = 0;
          this.grandTotal = 0;

          this.totalCGSTPercent = 0;
          this.totalSGSTPercent = 0;
          this.totalIGSTPercent = 0;

          const additionalCharges =
            parseFloat(this.getAllData?.additional_charges) || 0;

          this.dataProductArray.forEach((product: any) => {
            const qty = product.quantity;
            const pricePerUnit = parseFloat(product.price_per_unit);
            const discountPercent = parseFloat(product.maximum_discount || 0);
            const cgstPercent = parseFloat(product.cgst) || 0;
            const sgstPercent = parseFloat(product.sgst) || 0;
            const igstPercent = parseFloat(product.igst) || 0;

            const totalPrice = qty * pricePerUnit;
            const discountAmount = (totalPrice * discountPercent) / 100;
            const discountedPrice = totalPrice - discountAmount;

            const cgstAmount = (cgstPercent * discountedPrice) / 100;
            const sgstAmount = (sgstPercent * discountedPrice) / 100;
            const igstAmount = (igstPercent * discountedPrice) / 100;

            this.totalCGST += cgstAmount;
            this.totalSGST += sgstAmount;
            this.totalIGST += igstAmount;
            this.totalDiscount += discountAmount;


            this.grandTotal +=
              discountedPrice + cgstAmount + sgstAmount + igstAmount;

            // Sum up tax percentages
            this.totalCGSTPercent += cgstPercent;
            this.totalSGSTPercent += sgstPercent;
            this.totalIGSTPercent += igstPercent;
          });

          
              

            // Sum up tax percentages
            this.totalCGST +=additionalChargeTaxTotal/2;
            this.totalSGST += additionalChargeTaxTotal/2;
            this.totalIGST += this.totalIGSTPercent?additionalChargeTaxTotal:0;
            this.grandTotal +=this.totalAdditionalChargeWithTax
          this.additionalChargeList.forEach((element: any) => {

          });
          this.grandTotal += additionalCharges;

          // Store formatted values
          this.formattedTotalCGST = this.totalCGST.toFixed(2);
          this.formattedTotalSGST = this.totalSGST.toFixed(2);
          this.formattedTotalIGST = this.totalIGST.toFixed(2);
          this.formattedTotalDiscount = this.totalDiscount.toFixed(2);
          this.formattedGrandTotal = this.grandTotal.toFixed(2);

          // Store formatted percentage totals
          this.formattedTotalCGSTPercent = this.totalCGSTPercent.toFixed(2);
          this.formattedTotalSGSTPercent = this.totalSGSTPercent.toFixed(2);
          this.formattedTotalIGSTPercent = this.totalIGSTPercent.toFixed(2);

          // Calculate tax amounts for additional charges
          this.totalCGSTforAdditionalCharge =
            (parseFloat(this.formattedTotalCGSTPercent) * additionalCharges) /
            100;
          this.totalSGSTforAdditionalCharge =
            (parseFloat(this.formattedTotalSGSTPercent) * additionalCharges) /
            100;
          this.totalIGSTforAdditionalCharge =
            (parseFloat(this.formattedTotalIGSTPercent) * additionalCharges) /
            100;
          
          // Add these values to the respective total tax amounts
          this.totalCGST += this.totalCGSTforAdditionalCharge;
          this.totalSGST += this.totalSGSTforAdditionalCharge;
          this.totalIGST += this.totalIGSTforAdditionalCharge;

          // Update formatted values
          this.formattedTotalCGST = this.totalCGST.toFixed(2);
          this.formattedTotalSGST = this.totalSGST.toFixed(2);
          this.formattedTotalIGST = this.totalIGST.toFixed(2);

          // Update grand total to include tax on additional charges
          this.grandTotal +=
            this.totalCGSTforAdditionalCharge +
            this.totalSGSTforAdditionalCharge +
            this.totalIGSTforAdditionalCharge;
          this.formattedGrandTotal = this.grandTotal.toFixed(2);

          /////////////////
          let myfinlData = this.getAllData.productDetailList;
          this.filteredData = myfinlData.reduce(
            (accumulator: number, current: any) => {
              return accumulator + current.final_amount;
            },
            0
          );
          // const toWords = new ToWords();
          // let words = toWords.convert(parseFloat(this.formattedGrandTotal));

          // const toWords = new ToWords();
          // let words = toWords.convert(parseFloat(this.formattedGrandTotal));
          // this.words_total = words;
          const number = parseFloat(this.formattedGrandTotal);
          let integerPart = Math.floor(number);
          let decimalPart = number % 1;

          let words = numberToWords.toWords(integerPart);

          if (decimalPart > 0) {
            let decimalString = decimalPart.toFixed(2).split('.')[1];
            words += " Point " + numberToWords.toWords(parseInt(decimalString, 10));
          }

          this.words_total = words
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        }
      });
  }
  get hasCgst() {
    return this.getAllData?.productDetailList?.some((data: any) => data?.cgst != null);
  }
  get hasSgst() {
    return this.getAllData?.productDetailList?.some((data: any) => data?.sgst != null);
  }
  get hasIgst() {
    return this.getAllData?.productDetailList?.some((data: any) => data?.igst != null);
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
}
