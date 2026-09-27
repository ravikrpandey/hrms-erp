import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SerialSelectionModalComponent } from '../serial-selection-modal/serial-selection-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-sales-return',
  templateUrl: './create-sales-return.component.html',
  styleUrls: ['./create-sales-return.component.scss']
})
export class CreateSalesReturnComponent {
  financial_id: any;
  entity_id: any;
  salesReturnForm!: FormGroup;




  serialModal = false;
  so_id: any;
  invoice_id: any;
  impactHtml = '';
  items: any = [];
  serials = [
    {
      serial_no: 'SN001',
      batch: 'BATCH-001',
      status: 'Reserved',
      checked: false
    },
    {
      serial_no: 'SN002',
      batch: 'BATCH-001',
      status: 'Reserved',
      checked: false
    },
    {
      serial_no: 'SN003',
      batch: 'BATCH-001',
      status: 'Delivered',
      checked: false
    }
  ];

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private toaster: ToastrService, private activatedRoute: ActivatedRoute, private salesService: SalesService) { }
  returnType: any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')
    this.initializeForm();

    this.changeReturnType();
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res) {
        if (res?.so_id) {
          this.so_id = res?.so_id;
          this.returnType = res.type;
          this.getSODetailsByDocType(res?.so_id);
        }else if (res?.invoice_id) {
          this.invoice_id = res?.invoice_id;
          this.returnType = res.type;
          this.getSODetailsByDocType(res?.invoice_id);
        }
      }
    });
    this.salesReturnForm.get('return_type')?.valueChanges.subscribe(() => {
      this.changeReturnType();
    });
  }
  initializeForm() {
    this.salesReturnForm = this.fb.group({
      return_type: ['', Validators.required],
      sales_order: ['', Validators.required],
      customer: ['', Validators.required],
      warehouse: ['', Validators.required],
      transporter: [''],
      vehicle_no: [''],
      lr_number: [''],
      driver_name: [''],
      return_reason: [''],
      qc_status: [''],
      approval_status: [''],
      remarks: ['']
    });
  }



  changeReturnType() {

    const type =
      this.salesReturnForm.get('return_type')?.value;

    if (type === 'RESERVATION_RETURN') {

      this.impactHtml = `
        ✔ Hold Release <br>
        ✔ Reserved Stock Available Again <br>
        ❌ No Financial Impact <br>
        ❌ No GST Reverse <br>
        ✔ Inventory Ledger Update
      `;

    } else {

      this.impactHtml = `
        ✔ Stock Inward <br>
        ✔ Credit Note Required <br>
        ✔ GST Reverse <br>
        ✔ Customer Ledger Reverse <br>
        ✔ Inventory Ledger Update <br>
        ✔ QC Verification Required
      `;

    }

  }

  openSerialDialog(index: any, data: any) {

    const dialogRef = this.dialog.open(SerialSelectionModalComponent, {
      width: '700px',
      data: {
        serials: JSON.parse(JSON.stringify(this.serials || [])),
        type: false,
        formData: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected Serials:', result);
      }
    });

  }

  toggleSerial(index: number) {

    this.serials[index].checked =
      !this.serials[index].checked;

  }

  submit() {

    console.log(this.salesReturnForm.value);

    if (this.salesReturnForm.invalid) {

      this.salesReturnForm.markAllAsTouched();

      return;

    }

    alert('Sales Return Submitted Successfully');

  }




  saveSelectedSerials(data: any) {

    console.log(data);

  }
  currencySign: any
  grossTotal: any
  grossDiscountArray: any = [];
  gstTotal: any
  totalAMTAfterDiscount: any
  grant_total: any
  amountInWords: any
  resData: any;
  chargeSummary: any;
  setFormData: any = [];
  getSODetailsByDocType(id: any) {

    this.salesService.getSODetailsByDocType(id,'').subscribe({
      next: (res: any) => {
        console.log(res);
        this.grossDiscountArray = res.data.grossDiscountDetail;
        let itemListArray = res.data?.productDetailList;
        this.resData = res.data;
        this.patchValue(res.data);
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
                      uom_name: cust.acc_uom_name ?? cust.bas_uom_name,
                      return_qty: 0
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
                    uom_name: cb.branding_data.bra_uom_name,
                    return_qty: 0
                  });
                }
              });
            }

            // ab product me add kar do
            elem.subItems = subItems;
          }
        }
        this.items = itemListArray;
        this.calculation(this.items);

      }, error: (err) => {
        console.log(err)
      },
    })
  }
  getDays(orderDate: any) {

    const start = new Date(orderDate);
    const today = new Date();

    const diff = today.getTime() - start.getTime();

    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  patchValue(data: any) {
    if (data) {
      this.salesReturnForm.patchValue({
        sales_order: data?.sales_order_no,
        customer: data?.company_name,
        warehouse: data?.warehouse_name,
        return_type: this.returnType
      })
    }
  }
  cancel2(index: any, data: any) {
    
  }
  cancel(index: number, data: any) {
    ;

    const latestItem = this.items?.[index];

    if (!latestItem) {
      console.error('Item not found at index:', index);
      return;
    }

    console.log('Cancel clicked at index:', index);
    console.log('Latest item data:', latestItem);

    const formData = {
      so_id: latestItem.soi_id,
      return_qty: latestItem.return_qty,
      so_no: this.resData?.sales_order_no,
      warehouse_id: this.resData?.warehouse_id,
      item_id: latestItem.product_master_id,
      finance_id: this.financial_id,
      entity_id: this.entity_id
    };

    // ensure array exists
    if (!this.setFormData) {
      this.setFormData = [];
    }

    // avoid duplicate push
    const newItem = {
      ...this.items[index],
      remark: '',
      return_reason: ''
    };

    if (!this.setFormData) {
      this.setFormData = [];
    }

    // check duplicate by product_master_id
    const existsIndex = this.setFormData.findIndex(
      (x: any) => x.product_master_id === newItem.product_master_id
    );

    if (existsIndex === -1) {
      // not exists → push
      this.setFormData.push(newItem);
    } else {
      // already exists → update instead of duplicate
      this.setFormData[existsIndex] = {
        ...this.setFormData[existsIndex],
        ...newItem
      };
    }

    const dialogRef = this.dialog.open(SerialSelectionModalComponent, {
      width: '700px',
      data: {
        formData,
        type: true,
        serials: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      console.log('Selected Serials:', result);

      if (this.setFormData[index]) {
        this.setFormData[index].remark = result?.remark ?? '';
        this.setFormData[index].return_reason = result?.return_reason ?? '';
      }
    });
  }

  calculation(itemList: any) {

    console.log(itemList);

    // 1. Gross Total (Qty × Price)
    this.grossTotal = itemList.reduce(
      (sum: number, item: any) =>
        sum +
        (Number(item.price_per_unit) || 0) *
        (Number(item.so_item_qty) || 0),
      0
    );

    // 2. Discount Total
    const totalDiscount = itemList.reduce(
      (sum: number, item: any) =>
        sum +
        (Number(item.discount_amount) || 0) *
        (Number(item.so_item_qty) || 0),
      0
    );

    // 3. Taxable Amount
    this.totalAMTAfterDiscount = this.grossTotal - totalDiscount;

    // 4. IGST Calculation
    this.gstTotal = itemList.reduce(
      (sum: number, item: any) =>
        sum +
        (
          (Number(item.price_per_unit) || 0) *
          (Number(item.so_item_qty) || 0) -
          (Number(item.discount_amount) || 0) *
          (Number(item.so_item_qty) || 0)
        ) *
        (Number(item.igst) || 0) / 100,
      0
    );

    console.log("IGST Total =>", this.gstTotal);

    // 5. Grant Total (Tax Included)
    this.grant_total = this.totalAMTAfterDiscount + this.gstTotal;

    console.log("Grant Total =>", this.grant_total);

    // 6. Charges Calculation
    this.chargeSummary = this.calculateCharges(
      this.grant_total,
      this.resData?.chargeRuleMst,
      this.getDays(this.resData?.sales_order_date)
    );

    console.log("Charge Summary =>", this.chargeSummary);
  }

  calculateCharges(order: any, rules: any, days: any) {

    const gross = Number(order) || 0;

    console.log("Gross Amount =>", gross);
    console.log("Days =>", days);

    let applied: any = [];

    rules.forEach((rule: any) => {

      console.log("Checking Rule =>", rule);

      let match = false;

      const minDays = rule.min_days;
      const maxDays = rule.max_days;

      if (
        (minDays === null || days >= Number(minDays)) &&
        (maxDays === null || days <= Number(maxDays))
      ) {
        match = true;
      }

      console.log("Match Status =>", match);

      if (match) {

        let amount = 0;

        // Percentage
        if (rule.calculation_type === "PERCENT") {

          const ruleValue = Number(rule.value) || 0;

          console.log("Rule Value =>", ruleValue);

          amount = (gross * ruleValue) / 100;
        }

        // Flat
        if (rule.calculation_type === "FLAT") {

          amount = Number(rule.value) || 0;
        }

        console.log("Calculated Amount =>", amount);

        applied.push({
          charge_type: rule.charge_type,
          rule_name: rule.rule_name,
          value: rule.value,
          calculation_type: rule.calculation_type,
          amount: Number(amount)
        });
      }
    });

    console.log("Applied Charges =>", applied);

    const totalCharges = applied.reduce(
      (sum: any, r: any) => sum + Number(r.amount),
      0
    );

    console.log("Total Charges =>", totalCharges);

    return {
      grossTotal: gross,
      appliedCharges: applied,
      totalCharges,
      // netAmount: gross - totalCharges
    };
  }
  //  getFormattedPaymentValue(payment: any): string {
  //     const value = Number(payment.payment_value);
  //     // use for id == 4
  //     if (payment.id === 4) {
  //       return value.toFixed(0);
  //     }

  //     // Total calculate (id 4 ko exclude)
  //     const total = this.paymentDetails
  //       ?.filter((p: any) => p.id !== 4)
  //       .map((p: any) => Number(p.payment_value) || 0)
  //       .reduce((a: number, b: number) => a + b, 0) || 0;

  //     // use for %
  //     if (total === 100) {
  //       const formatted =
  //         value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  //       return `${formatted}%`;
  //     }
  //     return this.currencySign + value.toFixed(2);
  //   }
  getAlphabet(index: number): string {
    return String.fromCharCode(97 + index); // small letters (a,b,c..)
    // return String.fromCharCode(65 + index); // capital letters (A,B,C..)
  }
  onReturnQtyChange(event: any, product: any) {

    let value = Number(event.target.value);

    if (value < 0) {
      value = 0;
    }
    if (value > product.so_item_qty) {
      value = product.so_item_qty;
      this.toaster.error(`Return qty cannot be greater than so item Qty (${product.so_item_qty})`);
    }
    product.return_qty = value;
    event.target.value = value;
  }
  createSalesReturn() {

    if (!this.setFormData || this.setFormData.length === 0) {
      this.toaster.error('Please select at least one item');
      return;
    }

    const formData = {
      so_id: this.so_id,
      so_no: this.resData?.sales_order_no,
      warehouse_id: this.resData?.warehouse_id,
      finance_id: this.financial_id,
      entity_id: this.entity_id,
      itemList: this.setFormData,
      customer_id: this.resData?.customer_id
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create sales return?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesService.createSalesReturn(formData).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toaster.success(res.message);
            Swal.fire({ title: 'Success!', text: res.message, icon: 'success' }).then(() => {
              this.router.navigate(['/master/sales/return']);
            });
          },
          error: (err: any) => {
            console.log(err);
            this.toaster.error(err?.error?.message || 'Something went wrong');

            Swal.fire({
              title: 'Error!',
              text: err?.error?.message || 'Something went wrong',
              icon: 'error'
            });

          }

        });

      }

    });

  }
}
