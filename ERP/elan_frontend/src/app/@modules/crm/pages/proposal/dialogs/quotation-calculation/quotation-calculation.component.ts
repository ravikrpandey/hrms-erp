import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface SubItem {
  customization_type_table_index: number,
  subItemId: number;
  subItemName: string;
  subItemType: string;
  qty: number;
  dbp: number;
  minPrice: number;
  maxPrice: number;
  gst: number;
  discountType1: 'percent' | 'flat' | null;
  discount1: number | null; 
  totalDiscountPercentItem?: number; // use for total discount % sub item wise
  totalDiscountAmountItem?: number; // use for total discount amount sub item wise
  totalDiscountAmountPerQTY?: number; // use for total discount amount per QTY
  totalPrice?: number;
  totalWithGst?: number;
  errorMessage?: string | null;
  customisationType: any;
  branding_sides: any;
  brandingTypes: any; // branding id
  accessory_in_name: any; // accessory id
  basket_mst_id: any; // baskets id
  custome_type: any; // accessories/baskets
}

interface MainItem {
  product_master_id: number;
  product_category_id: number;
  product_sub_category_id: number;
  itemId: number;
  itemName: string;
  itemCode: string;
  qty: number;
  dbp: number;
  minPrice: number;
  maxPrice: number;
  gst: number;
  promo_item: boolean;
  discount1?: number; // use for % value
  discount2?: number; // use for % value
  discount3?: number; // use for % value
  discount1Mode?: string | null; // use for percent/flat
  discount2Mode?: string | null; // use for percent/flat
  discount3Mode?: string | null; // use for percent/flat
  discount1Flat?: number; // use for flat value
  discount2Flat?: number; // use for flat value
  discount3Flat?: number; // use for flat value
  flatPercentage1?: number; // use for flat % value
  flatPercentage2?: number; // use for flat % value
  flatPercentage3?: number; // use for flat % value
  applyDiscount1Percent?: boolean; // use for % checkbox
  applyDiscount2Percent?: boolean; // use for % checkbox
  applyDiscount3Percent?: boolean; // use for % checkbox
  applyDiscount1Flat?: boolean; // use for flat checkbox
  applyDiscount2Flat?: boolean; // use for flat checkbox
  applyDiscount3Flat?: boolean; // use for flat checkbox
  totalDiscountPercentItem?: number; // use for total discount % item wise
  totalDiscountAmountItem?: number; // use for total discount amount item wise
  totalDiscountAmountPerQTY?: number; // use for total discount amount per QTY
  totalGrossDisFlatAmtItemWise?: number; // use for total gross discount flat amt item wise flat case
  totalGrossDisFlatAmtItemWisePercent?: number; // use for total gross discount flat amt % item wise flat case
  totalPrice?: number;
  totalWithGst?: number;
  errorMessage?: string | null;
  subItems?: SubItem[];
  select_scheme: [];
  warranty: string;
  custom_branding:any;
  grossDiscountBreakup?: GrossDiscountBreakup[];
}

export interface GrossDiscountBreakup {
  id: number | string; // grossDiscount Id
  type: 'percent' | 'flat' | null;
  enterValue: number;
  perQtyAmount: number;
  perQtyPercent: number;
}

interface GrossDiscount {
  id: number
  name: string;
  type: 'percent' | 'flat' | null;
  value: number | null;
  amount: number | null;
  applied: boolean;
}

@Component({
  selector: 'app-quotation-calculation',
  templateUrl: './quotation-calculation.component.html',
  styleUrls: ['./quotation-calculation.component.scss']
})
export class QuotationCalculationComponent {
  items: MainItem[] = [];
  grossTotal: number = 0;
  gstTotal: number = 0;
  grandTotal: number = 0;
  actionType: any;
  currencySign='₹';
  grossDiscounts: GrossDiscount[] = [];

  totalDiscountAmount: number = 0; // for all item sub items
  finalGrossAfterDisc: number = 0;
  finalGrandTotal: number = 0;

  // variables for flat discounts
  discount2Flat: number = 0;
  discount3Flat: number = 0;
  // will store % equivalent of flat discount
  flatPercentage2: number = 0;
  flatPercentage3: number = 0;
  // track which option is selected
  discount2Mode: 'percent' | 'flat' | null = null;
  discount3Mode: 'percent' | 'flat' | null = null;
  entityId: any;
  financial_year_id: any;
  userLoginId: any;
  pageMode: string;
  discountLength: number=3;

