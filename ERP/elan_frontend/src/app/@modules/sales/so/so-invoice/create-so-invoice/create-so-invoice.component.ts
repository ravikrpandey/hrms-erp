import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { SalesService as service1 } from '../../../service/sales.service';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { SalesService as service2 } from 'src/app/@modules/crm/pages/sales.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Subject, takeUntil } from 'rxjs';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-create-so-invoice',
  templateUrl: './create-so-invoice.component.html',
  styleUrls: ['./create-so-invoice.component.scss']
})
export class CreateSoInvoiceComponent {

  @ViewChild('invoiceContent')
  invoiceContent!: ElementRef;

  so_id: number;
  financial_year_id: any;
  invoiceStatus: string = 'APPROVED';
  company: any = {};

  getAllData: any = [];
  productList: any[] = [];
  selectedCurrency: any;

  subtotal = 0;
  gst = 0;
  total = 0;
  private destroy$ = new Subject<void>();

  dataStatus: boolean = false;

  salesInvoiceForm!: FormGroup;
  paymentTermsList = [
    { value: '1-30', label: '1-30 Days' },
    { value: '31-60', label: '31-60 Days' },
    { value: '61-90', label: '61-90 Days' },
    { value: '91-120', label: '91-120 Days' },
    { value: '121-150', label: '121-150 Days' },
    { value: '151-180', label: '151-180 Days' },
    { value: '181-210', label: '181-210 Days' },
    { value: '211-240', label: '211-240 Days' },
    { value: '241-270', label: '241-270 Days' },
    { value: '271-300', label: '271-300 Days' },
    { value: '301-330', label: '301-330 Days' },
    { value: '330+', label: '330+ Days' }
  ];

  constructor(
    private _active: ActivatedRoute,
    private _salesService: service1,
    private _salesService2: service2,
    private proposal: ProposalService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    public location: Location,
    private inventoryManag: InventoryManagementService,
    private configMasterService: ConfigurationalmasterService
  ) {

    this.company = {
      name: 'Elan Professional Appliances Pvt. Ltd.',
      address:
        'Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004',
      phone: '9999000011',
      email: 'info@elanpro.com',
      gstin: '09ABCDE1234F1Z5'
    };

  }
  originalGrandTotal: number = 0;

