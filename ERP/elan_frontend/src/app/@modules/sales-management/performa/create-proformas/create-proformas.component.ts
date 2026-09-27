import { Component, ViewChild } from '@angular/core';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
@Component({
  selector: 'app-create-proformas',
  templateUrl: './create-proformas.component.html',
  styleUrls: ['./create-proformas.component.scss'],
})
export class CreateProformasComponent {
  proformaFormGroup: FormGroup;
  selectedCategory: any = null;
  selectedItemCode: any = null;
  selectedItem: any = null;
  assignAction: any;
  proformaDocCode: string = '';
  entityId: any;
  customersList: any;
  customersList1: any = [];
  customersList2: any = [];
  now = new Date();
  getUserRole: any;
  employeeList: any;
  employeeList1: any;
  employeeList2: any;
  itemCategoryList: any;
  itemCategoryList2: any;
  itemCategoryList1: any;
  itemsList: any;
  itemsList2: any;
  itemsList1: any;
  newCodeVal: any;
  quotation_id: Number;

  quotationCode: Number;
  @ViewChild('quotationSelect') quotationSelect: MatSelect;
  view: any;
  baseUrl: any;
  proforma_created: any = 0;
  constructor(
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private fb: FormBuilder,
    private route: Router,
    private toast: ToastrService,
    private activeRouter: ActivatedRoute
  ) {
    this.baseUrl = environment.servralUrl;

    this.proformaFormGroup = this.fb.group({
      business_name: [''],
      // shiped_customer: ['', Validators.required],
      create_date: [''],
      deleveryDate: ['', Validators.required],
      employee_name: [''],
      asset_category_name: ['', Validators.required],
      // quotation_doc_code: [''],
      items: this.fb.array([this.createItemFormGroup()]),
      tax_temp: [''],
      rate: [''],
      tax_amount: [''],
      delivery: [''],
      delivery_days: [''],
      charges_amount: [''],
      discount_type: [''],
      discount_amount: [''],
      grand_total: [''],
      details_photo: [''],

      terms: [''],
      remarks: [''],
    });

    this.proformaDocCode = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
  }
  get items() {
    return this.proformaFormGroup.get('items') as FormArray;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      itemName: [''],
      itemCode: [{ value: this.newCodeVal, disabled: true }],
      quantity: [''],
      price: [''],
      tax: [''],
      discount: [''],
      totalDiscount: [''],
      amount: [''],
    });
  }
  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  ///////////
  details_photo: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.proformaFormGroup.patchValue({ details_photo: null });
        return (this.details_photo = '');
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.details_photo = `uploaded_files/${response?.url}`;
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

  viewImg() {
    window.open(this.baseUrl + '/' + this.details_photo, '_blank');
  }
  ///////////

  proF_id: any;
  onSubmit() {
    if (this.proformaFormGroup.invalid) {
      Object.keys(this.proformaFormGroup.controls).forEach((controlName) => {
        const control = this.proformaFormGroup.get(controlName);
        if (control && control.invalid) {
        }
      });
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    if (this.proforma_created == 1) {
      return this.toast.error('Proforma already exists for this quotation.');
    }
    let user_id = localStorage.getItem('EmpMainId');
    let dept = localStorage.getItem('department_id');
    let formData = this.proformaFormGroup.value;

    let proformaData: any = {
      proforma_doc_code: this.proformaDocCode,
      delivery_date: formData?.deleveryDate,
      proforma_create_date: formData?.create_date,
      department_id: dept,
      user_id: user_id,
      entity_id: this.entityId,
      quotation_id: this.quotationCode,
      details_photo: this.details_photo ? this.details_photo : null,
    };

    this.salesManagementService
      .createProforma(proformaData, this.proF_id)
      .subscribe({
        next: (res) => {
          if (res) {
            this.toast.success('Proforma created successfully');
          }
          this.back();
        },
        error: (err) => {
          // Use an arrow function to bind the correct `this`
          this.toast.error(err.error.message);
        },
      });
  }
  ngAfterViewInit() {
    if (this.quotation_id) {
      this.quotationSelect.value = this.quotation_id;
    }
  }
  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    const signInUserData = localStorage.getItem('signInUser');
    this.assignAction = this._rbackService.accessAssignAction();
    let proformaId: any;
    this.activeRouter.queryParams.subscribe((res: any) => {
      proformaId = res.id;
      this.view = res.view;
      if (this.view) {
        this.proformaFormGroup.disable();
      } else {
        this.proformaFormGroup.enable();
      }
      this.quotation_id = parseInt(res.quotation_id);
    });
    if (this.quotation_id) {
      this.selectedQuotation(this.quotation_id);
    }

    if (proformaId) {
      this.viewProforma(proformaId);
    }
    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    this.proformaFormGroup.patchValue({
      create_date: this.now,
    });

    this.getCoustomersList();
    let entityId = localStorage.getItem('selectedEntityId');
    this.getQuotationDocCode(entityId);
  }

  getCoustomersList() {
    this.salesManagementService
      .getAllActiveSuperUser(this.entityId)
      .subscribe((data: any) => {
        this.customersList = data.data;
        this.customersList1 = this.customersList.map(
          (res: any) => res.business_name
        );
        this.customersList2 = this.customersList;
      });
  }
  customerSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.customersList2.filter((item: any) =>
      tempVal.includes(item.business_name)
    );
    this.customersList = filteredVariable;
  }

  back() {
    this.route.navigate(['master/sales-management/proforma']);
  }

  /////////////////
  quotationItemList: any = [];
  quotationDocCodeList: any = [];
  discountType: any[] = ['Rate', 'Fixed'];
  getQuotationDocCode(entityId: any) {
    this.salesManagementService.getQuotationDocCode(entityId).subscribe({
      next: (res: any) => {
        this.quotationDocCodeList = res.data;
      },
    });
  }

  selectedQuotation(quotation_id: any) {
    this.salesManagementService
      .getApprovedQuotationDetailById(quotation_id)
      .subscribe({
        next: (res: any) => {
          this.proforma_created = res.data[0].proforma_created;
          const { details_photo, create_date, ...otherData } = res.data[0];
          // this.details_photo = details_photo;//// this image is part of quotation so it will not be patched at proforma
          this.proformaFormGroup.patchValue(otherData);
          this.getApprovedQuotationItemDetailById(quotation_id);
          this.quotationCode = quotation_id;
        },
      });
  }
  getApprovedQuotationItemDetailById(quotation_id: any) {
    this.salesManagementService
      .getApprovedQuotationItemDetailById(quotation_id)
      .subscribe({
        next: (res: any) => {
          this.quotationItemList = res.data;
        },
      });
  }
  isView: boolean = false;
  viewProforma(id: any) {
    this.salesManagementService.viewProforma(id).subscribe({
      next: (res: any) => {
        let data = res.data[0];
        this.proformaDocCode = data.proforma_doc_code;
        this.quotationSelect.value = data.quotation_id;

        this.proformaFormGroup.patchValue({
          // quotation_doc_code:data.quotation_id,
          business_name: data.business_name,
          // shiped_customer: data.customer_id,
          create_date: data.proforma_create_date,
          deleveryDate: data.delivery_date,
          employee_name: data.employee_name,
          asset_category_name: data.asset_category_name,

          tax_temp: data.tax_temp,
          rate: data.rate,
          tax_amount: data.tax_amount,
          delivery: data.delivery,
          delivery_days: data.delivery_days,
          charges_amount: data.charges_amount,

          grand_total: data.grand_total,

          terms: data.terms,
          remarks: data.remarks,
        });
        const { photo, ...otherData } = data;
        this.details_photo = photo;
        this.getApprovedQuotationItemDetailById(data.quotation_id);
        this.isView = true;
      },
    });
  }
}