  constructor(
    public dialogRef: MatDialogRef<QuotationCalculationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef, private $proposal: ProposalService, private toast: ToastrService, private router: Router,

  ) {
    this.getGrossDiscountList();
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.userLoginId = localStorage.getItem('EmpMainId')

    this.formateArrayOfObject();
    
    this.pageMode = this.data.pageMode;
  }
  ngAfterViewInit(){
  this.calculateTotals();
this.currencySign = this.data.selectedCurrency.symbols
}
  get isViewMode(): boolean {
    return this.pageMode === 'view';
  }

  onGrossTypeChange(d: GrossDiscount, type: 'percent' | 'flat', event: any) {
    if (event.target.checked) {
      d.applied = true;
      d.type = type;
      if (d.value == null) d.value = 0;d.amount = 0;
    } else {
      d.applied = false;
      d.type = null;
      d.value = null;
      d.amount = null;
    }
    this.calculateTotals();
  }

  // Checkbox toggle for Discount 1,2,3
  onDiscountCheckboxChange(event: any, item: any, type: 'percent' | 'flat', checkboxField: string, discountIndex: 1 | 2 | 3) {
    //item[checkboxField] = event.target.checked;
    const discountModeKey = `discount${discountIndex}Mode`;
    const applyPercentKey = `applyDiscount${discountIndex}Percent`;
    const applyFlatKey = `applyDiscount${discountIndex}Flat`;
    const flatValueKey = `discount${discountIndex}Flat`;
    const percentValueKey = `discount${discountIndex}`;

    // Set mode (percent or flat)
    item[discountModeKey] = type;

    if (type === 'percent') {
      item[applyPercentKey] = !item[applyPercentKey];
      if (item[applyPercentKey]) {
        item[applyFlatKey] = false;
        item[flatValueKey] = 0; // reset flat value
      }
    } else {
      item[applyFlatKey] = !item[applyFlatKey];
      if (item[applyFlatKey]) {
        item[applyPercentKey] = false;
        item[percentValueKey] = 0; // reset percent value
      }
    }

    this.calculateTotals(null, checkboxField);
  }

  // Checkbox toggle for customization
  onDiscountTypeChange(sub: any, type: 'percent' | 'flat') {
    // If user clicks on the SAME selected checkbox → unselect it
    if (sub.discountType1 === type) {
      sub.discountType1 = null;
      sub.discount1 = 0;
      this.calculateTotals();
      return;
    }

    // Else: select the clicked one
    sub.discountType1 = type;
    sub.discount1 = 0;

    this.calculateTotals();
  }

