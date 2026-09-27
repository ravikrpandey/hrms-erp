import { Component } from '@angular/core';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-create-sales-invoice',
  templateUrl: './create-sales-invoice.component.html',
  styleUrls: ['./create-sales-invoice.component.scss'],
})
export class CreateSalesInvoiceComponent {
  salesInvoiceFormGroup: FormGroup;
  selectedCategory: any = null;
  selectedItemCode: any = null;
  selectedItem: any = null;
  assignAction: any;
  invoiceDocCode: string = '';
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
  proformaList: any;
  view: any;
  proformaCodeId: Number;
  proforma_id: Number;

  isChecked: boolean = true;
  baseUrl: any;
  sales_created: any = 0;

  constructor(
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private fb: FormBuilder,
    private route: Router,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private activeRouter: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.baseUrl = environment.servralUrl;
    this.salesInvoiceFormGroup = this.fb.group({
      business_name: [''],
      shiped_customer: [''],
      create_date: [''],
      delivery_date: [''],
      proforma_id: [''],
      employee_name: [''],
      asset_category_name: ['', [Validators.required]],
      // ship_to_customer_name: [''],
      items: this.fb.array([this.createItemFormGroup()]),
      tax_temp: [''],
      rate: [''],
      tax_amount: [''],
      delivery: [''],
      delivery_days: [''],
      charges_amount: [''],
      due_charges: ['', [Validators.required, Validators.min(0)]],
      payment_due_days: ['', [Validators.required]],
      grand_total: [''],
      details_photo: [''],
      isChecked: ['true'],
      terms: [''],
      remarks: [''],
    });

    this.invoiceDocCode = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
  }
  get items() {
    return this.salesInvoiceFormGroup.get('items') as FormArray;
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
        this.salesInvoiceFormGroup.patchValue({ details_photo: null });
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
    if (this.salesInvoiceFormGroup.invalid) {
      Object.keys(this.salesInvoiceFormGroup.controls).forEach(
        (controlName) => {
          const control = this.salesInvoiceFormGroup.get(controlName);
          if (control && control.invalid) {
          }
        }
      );
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    if (this.sales_created == 1) {
      return this.toast.error(
        'Sales invoice already exists for this proforma.'
      );
    }
    let user_id = localStorage.getItem('EmpMainId');
    let dept = localStorage.getItem('department_id');
    let formData = this.salesInvoiceFormGroup.value;
    let proformaData: any = {
      invoice_doc_code: this.invoiceDocCode,
      department_id: dept,
      entity_id: this.entityId,
      proforma_id: this.proformaCodeId,
      supply_now: formData.isChecked,
      sales_invoice_create_date: formData.create_date,
      user_id: user_id,
      payment_due_days: formData.payment_due_days,
      due_charges: formData.due_charges,
      details_photo: this.details_photo ? this.details_photo : null,
    };
    this.salesManagementService
      .createSalesInvoice(this.proF_id, proformaData)
      .subscribe({
        next: (res) => {
          this.toast.success('Sales invoice created sucessfully');
          this.back();
        },
        error: (err) => {
          this.toast.error(err.error.message);
        },
      });
  }

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    const signInUserData = localStorage.getItem('signInUser');
    this.assignAction = this._rbackService.accessAssignAction();

    let saleInvoiceId;
    this.activeRouter.queryParams.subscribe((res: any) => {
      saleInvoiceId = res.id;
      this.view = res.view;
      if (this.view) {
        this.salesInvoiceFormGroup.disable();
      } else {
        this.salesInvoiceFormGroup.enable();
      }
      this.proforma_id = parseInt(res.proforma_id);
    });
    if (this.proforma_id) {
      this.selectedProforma(this.proforma_id);
      this.salesInvoiceFormGroup
        .get('proforma_id')
        ?.patchValue(this.proforma_id);
    }

    if (saleInvoiceId) {
      this.viewSaleInvoice(saleInvoiceId);
    }
    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    this.salesInvoiceFormGroup.patchValue({
      create_date: this.now,
    });

    this.getCoustomersList();

    this.getProformaDocCode(this.entityId);
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
    this.route.navigate(['master/sales-management/sales']);
  }

  /////////////////
  quotationItemList: any = [];
  proformaDocCodeList: any = [];
  discountType: any[] = ['Rate', 'Fixed'];
  getProformaDocCode(entityId: any) {
    this.salesManagementService.getProformaDocCode(entityId).subscribe({
      next: (res: any) => {
        this.proformaDocCodeList = res.data;
      },
    });
  }

  selectedProforma(quotation_id: any) {
    this.salesManagementService
      .getApprovedProformaDetailById(quotation_id)
      .subscribe({
        next: (res: any) => {
          this.sales_created = res.data[0].sales_created;
          const { details_photo, create_date, ...otherData } = res.data[0];
          // this.details_photo = details_photo;//// this image is part of proforma so it will not be patched at sales invoice
          this.salesInvoiceFormGroup.patchValue(otherData);
          this.getApprovedQuotationItemDetailById(res.data[0].quotation_id);
          this.proformaCodeId = res.data[0].id;
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
  restrictNegative(event: KeyboardEvent) {
    const key = event.key;

    if (key === '-' || key === 'e') {
      event.preventDefault();
    }
  }

  toggle(event: any, isChecked: boolean) {}
  isView: boolean = false;
  viewSaleInvoice(id: any) {
    this.salesManagementService.getSaleInvoiceById(id).subscribe({
      next: (res: any) => {
        let data = res.data[0];
        this.invoiceDocCode = data.invoice_doc_code;
        // this. = data.proforma_doc_code;
        this.salesInvoiceFormGroup.patchValue({
          proforma_id: data.proforma_id,
          business_name: data.business_name,
          // ship_to_customer_name: data.ship_to_customer_name,
          create_date: data.sales_invoice_create_date,
          delivery_date: data.delivery_date,
          employee_name: data.employee_name,
          asset_category_name: data.asset_category_name,

          tax_temp: data.tax_temp,
          rate: data.rate,
          tax_amount: data.tax_amount,
          delivery: data.delivery,
          delivery_days: data.delivery_days,
          charges_amount: data.charges_amount,
          due_charges: data.due_charges,
          payment_due_days: data.payment_due_days,
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
