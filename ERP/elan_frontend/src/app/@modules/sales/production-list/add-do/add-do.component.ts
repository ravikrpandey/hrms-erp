import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../service/sales.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-add-do',
  templateUrl: './add-do.component.html',
  styleUrls: ['./add-do.component.scss'],
})
export class AddDoComponent implements OnInit {
  addDoform: FormGroup;
  proposalTypeList: any = ['GST', 'NON GST'];
  gstTypeList: any = ['CGST/SGST', 'IGST'];
  isDiscountRequired: boolean = false;
  isDiscountApproved: boolean = false;
  formDisabled: boolean;
  cetegory: any = [];
  productData: any = [];
  states1: any;
  hsnCodeList: any = [];
  selectedBranchStateId: any;
  entityId: string | null;
  financial_year_id: string | null;
  productVariantData: any = [];
  isSameState!: boolean;
  selectedStateCode: any;
  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private salesService: SalesService,
    private _active: ActivatedRoute,
    private $crm: CrmService,
    private _toaster: ToastrService,
    private $common: CommonService,
    private $productionService: ProductionService,
    private travelReqService: TravelRequestService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.addDoform = _fb.group({
      do_date: new FormControl('', Validators.required),
      customer_name: new FormControl(''),
      proposal_no: new FormControl(''),
      trans_type_id: new FormControl('', Validators.required),
      billing_address: new FormControl('', Validators.required),
      shipping_address: new FormControl('', Validators.required),
      order_number: new FormControl(''),
      notes: new FormControl(''),
      terms_and_conditions: new FormControl(''),
      company_name: new FormControl(''),
      branch_id: new FormControl('', Validators.required),
      state_id: new FormControl('', Validators.required),
      productDetailList: new FormArray([
        new FormGroup({
          id: new FormControl(null),
          product_master_id: new FormControl(null),
          variant_id: new FormControl(null),
          product_code: new FormControl(null),
          product_description: new FormControl(null),
          uom_name: new FormControl(null),
          uom_id: new FormControl(null),
          proposed_quantity: new FormControl(null),
          delivered_qty: new FormControl(null),
          remaining_quantity: new FormControl(null),
          qty: new FormControl(null),
          price_per_unit: new FormControl(null),
          // gst_type: new FormControl(null),
          cgst: new FormControl(null),
          sgst: new FormControl(null),
          hsn_code_id: new FormControl(null),

          igst: new FormControl(null),
          // maximum_discount: new FormControl(null),
          // discount_approved: new FormControl(null),
          // discount_request: new FormControl(null),
          readonly: new FormControl(true),
        }),
      ]),
    });
  }
  proposal_id: any;
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this._active.queryParams.subscribe((res: any) => {
      this.proposal_id = res.sales_id;
      this.getAllCategory();
      if (res.sales_id) {
        this.getsalesOrderListByid(res.sales_id);
      }
    });
    this.getAllproduct();
    // this.proposalVersionListById()
    this.generateDeliveryOrderNumber(this.financial_year_id);
    this.getHsnCode();
    this.branchSetup_get();
    let countryId = '101'; //Based on India
    this.getStatesByCountryId(countryId);
    this.getAllActiveTransType();
  }

  getHsnCode() {
    this._configurationalMasterService
      .getHsnCode(this.entityId)
      .subscribe((res: any) => {
        this.hsnCodeList = res.data;
      });
  }
  generateDeliveryOrderNumber(id: any) {
    this.salesService.generateDeliveryOrderNumber(id).subscribe((res: any) => {
      this.addDoform.patchValue({
        order_number: res.data,
      });
    });
  }
  handleShowHide(data: any) {
    this.isDiscountRequired = true;
    this.isDiscountApproved = true;
  }
  getAllProductDetails: any = [];
  getsalesOrderListByid(id: any) {
    this.salesService.salesOderByid(id).subscribe((res: any) => {
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;

      if (res) {
        setTimeout(() => {
          this.setAllData(obj);
        }, 100);
        this.addDoform.patchValue({
          customer_name: res.data.contact_person_name,
          proposal_no: res.data.proposal_no,
          company_name: res.data.company_name,
        });
      }
    });
  }

  get CF_1(): any {
    return this.addDoform.controls;
  }

  addrow() {
    <FormArray>this.CF_1.productDetailList.push(
      new FormGroup({
        product_master_id: new FormControl(null),
        variant_id: new FormControl(null),
        product_varient_list: new FormControl([]),
        product_code: new FormControl(null),
        product_description: new FormControl(null),
        uom_name: new FormControl(null),
        uom_id: new FormControl(null),
        qty: new FormControl(null),
        price_per_unit: new FormControl(null),
        cgst: new FormControl(null),
        gst_type: new FormControl(null),
        sgst: new FormControl(null),
        igst: new FormControl(null),
        maximum_discount: new FormControl(null),
        discount_approved: new FormControl(null),
      })
    );
  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.productDetailList.length >= 1) {
      this.CF_1.productDetailList.removeAt(i);
    } else {
      // this.toast.error('must be one', "Can't Deleted!");
    }
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any, index: any) => {
        this.getAllActiveProduct(x?.product_category_id, index);
        this.getAllProductVariant(x?.product_id ?? x?.product_master_id, index);

        const defaultControls = {
          variant_id: null,
          qty: null,
          gst_type: null,
          cgst: null,
          sgst: null,
          igst: null,
          discount_approved: null,
          discount_request: null,
          readonly: false,
        };

        const mergedData = { ...defaultControls, ...x };

        // Create a new FormGroup
        const obj = new FormGroup({});

        Object.keys(mergedData).forEach((k) => {
          if (k === 'product_id') {
            obj.addControl('product_master_id', new FormControl(mergedData[k]));
          } else if (k == 'id') {
            obj.addControl('id', new FormControl(null));
          } else {
            obj.addControl(k, new FormControl(mergedData[k]));
          }
        });

        obj.addControl(
          'product_code',
          new FormControl(x?.MASTER_PRODUCT?.product_code ?? x?.product_code)
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
          'hsn_code_id',
          new FormControl(x?.MASTER_PRODUCT?.hsn_code_id || null)
        );
        obj.addControl(
          'uom_name',
          new FormControl(x?.MASTER_PRODUCT?.MASTER_UOM?.uom_name || null)
        );

        return obj;
      })
    );
  }

  productList: any = [];
  getAllproduct() {
    try {
      this.$crm.getAllproduct().subscribe(
        (response: any) => {
          if (response) {
            this.productList = response.data;
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

  selectProduct(data: any, index: any) {
    let currentList = this.addDoform?.value?.productDetailList;
    let productObj = this.productList?.find((elem: any) => elem?.id == data);

    // varient list create start
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
      // variant_id: productObj?.variant_id,
      product_code: productObj?.product_code,
      product_varient_list: productVarientList,

      // variant_id: '',
      product_description: '',
      uom_name: '',
      uom_id: '',
      price_per_unit: '',
    };
    this.addDoform.patchValue({
      productDetailList: currentList,
    });
  }

  generateProductVarient(data: any, index: any) {
    let currentList = [...this.addDoform?.value?.productDetailList];

    // Varient object generate start
    let varientObj: any = {};
    this.productList?.map((item: any) => {
      item?.product_variant_masters?.map((subItem: any) => {
        if (subItem?.id == data) {
          varientObj = subItem;
        }
      });
    });
    // Varient object end

    // handle duplicate entry start
    let isDuplicate = true;
    if (currentList?.length > 1) {
      let newList = currentList.slice();
      if (currentList && currentList.length > 1) newList.splice(index, 1);
      newList?.map((item: any) => {
        if (item.variant_id == data) {
          isDuplicate = false;
          // this.toast.error('This variant has been already added.')
        }
      });
    }
    // handle duplicate entry end

    currentList[index] = {
      ...currentList[index],
      variant_id: isDuplicate ? varientObj?.id : '',
      product_description: isDuplicate ? varientObj?.product_description : '',
      uom_name: isDuplicate ? varientObj?.tbl_uom?.uom_name : '',
      uom_id: isDuplicate ? varientObj?.uom_id : '',
      price_per_unit: isDuplicate ? varientObj?.price_per_unit : '',
      maximum_discount: isDuplicate ? varientObj?.maximum_discount : '',
    };
    this.addDoform.patchValue({
      productDetailList: currentList,
    });
    this.productColculation();
  }

  productColculation() {
    let formObj = this.addDoform?.value;
    let currentList = this.addDoform?.value?.productDetailList;
    if (currentList?.length) {
      let total_cost = 0;
      let taxable_value = 0;
      let discount = 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;
      let grant_total = 0;

      currentList?.map((item: any) => {
        if (item?.qty) {
          total_cost = total_cost + item?.qty * item?.price_per_unit;
        } else {
          total_cost = total_cost + Number(item?.price_per_unit);
        }

        if (item?.discount_approved) {
          discount =
            discount +
            (item?.qty
              ? (item?.qty * item?.price_per_unit * item?.discount_approved) /
                100
              : (item?.price_per_unit * item?.discount_approved) / 100);
        } else {
          discount =
            discount +
            (item?.qty
              ? (item?.qty * item?.price_per_unit * item?.maximum_discount) /
                100
              : (item?.price_per_unit * item?.maximum_discount) / 100);
        }

        if (item?.gst_type == 'CGST/SGST') {
          cgst = cgst + (item?.qty * item?.price_per_unit * item?.cgst) / 100;
          sgst = sgst + (item?.qty * item?.price_per_unit * item?.sgst) / 100;
        } else {
          igst = igst + (item?.qty * item?.price_per_unit * item?.igst) / 100;
        }
      });
      taxable_value =
        taxable_value +
        (total_cost + Number(formObj?.additional_charges)) -
        discount;
      grant_total = taxable_value + cgst + sgst + igst;
      this.addDoform.patchValue({
        total_cost: total_cost?.toFixed(2),
        discount: discount.toFixed(2),
        taxable_value: taxable_value.toFixed(2),
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        igst: igst.toFixed(2),
        grant_total: grant_total.toFixed(2),
      });
    }
  }
  // Product colculation end

  // to restrict user from entering strings
  keyPress(event: Event | any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  qtyCheck(event: any, index: number) {
    const key = event.key;
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
      return;
    }
    if (!this.CF_1 || !this.CF_1.productDetailList) return;

    const productDetailList = this.CF_1.productDetailList as FormArray;
    const productFormGroup = productDetailList.at(index) as FormGroup;
    if (!productFormGroup) return;

    const remainingQty = productFormGroup.get('remaining_quantity')?.value || 0;

    let inputValue = event.target.value + key;
    let enteredQty = parseInt(inputValue, 10);

    if (enteredQty > remainingQty) {
      event.preventDefault();
      this._toaster.warning(
        'Delivery quantity should not exceed remaining quantity!'
      );
    }
  }

  selectGstType(index: any) {
    let currentList = this.addDoform?.controls?.['productDetailList']?.value;
    currentList[index] = {
      ...currentList[index],
      cgst: null,
      sgst: null,
      igst: null,
    };
    this.addDoform.patchValue({
      productDetailList: currentList,
    });
    this.addDoform.patchValue({
      cgst: 0,
      sgst: 0,
      igst: 0,
    });
  }

  setAllData(obj: any) {
    // handle variant start
    let productDetailList = obj?.productDetailList;
    if (productDetailList) {
      this.productList?.map((item: any) => {
        productDetailList?.map((subSubItem: any) => {
          if (subSubItem?.product_master_id == item?.id) {
            subSubItem.product_varient_list = item.product_variant_masters;
          }
        });
      });
      this.CF_1.productDetailList = this.patchData(productDetailList);
    }
    // handle variant end
    this.addDoform.patchValue({
      proposal_type: obj?.proposal_type,
      company_name: obj?.company_name,
      contact_person_name: obj?.contact_person_name,
      contact_number: obj?.contact_number,
      mail_id: obj?.mail_id,
      address: obj?.address,
      gst_no: obj?.gst_no,

      total_cost: obj?.total_cost,
      additional_charges: obj?.additional_charges ? obj?.additional_charges : 0,
      discount: obj?.discount,
      taxable_value: obj?.taxable_value,
      // sgst: obj?.sgst,
      // cgst: obj?.cgst,
      // igst: obj?.igst,
      grant_total: obj?.grant_total,
    });
    this.addDoform.patchValue({ total_cost: obj?.total_cost });

    this.addDoform.patchValue({ proposal_no: obj?.proposal_no });
  }
  imageToUpload: any;
  imageUrl: any;
  imagePath: any;
  uploadDoc(evemt: any) {
    let isValidExtension = this.$common.checkForValidFile(evemt);
    if (!isValidExtension) return;

    let data = '';
    if (evemt.target.files && evemt.target.files[0]) {
      data = evemt.target.files[0];
    }

    var formData: any = new FormData();
    formData.append('file', data);
    this.$crm.uploadDoc(formData).subscribe(
      (res: any) => {
        this.imageUrl = res?.backendUrl;
        // this.handleViewImg = false;
      },
      (err) => {
        if (err.status == 400) {
          this._toaster.error('Something went Wrong');
        } else if (err.status == 403) {
          this._toaster.error('Already Exits!');
        } else {
          this._toaster.error('Something went Wrong');
        }
      }
    );
  }

  ngSubmitform(data: any) {
    if (this.addDoform.invalid) {
      return this._toaster.error('Mandatory fields should not be empty!');
    }

    const productDetailList = this.addDoform.get(
      'productDetailList'
    ) as FormArray;

    const totalQty = productDetailList.controls.reduce((sum, fg) => {
      const qty = fg.get('qty')?.value || 0;
      return sum + Number(qty);
    }, 0);

    if (totalQty <= 0) {
      return this._toaster.error(
        'Total delivery quantity must be greater than 0!'
      );
    }

    let addDO = {
      ...data,
      proposal_id: this.proposal_id,
      states_code: this.selectedStateCode,
      upload_file: this.imageUrl,
      do_date: moment(data.do_date).format('YYYY-MM-DD'),
    };

    this.salesService.createAddDoData(addDO).subscribe(
      (res: any) => {
        if (res) {
          this._toaster.success(res.message);
          this.router.navigate(['/master/sales/sales-order-list']);
        }
      },
      (err: any) => {
        this._toaster.error(err.error.message);
      }
    );
  }

  getAllActiveProduct(event: any, index: any) {
    this.$productionService
      .getAllActiveProduct(event.value ?? event, this.entityId)
      .subscribe((res: any) => {
        this.productData[index] = res.data;
      });
  }
  getAllCategory() {
    this.$productionService
      .getAllCetegory(this.entityId)
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
        (err: any) => {}
      );
  }

  transTypeList: any = [];
  getAllActiveTransType() {
    try {
      this.$crm.getAllActiveTransType().subscribe(
        (response: any) => {
          if (response) {
            this.transTypeList = response.data;
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
  branchList: any = [];
  branchSetup_get() {
    try {
      this.$crm.branchSetup_get().subscribe(
        (response: any) => {
          if (response) {
            this.branchList = response.data;
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
  checkApplicableGst() {
    const branchId = this.addDoform.get('branch_id')?.value;
    this.selectedBranchStateId = this.branchList.find(
      (c: any) => c.id == branchId
    )?.MASTER_STATE?.states_id;
  }
  stateChange(e: any) {
    const selectedStateId = e.value;
    console.log(this.selectedBranchStateId, selectedStateId);
    if (this.selectedBranchStateId == selectedStateId) {
      this.isSameState = true;
    } else {
      this.isSameState = false;
    }
    const selectedState = this.stateList.find(
      (state: any) => state.states_id === selectedStateId
    );
    if (selectedState) {
      this.selectedStateCode = selectedState.states_code;
      console.log('yessssssssssssssssssss', this.selectedStateCode);
    }
  }
  stateList: any = [];
  getStatesByCountryId(countryId: any) {
    this.travelReqService
      .getstatesbycountryid(countryId)
      .subscribe((res: any) => {
        if (res && res?.data) {
          this.stateList = res.data;
          this.states1 = this.stateList.map((item: any) => item.states_name);
        }
      });
  }
  stateSearch1(e: any) {
    const aa = e;
    let filteredVariable = this.stateList.filter((item: any) =>
      aa.includes(item.states_name)
    );
    this.stateList = filteredVariable;
  }
}