  calculateTotals(discountField: any = null, checkboxField: any = null) {
    // ---- Step 1: Calculate item/sub item level discounts ----
    let gross = 0;
    for (let item of this.items) {
      const basePrice = item.dbp * item.qty;
      let newPrice = basePrice;

      // Item-level cascading discounts 1,2,3
      const itemAny = item as any;
      for (let i = 1; i <= this.discountLength; i++) {
        const applyPercentKey = `applyDiscount${i}Percent`;
        const applyFlatKey = `applyDiscount${i}Flat`;
        const discountModeKey = `discount${i}Mode`;
        const discountValKey = `discount${i}`;
        const flatValKey = `discount${i}Flat`;
        const flatPercentKey = `flatPercentage${i}`;

        if (itemAny[applyPercentKey] || itemAny[applyFlatKey]) {
          //const flatAmount = Number(itemAny[flatValKey]); // total amount flat discount
          const flatAmount = Number(itemAny[flatValKey]) * (item.qty || 1); // per qty flat discount
          if (itemAny[discountModeKey] === 'flat' && flatAmount > 0) {
            itemAny[flatPercentKey] = this.decimalRound2((flatAmount / newPrice) * 100);
            newPrice -= this.decimalRound2(flatAmount);
          } else {
            itemAny[flatPercentKey] = Number(itemAny[discountValKey]) || 0;
            newPrice -= this.decimalRound2((newPrice * (Number(itemAny[discountValKey]) || 0)) / 100);
          }
        }
      }

      // Item Min Price Validation
      if (!item.promo_item) {
        let pricePerUnit = newPrice / item.qty;
        if (pricePerUnit < item.minPrice) {
          // item.errorMessage = `Price cannot go below min price (${item.minPrice})`;
          item.errorMessage = `Price cannot go below the threshold price`;

          // Reset all discounts if min price violated
          // for (let i = 1; i <= this.discountLength; i++) {
          //   itemAny[`discount${i}`] = 0;
          //   itemAny[`discount${i}Flat`] = 0;
          //   itemAny[`applyDiscount${i}Percent`] = false;
          //   itemAny[`applyDiscount${i}Flat`] = false;
          // }

          // Reset only the provided fields (discount → 0, checkbox → false)
          if (discountField) itemAny[discountField] = 0;
          if (checkboxField) itemAny[checkboxField] = false;

          // ---- reset item level totals ----
          item.totalPrice = this.decimalRound2(newPrice);
          item.totalWithGst = this.decimalRound2(newPrice + (newPrice * item.gst) / 100);
          item.totalDiscountAmountItem = this.decimalRound2(basePrice - newPrice);
          item.totalDiscountAmountPerQTY = this.decimalRound2(item.totalDiscountAmountItem / item.qty);
          item.totalDiscountPercentItem = this.decimalRound2((item.totalDiscountAmountItem / basePrice) * 100);
          gross += item.totalPrice;

          this.cdr.detectChanges(); // force input field to refresh bindings
          setTimeout(() => item.errorMessage = null, 5000);
          continue;
        }
      }

      // ---- Save item level totals ----
      item.totalPrice = this.decimalRound2(newPrice);
      item.totalWithGst = this.decimalRound2(newPrice + (newPrice * item.gst) / 100);
      item.totalDiscountAmountItem = this.decimalRound2(basePrice - newPrice);
      item.totalDiscountAmountPerQTY = this.decimalRound2(item.totalDiscountAmountItem / item.qty);
      item.totalDiscountPercentItem = this.decimalRound2((item.totalDiscountAmountItem / basePrice) * 100);
      gross += item.totalPrice;

      // calculate sub item discounts
      if (item.subItems) {
        for (let sub of item.subItems) {
          const subBase = sub.dbp * sub.qty;
          let subPrice = subBase;

          // ---- A) Percent discount = 100 => total zero ----
          if (sub.discountType1 === "percent" && Number(sub.discount1) >= 100) {
            sub.discount1 = 100;
            sub.totalPrice = 0;
            sub.totalWithGst = 0;
            sub.totalDiscountAmountItem = subBase;
            sub.totalDiscountAmountPerQTY = this.decimalRound2(sub.totalDiscountAmountItem / sub.qty);
            sub.totalDiscountPercentItem = 100;
            gross += sub.totalPrice;
            continue;
          }

          // ---- Apply percent first ----
          if (sub.discountType1 === "percent" && Number(sub.discount1) > 0) {
            subPrice -= this.decimalRound2((subPrice * Number(sub.discount1)) / 100);
          }

          // ---- B) Flat discount × qty ----
          if (sub.discountType1 === "flat") {
            const qty = sub.qty || 1;
            const flatAmt = (Number(sub.discount1) || 0) * qty;
            const afterFlat = subPrice - flatAmt;

            // NEGATIVE CHECK
            if (afterFlat < 0) {
              sub.errorMessage = `Flat discount too high! Price cannot be negative.`;

              // Reset flat
              sub.discount1 = 0;
              sub.discountType1 = null;

              // Recalculate percent only
              let fixPrice = subBase;
              if (sub.discountType1 === "percent") {
                fixPrice -= (fixPrice * (sub.discount1 || 0)) / 100;
              }

              sub.totalPrice = this.decimalRound2(fixPrice);
              sub.totalWithGst = this.decimalRound2(fixPrice + (fixPrice * sub.gst) / 100);
              sub.totalDiscountAmountItem = this.decimalRound2(subBase - fixPrice);
              sub.totalDiscountAmountPerQTY = this.decimalRound2(sub.totalDiscountAmountItem / qty);
              sub.totalDiscountPercentItem = this.decimalRound2((sub.totalDiscountAmountItem / subBase) * 100);
              gross += sub.totalPrice;

              this.cdr.detectChanges();
              setTimeout(() => (sub.errorMessage = null), 3000);
              continue;
            }

            // valid flat flow
            subPrice = afterFlat;
          }

          // ---- Save Sub Item Outputs ----
          sub.totalPrice = this.decimalRound2(subPrice);
          sub.totalWithGst = this.decimalRound2(subPrice + (subPrice * sub.gst) / 100);
          sub.totalDiscountAmountItem = this.decimalRound2(subBase - subPrice);
          sub.totalDiscountAmountPerQTY = this.decimalRound2(sub.totalDiscountAmountItem / sub.qty);
          sub.totalDiscountPercentItem = this.decimalRound2((sub.totalDiscountAmountItem / subBase) * 100);
          gross += sub.totalPrice;
        }
      }
    }

    this.grossTotal = gross;

    // Calculate GST Value
    let gstTotalAmount =
      this.items.reduce((sum, item) => sum + ((item.totalWithGst || 0) - (item.totalPrice || 0)), 0) +
      this.items.reduce(
        (sum, item) =>
          sum +
          (item.subItems?.reduce(
            (s, sub) => s + ((sub.totalWithGst || 0) - (sub.totalPrice || 0)),
            0
          ) || 0),
        0
      );

    this.gstTotal = this.decimalRound2(gstTotalAmount);

    // ---- Step 2: Calculate total discount including gross ----
    let grandTotalDiscount = 0;
    for (let item of this.items) {
        grandTotalDiscount += item.totalDiscountAmountItem || 0;
        if (item.subItems) {
            for (let sub of item.subItems) {
                grandTotalDiscount += sub.totalDiscountAmountItem || 0;
            }
        }
    }

    let totalItems = this.items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    let totalSubItems = this.items.reduce(
        (sum, i) => sum + (i.subItems ? i.subItems.reduce((s, sub) => s + (sub.totalPrice || 0), 0) : 0),
        0
    );

    let grossDiscountAmount = 0;
    let grossTotalAmount = totalItems + totalSubItems;
    for (let d of this.grossDiscounts) {
      const discValue = Number(d.value) || 0;
      if (d.applied && discValue && discValue > 0) {
        let discount = 0;
        if (d.type === 'percent') {
          // grossDiscountAmount += (grossTotalAmount) * discValue / 100;
          discount = this.decimalRound2(grossTotalAmount * (discValue / 100));
        } else if (d.type === 'flat') {
          discount = this.decimalRound2(discValue);
          // grossDiscountAmount += discValue;
        }
        grossDiscountAmount += discount;
        grossTotalAmount -= discount; // cascade for next discount
        d.amount = discount; // actual calculated discount amount
      }
    }

    // ---- Step 3: distribute gross discount per item (only item level, no sub-items) ----
    for (let item of this.items) {
      item.grossDiscountBreakup = []; // reset each time
      let itemShareBase = (item.totalPrice || 0);
      let totalBase = totalItems + totalSubItems;
      let runningBase = item.dbp; 

      for (let d of this.grossDiscounts) {
        if (d.applied && d.value && d.value > 0) {
          let perQtyAmount = 0;
          let perQtyPercent = 0;

          if (d.type === 'percent') {
            perQtyPercent = d.value;
            perQtyAmount = this.decimalRound2((runningBase * perQtyPercent) / 100);
            // for cascading base reduce price
            runningBase -= perQtyAmount;
          } else if (d.type === 'flat') {
            let itemShare = (itemShareBase / totalBase) * d.value; // item ka share of flat
            perQtyAmount = this.decimalRound2(itemShare / item.qty);
            perQtyPercent = this.decimalRound2((perQtyAmount / runningBase) * 100);
            // for cascading base reduce price
            runningBase -= perQtyAmount;
          }

          item.grossDiscountBreakup.push({
            id: d.id,          
            type: d.type,
            enterValue: d.value,
            perQtyAmount,
            perQtyPercent
          });
        }
      }
    }

    // ---- Update totals ----
    this.totalDiscountAmount = this.decimalRound2(grandTotalDiscount + grossDiscountAmount);
    this.finalGrossAfterDisc = this.decimalRound2(totalItems + totalSubItems - grossDiscountAmount);
    this.finalGrandTotal = this.decimalRound2(this.finalGrossAfterDisc + this.gstTotal);

    // ---- Step 4: Min-price check for item level (hypothetical gross discount only) ----
    for (let item of this.items) {
      if (!item.promo_item) {
        const minTotal = item.minPrice * item.qty;
        let hypotheticalPrice = item.totalPrice || 0;

        for (let d of this.grossDiscounts) {
          if (d.applied && d.value && d.value > 0) {
            if (d.type === 'percent') {
                hypotheticalPrice *= 1 - d.value / 100;
            } else if (d.type === 'flat') {
                hypotheticalPrice -= ((item.dbp * item.qty) / (totalItems + totalSubItems)) * d.value;
            }
          }
        }

        if (hypotheticalPrice < minTotal) {
          // item.errorMessage = `Cannot apply gross discount: Price cannot go below min price (${item.minPrice})`;
          item.errorMessage = `Cannot apply gross discount: Price cannot go below the threshold price`;
          setTimeout(() => (item.errorMessage = null), 5000);

          // Cancel gross discounts entirely
          for (let d of this.grossDiscounts) {
              d.applied = false;
              d.value = null;
              d.type = null;
          }
          this.calculateTotals();
          return;
        }
      }
    }
  }

