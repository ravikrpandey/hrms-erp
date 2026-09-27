import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SerialSelectionModalComponent } from '../serial-selection-modal/serial-selection-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-so-return',
  templateUrl: './create-so-return.component.html',
  styleUrls: ['./create-so-return.component.scss']
})
export class CreateSoReturnComponent {
  financial_id: any;
  entity_id: any;
  salesReturnForm!: FormGroup;
  get isInvoiceCancel(): boolean {
    return this.returnType === 'INVOICE_CANCEL';
  }

  get footerColspan(): number {
    return this.isInvoiceCancel ? 7 : 9;
  }
  status: boolean = false;
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
 selectedCurrency: any;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog,
    private toaster: ToastrService, private activatedRoute: ActivatedRoute,private configMasterService : ConfigurationalmasterService,
    private salesService: SalesService, public location: Location) { }
  returnType: any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')
    this.initializeForm();

    this.changeReturnType();
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res) {
        this.status = res?.status === 'VIEW' ? true : false;
        if (res?.so_id) {
          this.so_id = res?.so_id;
          this.returnType = res.type;
          this.getSODetailsByDocType(res?.so_id, res?.type);
        } else if (res?.invoice_id) {
          this.invoice_id = res?.invoice_id;
          this.returnType = res.type;
          this.getSODetailsByDocType(res?.invoice_id, res?.type);
        }
      }
    });
    this.salesReturnForm.get('return_type')?.valueChanges.subscribe(() => {
      this.changeReturnType();
    });
  
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
  
      this.calculation(this.items);
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
  discountAmt: any
  grant_total: any
  amountInWords: any
  resData: any;
  ruleMst: any;
  chargeSummary: any;
  setFormData: any = [];
  existingGrossDiscount:any;
  getSODetailsByDocType(id: any, type: any) {

    this.salesService.getSODetailsByDocType(id, type).subscribe({
      next: (res: any) => {
        console.log(res);
        this.existingGrossDiscount = res?.existingTotalDiscountAmount;
        this.grossDiscountArray = res.data.grossDiscountDetail;
        let itemListArray = this.returnType !== "INVOICE_CANCEL" ? res.data?.SALES_ORDER_ITEM_LIST_NEWs : res.data.items;
        this.resData = res.data;
        this.ruleMst = res.chargeRuleMst.filter((x: any) => this.returnType == 'SO_CANCEL' ? x.reference_type == 'SO_CANCEL' : x.reference_type == 'GOODS_RETURN');
        this.patchValue(res.data);
        //let product = this.product_rows; 

        itemListArray = itemListArray.filter((x: any) => x.qty > 0);
        this.items = this.buildTree(itemListArray);


        this.calculation(this.items);

      }, error: (err) => {
        console.log(err)
      },
    })
  }
  buildTree(data: any[]) {
    const map = new Map<number, any>();
    const roots: any[] = [];
    
    // Create all nodes first
    for (const item of data) {
      if (this.returnType == 'INVOICE_CANCEL' && !this.status) {

        map.set(Number(item.so_item_ids), {
          ...item,
          children: [],
          level: 0
        });
      } else {

        map.set(Number(this.status ? item.so_item_ids : item.id), {
          ...item,
          children: [],
          level: 0
        });
      }
    }

    // Build parent-child relationship
    for (const item of data) {
      let nodes1: any;
      if (this.returnType == 'INVOICE_CANCEL' && !this.status) {
        nodes1 = map.get(Number(item.so_item_ids));
      } else {
        nodes1 = map.get(Number(this.status ? item.so_item_ids : item.id));
      }

      const parentId =
        item.parent_item_id === null ||
          item.parent_item_id === undefined ||
          item.parent_item_id === ''
          ? null
          : Number(item.parent_item_id);

      // Root node
      if (parentId === null || !map.has(parentId)) {
        roots.push(nodes1);
        continue;
      }

      const parent = map.get(parentId);

      // Prevent duplicate push
      if (this.status || this.returnType == 'INVOICE_CANCEL') {

        if (!parent.children.some((x: any) => Number(x.so_item_ids) === Number(nodes1.so_item_ids))) {
          parent.children.push(nodes1);
        }
      } else {

        if (!parent.children.some((x: any) => Number(x.id) === Number(nodes1.id))) {
          parent.children.push(nodes1);
        }
      }
    }

    // Set levels recursively
    const setLevels = (nodes: any[], level = 0) => {
      for (const node of nodes) {
        node.level = level;

        if (node.children?.length) {
          setLevels(node.children, level + 1);
        }
      }
    };

    setLevels(roots);

    return roots;
  }
  //   buildTree(data: any[]) {
  //   const map = new Map<number, any>();
  //   const result: any[] = [];

  //   // First pass: create all nodes
  //   data.forEach(item => {
  //     map.set(Number(item.id), {
  //       ...item,
  //       children: [],
  //       level: 0
  //     });
  //   });

  //   // Second pass: create parent-child relationship
  //   data.forEach(item => {
  //     const node = map.get(Number(item.id));

  //     const parentId = item.parent_item_id;

  //     // Root node
  //     if (
  //       parentId === null ||
  //       parentId === undefined ||
  //       parentId === ''
  //     ) {
  //       result.push(node);
  //       return;
  //     }

  //     const parent = map.get(Number(parentId));

  //     if (parent) {
  //       node.level = parent.level + 1;
  //       parent.children.push(node);
  //     } else {
  //       // Agar parent nahi mila to root me daal do
  //       console.warn(
  //         `Parent not found for item ${item.id}, parent_item_id=${parentId}`
  //       );
  //       result.push(node);
  //     }
  //   });

  //   // Recursive level update for deeper nesting
  //   const updateLevels = (nodes: any[], level = 0) => {
  //     nodes.forEach(node => {
  //       node.level = level;

  //       if (node.children?.length) {
  //         updateLevels(node.children, level + 1);
  //       }
  //     });
  //   };

  //   updateLevels(result);

  //   return result;
  // }
  // buildTree(data: any[]) {
  //   const map = new Map();

  //   data.forEach(item => {
  //     map.set(item.id, { ...item, children: [], level: 0 });
  //   });

  //   const result: any[] = [];

  //   data.forEach(item => {
  //     const node = map.get(item.id);

  //     if (item.parent_item_id) {
  //     const parent = map.get(Number(item.parent_item_id));
  //       if (parent) {
  //         node.level = parent.level + 1;
  //         parent.children.push(node);
  //       }
  //     } else {
  //       node.level = 0; // parent
  //       result.push(node);
  //     }
  //   });

  //   return result;
  // }
  getDays(orderDate: any) {

    const start = new Date(orderDate);
    const today = new Date();

    const diff = today.getTime() - start.getTime();

    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  patchValue(data: any) {
    if (data) {
      this.salesReturnForm.patchValue({
        sales_order: this.returnType !== 'INVOICE_CANCEL' ? data?.sales_order_no : data?.sales_invoice_no,
        customer: this.returnType !== 'INVOICE_CANCEL' ? data?.CUSTOMER_PROFILE_MST?.company_name : data?.customer?.company_name,
        warehouse: this.returnType !== 'INVOICE_CANCEL' ? data?.warehouseData?.name : data?.sales_order?.warehouseData?.name,
        return_type: this.returnType
      })
    }
  }

  openDialog(index: number, data: any) {

    const latestItem = this.items?.[index];

    if (data?.return_qty == 0 || data?.return_qty == null) {
      this.toaster.warning('Return quantity must be greater than zero.');
      return;
    }
    const dialogRef = this.dialog.open(SerialSelectionModalComponent, {
      width: '700px',
      data: {
        type: true,
        serials: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result?.length) return;

      result.forEach((item: any) => {

        const index = this.setFormData.findIndex(
          (x: any) => x.gis_id === item.gis_id
        );

        if (index > -1) {

          // Update existing record
          this.setFormData[index] = {
            ...this.setFormData[index],
            ...item
          };

        } else {

          // Add new record
          this.setFormData.push(item);

        }

      });
    });
  }

  cancel(index: number, data: any) {

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

    // Initialize array if not exists
    if (!this.setFormData) {
      this.setFormData = [];
    }

    const newItem = {
      ...latestItem,
      remark: '',
      return_reason: ''
    };

    /**
     * Use unique key for duplicate checking.
     * Prefer soi_id because every SO item should have unique soi_id.
     */

    const existingIndex = this.setFormData.findIndex(
      (item: any) => item.id === newItem.id
    );

    let formIndex: number;

    if (existingIndex > -1) {
      // Update existing item
      this.setFormData[existingIndex] = {
        ...this.setFormData[existingIndex],
        ...newItem
      };
      formIndex = existingIndex;
    } else {
      // Push new item
      this.setFormData.push(newItem);
      formIndex = this.setFormData.length - 1;
    }

    console.log('Updated setFormData:', this.setFormData);

    const dialogRef = this.dialog.open(SerialSelectionModalComponent, {
      width: '700px',
      data: {
        formData,
        type: false,
        serials: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      console.log('Selected Serials:', result);

      // Update the correct item
      this.setFormData[formIndex] = {
        ...this.setFormData[formIndex],
        remark: result?.remark ?? '',
        return_reason: result?.return_reason ?? '',
        selectedSerials: result?.selectedSerials ?? []
      };

      console.log('Final setFormData:', this.setFormData);
    });
  }
  utilizedAdvance:any;
  existingTotalDiscountAmount:any;
  calculation(itemList: any[]) {

    console.log("ITEM LIST =>", itemList);
    this.grossTotal = 0;
    this.gstTotal = 0;
    this.totalAMTAfterDiscount = 0;
    this.grant_total = 0;
    this.discountAmt = 0;
    let totalDiscount = 0;

    // RECURSIVE FUNCTION
    const calculateRecursive = (items: any[]) => {

      items.forEach((item: any) => {

        let qty;
        if (this.returnType !== 'INVOICE_CANCEL') {

          qty = Number(this.status ? item.qty : item.return_qty || 0);
        } else {
          qty = Number(item.qty || 0);
        }

        const price = Number(item.price_per_unit || 0);

        const discount = Number(item.discount_per_unit || 0);

        const gst = Number(item.igst || 0);

        // BASIC AMOUNT
        const itemTotal = qty * price;

        // DISCOUNT AMOUNT
        const discountTotal = qty * discount;

        // TAXABLE
        const taxableAmount = itemTotal - discountTotal;

        // GST VALUE
        const gstAmount = taxableAmount * gst / 100;

        // ADD TOTALS
        this.grossTotal += taxableAmount;

        totalDiscount += discountTotal;
        this.discountAmt = totalDiscount;
        this.gstTotal += gstAmount;

        // CHILD CALCULATION
        if (item.children && item.children.length > 0) {
          calculateRecursive(item.children);
        }

      });

    };

    // START RECURSION
    calculateRecursive(itemList);

    // NET AMOUNT
    this.totalAMTAfterDiscount = this.grossTotal;

    // SUB TOTAL BEFORE CHARGES
    this.grant_total =
      this.totalAMTAfterDiscount + this.gstTotal;

    console.log("Grant Total Before Charges =>", this.grant_total);

    // CALCULATE CHARGES
    if (!this.status) {


      this.chargeSummary = this.calculateCharges(
        this.grant_total,
        this.ruleMst,
        this.getDays(this.returnType !== 'INVOICE_CANCEL' ? this.resData?.sales_order_date : this.resData?.sales_invoice_date,)
      );
    }
    console.log("Charge Summary =>", this.chargeSummary);

    // FINAL GRAND TOTAL AFTER CHARGES
    // this.grant_total =this.grant_total +Number(this.chargeSummary?.totalCharges || 0);
const totalCharges = Number(this.chargeSummary?.totalCharges || 0);
 this.utilizedAdvance =this.configMasterService.convertAmount(Number(this.resData?.utilize_advance_amount || 0),this.resData?.currency_id,this.selectedCurrency?.Currency_Convert_id);
 this.existingTotalDiscountAmount =this.configMasterService.convertAmount(Number(this.resData?.utilize_gross_dic_amt || 0),this.resData?.currency_id,this.selectedCurrency?.Currency_Convert_id);
// this.resData?.utilize_advance_amount = utilizedAdvance;

this.grant_total = this.grant_total + totalCharges - this.utilizedAdvance;
this.grant_total = this.grant_total -this.existingTotalDiscountAmount;
    console.log("Final Grand Total =>", this.grant_total);



  }
  calculateCharges(order: any, rules: any[], days: any) {

    ;

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

  getAlphabet(index: number): string {
    return String.fromCharCode(97 + index);
  }
  onReturnQtyChange(event: any, product: any) {

    let value = Number(event.target.value);

    if (value < 0) {
      value = 0;
    }
    if (value > product.qty) {
      value = product.qty;
      this.toaster.error(`Return qty cannot be greater than so item Qty (${product.qty})`);
    }
    product.return_qty = value;
    event.target.value = value;

    this.calculation(this.items);
  }
  createSalesReturn() {

    if (this.returnType === 'INVOICE_CANCEL') {
      const formData = {
        invoice_id: this.invoice_id
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to cancel sales invoice?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.salesService.createSalesReturn(formData).subscribe({
            next: (res: any) => {
              console.log(res);
              this.toaster.success(res.message);
              Swal.fire({ title: 'Success!', text: res.message, icon: 'success' }).then(() => {
                this.router.navigate(['/master/sales/so/invoice']);
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
    } else {



      if (!this.setFormData || this.setFormData.length === 0) {
        this.toaster.error('Please select a reason for the item.');
        return;
      }

      const formData = {
        so_id: this.so_id,
        so_no: this.resData?.sales_order_no,
        warehouse_id: this.resData?.warehouseData?.id,
        finance_id: this.financial_id,
        entity_id: this.entity_id,
        itemList: this.setFormData,
        customer_id: this.resData?.customer_id,
        return_type: this.returnType,
        total_amount: this.grant_total,
        total_charge: this.chargeSummary.totalCharges,
        net_amount: this.totalAMTAfterDiscount,
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to SO Action?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
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

  download() {
  this.salesService.downloadSalesInvoice(this.invoice_id).subscribe({
    next: (blob: Blob) => {

      console.log('Blob Size:', blob.size);
      console.log('Blob Type:', blob.type);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `SalesInvoice_${this.invoice_id}.pdf`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}
