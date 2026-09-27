import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-preview-quotation',
  templateUrl: './preview-quotation.component.html',
  styleUrls: ['./preview-quotation.component.scss']
})
export class PreviewQuotationComponent {
  // invoice.component.ts
  getByAllData: any;
  emailCheckBtn: boolean = false;
  advance_check: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private $crm: CrmService,
    private proposal: ProposalService,
    private route: ActivatedRoute,

    private $productionService: ProductionService,
    private _router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    @Optional() public dialogs: MatDialogRef<PreviewQuotationComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    console.log(this.data, "_______PAVAANANNANANA1111")
    // this.product_rows = this.data?.productDetailList;
    this.proposalVersionListById(this.data?.data);
  }
  loadPreviewData: any = '';
  invoiceType: any = this.data?.data?.pageMode == 'quotation' ? 'Quotation' : 'Proforma Invoice';
  viewSource: boolean = this.data?.data?.viewSource=='customer_pannel'?true:false;
  invoiceButtonName: any = '';
  // invoiceButtonName:any=this.data?.pageMode =='quotation' ? 'Send Quotation' : 'Sent PI';
  elanName: string = 'Elan Professional Appliances Pvt. Ltd.';
  footerAddress: string = this.elanName + ', Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004';
  currencySign = '₹';
  invoice = {
    dispatchLocation: '',
    piNumber: '',
    pi_Number: '',
    date: '',
    otherReferences: '',
    salesManager: {
      name: '',
      phone: '',
      email: ''
    }
  };

  company = {
    company_name: '',
    fullAddress: '',
    gstin: '',
    mail_id: '',
    phone: ''
  };

  proposal_no: any;

  grossDiscountArray: any = [];
  bankDetails: any;
  private destroy$ = new Subject<void>();
  proposalId: any;
  versionId: any;
  paymentDetails: any;
  selectedCurrency: any
  ngOnInit() {

    this.route.queryParams.subscribe((params: any) => {
      console.log(params, "params<<<<<<<<<<<<<<<<<<<<");
      this.getByAllData = params
      if (params?.pageMode == "piLink") {
        this.proposalVersionListById(params)

      }
      this._configurationalMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
        console.log(currency);
        if (!currency) return;

        this.currencySign = currency.symbols

      });
    })
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setData() {


    if (this.loadPreviewData?.quotation_type === "direct") {

      this.invoiceType = "Sales Booking"
    }
    const d = new Date(this.loadPreviewData?.valid_till_date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    let validDate = `${day}-${month}-${year}`;

    this.proposal_no = this.loadPreviewData.proposal_no;

    this.elanName = this.loadPreviewData?.dealer == 1 ? this.loadPreviewData?.dealer_company_name : this.elanName;

    let fAdd = this.loadPreviewData.warehouse_address + ', ' + this.loadPreviewData.warehouse_postal_address + ', ' + this.loadPreviewData?.warehouse_pin
    if (this.loadPreviewData?.dealer == 1) {
      this.footerAddress = this.elanName + ' ' + fAdd;
    }
    this.company = {
      company_name: this.loadPreviewData?.warehouse_name || '',
      fullAddress: (this.loadPreviewData.warehouse_address + ', ') + (this.loadPreviewData.warehouse_postal_address + ', ') + (this.loadPreviewData?.warehouse_pin || ''),
      gstin: this.loadPreviewData?.warehouse_gst || '',
      mail_id: this.loadPreviewData?.warehouse_email || '',
      phone: this.loadPreviewData?.warehouse_contact_no || ''
    };
    console.log(this.loadPreviewData)
    this.terms = {
      delivery: this.loadPreviewData?.delivery_term,
      delivery_remark: this.loadPreviewData?.delivery_term === "Freight - To-Pay" ? ` ${' | ₹ ' + this.loadPreviewData?.delivery_term_remark || ''}` : ' | ' + this.loadPreviewData?.delivery_term_remark || '',
      unloading: this.loadPreviewData?.unloading == 'Elanpro' ? '' : this.loadPreviewData?.unloading + ' | ',
      unloading_resp_remark: this.loadPreviewData?.unloading_resp_remark ? this.loadPreviewData?.unloading_resp_remark : 'NA',
      unloading_resp_amount: this.loadPreviewData?.unloading == 'Elanpro' ? this.loadPreviewData?.unloading_resp_amount ? ' | ' + this.currencySign + this.loadPreviewData?.unloading_resp_amount : '' : '',
      warranty_month: this.loadPreviewData?.warranty_month,
      warranty_month_remark: this.loadPreviewData?.warranty_month_remark, // use for Special Warranty Terms
      freight: this.loadPreviewData?.freight_name,
      payment: this.loadPreviewData?.payment_name,
      sub_payment_name: this.loadPreviewData?.sub_payment_name,
      insurance: this.loadPreviewData?.insurance_name == 'Elanpro' ? this.currencySign + this.loadPreviewData?.insurance_amt : this.loadPreviewData?.insurance_name,
      validity: '30 days',
      note: 'Goods once sold will not be taken back.',
      additionalNote: '',
      insurance_amt: this.loadPreviewData?.insurance_name == 'Elanpro' ? ' | ' + this.currencySign + this.loadPreviewData?.insurance_amt : '',
    };

    this.invoice = {
      dispatchLocation: this.loadPreviewData?.branch_name || '',
      piNumber: this.getByAllData?.pageMode == 'piLink' ? this.loadPreviewData?.pi_number : '',
      pi_Number: this.loadPreviewData?.pi_number,
      date: validDate || '',
      otherReferences: this.loadPreviewData?.lead_source || '',
      salesManager: {
        name: [
          this.loadPreviewData?.first_name || '',
          this.loadPreviewData?.middle_name || '',
          this.loadPreviewData?.last_name || ''
        ].join(' ').trim(),
        phone: this.loadPreviewData?.sales_number || '',
        email: this.loadPreviewData?.employee_official_email || ''
      }
    };
    console.log(this.invoice, "_____PAABABABBABA")

    this.customer = {
      name: this.loadPreviewData?.company_name ?? '',
      city: [
        this.loadPreviewData?.billing_address ?? '',
        this.loadPreviewData?.billing_pincode ?? '',
        this.loadPreviewData?.billing_city_name ?? ''
      ].filter(Boolean).join(', '),
      state: this.loadPreviewData?.billing_state_name ?? '',
      gst: this.loadPreviewData?.shipping_gst_in ?? '',
      gst2: this.loadPreviewData?.gst_in ?? '',
      contactPerson: this.loadPreviewData?.personName ?? '',
      contactNo: this.loadPreviewData?.mobile ?? '',

      deliveryAddress: [
        this.loadPreviewData?.shipping_address ?? '',
        this.loadPreviewData?.shipping_pin_code ?? '',
        this.loadPreviewData?.shipping_city_name ?? '',
        this.loadPreviewData?.shipping_state_name ?? '',
        this.loadPreviewData?.shipping_country_name ?? ''
      ].filter(Boolean).join(', ')
    };


    // this.customer = {
    //   name: this.loadPreviewData?.company_name,
    //   city: this.loadPreviewData?.billing_pincode +', '+ this.loadPreviewData?.billing_address+', '+this.loadPreviewData?.billing_city_name,
    //   state: this.loadPreviewData?.billing_state_name ,

    //   contactPerson: this.loadPreviewData?.contact_person_name,
    //   contactNo: this.loadPreviewData?.mobile,
    //   deliveryAddress: this.loadPreviewData?.shipping_pin_code +', '+this.loadPreviewData?.shipping_address+', '+this.loadPreviewData?.shipping_city_name+', '+this.loadPreviewData?.shipping_state_name+', '+this.loadPreviewData?.shipping_country_name
    // };

    this.convertAmountToWords();
    this.totalAMTAfterDiscount = this.loadPreviewData?.totalAMTAfterDiscount;
    this.grossTotal = this.loadPreviewData?.grossTotal;
    this.gstTotal = this.loadPreviewData?.gstTotal;
    this.grant_total = this.loadPreviewData?.grant_total;  // final amount
    this.grossDiscountArray = this.loadPreviewData?.grossDiscountDetail;
    let bankData = this.loadPreviewData?.bankData;

    this.bankDetails = {
      name: bankData?.account_name ?? bankData?.beneficiary_name,
      bankName: bankData?.bank_name,
      accountNumber: bankData?.bank_account_no ?? bankData?.bank_account_number,
      accountType: bankData?.account_type,
      ifsc: bankData?.ifsc_code,
    };

    this.paymentDetails = this.loadPreviewData?.paymentDetails;

  }
  customer = {
    name: '',
    city: '',
    state: '',
    gst: '',
    gst2: '',
    contactPerson: '',
    contactNo: '',
    deliveryAddress: ''
  };

  product_rows: any = [];


  totalAMTAfterDiscount = 0;
  grossTotal = 0;
  igst = 0;
  gstTotal = 0;
  grant_total = 0;
  amountInWords = '';
  note = '';

  terms = {
    delivery: '',
    delivery_remark: '',
    unloading: '',
    unloading_resp_remark: '',
    unloading_resp_amount: '',
    warranty_month: '',
    warranty_month_remark: '',
    freight: '',
    payment: '',
    sub_payment_name: '',
    insurance: '',
    validity: '30 days',
    note: 'Goods once sold will not be taken back.',
    additionalNote: '',
    insurance_amt: ''
  };

  loading: boolean = false;

  sendQuotationPI(action: any) {

    this.loading = true;
    let obj = {
      proposal_id: this.proposalId,
      version_id: this.versionId,
      approvel_status: 'approved', //approve/pending
      page_mode: this.data?.data.pageMode //quotation/pi
    }
    if (action == 'sb') {

      this.proposal.updateVersionStatus(this.versionId).subscribe((response: any) => {
        if (response) {
          this.loading = false;
          this.dialogs.close({ confirmed: true, data: this.data?.data });
        }
      },
        (err) => {
          this.loading = false;
          this.toast.warning('Failed !');
        }
      );
    } else {

      this.proposal.createproforma(obj).subscribe((response: any) => {
        if (response) {
          this.loading = false;
          this.dialogs.close({ confirmed: true, data: this.data?.data });
        }
      },
        (err) => {
          this.loading = false;
          this.toast.warning(err.error.error);
        }
      );
    }


    // if (this.data) {
    //   this.dialogs.close({ confirmed: true, data: this.data});
    // } else {
    //   this.toast.warning('Failed !');
    // }
  }
  actionName: any;
  proposalVersionListById(data: any) {
    try {
      let action_type;
      
      if (data?.version_id || this.getByAllData?.version_id) {
        action_type = false;
      } else {
        action_type = true;
      }
      let a;

      this.versionId = data?.version_id || Number(this.getByAllData?.version_id);
      this.proposalId = data?.proposal_id || Number(this.getByAllData?.proposalId);

      this.proposal.previewProposal(this.versionId, this.proposalId, action_type).subscribe((response: any) => {
        if (response) {
          this._configurationalMasterService.currencyData.next({
            currency_id: response.data?.currency_id
          });
          this.loadPreviewData = response.data;

          if (response?.data?.email_status === "ACCEPTED" || response?.data?.email_status === "REJECTED") {
            this.emailCheckBtn = true;
          }
          if (response?.data?.email_status === "ACCEPTED") {
            this.advance_check = true;
          } else {
            this.advance_check = false;
          }

          if (this.data?.data?.pageMode === 'quotation' && !this.loadPreviewData?.pi_number) {
            // If discount approval requested, button text changes to 'Send for Approval'
            this.invoiceButtonName = this.loadPreviewData?.is__discount_requested == 1 ? 'Send for Approval' : 'Send Quotation';
          } else if (this.loadPreviewData?.pi_number && !this.data?.data?.is_sales_booking) {
            this.invoiceType = 'Proforma Invoice'
            this.invoiceButtonName = this.loadPreviewData?.is__discount_requested == 1 && !this.data?.data?.isSendPi ? 'Send for Approval' : 'Send PI';
            this.invoiceButtonName = this.loadPreviewData?.version_status === 'approved'
              ? 'Send PI'
              : (this.loadPreviewData?.is__discount_requested == 1 && !this.data?.data?.isSendPi
                ? 'Send for Approval'
                : 'Send PI');
          }

          if (this.loadPreviewData?.quotation_type === "direct" || this.data?.data?.is_sales_booking) {
            this.invoiceButtonName = this.loadPreviewData?.is__discount_requested == 1 ? 'Send for Approval' : 'Send Sales Booking';
            this.actionName = 'sb';
            this.invoiceType = 'Sales Booking'
          }
          console.log(this.loadPreviewData, "_____PAVANANANNANNA")
          // this.product_rows = response.data?.productDetailList;
          let itemListArray = response.data?.productDetailList;
          //let product = this.product_rows; 
          for (const elem of itemListArray) {
            if (elem?.product_master_id) {


              let subItems: any[] = [];
              let counter = 0;

              if (elem.custom_branding && elem.custom_branding.length > 0) {
                elem.custom_branding.forEach((cb: any) => {
                  // 1. customisation_data 
                  if (cb.customisation_data && cb.customisation_data.length > 0) {
                    cb.customisation_data.forEach((cust: any) => {
                      subItems.push({
                        index: counter++,
                        item_name: cust.item_name ?? cust.type_of_basket,
                        type: "Customizations",
                        hsn_sac_code: cust.acce_hsn_sac_code ?? cust.basket_hsn_code,
                        gst: cust.gst ?? cust.acce_gst_value,
                        qty: cust.qty,
                        mrp: cust.price_per_unit,
                        discount: cust.discount,
                        offerprice: cust.total_price,
                        totalWithGst: cust.customisation_with_gst,
                        totalDiscountAmount: cust.totalDiscountAmountC,
                        totalDiscountAmountPerQTY: cust.totalDiscountAmountPerQTYC,
                        uom_name: cust.acc_uom_name ?? cust.bas_uom_name
                      });
                    });
                  }

                  // 2. branding_data 
                  if (cb.branding_data) {

                    subItems.push({
                      index: counter++,
                      item_name: "Branding: " + cb.branding_data.branding_description,
                      type: "Branding",
                      hsn_sac_code: cb.branding_data.hsn_sac_code,
                      gst: cb.branding_data.gst,
                      qty: cb.branding_data.qty,
                      mrp: cb.branding_data.branding_amt,
                      discount: cb.branding_data.discount,
                      offerprice: cb.branding_data.branding_after_discount,
                      totalWithGst: cb.branding_data.branding_with_gst,
                      totalDiscountAmount: cb.branding_data.totalDiscountAmountB,
                      totalDiscountAmountPerQTY: cb.branding_data.totalDiscountAmountPerQTYB,
                      uom_name: cb.branding_data.bra_uom_name
                    });
                  }
                });
              }

              // ab product me add kar do
              elem.subItems = subItems;
            }
          }
          this.product_rows = itemListArray;
          // console.log(product,"____________Sadasdasdada");



          console.log(this.product_rows, "____11111111111111111111111__")
          this.setData();
        }
      },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  closeModal() {
    this.dialogs.close();
  }


  amount: string = '';

  convertAmountToWords() {

    const num = Number(this.loadPreviewData?.grant_total || 0);

    if (!num) {
      this.amountInWords = 'Zero';
      return;
    }

    const [wholePart, decimalPart = '0'] =num.toFixed(2).split('.');

    const wholeWords = this.convertNumberToWords(Number(wholePart));

    const decimalWords = this.convertNumberToWords(Number(decimalPart));

   

    const majorUnit = this?.data?.selectedCurrency?.currency_unit||'';
    const minorUnit = this?.data?.selectedCurrency?.currency_fraction||'';
    

    this.amountInWords =
      `${wholeWords} ${majorUnit} and ${decimalWords} ${minorUnit} Only`;
  }
  // convertAmountToWords() {
  //   let num = parseFloat(this.loadPreviewData?.grant_total);
  //   if (isNaN(num)) {
  //     this.amountInWords = '0';
  //     return;
  //   }

  //   let [rupees, paise] = this.loadPreviewData?.grant_total.split('.');

  //   let rupeeWords = this.convertNumberToWords(parseInt(rupees));
  //   let paiseWords = paise ? this.convertNumberToWords(parseInt(paise)) : 'Zero';

  //   this.amountInWords = `${rupeeWords} Rupees and ${paiseWords} Paise Only`;
  // }

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
    return String.fromCharCode(97 + index); // small letters (a,b,c..)
    // return String.fromCharCode(65 + index); // capital letters (A,B,C..)
  }

  // Pi Link
  acceptedPI() {

    if (this.advance_check === false) {
      this.toast.warning("Pls Accepte Term And Conditions")
      return
    }
    Swal.fire({
      title: 'Are you sure want to Accepted The PI?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let status: any = "ACCEPTED"
        let customer_status: any = "APPROVED"
        let booking_status: any = "APPROVED"
        this.accept(status, customer_status, booking_status)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }

  accept(status: any, customer_status: any, booking_status: any) {

    let data = {
      email_status: status,
      customer_status: customer_status,
      pi_id: this.getByAllData?.idPI,
      version_id: this.getByAllData?.version_id,
      proposal_id: this.getByAllData.proposalId,
      booking_status: booking_status
    }
    this.proposal.updateAcceptPI(data).subscribe((res: any) => {
      console.log(res)
      this.toast.success(`${res?.message}`)
      // this.emailCheckBtn=true;
      this.emailCheckBtn = true;
    },
      ((err: any) => {
        this.toast.error("Something Went To Wrong")
      })
    )
  }

  rejectPI() {
    Swal.fire({
      title: 'Are you sure you want to reject this PI?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336', // red
      cancelButtonColor: '#063178',  // blue
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let status: any = "REJECTED"
        let customer_status: any = "REJECTED"
        let booking_status: any = "REJECTED"

        this.accept(status, customer_status, booking_status)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Optionally handle cancel action
        Swal.fire({
          title: 'Cancelled',
          text: 'PI rejection was cancelled.',
          icon: 'info'
        });
      }
    });
  }

  getFormattedPaymentValue(payment: any): string {
    const value = Number(payment.payment_value);
    // use for id == 4
    if (payment.id === 4) {
      return value.toFixed(0);
    }

    // Total calculate (id 4 ko exclude)
    const total = this.paymentDetails
      ?.filter((p: any) => p.id !== 4)
      .map((p: any) => Number(p.payment_value) || 0)
      .reduce((a: number, b: number) => a + b, 0) || 0;

    // use for %
    if (total === 100) {
      const formatted =
        value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
      return `${formatted}%`;
    }
    return this.currencySign + value.toFixed(2);
  }

  getProductImage(path: string): string {
    if (!path) {
      return '../../../../../../assets/No-Image.png';
    }
    return environment.servralUrl + '/' + path;
  }

  onImgError(event: any) {
    event.target.src = '../../../../../../assets/No-Image.png';
  }

}