  normalizeDiscount(item: any, idx: number) {
    if (!item[`applyDiscount${idx}Percent`]) {
      item[`discount${idx}`] = null;
    }
    if (!item[`applyDiscount${idx}Flat`]) {
      item[`discount${idx}Flat`] = null;
      item[`flatPercentage${idx}`] = null;
    }
    if (!item[`applyDiscount${idx}Percent`] && !item[`applyDiscount${idx}Flat`]) {
      item[`discount${idx}Mode`] = null;
      item[`discount${idx}`] = null;
      item[`discount${idx}Flat`] = null;
      item[`flatPercentage${idx}`] = null;
    }

    if (item.subItems && idx==1) {
      for (let sub of item.subItems) {
        if(!sub.discountType1) sub.discount1 = null;
      } 
    }
  }

  decimalRound2(value: number): number {
    return Number(value.toFixed(2));
  }

  // use for save db and local stroge
  bindAllData() {
    let finalData = {
      itemsDetails: this.items,
      grossDiscountDetails: this.grossDiscounts,
      grossTotal: this.grossTotal,
      gstTotal: this.gstTotal,
      totalDiscountAmount: this.totalDiscountAmount,
      finalGrossAfterDiscount: this.finalGrossAfterDisc,
      finalGrandTotal: this.finalGrandTotal
    }
    if (this.items && this.items.length > 0) {
      localStorage.setItem('quotationCalculation', JSON.stringify(finalData));
    }
  }

