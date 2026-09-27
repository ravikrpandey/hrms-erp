import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../../service/sales.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { HttpClient } from '@angular/common/http';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-view-eway-challan',
  templateUrl: './view-eway-challan.component.html',
  styleUrls: ['./view-eway-challan.component.scss']
})
export class ViewEwayChallanComponent {
  cellValue: any;
  assignAction: any;
  urlData: any;
  do_id: any; 
  eway_id:any;
  entity_id: any;
  financial_year_id:any;
  sales_invoice_id:any;
  irnNo:any;
  vieweWayData: any;
  additionalCharges:any[]=[];
  CDKData: any;
  signedInvoiceData: any;
  invoiceData: any;
  invoice_id: any;
  ewayDataList:any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _active: ActivatedRoute,
    private _salesService: SalesService,
    private _toaster: ToastrService,
    private $crm: CrmService,
    private _production: ProductionService,
     private http: HttpClient,
      private _commonService : CommonService
  ) {}

  ngOnInit(): void {
    this.urlData = environment.servralUrl;
    this.entity_id=localStorage.getItem('selectedEntityId')
    this.financial_year_id=localStorage.getItem("financial_id")
    this._active.queryParams.subscribe((res: any) => {
    this.do_id=res.doId;
    this.eway_id = res.eway_id;
    this.invoice_id=res.invoiceId;
     this.getEwayData()
    });
  }

  async getEwayData(){
    
    await this.getCDKData();
    if(this.invoice_id){
      await this.getInvoiceIrnDataByInvoiceId();
       await this.getAllEwayDataById();
    }else{
      await this.getEwayList();
    }
  }

  getAllData: any;
  filteredData: any;
  words_total: any;
 

  printPdf() {
    this._production.downloadDirectEwayPDf(this.eway_id,this.entity_id,this.financial_year_id,this.urlData).subscribe(
      (res: any) => {
        window.open(
          this.urlData + '/api/v1/direct-eway-download/' + res.pdfEwayResult,
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
    this._production.downloadDirectEwayPDf(this.eway_id,this.entity_id,this.financial_year_id,this.urlData).subscribe(
      (res: any) => {
        this.downloadPdf = false;
        window.open(
          this.urlData + '/api/v1/direct-eway-download/' + res.pdfEwayResult,
          '_blank'
        );
      },
      (err: any) => {
        this.downloadPdf = false;
        this._toaster.error(err.error.message);
      }
    );
  }

  formatDate(transportDate: string): string {
    if (!transportDate) return "N/A";
    return transportDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }

  getAllEwayDataById() {
    
    this._salesService.getAllEwayDataById(this.entity_id,this.financial_year_id,this.invoice_id,this.eway_id).subscribe(
      (res: any) => {
        this.vieweWayData = res.data;
        this.additionalCharges = res.data?.charges;
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }

  async getCDKData() {
    await this.$crm.getCDKData(this.entity_id).subscribe({
      next: async (res) => {
        
        this.CDKData = res.data;
      },
      error(err) {},
    });
  }

  getEwayList(){
    this._salesService.getEwayListDetails(this.entity_id,this.financial_year_id,this.eway_id).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.vieweWayData = res.data;
          this.ewayDataList = res.data.productData;
        }
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }

  getInvoiceIrnDataByInvoiceId() {
    this._salesService.getInvoiceIrnDataByInvoiceId(this.invoice_id).subscribe(
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
  totalAdditionalChargeWithTax:number=0;
  decryptSignedData(signedInvoice: string) {
    const requestData = {
      GSTIN: this.CDKData.GSTIN,
      CDKey: this.CDKData.CDKey,
      EInvUserName: this.CDKData.EInvUserName,
      EInvPassword: this.CDKData.EInvPassword,
      EFUserName: this.CDKData.EFUserName,
      EFPassword: this.CDKData.EFPassword,
      data: signedInvoice,
    };

    this.http.post('https://einvsandbox.webtel.in/v1.03/DecryptSignedData', requestData)
      .subscribe(
        (response: any) => {
          
          if (response[0].Status == '1') {
            this.invoiceData = JSON.parse(response[0].data);
            
            let additionalChargeBaseTotal = 0;
          let additionalChargeTaxTotal = 0;

          this.additionalCharges.forEach((charge: any) => {
            const baseAmount = parseFloat(charge.amount || '0');
            const taxPercent = parseFloat(charge.tax_rate || '0');

            const taxAmount = (baseAmount * taxPercent) / 100;

            additionalChargeBaseTotal += baseAmount;
            additionalChargeTaxTotal += taxAmount;
          });
          this.totalAdditionalChargeWithTax = additionalChargeBaseTotal+ additionalChargeTaxTotal;
            console.log("invoiceDatainvoiceDatainvoiceData",this.invoiceData);
            if (
              this.invoiceData.ItemList.some(
                (val: any) => val.IgstAmt === 0 || val.IgstAmt === null || val.IgstAmt === undefined
              )
            ) {
              const halfTax = additionalChargeTaxTotal / 2;
            
              this.invoiceData.ValDtls.CgstVal += halfTax;
              this.invoiceData.ValDtls.SgstVal += halfTax;
            } else {
              this.invoiceData.ValDtls.IgstVal += additionalChargeTaxTotal;
            }
            
            this.invoiceData.ValDtls.TotInvVal += this.totalAdditionalChargeWithTax;
            


            this.invoiceData.ItemList.map((val: any) => {
              if (val.IgstAmt === 0 || val.IgstAmt === null || val.IgstAmt === undefined) {
                const halfTax = additionalChargeTaxTotal / 2;
                val.CgstAmt = halfTax;
                val.SgstAmt = halfTax;
              } else {
                val.IgstAmt = additionalChargeTaxTotal;
              }
            });
            
            // IgstAmt CgstAmt IgstAmt TotItemVal 
            
          }
        },
        (error: any) => {
          console.error('Error decrypting signed data', error);
        }
      );
  }

}
