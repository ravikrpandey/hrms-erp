import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { AssignProposalDialogComponent } from '../dialogs/assign-proposal-dialog/assign-proposal-dialog.component';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { SalesService } from '../../sales.service';
import { SchemeDialogComponent } from '../scheme-dialog/scheme-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { PreviewQuotationComponent } from '../preview-quotation/preview-quotation.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { QuotationCalculationComponent } from '../dialogs/quotation-calculation/quotation-calculation.component';

@Component({
  selector: 'app-create-proposal-new',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalNewComponent {
  proposalForm: FormGroup;
  invoiceAddressForm: FormGroup;
  icon: boolean = true;
  leadFormSetupId: any;
  isDisabled: boolean = false;
  proposalTypeList: any = ['B2B', 'B2C', 'EXPORT'];
  gstTypeList: any = ['CGST/SGST', 'IGST'];
  leadId: any;
  proposalId: any;
  actionType: any;
  version_id: any;
  hsnCodeList: any = [];
  additionalChargeDataGetBy: any;

  proposal_list_id: any;
  routerParams: any;
  status: any;
  isInvoiceSubmitted: boolean = false;
  userLoginId: any;
  formDisabled: boolean = false;
  isDiscountRequired: boolean = false;
  isDiscountApproved: boolean = false;
  existing_type: any;
  existingData: any;
  entityId: string | null;
  financial_year_id: string | null;
  productData: any[] = [];
  cetegory: any = [];
  productVariantData: any[] = [];
  hideTableColumns: boolean;
  totalGrandAmount: any;
  totalGrandAmountOut: any;
  schemeData: any;
  schemeId: any;
  showInfo = false;
  applyCondition: boolean = false;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  additionalChargeData: any;
  getPriceSubData:any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private $crm: CrmService,
    private location: Location,
    private dialog: MatDialog,
    private $proposal: ProposalService,
    private salesService: SalesService,
    private $productionService: ProductionService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private _router: Router,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
   

  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.actionType = params?.actionType;
      this.existing_type = params.type;
      this.existingData = params.existing;
    });
    this.proposalForm = this.fb.group({
      id: new FormControl(null),
      // proposal_no: new FormControl(
      //   this.generateRandomPropWithDate(),
      //   Validators.required
      // ),
      proposal_no: new FormControl(Validators.required),
      proposal_type_id: new FormControl(null, Validators.required),
      company_name: new FormControl(null, Validators.required),
      contact_person_name: new FormControl(null, Validators.required),
      contact_number: new FormControl(null),
      mail_id: new FormControl(null, [Validators.required, Validators.email]),
      source_name: new FormControl(null),
      gst_no: new FormControl(''),

      // total_cost: new FormControl(null, Validators.required),
      additional_charges: new FormControl(0, Validators.required),
      discount: new FormControl(null, Validators.required),
      // taxable_value: new FormControl(null, Validators.required),
      sgst: new FormControl(null, Validators.required),
      cgst: new FormControl(null, Validators.required),
      igst: new FormControl(null, Validators.required),
      grant_total: new FormControl(null, Validators.required),
      totalAMTAfterDiscount: new FormControl(null),
      schemeData: new FormControl(null),
      grace_period: new FormControl(null),
      credit_days: new FormControl(null),
      country_id: new FormControl(101, Validators.required),
      state_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      postal_address: new FormControl(null),
      valid_till_date: new FormControl(null, Validators.required),
      lead_source: new FormControl(null, [Validators.required]),
      created_by: new FormControl(null, [Validators.required]),
      created_by_id: new FormControl(null),
      delivery_term_id: new FormControl(null, [Validators.required]),
      delivery_term_remark: new FormControl(null),
      unloading_resp_id: new FormControl(null, [Validators.required]),
      unloading_resp_remark: new FormControl(null),
      warranty_month: new FormControl(null, [Validators.required]),
      warranty_month_remark: new FormControl(null),
      payment_main_id: new FormControl(null, [Validators.required]),
      sub_payment_main_id: new FormControl(null, [Validators.required]),
      freight_id: new FormControl(null, [Validators.required]),
      insurance_id: new FormControl(null, [Validators.required]),
      location_id:new FormControl(null,[Validators.required]),
      warehouse_id:new FormControl(null,[Validators.required]),
      // pincode: new FormControl(null, Validators.required),
      pincode: new FormControl(null, [
  Validators.required,
  Validators.pattern(/^[0-9]{6}$/)   // only 6 digits allowed
]),
      productDetailList: new FormArray([
        new FormGroup({
          id: new FormControl(null),
          product_master_id: new FormControl(null),
          product_sub_category_id: new FormControl(null),
          item_name: new FormControl(null),
          variant_id: new FormControl(null),
          product_code: new FormControl(null),
          product_description: new FormControl(null),
          product_category_id: new FormControl(null),
          uom_name: new FormControl(null),
          uom_id: new FormControl(null),
          qty: new FormControl(null),
          price_per_unit: new FormControl(null),
          min_price:new FormControl(null),
          max_price:new FormControl(null),
          gst_type: new FormControl(null),
          cgst: new FormControl(null),
          sgst: new FormControl(null),
          igst: new FormControl(null),
          maximum_discount: new FormControl(null),
          discount_approved: new FormControl(null),
          discount_request: new FormControl(null),
          readonly: new FormControl(true),
          hsn_code_id: new FormControl(null),
          select_scheme: new FormControl(null),
          image: new FormControl(null),
          schemeApplied: new FormControl(false),
        }),
      ]),
      contactDetails: new FormArray([]),
      chargesDetailList: new FormArray([]),
      total_received: new FormControl(null),
      approvalRemark: new FormControl(null),
      invoice_remark: new FormControl(null),
      sales_documents: new FormControl(null)
    });

    this.loadOnChanges();
    this.invoiceAddressForm = this.fb.group({
      branch_id: new FormControl(null, Validators.required),
      company_name: new FormControl(
        null,
        this.defferentAddress ? Validators.required : null
      ),
      gst_no: new FormControl(null),
      complete_address: new FormControl(null),
    });
  }
  client_id: any;
  type_existing: any;
  id_existing: any;
  type: any;
  lead_summery: any;
  getDataScheme: any;
  proposalApprovalId: any;

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.getAllCategory();
    this.getAllCountry();
    this.getProposalType();
    this.route.queryParams.subscribe((params: any) => {

      if (params.client_id) {
        this.client_id = params.client_id;
        this.type_existing = params.type;
        this.getAllExistingClient(params.client_id);
      }
      if (params.actionType == 'dealClose') {
        this.id_existing = params.id;
        this.getAllexistingClientData();
      }
      this.leadId = params?.id;
      this.type = params.type;
      this.proposalId = params?.proposalId;
      this.actionType = params?.actionType;
      this.version_id = params?.version_id;
      this.proposalApprovalId = params.proposal_approval_id;
      this.proposal_list_id = params?.proposal_list_id;
      this.routerParams = params;

      this.lead_summery = params?.typeLead;
      if (this.leadId || this.proposalId) {
        this.getAllproduct();
      }
      if (this.version_id) {
        this.proposalVersionListById();
      } else {
        if (this.leadId) {
          this.getLeadData(this.leadId);
        }
        if (this.proposalId) {
          this.getAllDealClosedData();
          this.branchSetup_get();
        }
      }

    });
    this.getLeadSource(this.financial_year_id, this.entityId);
    this.handleFormDisabled();
    this.getHsnCode();
    this.getAllScheme();
    this.additionalChargeAll();
    this.environment();

    this.deliveryTermUnloadings();
    this.paymentMainLists();
    this.insuranceLists()
    this.freightLists()

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 15);
    this.proposalForm.get('valid_till_date')?.setValue(newDate, { emitEvent: false });
    this.branchSetup_get();

    
  }
  baseURL: any;
  liveUrl: any;
  environment() {
    let env = environment.servralUrl;
    this.baseURL = env
    if (env === 'https://elanuat.api.elitetraveltech.in') {
      this.liveUrl = "https://elanuat.elitetraveltech.in/"
    } else if (env === 'https://elandevapi.elitetraveltech.in') {
      this.liveUrl = "https://elandev.elitetraveltech.in/"

    } else {
      this.liveUrl = "http://localhost:4200/"

    }
  }
  chargesToggle: boolean = false;
  contactDetailsToggle: boolean = false;
  toggleChargesRow(event: any) {
    if (this.chargesToggle) {
      if (this.CF_2.chargesDetailList.length === 0) {
        this.addChargesRow();
      }
    } else {
      const chargesFormArray = <FormArray>this.CF_2.chargesDetailList;
      while (chargesFormArray.length !== 0) {
        chargesFormArray.removeAt(0);
      }
      this.productCalculation();
    }
  }
  toggleContactDetailsRow(event: any) {

    if (this.contactDetailsToggle) {
      if (this.CF_3.contactDetails.length === 0) {
        let mail_id = this.proposalForm.get('mail_id')?.value
        let contact_number = this.proposalForm.get('contact_number')?.value
        if (!mail_id || !contact_number) {
          this.toast.warning('E-mail ID and contact no. is required ')
          this.contactDetailsToggle = false;
          return;
        } else {

          this.addContactDetails();
        }
      }
    } else {
      const contactDetailsFormArray = <FormArray>this.CF_3.contactDetails;
      while (contactDetailsFormArray.length !== 0) {
        contactDetailsFormArray.removeAt(0);
      }
    }
  }

  get CF_2(): any {
    return this.proposalForm.controls;
  }

  addChargesRow() {
    if (!this.chargesToggle) return; // Prevent adding if toggle is off
    (<FormArray>this.CF_2.chargesDetailList).push(
      new FormGroup({
        charge_name_id: new FormControl(null, Validators.required),
        charges_amount: new FormControl(null, Validators.required),
        charges_hsn_id: new FormControl(null, Validators.required),
        charges_rate: new FormControl(null),
        charges_desc: new FormControl(null),
        charge_name: new FormControl(null)
      })
    );
  }

  allowOnlyNumber(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow only digits 0-9
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}


  deleteChargesRow(i: any, control: any) {
    if (this.CF_2.chargesDetailList.length >= 1) {
      this.CF_2.chargesDetailList.removeAt(i);
      this.productCalculation();
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }

  hsnCodeList2: any;
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
    let chargesDetailList = this.proposalForm.get(
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

  keyPress2(event: KeyboardEvent) {
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

  reloadCurrentRoute(id: any, type: any) {
    let currentUrl = `/master/crm/create-proposal?proposalId=${id}$actionType=${type}`;
    this._router
      .navigateByUrl(currentUrl, { skipLocationChange: true })
      .then(() => {
        this._router.navigate([currentUrl]);
      });
  }

  handleFormDisabled() {
    if (this.proposalId && this.actionType != 'edit') {
      this.formDisabled = true;
    }
  }

  clientData: any = [];

  getAllExistingClient(client_id: any) {
    let data = {
      proposal_no: this.proposalForm?.value?.proposal_no,
    };
    this.salesService.existingClient(client_id, data).subscribe((res: any) => {
      if (res) {
        this.clientData = res.data;
        this.generateRandomPropWithDate();
        this.getAllproduct();
        if (this.clientData) {
          this.proposalForm.patchValue({
            company_name: this.clientData.company_name,
            contact_person_name:
              this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]
                ?.contact_person_name,
            contact_number:
              this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]?.mobile,
            mail_id:
              this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]?.email_id,
            //  source_name:this.clientData?.source_name
          });
        }
      }
    });
  }
  // getHsnCode() {
  //   this._configurationalMasterService.getHsnCode(this.entityId).subscribe((res: any) => {
  //   this.hsnCodeList = res.data;
  //   })
  // }
  handleShowHide(data: any) {
    if (
      (this.actionType == 'edit' || this.actionType == 'view') &&
      data?.request_type == 'discount'
    ) {
      this.isDiscountRequired = true;
      this.isDiscountApproved = true;
    }
  }

  generateRandomPropWithDate() {
    if (this.actionType == 'create') {
      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return 'PROP' + formattedDate + randomNumber;
    }
  }

  selectProduct(data: any, index: any) {
    let currentList = this.proposalForm?.value?.productDetailList;
    let productObj = this.productList?.find((elem: any) => elem?.id == data);
    let tempList = [...this.productList];
    let productVarientList: any = [];
    tempList?.map((item: any) => {
      if (item?.id == data) {
        productVarientList = item?.product_variant_masters;
      }
    });

    currentList[index] = {
      ...currentList[index],
      product_master_id: productObj?.id,
      product_code: productObj?.product_code,
      product_varient_list: productVarientList,
      product_description: '',
      uom_name: '',
      uom_id: '',
      price_per_unit: '',
      min_price:'',
          max_price:'',
    };
    // this.proposalForm.patchValue({
    //   productDetailList: currentList,
    // });
  }

  generateProductVarient(data: any, index: any) {
    let currentList = [...this.proposalForm?.value?.productDetailList];
    let varientObj: any = {};
    this.productList?.map((item: any) => {
      item?.product_variant_masters?.map((subItem: any) => {
        if (subItem?.id == data) {
          varientObj = subItem;
        }
      });
    });
    let isDuplicate = true;
    if (currentList?.length > 1) {
      let newList = currentList.slice();
      if (currentList && currentList.length > 1) newList.splice(index, 1);
      newList?.map((item: any) => {
        if (item.variant_id == data) {
          isDuplicate = false;
          this.toast.error('This variant has been already added.');
        }
      });
    }
    currentList[index] = {
      ...currentList[index],
      variant_id: isDuplicate ? varientObj?.id : '',
      product_description: isDuplicate ? varientObj?.product_description : '',
      uom_name: isDuplicate ? varientObj?.tbl_uom?.uom_name : '',
      uom_id: isDuplicate ? varientObj?.uom_id : '',
      price_per_unit: isDuplicate ? varientObj?.price_per_unit : '',
      maximum_discount: isDuplicate ? varientObj?.maximum_discount : '',
      min_price:isDuplicate ? varientObj?.min_price : '',
      max_price:isDuplicate ? varientObj?.max_price : '',
    };
    this.proposalForm.patchValue({
      productDetailList: currentList,
    });
    this.productCalculation();
  }

  get CF_1(): any {
    return this.proposalForm.controls;
  }
  get CF_3(): any {
    return this.proposalForm.controls;
  }

  addContactDetails() {
    <FormArray>this.CF_3.contactDetails.push(
      new FormGroup({
        phone_no: new FormControl(''),
        email_id: new FormControl(''),
      })
    );
  }
  deleteContactDetails(i: any, control: any) {
    if (this.CF_3.contactDetails.length >= 1) {
      this.CF_3.contactDetails.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  addrow() {
    <FormArray>this.CF_1.productDetailList.push(
      new FormGroup({
        product_master_id: new FormControl(null),
        product_sub_category_id: new FormControl(null),
        item_name: new FormControl(null),
        variant_id: new FormControl(null),
        product_varient_list: new FormControl([]),
        product_code: new FormControl(null),
        product_description: new FormControl(null),
        product_category_id: new FormControl(null),
        uom_name: new FormControl(null),
        uom_id: new FormControl(null),
        qty: new FormControl(null),
        price_per_unit: new FormControl(null),
        min_price:new FormControl(null),
        max_price:new FormControl(null),
        cgst: new FormControl(null),
        gst_type: new FormControl(null),
        sgst: new FormControl(null),
        igst: new FormControl(null),
        maximum_discount: new FormControl(null),
        discount_approved: new FormControl(null),
        hsn_code_id: new FormControl(null),
        select_scheme: new FormControl(null),
        image: new FormControl(null),
        schemeApplied: new FormControl(false),
      })
    );
  }
  selectScheme(i: any, control: any) {
    let data = {
      product_name: control?.value?.MASTER_PRODUCT?.product_name,
      qty: control?.value?.qty,
      select_scheme: control?.value?.select_scheme,
      id: control?.value?.id,
    };
    console.log(control, 'control');
    if (data?.id === undefined || data?.id === null) {
      var otherData: any = {
        id: null,
        product_master_id: control?.value?.product_master_id,
        product_category_id: control?.value?.product_category_id,
        product_sub_category_id: control?.value?.product_sub_category_id,
        variant_id: null,
        product_code: control?.value?.product_code,
        product_description: control?.value?.product_description,
      };
    }
    if (data?.qty === null) {
      this.toast.warning('Pls Add Qty');
      return;
    }
    if (data?.select_scheme === null) {
      this.toast.warning('Pls Select Scheme');
      return;
    }
    const dialogRef = this.dialog.open(SchemeDialogComponent, {
      width: '80%',
      data: { id: this.leadId, data: data, otherData: otherData },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getLeadDataCopy(this.leadId);
    });
  }

  selectSchemeView(i: any, control: any) {
    let data = {
      product_name: control?.value?.MASTER_PRODUCT?.product_name,
      qty: control?.value?.qty,
      select_scheme: control?.value?.select_scheme,
      id: control?.value?.id,
    };
    console.log(control, 'control');
    //     if(data?.select_scheme === null){
    // this.toast.warning("Pls Select Scheme");
    // return
    //     }
    const dialogRef = this.dialog.open(SchemeDialogComponent, {
      width: '80%',
      data: { id: this.leadId, data: data, status: 'view' },
    });
    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.productDetailList.length >= 1) {
      this.CF_1.productDetailList.removeAt(i);
      this.productCalculation();
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any, index: any) => {
        this.getSubCategory(x?.product_category_id, index);
        this.getAllActiveProduct(
          x?.pro_sub_cat_id,
          x?.product_category_id,
          index
        );
        // this.getAllProductVariant(x?.product_id ?? x?.product_master_id, index);

        const defaultControls = {
          variant_id: null,
          qty: null,
          gst_type: null,
          cgst: null,
          sgst: null,
          // igst: null,
          discount_approved: null,
          discount_request: null,
          readonly: false,
        };

        const mergedData = { ...defaultControls, ...x };
        const obj = new FormGroup({});

        Object.keys(mergedData).forEach((k) => {
          if (k === 'product_id') {
            obj.addControl('product_master_id', new FormControl(mergedData[k]));
          } else if (k == 'id') {
            obj.addControl('id', new FormControl(x?.id || null));
          } else {
            obj.addControl(k, new FormControl(mergedData[k]));
          }
        });

        obj.addControl(
          'product_code',
          new FormControl(x?.MASTER_PRODUCT?.product_code ?? x?.product_code)
        );
        obj.addControl(
          'select_scheme',
          new FormControl(x?.MASTER_PRODUCT?.select_scheme ?? x?.schema_id)
        );
        obj.addControl(
          'product_sub_category_id',
          new FormControl(x?.pro_sub_cat_id)
        );
        obj.addControl(
          'product_description',
          new FormControl(
            x?.MASTER_PRODUCT?.product_description ?? x?.product_description
          )
        );
        obj.addControl(
          'price_per_unit',
          new FormControl(x?.MASTER_PRODUCT?.product_list_price || null)
        );
        obj.addControl(
          'maximum_discount',
          new FormControl(x?.MASTER_PRODUCT?.maximum_discount || null)
        );
        obj.addControl(
          'uom_name',
          new FormControl(x?.MASTER_PRODUCT?.MASTER_UOM?.uom_name || null)
        );
        obj.addControl(
          'hsn_code_id',
          new FormControl(x?.MASTER_PRODUCT?.hsn_code_id || null)
        );
        obj.addControl(
          'igst',
          new FormControl(x?.MASTER_PRODUCT?.igst || null)
        );
        obj.addControl(
          'sgst',
          new FormControl(x?.MASTER_PRODUCT?.sgst || null)
        );
        obj.addControl(
          'cgst',
          new FormControl(x?.MASTER_PRODUCT?.cgst || null)
        );
        obj.addControl(
          'uom_id',
          new FormControl(
            x?.MASTER_PRODUCT?.MASTER_UOM?.uom_id ??
            x?.MASTER_PRODUCT?.MASTER_UOM?.id
          )
        );
        return obj;
      })
    );
  }
  patchChargesData(charge: any) {
    if (charge.length > 0) this.chargesToggle = true;
    this.CF_2.chargesDetailList.clear;

    charge.forEach((elem: any, i: number) => {
      this.addChargesRow();
      this.CF_2.chargesDetailList.at(i).patchValue({
        charge_name_id: elem.charge_name,
        charges_amount: elem.amount,
        charges_hsn_id: elem.hsn_code_id,
        charges_rate: elem.tax_rate,
        charges_desc: elem.description,
        charge_name: elem.charge_name
      });
    });
  }
  goBack() {
    this.location.back();
  }
  productList: any = [];
  getAllproduct() {
    try {
      this.$crm.getAllproduct().subscribe(
        (response: any) => {
          if (response) {
            this.productList = response.data;
            this.getProductById(this.productList.id);
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
  getProductById(productId: any) {
    this._configurationalMasterService
      .getProductById(productId)
      .subscribe((res: any) => {
        console.log(res, 'aditya');

        this.proposalForm.patchValue({
          hsn_code_id: res?.data?.hsn_code_id,
        });
      });
  }
  leadData: any = {};
  productDetailsData: any = [];
  productListDetailsRecord: any = [];
  getLeadData(id: any) {
    try {
      let data = {
        proposal_no: this.proposalForm?.value?.proposal_no,
      };
      this.$proposal.getProposalCompanyData(id, data).subscribe(
        (response: any) => {
          if (response) {
            let obj = response.data;
            if (response?.data?.crmDetails) {
              this.schemeCalculation(response?.data?.crmDetails);
            }
            if (obj?.productDetailList) {
              this.productListDetailsRecord = obj?.productDetailList;
              this.lead_id = obj.id;
              this.setAllData(obj);
              this.handleShowHide(obj);
            } else {
              this.productListDetailsRecord = response.crmDetails;
              // this.lead_id = obj.id;
              this.setAllData(response);
              this.handleShowHide(response);
            }
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

  getLeadDataCopy(id: any) {
    try {
      let data = {
        proposal_no: this.proposalForm?.value?.proposal_no,
      };
      this.$proposal.getProposalCompanyData(id, data).subscribe(
        (response: any) => {
          if (response) {
            let obj = response.data;
            this.schemeCalculation(response?.crmDetails);
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
  schemeCalculation(data: any) {
    console.log(data, 'dataaaaa');
    let totalGrandAmount = 0;
    let totalGrandAmountOut = 0;
    data.forEach((item: any) => {
      totalGrandAmount += Number(item?.scheme?.grand_in_total);
      if (item?.scheme?.substract_total === true) {
        totalGrandAmountOut += Number(item?.scheme?.grand_out_total);
      }
    });
    console.log(totalGrandAmount, 'totalGrandAmount<<<<<<<');
    console.log(totalGrandAmountOut, 'totalGrandAmount<<<<<<<2');
    this.totalGrandAmount = Number(totalGrandAmount);
    this.totalGrandAmountOut = totalGrandAmountOut;
    this.productCalculation();
  }
  getData: any;
  getProposalList() {
    try {
      let data = 'all Proposal';
      this.$proposal
        .getProposalList(this.proposalId, 'proposal_no', this.userLoginId, data,'Quotation')
        .subscribe(
          (response: any) => {
            if (response) {
              let obj = response.data;
              this.status = obj?.proposal_status;
              this.getData = obj;
              this.setAllData(obj);
              this.handleShowHide(obj);
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
  getData1: any;
  getAllProductDetails: any = [];
  getAllDealClosedData() {
    try {
      this.$proposal
        .getClosedListData(
          this.proposalId,
          this.version_id,
          this.proposalApprovalId
        )
        .subscribe(
          (response: any) => {
            if (response) {
              let obj = response.data;
              this.status = obj?.proposal_status;
              this.getData = obj;
              this.getAllProductDetails =
                obj?.crmDetails ?? obj?.productDetailList;
              this.setAllData(obj);
              this.handleShowHide(obj);
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
  lead_id: any;
  setAllData(obj: any) {
    console.log('duplicate');
    let productDetailList = [];
    if (obj?.productDetailList) {
      productDetailList = obj?.productDetailList;
    } else {
      productDetailList = obj?.crmDetails;
    }
    if (productDetailList) {
      this.CF_1.productDetailList = this.patchData(productDetailList);
    }
    let charges = obj?.charges;
    if (charges) {
      this.patchChargesData(charges);
    }

    this.proposalForm.patchValue({
      proposal_no: obj?.proposal_no
        ? obj?.proposal_no
        : this.generateRandomPropWithDate(),
      proposal_type_id: obj?.proposal_type_id,
      company_name: obj?.company_name ?? obj?.data?.company_name,
      contact_person_name:
        obj?.contact_person_name ?? obj?.data?.contact_person_name,
      contact_number: obj?.contact_number ?? obj?.data?.contact_number,
      mail_id: obj?.mail_id ?? obj?.data?.mail_id,
      address: obj?.address,
      gst_no: obj?.gst_no,

      // total_cost: obj?.total_cost,
      additional_charges: obj?.additional_charges ? obj?.additional_charges : 0,
      discount: obj?.discount,
      // taxable_value: obj?.taxable_value,
      // hsn_code_id:obj?.crmDetails?.MASTER_UOM?.hsn_code_id,
      // igst: obj?.crmDetails?.MASTER_UOM?.igst,
      grant_total: obj?.grant_total,
      source_name:
        obj?.data?.source_name ??
        obj?.companyData?.[0]?.source_name ??
        obj?.source_name,
    });
    // this.proposalForm.patchValue({ total_cost: obj?.total_cost });
    // if (this.actionType != 'create') {
    if (obj?.grant_total) {
      this.proposalForm.patchValue({ proposal_no: obj?.proposal_no });
    }
    this.productCalculation();
  }

  proposalVersionListById() {
    try {
      let action_type = true;

      this.$proposal
        .proposalVersionListById(
          this.version_id,
          this.proposalId,
          this.proposalApprovalId,
          action_type,
          this.userLoginId
        )
        .subscribe(
          (response: any) => {
            if (response) {
              let obj = response.data;
              this.status = obj?.proposal_status;
              this.getData = obj;
              this.setAllData(obj);
              this.handleShowHide(obj);
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

  selectGstType(index: any) {
    let currentList = this.proposalForm?.controls?.['productDetailList']?.value;
    currentList[index] = {
      ...currentList[index],
      cgst: null,
      sgst: null,
      igst: null,
    };
    this.proposalForm.patchValue({
      productDetailList: currentList,
    });
    this.proposalForm.patchValue({
      cgst: 0,
      sgst: 0,
      igst: 0,
    });
  }
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
  totalAMTAfterDiscount: any;
  productCalculation() {
    let formObj = this.proposalForm?.value;
    let currentList = this.CF_1.productDetailList.value || [];
    3;
    let chargeList = this.CF_2.chargesDetailList.value || [];

    this.totalCGST = 0;
    this.totalSGST = 0;
    this.totalIGST = 0;
    this.totalDiscount = 0;
    this.grandTotal = 0;

    this.totalCGSTPercent = 0;
    this.totalSGSTPercent = 0;
    this.totalIGSTPercent = 0;

    const additionalCharges = parseFloat(formObj?.additional_charges) || 0;
    let totalAMTwithout: any = 0;
    currentList.forEach((item: any) => {
      const qty = Number(item?.qty);
      let discountPercent;
      const pricePerUnit = Number(item?.price_per_unit);
      if (!item.discount_approved) {
        discountPercent = Number(item?.maximum_discount) || 0;
      } else {
        discountPercent = Number(item?.discount_approved) || 0;
      }
      const cgstPercent = Number(item?.cgst) || 0;
      const sgstPercent = Number(item?.sgst) || 0;
      const igstPercent = Number(item?.igst) || 0;

      const totalPrice = qty * pricePerUnit;
      const discountAmount = (totalPrice * discountPercent) / 100;
      const discountedPrice = totalPrice - discountAmount;
      totalAMTwithout += discountedPrice;
      const cgstAmount = (cgstPercent * discountedPrice) / 100;
      const sgstAmount = (sgstPercent * discountedPrice) / 100;
      const igstAmount = (igstPercent * discountedPrice) / 100;

      this.totalCGST += cgstAmount;
      this.totalSGST += sgstAmount;
      this.totalIGST += igstAmount;
      this.totalDiscount += discountAmount;
      this.grandTotal += discountedPrice + cgstAmount + sgstAmount + igstAmount;

      this.totalCGSTPercent += cgstPercent;
      this.totalSGSTPercent += sgstPercent;
      this.totalIGSTPercent += igstPercent;
    });
    this.totalAMTAfterDiscount = totalAMTwithout;
    this.grandTotal += additionalCharges;

    this.formattedTotalCGST = this.totalCGST.toFixed(2);
    this.formattedTotalSGST = this.totalSGST.toFixed(2);
    this.formattedTotalIGST = this.totalIGST.toFixed(2);
    this.formattedTotalDiscount = this.totalDiscount.toFixed(2);
    this.formattedGrandTotal = this.grandTotal.toFixed(2);

    this.formattedTotalCGSTPercent = this.totalCGSTPercent.toFixed(2);
    this.formattedTotalSGSTPercent = this.totalSGSTPercent.toFixed(2);
    this.formattedTotalIGSTPercent = this.totalIGSTPercent.toFixed(2);

    this.totalCGSTforAdditionalCharge =
      (this.totalCGSTPercent * additionalCharges) / 100;
    this.totalSGSTforAdditionalCharge =
      (this.totalSGSTPercent * additionalCharges) / 100;
    this.totalIGSTforAdditionalCharge =
      (this.totalIGSTPercent * additionalCharges) / 100;

    this.totalCGST += this.totalCGSTforAdditionalCharge;
    this.totalSGST += this.totalSGSTforAdditionalCharge;
    this.totalIGST += this.totalIGSTforAdditionalCharge;

    this.formattedTotalCGST = this.totalCGST.toFixed(2);
    this.formattedTotalSGST = this.totalSGST.toFixed(2);
    this.formattedTotalIGST = this.totalIGST.toFixed(2);

    this.grandTotal +=
      this.totalCGSTforAdditionalCharge +
      this.totalSGSTforAdditionalCharge +
      this.totalIGSTforAdditionalCharge;
    console.log(this.totalGrandAmount, 'totalGrandAmount<<<<<<<111');
    console.log(this.totalGrandAmountOut, 'totalGrandAmount<<<<<<<222');
    const totalGrandAmount = Number(this.totalGrandAmount) || 0;
    const totalGrandAmountOut = Number(this.totalGrandAmountOut) || 0;

    this.formattedGrandTotal =
      parseFloat(this.grandTotal.toFixed(2)) +
      totalGrandAmount -
      totalGrandAmountOut;

    let totalAdditionalCharges = 0;
    let totalGSTonCharges = 0;
    chargeList.forEach((charge: any) => {
      const chargeAmount = Number(charge?.charges_amount) || 0;
      const chargeRate = Number(charge?.charges_rate) || 0;

      totalAdditionalCharges += chargeAmount;
      totalGSTonCharges += (chargeAmount * chargeRate) / 100;
    });

    this.proposalForm.patchValue({
      // total_cost: (this.grandTotal - additionalCharges).toFixed(2),
      discount: this.formattedTotalDiscount,
      cgst: this.formattedTotalCGST,
      sgst: this.formattedTotalSGST,
      igst: parseFloat(this.formattedTotalIGST) + totalGSTonCharges,
      grant_total: this.formattedGrandTotal + totalAdditionalCharges,
      totalAMTAfterDiscount: this.totalAMTAfterDiscount,
    });
  }

  keyPress(event: Event | any) {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  dialogOpen() {
    if (this.proposalForm.status === 'INVALID') {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    if (this.proposalForm?.value?.productDetailList?.length) {
      const dialogRef = this.dialog.open(AssignProposalDialogComponent, {
        width: '1200px',
        data: {
          value: this.proposalForm?.value,
          productList: this.productData[0],
          create_lead_id: this.getData?.create_lead_id,
          existing: 'existing',
        },
      });

      dialogRef.afterClosed().subscribe((result) => { });
    }
  }

  dialogOpen1() {
    if (this.proposalForm.status === 'INVALID') {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    if (this.proposalForm?.value?.productDetailList?.length) {
      const dialogRef = this.dialog.open(AssignProposalDialogComponent, {
        width: '1200px',
        data: {
          value: this.proposalForm?.value,
          productList: this.productData[0],
          create_lead_id: this.getData?.create_lead_id,
          existing_type: this.existing_type,
        },
      });

      dialogRef.afterClosed().subscribe((result) => { });
    }
  }
  upsellCreate() {
    Swal.fire({
      title: `You want to do Up-Sell ${'<br>'} Product Price`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let currentList = this.proposalForm?.value?.productDetailList;
        currentList?.map((item: any) => (item.readonly = false));
        this.proposalForm.patchValue({
          productDetailList: currentList,
        });
      }
    });
  }
  formObj: any = {};
  updateProposalStatus(statusType: any) {
    this.proposalForm?.value?.productDetailList?.map(
      (item: any, index: number) => {
        const discountApproved = Number(item?.discount_approved);
        const maximumDiscount = Number(item?.maximum_discount);
        const discountRequest = Number(item?.discount_request);
        if (
          discountApproved <= maximumDiscount ||
          discountApproved > discountRequest
        ) {
          this.toast.error(
            'Approved discount should be greater than maximum discount and less than discount request',
            'Error Msg'
          );
        } else {
          let approvalRemark = this.proposalForm?.value?.approvalRemark;
          let list: any = [];
          this.proposalForm?.value?.productDetailList?.map((item: any) => {
            list.push({
              id: Number(item?.id),
              discount_approved: Number(item?.discount_approved),
            });
          });
          if (!approvalRemark) {
            return this.toast.error('Remark is required');
          }
          let data = {
            ...this.proposalForm.value,
            remark: approvalRemark,
            id: this.proposalId,
            proposal_status: statusType == 'AP' ? 'approved' : 'rejected',
          };
          this.$proposal.updateProposalStatus(data).subscribe(
            (res: any) => {
              if (res) {
                this.toast.success(res.message);
                this.goBack();
              }
            },
            (err) => {
              if (err.status == 400) {
                this.toast.error('Something went Wrong');
              } else if (err.status == 403) {
                this.toast.error('Already Exits!');
              } else {
                this.toast.error('Something went Wrong');
              }
            }
          );
        }
      }
    );
  }

  setReceivedAmount(receivedAmt: any) {
    this.proposalForm.patchValue({
      total_received: receivedAmt,
    });
  }

  // Make invoice start
  showInvoice: boolean = false;
  defferentAddress: boolean = false;
  invoiceAddress: boolean = false;
  branchObj: any = {};

  makeInvoice() {
    this.showInvoice = true;
  }
  backInvoice() {
    this.showInvoice = false;
    this.invoiceAddress = false;
    this.resetAddressUpdateForm();
  }

  defferentAddressChange() {
    this.defferentAddress = !this.defferentAddress;
  }

  resetAddressUpdateForm() {
    this.invoiceAddressForm.reset();
    this.branchObj = {};
  }
  branchList: any = [];
  branchSetup_get() {
    try {
      this.$crm.branchSetup_get().subscribe(
        (response: any) => {
          if (response) {
            this.branchList = response.data?.filter(
              (elem: any) => elem?.billing_status == 1
            );
            this.locationList = response.data
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

  backFromViewInvoice() {
    this.actionType = this.routerParams?.actionType;
    this.showInvoice = true;
    this.invoiceAddress = false;
    this.resetAddressUpdateForm();
  }

  viewInvoice() {
    this.branchObj = this.branchList?.find(
      (elem: any) => elem?.id == this.invoiceAddressForm?.value?.branch_id
    );
    if (this.invoiceAddressForm.status === 'INVALID') {
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    this.getLeadData(this.proposalId);
    if (this.defferentAddress) {
      this.updateAddress();
      this.getUpdatedAddress();
    } else {
      this.showInvoice = false;
      this.defferentAddress = false;
      this.invoiceAddress = true;
      this.actionType = '';
    }
  }

  updateAddress() {
    try {
      let req = this.invoiceAddressForm?.value;
      req.branch_id = this.branchObj?.id;
      req.proposal_id = this.proposalId;
      this.$proposal.createBilling(req).subscribe(
        (response: any) => {
          if (response) {
            this.toast.success(response.message);
            this.showInvoice = false;
            this.defferentAddress = false;
            this.invoiceAddress = true;
            this.actionType = '';
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

  getUpdatedAddress() {
    try {
      this.$proposal.getUpdatedAddress().subscribe(
        (response: any) => {
          if (response) {
            let obj = response?.data;
            this.branchObj = {
              ...obj,
              ...this.branchObj,
              branch_address: obj?.complete_address,
              billing_id: obj?.id,
            };
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

  saveInvoice() {
    try {
      let req = {
        proposal_id: this.proposalId,
        billing_id: this.branchObj?.billing_id,
        invoice_remark: this.proposalForm?.value?.invoice_remark,
      };
      this.$proposal.createInvoice(req).subscribe(
        (response: any) => {
          if (response) {
            this.isInvoiceSubmitted = true;
            this.toast.success(response.message);
            this.invoiceAddress = false;
            this.actionType = this.routerParams?.actionType;
            this.resetAddressUpdateForm();
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

  checkGSTNumber(value: any) {
    if (value) {
      const pattern =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
      return pattern.test(value);
    }
  }
  viewImg() {
    window.open(this.baseURL + '/' + this.sales_documents, '_blank');
  }
  reloadCurrentRoute2() {
    let currentUrl = this.route.url;
    this._router.navigateByUrl('/master/sales/all-proposal', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }
  isSubmitting = false;
  previewDialog(data: any) {
    let dialogRef = this.dialog.open(PreviewQuotationComponent, {
      position: { top: '0px' },
      width: "1200px",
      disableClose: true,
      data: data
    })
    dialogRef.afterClosed().subscribe({
      next: (res: any) => {
        // this.reloadCurrentRoute2();
        this._router.navigateByUrl('/master/sales/all-proposal')
      }, error: (err: any) => {
        this.toast.error(err?.error?.message || 'Something went Wrong');
      }
    })
  }


  createProposal() {

    let department_id = localStorage.getItem('department_id');
    let proposal_type_id = this.proposalForm.get('proposal_type_id')?.value;
    // if (!proposal_type_id) {
    //   this.toast.error('Proposal type is required', 'Fields Error');
    //   this.isSubmitting = false;
    //   return;
    // }
    let loginUser: any = localStorage.getItem('signInUser');
    let userData = JSON.parse(loginUser);
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    let value = this.proposalForm?.value;

    // if (this.proposalForm.status === 'INVALID') {
    //   this.toast.error('Required fields should not be empty', 'Fields Error');
    //   this.isSubmitting = false;
    //   return;
    // }

    const gstValidate = this.checkGSTNumber(value?.gst_no);
    const proposalType = this.proposalForm.value.proposal_type_id;
    const gstNo = this.proposalForm.value.gst_no;

    if (proposalType === 'B2B' && (!gstNo || gstNo.trim() === '')) {
      this.toast.error('Enter a valid GST No.', 'Fields Error');
      this.isSubmitting = false;
      return;
    }

    if (proposalType === 'B2B' && gstNo) {
      this.toast.clear();
    }

    let data = {
      ...value,
      additional_charges: Number(value?.additional_charges),
      login_id: this.userLoginId,
      request_type: 'normal',
      department_id: department_id,
      employee_id: userData.employee_id,
      include_additional_charges: this.chargesToggle,
      sales_documents: this.sales_documents

    };

    let empDetail = localStorage.getItem('signInUser');
    if (empDetail != null) {
      const empdetail = JSON.parse(empDetail);
      data.lead_owner = `${empdetail.first_name} ${empdetail.last_name}`;
    }

    if (this.existing_type === 'existing_client') {
      data.existing_client = true;
      data.customer_id = this.client_id;
    }

    if (this.actionType === 'edit') {
      data.id = this.proposalId;
      data.create_lead_id = this.getData?.create_lead_id;
      data.type = 'edit';
    }

    if (Array.isArray(data.productDetailList)) {
      data.productDetailList.forEach((product: any) => {
        if (product.discount_request === '') {
          delete product.discount_request;
        }
      });
    }
    if (this.productListDetailsRecord?.length) {
      data.id = this.lead_id;
    } else {
      data.create_lead_id = this.leadId;
    }
    // if (!this.productListDetailsRecord?.length) {
    //   data.create_lead_id = this.leadId;
    // }

    if (this.productListDetailsRecord?.length) {
      this.productListDetailsRecord = this.productListDetailsRecord.map(
        (item: any) => {
          if (item.gst) {
            const gstValue = parseFloat(item.gst);
            return {
              ...item,
              cgst: parseFloat((gstValue / 2).toFixed(2)),
              sgst: parseFloat((gstValue / 2).toFixed(2)),
            };
          }
          return item;
        }
      );
      this.productListDetailsRecord.forEach((product: any) => {
        data.productDetailList.forEach((item: any) => {
          if (product.id == item.id) {
            item.MASTER_PRODUCT = product.MASTER_PRODUCT;
            if (product.gst) {
              item.cgst = product.cgst;
              item.sgst = product.sgst;
            }
          }
        });
      });
      // data.productDetailList = this.productListDetailsRecord;
      // data.id = this.prop_id;
    } else {
      data.create_lead_id = this.leadId;
    }
    data.entity_id = this.entityId;
    data.financial_year_id = this.financial_year_id;

    const productDetailsValid = data.productDetailList.every((res: any) => {
      if (res.qty == null || res.qty === undefined) {
        this.toast.error('QTY is required !!', 'Error Msg');
        this.isSubmitting = false;
        return false;
      }
      return true;
    });

    if (!productDetailsValid) return;


    data.create_lead_id = this.leadId;
    data.new_customer = 'Yes';

    let deleveryTerm = this.termOfDeliveryList.find((x: any) => x.id === data.delivery_term_id);
    let unloadingResp = this.unloadingRespList.find((x: any) => x.id === data.unloading_resp_id);
    let paymentMain = this.paymentMainList.find((x: any) => x.id === data.payment_main_id);
    let paymentSubMain = this.paymentSubList.find((x: any) => x.id === data.sub_payment_main_id);
    let freight = this.freightList.find((x: any) => x.id === data.freight_id);
    let insurance = this.insuranceList.find((x: any) => x.id === data.insurance_id);
    data.sub_payment_name = paymentSubMain?.sub_payment_name;
    data.freight_name = freight?.freight_name;
    data.insurance_name = insurance?.insurance_name;
    data.delivery_term = deleveryTerm?.delivery_term;
    data.unloading = unloadingResp?.unloading;
    data.payment_name = paymentMain?.payment_name;

    console.log("GET HERE ALL DETAILS ******", data)
    // return
    this.$proposal.createProposalNew(data).subscribe(
      (res: any) => {
        
        if (res) {
          this.previewDialog(res.data);
          // this.toast.success(res.message);
          // this.proposalForm.reset();
          // if (this.actionType === 'create') {
          //   this._router.navigate(['/master/sales/all-proposal']);
          // } else if (this.actionType === 'edit') {
          //   this._router.navigate(['/master/sales/all-proposal']);
          // }
          // this.proposalForm.patchValue({
          //   // total_cost: null,
          //   additional_charges: 0,
          //   discount: null,
          //   // taxable_value: null,
          //   sgst: null,
          //   cgst: null,
          //   igst: null,
          //   grant_total: null,
          // });
        }
        this.isSubmitting = false;
      },
      (err) => {
        if (err.status === 400) {
          this.toast.error(err?.message);
        } else if (err.status === 403) {
          this.toast.error('Already Exists!');
        } else {
          this.toast.error(err?.error?.message || 'Something went Wrong');
        }
        this.isSubmitting = false;
      }
    );
  }

  existing_client_data: any = [];
  getAllexistingClientData() {
    this.$proposal
      .getAllproposalById(this.id_existing)
      .subscribe((res: any) => {
        if (res) {
          this.existing_client_data = res.data;
        }
      });
  }

  // getAllActiveProduct(event: any, index: any) {
  //   this.$productionService
  //     .getAllActiveProduct(event.value ?? event, this.entityId)
  //     .subscribe((res: any) => {
  //       this.productData[index] = res.data;
  //     });
  // }

  getAllActiveProduct(event: any, event2: any, index: any) {
    this.$productionService
      .getItemsBySubCategory(
        event?.id ?? event,
        event2?.item_category_id ?? event2
      )
      .subscribe((res: any) => {
        if (res.code === 201) {
          this.toast.error(res.message);
        }
        this.productData[index] = res.data;
      });
  }


  getProductData(data: any, index: any) {
this.getpriceSubCategory(data,index)
    // this.CF_1.productDetailList.at(index)?.patchValue({
    //   uom_name: data?.MASTER_UOM?.uom_name,
    //   uom_id: data?.uom_id,
    //   igst: data?.MASTER_HSN_SAC_CODE?.gst_value,
    //   product_code: data?.item_code,
    //   item_name: data?.item_name,
    //   product_description: data?.description,
    //   price_per_unit: data?.MRP,
    //   min_price: data?.MVP,
    //   image: environment.servralUrl + '/' + data?.image,
    //   hsn_code_id: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
    // });
  }

     getpriceSubCategory(data: any, index: any) {
          this._configurationalMasterService.getItemPriceSubcategory(this.client_id, data?.id, data?.sub_category_id, data?.asset_id, this.version_id).subscribe((res: any) => {
              console.log(res, "res<<<<<<<<<<<<")
              
              if (res?.data) {
                  this.getPriceSubData = res.data;
              }
              let price_per_unit = (this.getPriceSubData && this.getPriceSubData.customer_price_mapstatus === true)
                  ? this.getPriceSubData.item_price
                  : data?.MVP
              console.log(price_per_unit);
              this.CF_1.productDetailList.at(index)?.patchValue({
                item_name:data?.item_name,
                  name_product: data?.item_name,
                  uom_name: data?.MASTER_UOM?.uom_name,
                  uom_id: data?.uom_id,
                  igst: data?.MASTER_HSN_SAC_CODE?.gst_value,
                  product_code: data?.item_code,
                  maximum_discount: data?.maximum_discount,
                  product_description: data?.description,
                  // price_per_unit: this.getPriceSubData?.customer_price_mapstatus===true? this.getPriceSubData?.item_price : data?.MVP,
                  price_per_unit: res?.data?.DBP,
                  min_price: res?.data?.MVP,
                  max_price: res?.data?.MRP,
                  discount_1: res?.data?.discount_1,
                  discount_2: res?.data?.discount_2,
                  discount_3: res?.data?.discount_3,
                  
                  image: environment.servralUrl + '/' + data?.image,
                  // hsn_code_id: this.getHsnCode(data?.hsn_code_id, index),
                  // hsn_code_id: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
                  hsn_code_id_view: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
                  // hsn_code_id: this.getHsnCode(data?.hsn_code_id, index),
                  hsn_code: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
                  
                  // discount_1:  (this.getPriceSubData && this.getPriceSubData.customer_price_mapstatus === true)? this.getPriceSubData.discount_1: data?.discount_1,
                  // discount_2:  (this.getPriceSubData && this.getPriceSubData.customer_price_mapstatus === true)? this.getPriceSubData.discount_2: data?.discount_2,
                  // discount_3:  (this.getPriceSubData && this.getPriceSubData.customer_price_mapstatus === true)? this.getPriceSubData.discount_3: data?.discount_3,
  
              });
          })
      }
  subCategory: any[] = [];
  getSubCategory(event: any, index: any) {
    this._configurationalMasterService
      .getSubCategory(event?.value ?? event)
      .subscribe(
        (res: any) => {
          if (res.code === 201) {
            this.toast.error(res.message);
          }
          this.subCategory[index] = res.data;
        },
        (error) => {
          this.toast.error(error.message);
        }
      );
  }

  getAllCategory() {
    this._configurationalMasterService
      .getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.cetegory = res.data;
      });
  }

  getAllProductVariant(data: any, index: any) {
    this._configurationalMasterService
      .getProductVariantByproduct_id(data?.value ?? data)
      .subscribe(
        (res: any) => {
          if (res) {
            this.productVariantData[index] = res.data;
          }
        },
        (err: any) => { }
      );
  }

  bindProductData(index: any) {
    let productDetailList = this.proposalForm.get(
      'productDetailList'
    ) as FormArray;
    let product_id = productDetailList.value[index]?.product_master_id;
    let data = this.productData[index].filter(
      (res: any) => res.id == product_id
    );

    if (data && data.length > 0) {
      const product = data[0];
      productDetailList.at(index).patchValue({
        product_description: product.product_description,
        product_code: product.product_code,
        maximum_discount: product.maximum_discount,
        price_per_unit: product.product_list_price,
        min_price:product?.min_price,
        max_price:product?.max_price,
        uom_name: product.uom_name,
        uom_id: product.uom_id,
        hsn_code_id: product?.hsn_code_id,
        igst: product?.igst,
        select_scheme: product?.scheme_id,
      });
    }
  }

  proposalSelection(e: any) {
    if (e.value === 'EXPORT') {
      this.hideTableColumns = true;
    } else {
      this.hideTableColumns = false;
    }
  }
  // onHSNCodeChange(data:any){
  //   this.proposalForm.get('igst')?.patchValue(data?.value);
  //   }

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

  schemSelection(e: any) {
    this.schemeId = e?.value;
    this._configurationalMasterService
      .getByIdScheme(e?.value)
      .subscribe((res: any) => {
        this.getDataScheme = res.data;
      });
  }

  schemeInfo() { }
  applySelect() {
    console.log(this.getDataScheme?.selected_item, 'this.getDataScheme');
    let currentList = this.CF_1.productDetailList.value;
    console.log(currentList, 'currentList');
    let selectData = this.getDataScheme?.selected_item;
    let promo_itemData = this.getDataScheme?.promo_item;
    this.applyCondition = selectData?.every((selectedItem: any) =>
      currentList?.some(
        (currentItem: any) =>
          selectedItem?.selected_item_id === currentItem?.product_master_id
      )
    );

    console.log(this.applyCondition, 'applyCondition');
    if (!this.applyCondition) {
      this.toast.warning('This is not applicable');
      return;
    }
    if (this.applyCondition) {
      this.CF_1.productDetailList.controls.forEach((ctrl: any) => {
        const productId = ctrl.get('product_master_id')?.value;

        const isMatched = selectData?.some(
          (item: any) => item?.selected_item_id === productId
        );

        ctrl.get('schemeApplied')
          ? ctrl.get('schemeApplied')?.setValue(isMatched)
          : ctrl.addControl('schemeApplied', new FormControl(isMatched));
      });
    }
    const finalData: any = [];
    promo_itemData?.map((item: any) => {
      finalData.push({
        product_master_id: item?.promo_item_id,
        product_category_id: item?.promo_category_id,
        product_sub_category_id: item?.promo_subcat_id,
        variant_id: null,
        product_code: item?.promo_item_code,
        product_description: item?.promo_item_description,
      });
    });
    let data = {
      scheme_id: this.schemeId,
      quotation_id: this.leadId,
      createLeadDetails: finalData,
    };

    this.$proposal.add_promo_item(data).subscribe((res: any) => {
      console.log(res);
      // this.getLeadData(this.leadId);
    });
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      if (res) {
        this.countryList = res.data;
      }
    });
  }

  getAllState(countryId: any) {
    this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
      if (res && res?.data) {
        this.stateList = res?.data;
      }
    });
  }

  getAllCity(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe((res: any) => {

      if (res && res?.data) {
        this.cityList = res?.data;
        let country = this.proposalForm.get('country_id')?.value;
        if (this.state && country == 101) {
          let city = this.cityList.find((x: any) => x.city_name == this.state[1]);

          if (!city) {
            let data = {
              city_name: this.state[1],
              states_id: stateId
            }
            this._configurationalMasterService.createCity(data).subscribe({
              next: (res: any) => {
                console.log(res.data);
                this.proposalForm.get('city_id')?.patchValue(res?.data?.city_id);
                this.proposalForm.get('states_id')?.patchValue(res?.data?.states_id);

              }, error: (error) => {

              }
            })
          } else {

            this.proposalForm.get('states_id')?.patchValue(city?.states_id);
            this.proposalForm.get('city_id')?.patchValue(city.city_id);
          }
        }
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

  additionalChargeAll() {
    this.$proposal
      .getAllAdditionalCharge(this.entityId, this.financial_year_id)
      .subscribe((res: any) => {
        this.additionalChargeData = res.data;
      });
  }
  additionalCharge(e: any, i: any) {

    this.$proposal
      .getAllAdditionalChargeGetBy(e.value)
      .subscribe((res: any) => {
        this.additionalChargeDataGetBy = res.data;

        this.CF_2.chargesDetailList.at(i)?.patchValue({
          charges_hsn_id: res.data?.hsn_sac_code,
          charges_rate: res.data?.gstRate,
          charges_desc: res.data?.description_additional,
          charge_name: res.data?.additional_name
          // uom_id: res.data?.uom_id, igst: data?.igst,
          // product_code: res.data?.product_code, product_description: data?.product_description, price_per_unit: data?.product_list_price, hsn_code_id:this.getHsnCode(data?.hsn_code_id,index)
        });
      });
  }

  sales_documents: any
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.proposalForm.patchValue({ sales_documents: null });
        return this.sales_documents = ""
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.sales_documents = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  ////////////
  /// here code for new changes 6 july
  /////

  leadSourceList: any = [];
  createdByList: any = ['Self', 'Any Other'];
  salesEmployeeList: any = [];
  salesEmployeeList2: any = [];
  salesEmployeeList3: any = [];
  postOffice: any[] = [];
  originalDate: Date | null = null;
  termOfDeliveryList: any = [];
  unloadingRespList: any = [];
  paymentMainList: any = [];
  paymentSubList: any = [];
  freightList: any = [];
  insuranceList: any = [];
  locationList: any[] = [];
  getLeadSource(financial_year_id: any, entity_id: any) {
    this.$proposal.getLeadSource(financial_year_id, entity_id).subscribe({
      next: (res) => {
        this.leadSourceList = res.data;
      }, error: (err) => {
        this.toast.error(err.error.message);
        return;
      }
    })
  }
  typeFilter(e: any) {
    const aa = e
    let filteredVariable = this.salesEmployeeList2.filter((item: any) => aa.includes(item.first_name));
    this.salesEmployeeList = filteredVariable
  }
  selectCreatedBy(createdBy: string) {
    if (createdBy === 'Any Other') {
      this.proposalForm.get('created_by_id')?.setValidators([Validators.required]);

      this.$proposal.getSalesCustomers().subscribe({
        next: (res) => {
          this.salesEmployeeList = res.data;
          this.salesEmployeeList2 = res?.data;
          this.salesEmployeeList3 = this.salesEmployeeList.map((value: any) => value.first_name)
        }, error: (err) => {
          this.toast.error(err.error.message);
          return;
        }
      })
    } else {
      this.proposalForm.get('created_by_id')?.clearValidators();
    }
    this.proposalForm.get('created_by_id')?.updateValueAndValidity();
  }

  // fetchPinDetails() {
  //   let country = this.proposalForm.get('country_id')?.value;
  //   if (country) {
  //     this.getAllState(country);
  //   }
  //   let pin = this.proposalForm.get('pincode')?.value;
  //   this.$common.getPostOfficeByPincode(pin).subscribe(
  //     (response: any) => {
  //       if (response.PostOffice) {
  //         this.postOffice = response.PostOffice;
  //       } else {
  //         this.postOffice = [];
  //       }
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error(error);
  //     }
  //   );
  // }

  fetchPinDetails() {
  let pin = this.proposalForm.get('pincode')?.value;
  let country = this.proposalForm.get('country_id')?.value;

  if (!pin || !country) return;
  // State list 
  this.getAllState(country);
  this.$common.getPostOfficeByPincode(pin).subscribe(
    (response: any) => {
      if (response.PostOffice && response.PostOffice.length > 0) {
        this.postOffice = response.PostOffice;
        const post = response.PostOffice[0];
        
        let state_id = this.stateList.find(
          (x: any) => x.states_name.toLowerCase() === post.State.toLowerCase()
        )?.states_id;

        if (state_id) {
          this.proposalForm.get('state_id')?.patchValue(state_id);
          this.proposalForm.get('state_id')?.disable();
          this.getAllCity(state_id);

          // City patch 
          setTimeout(() => {
            let city_id = this.cityList.find(
              (x: any) => x.city_name.toLowerCase() === post.District.toLowerCase()
            )?.city_id;

            if (city_id) {
              this.proposalForm.get('city_id')?.patchValue(city_id);
              this.proposalForm.get('city_id')?.disable();
            }
          }, 800);
        }
      } else {
        this.postOffice = []; 
      }
    },
    (error: HttpErrorResponse) => {
      console.error(error);
    }
  );
}


  loadOnChanges() {
    this.proposalForm.get('country_id')?.valueChanges.subscribe((data: any) => {
      if (data) {

        if (data !== 101) {

          this.proposalForm.get('pincode')?.patchValue(null);
          this.proposalForm.get('postal_address')?.patchValue(null);
          this.proposalForm.get('state_id')?.patchValue(null);
          this.proposalForm.get('city_id')?.patchValue(null);
            
          this.proposalForm.get('address')?.patchValue(null);
          this.postOffice = [];
          this.cityList = [];

        }
        this.getAllState(data);
      }
    });

    this.proposalForm.get('state_id')?.valueChanges.subscribe((data: any) => {
      if (data) {
        this.getAllCity(data);
      }
    });


  }
  state: any;

  // selectPostal(event: any) {
  //   this.state = event.split(',');

  //   let state_id = this.stateList.find((x: any) => x.states_name === this.state[2])?.states_id;
  //   this.proposalForm.get('state_id')?.patchValue(state_id);
  //   this.getAllCity(state_id);
  // }

  selectPostal(event: any) {
  this.proposalForm.get('postal_address')?.patchValue(event);
}

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (selectedDate) {
      this.originalDate = selectedDate;
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 15);
      this.proposalForm.get('valid_till_date')?.setValue(newDate, { emitEvent: false });
    }
  }

  deliveryTermUnloadings() {
    this.$proposal.deliveryTermUnloadings().subscribe({
      next: (res: any) => {
        console.log(res);
        this.termOfDeliveryList = res.data.filter((x: any) => x.type !== 'unloading')
        this.unloadingRespList = res.data.filter((x: any) => x.type == 'unloading')
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  paymentMainLists() {
    this.$proposal.paymentMainList().subscribe({
      next: (res: any) => {
        console.log(res);
        this.paymentMainList = res.data;
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  paymentMainSubCategory(payment_main_id: any) {

    this.$proposal.subPaymentMainList(payment_main_id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.paymentSubList = res.data;
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  insuranceLists() {
    this.$proposal.insuranceList().subscribe({
      next: (res: any) => {
        console.log(res);
        this.insuranceList = res.data;
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  freightLists() {
    this.$proposal.freightList().subscribe({
      next: (res: any) => {
        console.log(res);
        this.freightList = res.data;
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  discountPopup() {
    // if (this.proposalForm.status === 'INVALID') {
    //   this.toast.error('Required fields should not be empty', 'Fields Error');
    //   return;
    // }
    if (this.proposalForm?.value?.productDetailList?.length) {
      const dialogRef = this.dialog.open(QuotationCalculationComponent, {
        width: '1200px',
        disableClose: true,
        data: {
          value: this.proposalForm?.value,
          productList: this.productData[0],
          create_lead_id: this.getData?.create_lead_id,
          existing: 'existing',
        },
      });

      dialogRef.afterClosed().subscribe((result) => { });
    }
  }
  warehouseList: any = [];
  selectLocation(event: any) {
    
    this.$crm.getWarehouseByBranch(event).subscribe({
      next: (res: any) => {
        if(!res.data.length){
          this.toast.error('Warehouse not found', 'Fields Error');
            return;
        }
        this.warehouseList = res.data;
      }, error: (err) => {
        this.warehouseList = [];
      }
    })
  }



}