  // use for close modal
  closeModal() {
    this.bindAllData();
    this.dialogRef.close();
  }

  // save final data
  loading: boolean=false;
  getSaveData() {
    
    // Cleanup: Discount flags check
    for (let item of this.items) {
      this.normalizeDiscount(item, 1);
      this.normalizeDiscount(item, 2);
      this.normalizeDiscount(item, 3);
    }

    // Separate BOM entries from subItems
    // Move all subItems with subItemType === 'BOM' into a new bomArray property
    // Keep only non-BOM entries (e.g., Customization/Branding) inside subItems
    // Return a new object without modifying the original item
    const updatedItems = this.items.map((item: any) => {

      const subItems = item.subItems || [];
      const bomArray = subItems.filter(
        (sub: any) => sub.subItemType === 'KIT'
      );

      const filteredSubItems  = subItems.filter(
        (sub: any) => sub.subItemType !== 'KIT'
      );

      return {
        ...item,
        subItems: filteredSubItems,
        bomArray
      };
    });

    this.loading = true;
    let finalData = {
      // productDetailList: this.items,
      productDetailList: updatedItems,
      grossDiscountDetails: this.grossDiscounts,
      grossTotal: this.grossTotal,
      gstTotal: this.gstTotal,
      totalDiscountAmount: this.totalDiscountAmount,
      finalGrossAfterDiscount: this.finalGrossAfterDisc,
      finalGrandTotal: this.finalGrandTotal
    }

    localStorage.removeItem('quotationCalculation');
    localStorage.removeItem('quotationCalculationItemList');
    // console.log('Final Data:', finalData);

    let empdetail
    let empDetail = localStorage.getItem('signInUser')
    let department_id = localStorage.getItem('department_id')

    if (empDetail != null && empDetail !== undefined) {
      empdetail = JSON.parse(empDetail)
    }

    let isEdit: any;
    if (this.data?.value?.type === 'edit') {
      isEdit = {
        id: this.data?.value?.id
      }
    }
    let loginUser: any = localStorage.getItem('signInUser');
    let userData = JSON.parse(loginUser);
    let data = {
      ...isEdit,
      ...this.data?.value,
      additional_charges: Number(this.data.value?.additional_charges),
      department_id: department_id,
      entity_id: this.entityId,
      financial_year_id: this.financial_year_id,
      items: this.items,
      discountSummary: finalData?.grossDiscountDetails,
      login_id: this.userLoginId,
      employee_id: userData.employee_id,
      ...finalData,
      request_type: 'normal',
    };
    if (this.data.existing_type == 'existing_client') {
      data.existing_client = true
    }
    data.lead_owner = empdetail.first_name + ' ' + empdetail.last_name;
    data.pageModeURL = this.data?.pageModeURL;
    data.PaymentArray= this.data?.PaymentArray;

  if(this.data?.exitProposalData?.proformaStatus){
    data.proformaStatus=true;
    data.expiry_date=this.data.exitProposalData?.expiry_date;
    data.is_so_created= true;
    data.login_id= this.data.exitProposalData?.login_id; 
  }
    data.version_id= this.data.exitProposalData?.version_id;
    //console.log(data,"_____getSaveDataDiscount");
    if(this.data?.value?.quotationType){
      data.id=null;
    }
    console.log('Final Data:', data);
  // return;
   if(this.data?.value?.isSalesBooking!='Edit SB'){
      data.id=data.id??null;
      this.$proposal.createProposal(data).subscribe((res: any) => {
       if (res) {
         this.loading = false;
         this.toast.success('Discount applied successfully!');
         const localDataStr:any = localStorage.getItem('quotationCalculationItemList');
         localStorage.removeItem('quotationCalculationItemList');
         if(res){
           let getData={res:res,data:data}
           this.dialogRef.close(getData);
         }
       }
     },
       (err) => {
         this.loading = false;
         if (err.status == 400) {
           this.toast.error(err?.message);
         } else if (err.status == 403) {
           this.toast.error('Already Exits!');
         }
         else {
           this.toast.error(err?.error?.message || 'Something went Wrong');
         }
       }
     );
    }else{
      data.type='edit'
      data.id=this.data.value.id;
      this.$proposal.updateSalesBooking(data).subscribe((res: any) => {
       if (res) {
         this.loading = false;
         this.toast.success('Discount applied successfully!');
         const localDataStr:any = localStorage.getItem('quotationCalculationItemList');
         localStorage.removeItem('quotationCalculationItemList');
         if(res){
           let getData={res:res,data:data}
           this.dialogRef.close(getData);
         }
       }
     },
       (err) => {
         this.loading = false;
         if (err.status == 400) {
           this.toast.error(err?.message);
         } else if (err.status == 403) {
           this.toast.error('Already Exits!');
         }
         else {
           this.toast.error(err?.error?.message || 'Something went Wrong');
         }
       }
     );
   }
  }