  ngOnInit(): void {

    this.initializeForm();

    this.financial_year_id =
      localStorage.getItem('financial_id');

    this._active.queryParams.subscribe((res: any) => {

      this.so_id = res.so_id;
      this.invoiceStatus = res.invoiceStatus;
      this.invoiceData();

    });
    this.getAllWarehouseListNew();
    this.getsShippingAddress();


    this.configMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
      console.log(currency);
      if (!currency) return;

      this.selectedCurrency = currency
      this.updateCurrencyRate()

    });

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateCurrencyRate() {
    const rate = Number(this.selectedCurrency?.rate || 1);

    const convertItems = (items: any[]) => {
      items.forEach((item: any) => {

        const ppu = Number(item.price_per_unit_org || item.price_per_unit || 0);
        const op = Number(item.offerprice_org || item.offerprice || 0);
        const discountPU = Number(item.discount_per_unit_org || item.discount_per_unit || 0);
        const discountAmt = Number(item.discount_amount_org || item.discount_amount || 0);

        item.price_per_unit_org = ppu;
        item.offerprice_org = op;
        item.discount_per_unit_org = discountPU;
        item.discount_amount_org = discountAmt;

        item.price_per_unit = this.selectedCurrency.Currency_Type === 'INR' ? ppu : ppu * rate;
        item.offerprice = this.selectedCurrency.Currency_Type === 'INR' ? op : op * rate;
        item.discount_per_unit = this.selectedCurrency.Currency_Type === 'INR' ? discountPU : discountPU * rate;
        item.discount_amount = this.selectedCurrency.Currency_Type === 'INR' ? discountAmt : discountAmt * rate;
        if (item.children?.length) {
          convertItems(item.children);
        }
      });
    };

    convertItems(this.items);

    this.calculateInvoiceTotal(this.items);
  }
  initializeForm(): void {

    this.salesInvoiceForm = this.fb.group({


      so_no: [''],

      so_date: [''],

      customer_name: [''],

      warehouse_name: [''],

      payment_terms: ['', Validators.required],
      billing_address_id: [''],
      shipping_address_id: [''],
      shipping_address: [''],
      billing_contact_person: ['', [Validators.required]],
      shipping_contact_person: ['', [Validators.required]],
      dispatch_address: [''],



      subtotal: [0],

      discount_amount: [0],

      total_gst: [0],

      grand_total: [0],
      total_advance: [0],
      utilize: [0],
      utilize_amount: [0],
      gross_discount_amt: [0],
      remaining_gross_dis_amt: [0],
      utilize_gross_dic_amt: [0],





    });

  }
  resData: any;
  ruleMst: any;
  advancePayment: any;

  invoiceData(): void {

    this._salesService.getSalesOrderInvoice(this.so_id, this.financial_year_id).subscribe({
      next: (res: any) => {
        this.getAllData = res?.data;

        this.dataStatus = true;
        this.getsCustomerAddress(this.getAllData?.customer_id)
        this.configMasterService.currencyData.next({
          currency_id: this.getAllData?.CRM_VERSION_PROPOSAL_MST?.MASTER_CURRENCY_CONVERT?.Currency_Convert_id,
          page:'invoice'
        });
        let itemListArray = res.data?.SALES_ORDER_ITEM_LIST_NEWs;
        this.resData = res.data;
        this.advancePayment = res?.advancePayment
        this.ruleMst = res.chargeRuleMst;
        this.getCustomerContactById(this.getAllData?.customer_id);
        
        const contact = this.contactPersonList.find((x: any) => x.id === this.getAllData?.customer_contact_id);
        this.salesInvoiceForm.patchValue({

          so_no: this.getAllData?.sales_order_no,

          so_date: this.getAllData?.sales_order_date,

          customer_name: this.getAllData?.CUSTOMER_PROFILE_MST?.company_name,

          warehouse_name: this.getAllData?.warehouseData?.name,
          // dispatch_address: this.getAllData?.warehouseData?.code + ''+ this.getAllData?.warehouseData?.name+''+this.getAllData?.warehouseData?.address+''+'('+this.getAllData?.warehouseData?.gst+')',
          dispatch_address: [
            this.getAllData?.warehouseData?.code
              ? `${this.getAllData.warehouseData.code}-`
              : '',
            this.getAllData?.warehouseData?.name ?? '',
            this.getAllData?.warehouseData?.address ?? '',
            this.getAllData?.warehouseData?.gst
              ? `(${this.getAllData.warehouseData.gst})`
              : ''
          ].filter(Boolean).join(' '),

          billing_address_id: this.getAllData?.CRM_VERSION_PROPOSAL_MST?.billing_address_id,
          shipping_address_id: this.getAllData?.shipping_address_id,
          shipping_address:
            `${this.getAllData?.shippingAddress?.shipping_address ?? ''}, ` +
            `${this.getAllData?.shippingAddress?.shipping_postal_address ?? ''}` +
            `${this.getAllData?.shippingAddress?.shipping_gst_in
              ? ` (${this.getAllData.shippingAddress.shipping_gst_in})`
              : ''}`,
          shipping_contact_person: this.getAllData?.customer_contact_id,
          billing_contact_person: this.getAllData?.proposalData?.contact_person_id,
          // shipping_address: this.getAllData?.shippingAddress?.shipping_address+ ',' +this.getAllData?.shippingAddress?.shipping_postal_address + '('+this.getAllData?.shippingAddress?.shipping_gst_in+')',
          // billing_contact_person: contact? `${contact.title} ${contact.contact_person_name} | ${contact.mobile}`: '',
          // shipping_contact_person: contact? `${contact.title} ${contact.contact_person_name} | ${contact.mobile}`: '',
          total_advance: this.configMasterService.convertAmount(res?.advancePayment?.advanceAmt, this.advancePayment?.currency_id, this.selectedCurrency?.Currency_Convert_id),

          utilize: res?.advancePayment?.advance_adjustment_percentage ?? 0,
          gross_discount_amt: res?.grossDiscount,
          remaining_gross_dis_amt: res?.grossDiscount-res?.existingTotalDiscountAmount,
        });

        itemListArray = itemListArray.filter((x: any) => x.qty > 0);
        const rate = Number(this.selectedCurrency?.rate || 1);
        itemListArray = itemListArray.map((x: any, index: number) => {
          const ppu = Number(x.price_per_unit || 0);
          const op = Number(x.offerprice || 0);
          const discountPU = Number(x.discount_per_unit || 0);
          const discountAmt = Number(x.discount_amount || 0);

          return {
            ...x,
            price_per_unit: this.selectedCurrency.Currency_Type === 'INR' ? ppu : ppu * rate,
            offerprice: this.selectedCurrency.Currency_Type === 'INR' ? op : op * rate,
            discount_per_unit: this.selectedCurrency.Currency_Type === 'INR' ? discountPU : discountPU * rate,
            discount_amount: this.selectedCurrency.Currency_Type === 'INR' ? discountAmt : discountAmt * rate,
          };
        });
        this.items = this.buildTree(itemListArray);
        this.calculateInvoiceTotal(this.items);
      },

      error: (err: any) => {

        this.dataStatus = false;

        this.getAllData = [];

      }

    });

  }
  items: any;

  buildTree(data: any[]) {
    const map = new Map();

    data.forEach(item => {
      map.set(item.id, { ...item, children: [], level: 0 });
    });

    const result: any[] = [];

    data.forEach(item => {
      const node = map.get(item.id);

      if (item.parent_item_id) {
        const parent = map.get(item.parent_item_id);
        if (parent) {
          node.level = parent.level + 1;
          parent.children.push(node);
        }
      } else {
        node.level = 0; // parent
        result.push(node);
      }
    });

    return result;
  }


  getAlphabet(index: number): string {
    return String.fromCharCode(97 + index);
  }
  chargeSummary: any;
  getDays(orderDate: any) {

    const start = new Date(orderDate);
    const today = new Date();

    const diff = today.getTime() - start.getTime();

    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  calculateInvoiceTotal(getAllData: any[]): void {

    let subtotal = 0;

    let totalDiscount = 0;

    let totalGst = 0;

    let grandTotal = 0;

    // RECURSIVE FUNCTION
    const calculateRecursive = (items: any[]) => {

      items.forEach((item: any) => {

        // QTY
        const qty =
          Number(item.return_qty || item.so_item_qty || item.qty || 0);

        // RATE
        const rate =
          Number(item.price_per_unit || item.offerprice || 0);

        // GST
        const gstRate =
          Number(item.igst || item.gst || 0);

        // DISCOUNT
        const discount =
          Number(item.discount_per_unit || item.discount_amount || 0);

        // BASIC AMOUNT
        const basicAmount =
          qty * rate;

        // DISCOUNT AMOUNT
        const discountAmount =
          qty * discount;

        // TAXABLE AMOUNT
        const taxableAmount =
          basicAmount - discountAmount;

        // GST AMOUNT
        const gstAmount =
          (taxableAmount * gstRate) / 100;

        // TOTAL WITH GST
        const totalAmount =
          taxableAmount + gstAmount;

        // ASSIGN VALUES
        item.taxable_amount =
          taxableAmount.toFixed(2);

        item.discount_total =
          discountAmount.toFixed(2);

        item.gst_amount =
          gstAmount.toFixed(2);

        item.totalPrice =
          totalAmount.toFixed(2);

        // ADD TOTALS
        subtotal += taxableAmount;

        totalDiscount += discountAmount;

        totalGst += gstAmount;

        grandTotal += totalAmount;

        // CHILDREN
        if (item.children && item.children.length > 0) {

          calculateRecursive(item.children);

        }

        // OLD SUBITEM SUPPORT
        if (item.subItems && item.subItems.length > 0) {

          calculateRecursive(item.subItems);

        }

      });

    };

    // START CALCULATION
    calculateRecursive(getAllData);

    console.log("Subtotal =>", subtotal);

    console.log("Discount =>", totalDiscount);

    console.log("GST =>", totalGst);

    console.log("Grand Total Before Charges =>", grandTotal);

    // CHARGE CALCULATION
    // this.chargeSummary = this.calculateCharges(

    //   grandTotal,

    //   this.ruleMst,

    //   this.getDays(this.resData?.sales_order_date)

    // );

    console.log("Charge Summary =>", this.chargeSummary);

    // FINAL GRAND TOTAL
    grandTotal =
      grandTotal +
      Number(this.chargeSummary?.totalCharges || 0);

    console.log("Final Grand Total =>", grandTotal);

    // const dd =this.configMasterService.convertCurrency(this.advancePayment?.advanceAmt,this.advancePayment?.currency_id,this.advancePayment?.exchangeRate,this.selectedCurrency?.Currency_Convert_id,this.selectedCurrency?.rate)
    const dd2 = this.configMasterService.convertAmount(this.advancePayment?.advanceAmt, this.advancePayment?.currency_id, this.selectedCurrency?.Currency_Convert_id)
    // const utilizedAdvance = (dd2 * this.advancePayment?.advance_adjustment_percentage ) / 100;

    // const netPayable = grandTotal - utilizedAdvance;
    // PATCH FORM

    const invoiceAmount = Number(dd2) || 0;
    const adjustmentPercentage = Number(this.advancePayment?.advance_adjustment_percentage) || 0;
    const grandTotalAmount = Number(grandTotal) || 0;

    const utilizedAdvance = (invoiceAmount * adjustmentPercentage) / 100;
    const netPayable = grandTotalAmount - utilizedAdvance;
    this.salesInvoiceForm.patchValue({

      subtotal:
        subtotal.toFixed(2),

      discount_amount:
        totalDiscount.toFixed(2),

      total_gst:
        totalGst.toFixed(2),

      total_charges:
        Number(this.chargeSummary?.totalCharges || 0).toFixed(2),

      grand_total:
        netPayable.toFixed(2),
      utilize_amount: utilizedAdvance,
      total_advance: this.configMasterService.convertAmount(this.advancePayment?.advanceAmt, this.advancePayment?.currency_id, this.selectedCurrency?.Currency_Convert_id)

    });
    this.originalGrandTotal = Number(this.salesInvoiceForm.get('grand_total')?.value || 0);

  }

  calculateCharges(order: any, rules: any[], days: any) {

    const gross = Number(order) || 0;

    console.log("Gross Amount =>", gross);
    console.log("Days =>", days);

    // SAFETY CHECK
    if (!Array.isArray(rules) || rules.length === 0) {

      return {
        grossTotal: gross,
        appliedCharges: [],
        totalCharges: 0,
        netAmount: gross
      };

    }

    let applied: any[] = [];

    rules.forEach((rule: any) => {

      console.log("Checking Rule =>", rule);

      const minDays =
        rule.min_days !== null
          ? Number(rule.min_days)
          : null;

      const maxDays =
        rule.max_days !== null
          ? Number(rule.max_days)
          : null;

      // MATCH CONDITION
      const match =
        (minDays === null || days >= minDays) &&
        (maxDays === null || days <= maxDays);

      console.log("Match Status =>", match);

      if (!match) return;

      let amount = 0;

      // PERCENT CALCULATION
      if (rule.calculation_type === "PERCENT") {

        const value = Number(rule.value) || 0;

        amount = (gross * value) / 100;

      }

      // FLAT CALCULATION
      else if (rule.calculation_type === "FLAT") {

        amount = Number(rule.value) || 0;

      }

      // ROUND VALUE
      amount = Number(amount.toFixed(2));

      console.log("Calculated Amount =>", amount);

      applied.push({

        charge_type: rule.charge_type,

        rule_name: rule.rule_name,

        value: rule.value,

        calculation_type: rule.calculation_type,

        amount

      });

    });

    console.log("Applied Charges =>", applied);

    // TOTAL CHARGES
    const totalCharges = applied.reduce(

      (sum: number, r: any) =>
        sum + Number(r.amount || 0),

      0

    );

    // NET AMOUNT
    const netAmount = gross + totalCharges;

    console.log("Total Charges =>", totalCharges);

    console.log("Net Amount =>", netAmount);

    return {

      grossTotal: gross,

      appliedCharges: applied,

      totalCharges: Number(totalCharges.toFixed(2)),

      netAmount: Number(netAmount.toFixed(2))

    };

  }
  getProductImage(path: string): string {

    if (!path) {

      return '../../../../../../assets/No-Image.png';

    }

    return environment.servralUrl + '/' + path;

  }


  onImgError(event: any): void {

    event.target.src =
      '../../../../../../assets/No-Image.png';

  }

  createSalesInvoice() {

    if (this.salesInvoiceForm.invalid) {
      this.salesInvoiceForm.markAllAsTouched();
      this.toaster.warning("Please fill in all required fields")
      return;
    }
    const contact = this.contactPersonList.find((x: any) => x.id == this.salesInvoiceForm.value.shipping_contact_person);
    const contactText = `${contact.title} ${contact.contact_person_name} | ${contact.mobile}`;
    const contact2 = this.contactPersonList.find((x: any) => x.id == this.salesInvoiceForm.value.billing_contact_person);
    const contactText2 = `${contact.title} ${contact.contact_person_name} | ${contact.mobile}`;
    let formData = {
      payment_terms: this.salesInvoiceForm.value.payment_terms,
      financial_year_id: this.financial_year_id,
      ...this.getAllData,
      ...this.salesInvoiceForm.value,
      selectedCurrency: this.selectedCurrency,
      shipping_contact_person: contactText,
      billing_contact_person: contactText2
    }

    this._salesService.createSalesInvoice(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toaster.success("Sales invoice ceated successfully");
        this.router.navigate(['/master/sales/so/invoice']);
      }, error: (err: any) => {
        console.log(err);
      },
    })
    console.log(this.salesInvoiceForm.value);


  }

  warehouseList: any = [];
  getAllWarehouseListNew() {
    this.inventoryManag.getAllWarehouseListNew().subscribe({
      next: (res: any) => {

        this.warehouseList = res.data;
      }, error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    })
  }
  shippingAddressList: any = [];
  getsShippingAddress() {
    this._salesService.getsShippingAddress().subscribe({
      next: (res: any) => {

        this.shippingAddressList = res.data;
      }, error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    })
  }
  contactPersonList: any = [];
  getCustomerContactById(customer_id: any) {
    this._salesService2.getCustomerContactById(customer_id).subscribe({
      next: (res: any) => {
        this.contactPersonList = res.data;
      }, error: (err: any) => {
        this.toaster.error(err.error.message);
      },
    })
  }
  billingAddressList: any = []

  getsCustomerAddress(customer_id: any) {
    this.proposal.getsCustomerAddress(customer_id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.billingAddressList = res.data.billingAddress;
        // this.shippingAddressList = res.data.shippingAddress;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  inputDiscount(): void {
    
    const discount = Number(this.salesInvoiceForm.get('utilize_gross_dic_amt')?.value || 0);
    const remainingDiscount = Number(this.salesInvoiceForm.get('remaining_gross_dis_amt')?.value || 0);

    const finalGrandTotal = this.originalGrandTotal - discount;

    if (discount > finalGrandTotal) {
      this.toaster.warning("Utilize Discount Amount cannot be greater than Grand Total.")
      this.salesInvoiceForm.patchValue({ utilize_gross_dic_amt: 0 });
      this.inputDiscount();
      return
    } else if (discount > remainingDiscount) {
      this.toaster.warning("Utilize Discount Amount cannot be greater than Remaining Discount Amount.")
      this.salesInvoiceForm.patchValue({ utilize_gross_dic_amt: 0 });
      this.inputDiscount();
      return
    }
    this.salesInvoiceForm.patchValue({
      grand_total: finalGrandTotal > 0 ? finalGrandTotal : 0
    });
  }
}