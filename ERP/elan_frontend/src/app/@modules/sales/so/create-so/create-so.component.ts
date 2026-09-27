import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { SalesService } from '../../service/sales.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SchemeDialogComponent } from 'src/app/@modules/crm/pages/proposal/scheme-dialog/scheme-dialog.component';
import { MapAddressQtyDialogComponent } from './map-address-qty-dialog/map-address-qty-dialog.component';
import { pick } from 'src/app/@shared/helper/deliveryAddressHelper';
import Swal from 'sweetalert2';
// import { SchemeDialogComponent } from '../scheme-dialog/scheme-dialog.component';

@Component({
  selector: 'app-create-so',
  templateUrl: './create-so.component.html',
  styleUrls: ['./create-so.component.scss'],
})
export class CreateSoComponent {
  productList: any[] = [];
  filterproduct: any[] = [];
  categoryList: any[] = [];
  filterCategory: any[] = [];
  selectedItems: any;
  isView: boolean = false;
  entityId: any;
  proposalTypeList: any = ['B2B', 'B2C', 'EXPORT'];
  gstTypeList: any = ['CGST/SGST', 'IGST'];
  formDisabled: boolean = false;
  frmSalesOrder: FormGroup;
  type_existing: any;
  hideTableColumns: boolean;
  proposalId: any;
  financial_year_id: any;
  actionType: any;
  version_id: any;
  schemeData: any;
  leadId: any;
  customer_type: any;
  warehouse_id: any;
  client_id: any;
  scheme_id: any;
  loginEmp: any;
  productNamesList: { [key: number]: string[] } = {};
  form: FormGroup;
  today: any;
  getAllData: any;
  bomArray: any;
  dispatchFrom: string = '';

  constructor(
    private _fb: FormBuilder,
    private _active: ActivatedRoute,
    private router: Router,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private dialog: MatDialog,
    private location: Location,
    private $crm: CrmService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private salesService: SalesService,
    private $productionService: ProductionService,
    private toster: ToastrService,
    private toast: ToastrService
  ) { }
  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginEmp = localStorage.getItem('EmpMainId');
    // this.form = this.fb.group({
    // sales_order_date: [this.today]  // Patching today's date
    // });
    this.getProposalType();
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.frmSalesOrder = this._fb.group({
      sales_order_no: [],
      elan_sales_order_no: ['', [Validators.required]],
      elan_so_date: ['', [Validators.required]],
      sales_order_date: [new Date()],
      proposal_no: [],
      pi_no: [],
      proposal_type: [],
      company_name: [],
      contact_person_name: [],
      contact_number: [],
      mail_id: [],
      source_name: [],
      gst_no: [],
      grant_total: [],
      discount: [],
      igst: [],
      notes: ['', [Validators.required]],
      terms_and_conditions: ['', [Validators.required]],
      totalAMTAfterDiscount: [],
      grace_period: [],
      schemeData: [],
      customisation_data: [],
      branding_data: [],
      customisation: [],
      select_scheme: [],
      product_master_name: [],
      promo_item: [],
      apply_scheme: [],
      item_id: [],
      custom_branding: [],
      items: this._fb.array([this.createItems()]),
      // chargeDetailList: this._fb.array([this.chargeDetail()]),
      lead_source: [],
      created_by: [],
      employee_name: [],
      branch_name: [],
      warehouse_name: [],
      delivery_term: [],
      delivery_term_remark: [],
      unloading: [],
      unloading_resp_remark: [],
      warranty_month: [],
      warranty_month_remark: [],
      payment_name: [],
      sub_payment_name: [],
      freight_name: [],
      insurance_name: [],
      valid_till_date: [],
      schedule_delivery_date: [],
      dispatch_from: []
    });