  // use for edit case fetch db data
  bindGrossDiscounts(dbDiscounts: GrossDiscount[]) {
    this.grossDiscounts = this.grossDiscounts.map(d => {
      const dbRecord = dbDiscounts.find(x => x.id === d.id);

      if (dbRecord) {
        return {
          ...d,
          ...dbRecord,
          applied: !!dbRecord.type  // only true if type exists (non-null/non-undefined)
        };
      }

      // No dbRecord found, reset values
      return {
        ...d,
        applied: false,
        type: null,
        value: null,
        amount: null
      };
    });

    // recall again
    this.calculateTotals();
  }

  ngOnInit() {
    // bind data for popup from local storage
    const saved = localStorage.getItem('quotationCalculation');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.items = parsed.itemsDetails || [];
      this.grossDiscounts = parsed.grossDiscountDetails || [];
      this.grossTotal = parsed.grossTotal || 0;
      this.gstTotal = parsed.gstTotal || 0;
      this.totalDiscountAmount = parsed.totalDiscountAmount || 0;
      this.finalGrossAfterDisc = parsed.finalGrossAfterDiscount || 0;
      this.finalGrandTotal = parsed.finalGrandTotal || 0;
    }
  }

  getGrossDiscountList(){
    this.$proposal.getGrossDiscountList().subscribe((res: any) => {
      this.grossDiscounts = res.data.map((d: { id: any; discount_name: any; }) => ({
        id: d.id,
        name: d.discount_name || '',
        type: null,
        value: null,
        amount: null,
        applied: false
      }));
      // get db data
      if (this.data?.isDiscount) {
        this.bindGrossDiscounts(this.data.isDiscount);
      }
    });
  }

  // accept only numbers and one decimal
  blockInvalidKeys(event: KeyboardEvent) {
  if (
    ['e', 'E', '+', '-', ','].includes(event.key)
  ) {
    event.preventDefault();
  }
}

  checkDataUnchanged(newData: any[]): boolean {
    const localDataStr = localStorage.getItem('quotationCalculationItemList');
    if (!localDataStr) return false; // localStorage empty, consider changed

    const localData = JSON.parse(localDataStr);
    return JSON.stringify(localData) === JSON.stringify(newData);
  }

  formateArrayOfObject() {
    
    const itemListArray = this.data?.value?.productDetailList || [];
    const isUnchanged = this.checkDataUnchanged(itemListArray);
    if (!isUnchanged) {
      localStorage.setItem('quotationCalculationItemList', JSON.stringify(itemListArray));
      localStorage.removeItem('quotationCalculation');
    }

    for (const elem of itemListArray) {
      if (elem?.product_master_id) {
        const subItems2: any[] = [];

        // Loop through all branding/customisation entries
        elem?.custom_branding?.forEach((brandingItem: any, index: number) => {
          // If customization data exists
          if (brandingItem?.customisation_data?.length) {
            brandingItem.customisation_data.forEach((x: any) => {
              let price = x?.price_per_unit;
              subItems2.push({
                customization_type_table_index: index,
                subItemId: elem?.product_master_id,
                subItemName: x?.accessories_name ?? x?.type_basket_name ?? x?.type_of_basket,
                subItemCode: '',
                qty: x?.qty,
                accessory_in_name: x?.accessory_in_name, // accessory id
                basket_mst_id: x?.basket_mst_id, // baskets id
                customization_type: x?.customization_type,
                dbp: price,
                minPrice: price,
                maxPrice: price,
                discountType1: x?.discountType1,
                discount1: x?.discount1 ? x?.discount1 : x?.discount,
                gst: x?.gst,
                order_qty: x?.order_qty,
                subItemType: 'Customization', // x?.custome_type,
                totalPrice: x?.total_price ? x?.total_price : x?.totalPrice,
                custome_type: x?.custome_type,
                totalDiscountAmountItem: 0,
                totalDiscountAmountPerQTY: 0,
                totalDiscountPercentItem: 0,
                totalWithGst:x?.totalWithGst,
                customisationType: {
                  order_qty: brandingItem?.order_qty,
                  grand_in_total: brandingItem?.grand_in_total,
                  qty: brandingItem?.qty,
                  select_scheme: brandingItem?.select_scheme,
                  remaining_qty: brandingItem?.remaining_qty,
                  substract_total: brandingItem?.substract_total,
                  total_in_gst: brandingItem?.total_in_gst,
                }
              });
            });
          }

          // If branding data exists
          let brandingData = brandingItem?.branding_data;
          let qty=brandingItem?.branding_data?.qty ?? brandingItem?.qty;
          if (brandingItem?.branding_data) {
            subItems2.push({
              customization_type_table_index: index,
              subItemId: elem?.id,
              subItemName: brandingData?.branding_description,
              subItemCode: '',
              qty: qty,
              accessory_in_name: '',
              customization_type: {
                order_qty: brandingItem?.order_qty,
                grand_in_total: brandingItem?.grand_in_total,
                qty: qty,
                select_scheme: brandingItem?.select_scheme,
                remaining_qty: brandingItem?.remaining_qty,
                substract_total: brandingItem?.substract_total,
                total_in_gst: brandingItem?.total_in_gst,
              },
              brandingTypes: brandingData?.brandingTypes, // brandingTypes id
              select_scheme: brandingItem?.select_scheme,
              dbp: brandingData?.branding_amt,
              minPrice: brandingData?.branding_amt,
              maxPrice: brandingData?.branding_amt,
              gst: brandingData?.gst,
              branding_sides: brandingData?.branding_sides,
              subItemType: 'Branding',
              totalDiscountAmountItem: 0,
              totalDiscountAmountPerQTY: 0,
              totalDiscountPercentItem: 0,
              discountType1: brandingData?.discountType1,
              discount1: brandingData?.discount ? brandingData?.discount : brandingData?.discount1,
              totalPrice: brandingData?.total_price ? brandingData?.total_price : brandingData?.totalPrice,
              totalWithGst: parseInt(brandingData?.totalWithGst),
            });
          }
        });

        // Loop through all bom entries
        elem?.bomArray?.forEach((x: any) => {
            subItems2.push({
              subItemId: x?.bom_id,
              subItemName: x?.bom_name,
              qty: x?.qty,
              dbp: x?.price_per_unit,
              minPrice: x?.price_per_unit,
              maxPrice: x?.price_per_unit,
              discountType1: x?.discountType,
              discount1: x?.discount,
              gst: x?.gst,
              hsn_code: x?.hsn_code,
              subItemType: 'KIT',
              totalPrice: x?.total_price,
              totalDiscountAmountItem: 0,
              totalDiscountAmountPerQTY: 0,
              totalDiscountPercentItem: 0,
              totalWithGst:x?.totalWithGst,
              items: x?.items
            });
        });

        const itemName = elem.name_product || elem?.item_name || elem?.product_name;
        this.items.push({
          product_master_id: elem?.product_master_id,
          product_sub_category_id: elem?.product_sub_category_id,
          product_category_id: elem?.product_category_id,
          itemId: elem?.product_master_id,
          itemName: itemName,
          itemCode: elem?.product_code,
          qty: parseInt(elem?.qty),
          dbp: elem?.price_per_unit ? elem?.promo_item ? 0 : elem?.price_per_unit : elem?.max_price,
          minPrice: elem?.min_price,
          maxPrice: elem?.max_price,
          gst: elem?.promo_item ? 0 : elem?.igst,
          promo_item: elem?.promo_item,
          warranty: elem?.warranty,
          applyDiscount1Percent: elem.discount1Mode === "percent" ? true : false,
          applyDiscount1Flat: elem.discount1Mode === "flat" ? true : false,
          discount1Mode: elem?.discount1Mode,
          discount1: elem?.discount_1 ? elem?.discount_1 : elem?.discount1,
          discount1Flat: elem?.discount1Flat,
          flatPercentage1: elem?.flatPercentage1,
          applyDiscount2Percent: elem.discount2Mode === "percent" ? true : false,
          applyDiscount2Flat: elem.discount2Mode === "flat" ? true : false,
          discount2Mode: elem?.discount2Mode,
          discount2: elem?.discount_2 ? elem?.discount_2 : elem?.discount2,
          discount2Flat: elem?.discount2Flat,
          flatPercentage2: elem?.flatPercentage2,
          applyDiscount3Percent: elem.discount3Mode === "percent" ? true : false,
          applyDiscount3Flat: elem.discount3Mode === "flat" ? true : false,
          discount3Mode: elem?.discount3Mode,
          discount3: elem?.discount_3 ? elem?.discount_3 : elem?.discount3,
          discount3Flat: elem?.discount3Flat,
          flatPercentage3: elem?.flatPercentage3,
          totalPrice: 0,
          totalWithGst: 0,
          subItems: subItems2,
          select_scheme: elem?.select_scheme,
          custom_branding: elem?.custom_branding,
          totalDiscountAmountItem: 0,
          totalDiscountAmountPerQTY: 0,
          totalDiscountPercentItem: 0, // use for approval
          totalGrossDisFlatAmtItemWise: 0,/// not saved
          totalGrossDisFlatAmtItemWisePercent: 0,// not saved
        });
      }
    }
  }

}