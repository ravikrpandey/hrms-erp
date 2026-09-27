import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { viewInvoiceIrn } from '../view-invoice-irn-dialog/view-invoice-irn.component';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { SalesService } from '../../service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-sales-invoice-action',
  templateUrl: './sales-invoice-action.component.html',
  styleUrls: ['./sales-invoice-action.component.scss'],
})
export class SalesInvoiceAction {
  assignAction: any;
  entity_id: any;

  tempDoId: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
    private crmSale: CrmService,
    private _commonService: CommonService,
    private _sales: SalesService
  ) {}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
  }

  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  viewIRN(): void { 
       
    const dialogRef = this.dialog.open(viewInvoiceIrn, {
      width: '450px',
      data: { cellData: this.cellValue?.do_id },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  generateIRN(e:any){    
    e.stopPropagation();
    
      this.router.navigate(['master/sales/generate-IRN'], {
        queryParams: {
          status_type: 'generate_irn',
          id: this.cellValue.do_id?this.cellValue.do_id:this.cellValue.id,
          invoiceNo:this.cellValue.sales_invoice_no,
          invoiceDate:this.cellValue.sales_invoice_date,
          invoiceMode:this.cellValue.invoice_mode,
          invoice_id : this.cellValue.id,
          
        },
      });
  }
  CDKData: any;
  irnProductList: any[] = [];

  getCDKData(doId: any) {
    this.crmSale.getCDKData(doId).subscribe({
      next: async (res) => {
        this.CDKData = res.data;
      },
      error(err) {},
    });
  }

  branchList: any;
  entityDetails: any;
  getEntityDetails() {
    this._sales.getEntityDeatilsById(this.entity_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.entityDetails = res.data;
      }
    });
  }
  cancelIRN(e:any, cellValue:any) {
    e.stopPropagation();
    
    if (cellValue.do_id == null) {
      this.tempDoId = 'DIRECT';
    } else {
      this.tempDoId = cellValue.do_id;
    }
    this.crmSale.getCDKData(this.entity_id).subscribe({
      next: async (response) => {
        this.CDKData = response?.data;
        this.crmSale.getDoData(this.tempDoId, cellValue.id).subscribe({
          next: async (res: any) => {
            this.crmSale.branchSetup_get().subscribe({
              next: async (resp: any) => {
               let branchList = resp?.data;
                // let data = { productDetailList: res.data?.productData };
                // this.doData = res.data?.challanData;

                this.irnProductList = [...res.data?.productData];
                if (this.irnProductList) {
                  let isSameState = true;
                  let itemDetails = await this.setItems();

                  // Calculate totals based on state condition
                  let totalAssVal: number = itemDetails.reduce(
                    (sum: any, item: any) => sum + (Number(item.AssAmt) || 0),
                    0
                  );
                  let totalIgstVal: number = isSameState
                    ? 0 : itemDetails.reduce((sum: any, item: any) =>sum + (Number(item.IgstAmt) || 0),0);
                  let totalCgstVal: number = isSameState? itemDetails.reduce((sum: any, item: any) =>sum + (Number(item.CgstAmt) || 0),0): 0;
                  let totalSgstVal: number = isSameState? itemDetails.reduce((sum: any, item: any) =>sum + (Number(item.SgstAmt) || 0),0): 0;
                  let totalInvoiceValue: number =totalAssVal + totalIgstVal + totalCgstVal + totalSgstVal;
                  let branchData;

                  if (cellValue?.invoice_mode === 'DIRECT') {
                    branchData = branchList.find(
                      (x: any) => x.id === cellValue?.billing_branch_id
                    );
                  } else {
                    branchData = branchList.find(
                      (x: any) =>
                        x.id ===
                        cellValue?.billing_branch_id
                    );
                  }

                  // let branchData = await this.branchList.find(
                  //   (x: any) => x.id === this.cellValue?.billing_branch_id
                  // );
                  
                  let gstData = {
                    CDKey: this.CDKData.CDKey,
                    EInvUserName: this.CDKData.EInvUserName,
                    EInvPassword: this.CDKData.EInvPassword,
                    EFUserName: this.CDKData.EFUserName,
                    EFPassword: this.CDKData.EFPassword,
                    GSTIN: branchData?.branch_gstnumber,
                    CnlRsn: '1',
                    CnlRem: 'Wrong Entry',
                    Irn: cellValue?.irn_no,

                    doc_no: {
                      do_no: cellValue?.do_no,
                    },
                    // GetQRImg: 1,
                    // GetSignedInvoice: 1,

                    ValDtls: {
                      AssVal: Number(totalAssVal) || 0,
                      CgstVal: Number(totalCgstVal) || 0,
                      SgstVal: Number(totalSgstVal) || 0,
                      IgstVal: Number(totalIgstVal) || 0,
                      CesVal: 0,
                      StCesVal: 0,
                      Discount: 0,
                      OthChrg: 0,
                      RndOffAmt: 0,
                      TotInvVal: Number(totalInvoiceValue) || 0,
                      TotInvValFc: 0,
                    },
                  };
                  // await this.patchDoData(this.doData);
                  // await this.patchItems(data);
                  console.log('data', gstData);

                  this.crmSale
                    .cancelIRN(this.entity_id, this.cellValue?.id, gstData)
                    .subscribe(
                      (resps: any) => {
                        if (resps.code === 200) {
                          this.toast.success(resps.message);
                          this.router.navigate([
                            '/master/sales/cancelled-sales-invoice-list',
                          ]);
                        } else if (resps.code === 201) {
                          this.toast.warning(resps.error);
                        }
                        this._commonService?.hideLoader();
                      },
                      (err: any) => {
                        this._commonService?.hideLoader();
                        this.toast.error(
                          err.status === 400
                            ? 'Something went wrong!'
                            : 'wrong!'
                        );
                      }
                    );
                }
              },
            });
          },
        });
      },
      error(err) {},
    });
  }
  async setItems() {
    let isSameState = true;
    return this.irnProductList.map((x: any, i: number) => {
      
      let qty = parseInt(x.quantity);
      let discAmt = parseInt(x.discount);
      let discount =
        (x.price_per_unit * qty * discAmt) / 100;
      let preTaxVal: number = x.price_per_unit * qty - discount;

      let igstAmt: number = isSameState
        ? 0
        : x.igst
        ? (x.igst / 100) * preTaxVal
        : 0;
      let cgstAmt: number = isSameState ? (x.cgst / 100) * preTaxVal : 0;
      let sgstAmt: number = isSameState ? (x.sgst / 100) * preTaxVal : 0;

      let totItemVal =
        parseFloat(preTaxVal.toFixed(2)) +
        parseFloat(igstAmt.toFixed(2)) +
        parseFloat(cgstAmt.toFixed(2)) +
        parseFloat(sgstAmt.toFixed(2));

      return {
        SlNo: (i + 1).toString(), // Convert to string
        PrdDesc: `${x.product_name} ${x.product_description}`,
        IsServc: 'N',
        HsnCd: x.hsn_code.toString(), // Convert to string
        Barcde: '',
        Qty: Number(x.quantity) || 0,
        FreeQty: 0,
        Unit: x.uom_name.toString(), // Convert to string if necessary
        UnitPrice: Number(x.price_per_unit) || 0,
        TotAmt: Number(x.price_per_unit * qty) || 0,
        Discount: Number(discount) || 0,
        PreTaxVal: Number(preTaxVal) || 0,
        AssAmt: Number(preTaxVal) || 0,
        GstRt: isSameState
          ? Number(x.cgst || 0) + Number(x.sgst || 0)
          : Number(x.igst || 0),
        IgstAmt: Number(igstAmt) || 0,
        CgstAmt: Number(cgstAmt) || 0,
        SgstAmt: Number(sgstAmt) || 0,
        TotItemVal: Number(totItemVal) || 0,
      };
    });
  }
  generateEway(e:any){    
    e.stopPropagation();
    
      this.router.navigate(['master/sales/generate-e-way-bill'], {
        queryParams: {
          status_type: 'generate_eway_bill',
          id: this.cellValue.do_id,
          invoice_id : this.cellValue.id,
          invoiceNo:this.cellValue.sales_invoice_no,
          invoiceDate:this.cellValue.sales_invoice_date,
          invoiceMode:this.cellValue.invoice_mode,
          do_id:this.cellValue.do_id
        },
      });
  }
  generateDirectEway(e:any){    
    e.stopPropagation();
    
      this.router.navigate(['master/sales/create-direct-eway'], {
        queryParams: {
          status_type: 'generate_eway_bill',
          id: this.cellValue.do_id,
          invoice_id : this.cellValue.id,
          invoiceNo:this.cellValue.sales_invoice_no,
          invoiceDate:this.cellValue.sales_invoice_date,
          invoiceMode:this.cellValue.invoice_mode,
          do_id:this.cellValue.do_id
        },
      });
  }
}