    // this.frmSalesOrder.patchValue({
    //   sales_order_date: [this.today]
    // })
    this.getAllCategory(0);
    this.getHsnCode();
    // this.generateSalesOrderNO(this.financial_year_id);
    this.getAllScheme();
    this._active.queryParams.subscribe({
      next: (res: any) => {
        if (res?.sales_id) {
          this.proposalId = res?.sales_id;
          this.version_id = res?.version_id;
          this.getSOByProposal(res?.sales_id, res?.version_id);
        }
      },
      error: (err) => {
        this.toster.error(err.error.message);
      },
    });
  }

  createItems(): FormGroup {
    return this._fb.group({
      product_code: [null],
      product_name: [null],
      product_category_id: [],
      product_sub_category_id: [],
      product_master_id: [],
      variant_id: [],
      product_description: [],
      hsn_code: [],
      proposed_quantity: [],
      delivered_qty: [],
      remaining_quantity: [],
      quantity: [null],
      price_per_unit: [null],
      totalDiscountAmountPerQTY: [null],
      uom_name: [],
      maximum_discount: [],
      discount_request: [],
      igst: [],
      sgst: [],
      cgst: [],
      address: [],
      customisation_data: [],
      branding_data: [],
      apply_scheme: [],
      customisation: [],
      select_scheme: [],
      product_master_name: [],
      promo_item: [],
      item_id: [],
      custom_branding: [],
      // apply_scheme:[]
    });
  }
  get productItems(): FormArray {
    return this.frmSalesOrder.get('items') as FormArray;
  }

  addItem() {
    this.productItems.push(this.createItems());
  }

  getProductList(event: any, e: any, index: any) {
    let id = event.value ? event.value : event;

    new Promise<void>((resolve, reject) => {
      this.$productionService
        .getItemsBySubCategory(event.id ?? event, e.item_category_id ?? e)
        .subscribe(
          (res: any) => {
            if (res.code === 201) {
              this.toast.error(res.message);
            }
            this.productList[index] = res.data;
            this.filterproduct[index] = res.data;

            this.productNamesList[index] = res.data.map(
              (item: any) => item.product_name
            );

            // ✅ Optional: patch default product name (first one) to form control
            const itemFormGroup = this.productItems.at(index);
            if (res.data?.length && itemFormGroup) {
              itemFormGroup?.patchValue({
                product_master_name: res.data[0].product_name,
                // product_description: res.data[0].product_description,
                // hsn_code: res.data[0].hsn_code,
                // uom_name: res.data[0].uom_name
              });
            }
            resolve();
          },
          (err: any) => {
            reject(err);
          }
        );
    });
  }

  subCategory: any[] = [];
  getSubCategory(event: any, index: any) {
    new Promise<void>((resolve, reject) => {
      this._configurationalMasterService
        .getSubCategory(event.value ?? event)
        .subscribe(
          (res: any) => {
            if (res.code === 201) {
              this.toast.error(res.message);
            }
            this.subCategory[index] = res.data;
          },
          (err: any) => {
            reject(err);
          }
        );
    });
  }
  getAllCategory(i: any) {
    new Promise<void>((resolve, reject) => {
      this._configurationalMasterService.getActiveAssetMasterList().subscribe(
        (res: any) => {
          this.categoryList[i] = res.data;
          this.filterCategory[i] = res.data;
          resolve();
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }
  setItemDescription(item: any, index: number) {
    this.productItems.at(index).patchValue({
      product_description: item.product_description,
      hsn_code: item?.MASTER_HSN_SAC_CODE.hsn_sac_code,
      uom_name: item?.MASTER_UOM.uom_name,
      cgst: item?.MASTER_UOM.cgst,
      igst: item?.MASTER_UOM.igst,
      sgst: item?.MASTER_UOM.sgst,
      price_per_unit: item?.product_list_price,
    });
  }

  uploadedFile: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(
        event,
        false,
        true,
        false
      );
      if (!isValidExtension) {
        return;
      }

      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }

      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.uploadedFile = `uploaded_files/${response?.url}`;
            this.toster.success('Document uploaded successfully');
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
  viewImg1() {
    window.open(environment.servralUrl + '/' + this.uploadedFile, '_blank');
  }

  hsnCodeList2: any;
  hsnCodeList: any = [];
  hsn: any;
  getHsnCode() {
    this._configurationalMasterService
      .getHsnCode(this.entityId)
      .subscribe((res: any) => {
        this.hsnCodeList = res.data;
        this.hsnCodeList2 = this.hsnCodeList;
        this.hsn = this.hsnCodeList2.map((res: any) => res.hsn_sac_code);
      });
  }
  hsnSearch(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList2.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(value: any, index: number): void {
    let chargesDetailList = this.frmSalesOrder.get(
      'chargesDetailList'
    ) as FormArray;
    const selectedHSN = this.hsnCodeList.find(
      (hsn: { id: any }) => hsn.id == value
    );
    chargesDetailList.at(index).patchValue({
      charges_rate: selectedHSN.value,
      charges_desc: selectedHSN.description,
    });
  }

  handleFormDisabled() {
    if (this.proposalId && this.actionType != 'edit') {
      this.formDisabled = true;
    }
  }

  keyPress(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = (event.target as HTMLInputElement).value;

    const isNumber = /[0-9]/.test(inputChar);
    const isDot = inputChar === '.';

    if (event.keyCode !== 8 && !isNumber) {
      if (isDot) {
        if (currentValue.includes('.')) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }

    if (event.key === ' ' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  proposalSelection(e: any) {
    if (e.value === 'EXPORT') {
      this.hideTableColumns = true;
    } else {
      this.hideTableColumns = false;
    }
  }
  customerId: number;
  getAllProductDetails: any;
  deliveryAddress: any;
  getSOByProposal(id: any, version_id: any) {
    this.salesService.getSOByProposal(id, version_id).subscribe((res: any) => {
      this.customerId = res.data.customer_id;
      this.deliveryAddress = pick(res.data, [
        'shipping_pin_code',
        'shipping_address',
        'shipping_postal_address',
        'shipping_country_name',
        'shipping_state_name',
        'shipping_city_name',
        'shipping_gst_category',
        'shipping_gst_in',
        'shipping_address_id',
        'shipping_city_id'
      ]);
      if (this.customerId) {
      }
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;
      this.getAllData = obj;
      this.bomArray = obj?.bomArray;
      this.dispatchFrom = res.data?.warehouse_name + ', ' + res.data?.branch_name + ', ' + res.data?.address + ', ' + res.data?.pin;

      if (res) {
        // setTimeout(() => {
        //   this.setAllData(obj);
        // }, 100);
        this.warehouse_id = res.data?.warehouse_id;

        this.frmSalesOrder.patchValue({
          contact_person_name: res.data.contact_person_name,
          proposal_no: res.data.proposal_no,
          pi_no: res.data?.pi_number,
          contact_number: res.data.contact_number,
          company_name: res.data.company_name,
          mail_id: res.data.mail_id,
          proposal_type: res.data.perposal_type,
          grant_total: res.data.grant_total,
          totalAMTAfterDiscount: res.data.totalAMTAfterDiscount,
          discount: res.data.discount,
          igst: res.data.igst,
          gst_no: res.data.gst_no,
          schemeData: res.data?.scheme_id,
          schedule_delivery_date: res.data?.schedule_delivery_date,
          lead_source: res.data?.lead_source,
          created_by: res.data?.created_by,
          employee_name:
            res.data?.first_name +
            ' ' +
            (res.data?.middle_name ? res.data.middle_name + ' ' : '') +
            ' ' +
            res.data.last_name,
          branch_name: res.data?.branch_name,
          warehouse_name: res.data?.warehouse_name,
          delivery_term: res.data?.delivery_term,
          delivery_term_remark: res.data?.delivery_term_remark,
          unloading: res.data?.unloading,
          unloading_resp_remark: res.data?.unloading_resp_remark,
          warranty_month: res.data?.warranty_month,
          warranty_month_remark: res.data?.warranty_month_remark,
          payment_name: res.data?.payment_name,
          sub_payment_name: res.data?.sub_payment_name,
          freight_name: res.data?.freight_name,
          insurance_name: res.data?.insurance_name,
          valid_till_date: res.data?.valid_till_date,
          dispatch_from: this.dispatchFrom
        });
        this.scheme_id = res.data?.scheme_id;
        this.patchItems(obj);
        // this.patchAddCharge(obj?.charges);
      }
    });
  }

  async patchItems(items: any) {
    this.productItems.clear();

    for (let i = 0; i < items?.productDetailList.length; i++) {
      const ele = items.productDetailList[i];
      this.addItem();
      const lastItem = this.productItems.at(
        this.productItems.length - 1
      ) as FormGroup;

      lastItem.patchValue({
        product_code: ele.product_code,
        product_name: ele.product_name,
        product_category_id: ele.product_category_id,
        product_sub_category_id: ele.pro_sub_cat_id || null,
        product_master_id: ele.product_master_id,
        variant_id: ele.variant_id,
        product_description: ele.product_description,
        hsn_code: ele.hsn_sac_code,
        proposed_quantity: ele.proposed_quantity,
        delivered_qty: ele.delivered_qty,
        remaining_quantity: ele.remaining_quantity,
        quantity: ele.tempQuantity,
        uom_name: ele.uom_name,
        maximum_discount: ele.maximum_discount,
        discount_request: ele.discount_request,
        igst: ele.igst,
        sgst: ele.sgst,
        cgst: ele.cgst,
        price_per_unit: ele.price_per_unit,
        totalDiscountAmountPerQTY: ele.totalDiscountAmountPerQTY,
        promo_item: ele?.promo_item,
        apply_scheme: ele?.apply_scheme,
        customisation_data: ele?.customisation_data,
        branding_data: ele?.branding_data || [],
        customisation: Array.isArray(ele?.customisation)
          ? ele?.customisation[0]
          : null,
        select_scheme:
          Array.isArray(ele?.custom_branding) &&
            ele.custom_branding[0]?.select_scheme
            ? ele.custom_branding[0].select_scheme
            : [],
        item_id: ele?.id,
        custom_branding: ele?.custom_branding,
      });

      await this.getAllCategory(i);
      await this.getProductList(ele.pro_sub_cat_id, ele.product_category_id, i);
      await this.getSubCategory(ele.product_category_id, i);
    }
  }
  
  generateSalesOrderNO(financial_year_id: number) {
    this.salesService.generateSalesOrderNO(financial_year_id).subscribe({
      next: (res: any) => {
        this.frmSalesOrder.get('sales_order_no')?.patchValue(res?.data);
      },
      error: (err) => {
        this.toster.error(err.error.message);
      },
    });
  }

  createSalesOrder() {
    this.frmSalesOrder.markAllAsTouched();
    const selectedProducts = this.selectedItems?.products?.filter(
      (product: any) => product?.selected && product?.quantity > 0
    );

    const selectedBom = this.selectedItems?.bomArray?.filter(
      (bom: any) => bom?.enterDispatchQty > 0
    );

    let formData = {
      customer_id: this.customerId || this.proposalId,
      financial_id: this.financial_year_id,
      entity_id: this.entityId,
      proposal_id: this.proposalId,
      version_id: this.version_id,
      scheme_id: this.scheme_id,
      ...this.frmSalesOrder.value,
      selectedItems: selectedProducts,
      selectedBoms: selectedBom,
      shippingAddressArray: this.selectedItems?.shippingAddress,
      expected_delivery_date: this.selectedItems?.expected_delivery_date,
      contact_person_id: this.selectedItems?.contact_person_id,
      contact_person_name: this.selectedItems?.contact_person_name,
      mobile: this.selectedItems?.mobile,
      email_id: this.selectedItems?.email_id,
      // pincode: this.selectedItems?.pincode,
      // postal_address: this.selectedItems?.postal_address,
      // address: this.selectedItems?.address,
      // gst: this.selectedItems?.gst,
      loginEmployee:this.loginEmp,
      warehouse_id: this.warehouse_id
    };
    
    if (this.frmSalesOrder.invalid) {
      this.toster.error('Please fill all the required fields');
      return;
    }
    this.salesService.createSalesOrder(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toster.success(res.message);
        this.router.navigate(['/master/sales/so']);
      },
      error: (err) => {
        console.log(err);
        const message = err.error?.message;
        const items = err.error?.data;
    
        let itemListHtml = '';
        let tableHtml = '';

        if (items && items.length > 0) {
          tableHtml = `
      <div style="max-height:300px; overflow:auto;">
        <table border="1" 
               style="width:100%; border-collapse:collapse; text-align:center;">
          <thead style="background:#f8d7da;">
            <tr>
              <th style="padding:8px;">Item</th>
              <th style="padding:8px;">Item Code</th>
              <th style="padding:8px;">Required Qty</th>
              <th style="padding:8px;">Available Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: any) => `
              <tr>
                <td style="padding:8px;">${item.product_name}</td>
                <td style="padding:8px;">${item.product_code}</td>
                <td style="padding:8px;">${item.required_qty}</td>
                <td style="padding:8px; color:red; font-weight:bold;">
                  ${item.available_qty}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
        }
        Swal.fire({
          icon: 'error',
          html: `<p style="margin-bottom:10px;">${message}</p>
          ${tableHtml}`,
          width: 700,
          confirmButtonColor: '#d33'
        });
        this.toster.error(message);
        return;
      },
    });
  }

  getAllScheme = () => {
    this._configurationalMasterService.getAllScheme().subscribe((res: any) => {
      const modifyData: any = [];
      res.data?.filter((data: any) => {
        if (data?.status === 'ACTIVE') {
          modifyData.push(data);
        }
      });
      this.schemeData = modifyData;
    });
  };

  selectSchemeView(i: any, control: any) {
    const singleItem = this.productItems.at(i).value; // Get first item
    console.log(singleItem);
    let data = {
      product_name: control?.value?.product_name,
      qty: control?.value?.qty,
      select_scheme: control?.value?.customisation?.select_scheme,
      id: control?.value?.id || control?.value?.id_product,
      // proposal_no: this.proposalForm?.value?.proposal_no,
      actionType: this.actionType,
      version_id: Number(this.version_id),
      proposal_id: Number(this.proposalId),
      customisation_data: control?.value?.customisation_data,
      branding_data: control?.value?.branding_data,
      customisation: control?.value?.customisation,
    };
    
    const prefilledSchemeData = control?.value?.custom_branding || null;

    const dialogRef = this.dialog.open(SchemeDialogComponent, {
      width: '80%',
      data: {
        id: this.leadId,
        data: data,
        type: 'addSO',
        customer_type: this.customer_type,
        client_id: this.client_id,
        schemeData: prefilledSchemeData,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => { });
  }
  goBack() {
    this.location.back();
  }

  openDialog() {
    const dialogRef = this.dialog.open(MapAddressQtyDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100% !important',
      disableClose: true,
      data: {
        shippingAddress: this.deliveryAddress,
        dispatchFrom: this.dispatchFrom,
        // data: this.getAllProductDetails,
        // formData: this.productItems.value,
        selectedData: this.selectedItems,
        // bomArray: this.bomArray,
        getAllData: this.getAllData
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedItems = result;
      }
    });
  }

  getProposalType() {
    this._configurationalMasterService.getProposalType().subscribe(
      (res: any) => {
        this.proposalTypeList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getProductName(productId: any, i: number) {
    const list = this.productList[i] || [];
    const product = list.find((p: { id: any; }) => p.id == productId);

    return product ? `${product.item_name} - ${product.item_code}` : '';
  }

  getAddOnsNames(values: any[]): string {
    if (!values) return '';

    const map: any = {
      1: 'Customization',
      2: 'Branding'
    };

    return values.map(v => map[v]).join(', ');
  }

  getBomItemsTooltip(items: any[]): string {
    if (!items?.length) {
      return 'No Items';
    }

    return items
      .map((x, index) => `${index + 1}. ${x.item_name} (Qty: ${x.total_qty})`)
      .join('\n');
  }

}