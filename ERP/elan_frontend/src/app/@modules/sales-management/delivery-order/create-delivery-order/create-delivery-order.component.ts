import { Component } from '@angular/core';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';

@Component({
  selector: 'app-create-delivery-order',
  templateUrl: './create-delivery-order.component.html',
  styleUrls: ['./create-delivery-order.component.scss'],
})
export class CreateDeliveryOrderComponent {
  deliveryFormGroup: FormGroup;
  selectedCategory: any = null;
  selectedItemCode: any = null;
  selectedItem: any = null;
  assignAction: any;
  deliveryQty:any;
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
  delivery_doc_code: string;
  baseUrl: any;
  getPatchData: any;
  view: any;
  edit: any;
  warehouseList: any = [1, 2, 3, 4];
  itemsdata: any = [];
  warehouseList1: any = [];
  warehouseList2: any = [];
  mainEmpId: string | null;
  departmentList: any = [];
  patchedCustomerDataId: any;
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  approvedSalesList: any = [];
  salesDetails: any;
  department_id: string | null;
  sales_id: Number;
  delivery_created: any=0;
  financialYearId: string | null;

  constructor(
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private inventoryService: InventoryManagementService,
    private _empRegistration: EmpRegistrationService
  ) {
    this.baseUrl = environment.servralUrl;

    this.deliveryFormGroup = this.fb.group({
      quotation_id :[''],
      ref_invoice_no: [''],
      sales_id_invoice: [''],
      delivery_doc_code: [''],
      customer_name: [''],
      create_date: ['', Validators.required],
      source_warehouse_id: ['', Validators.required],
      department_id: [''],
      items: this.fb.array([]),
      shipping_address: [''],
      city: [''],
      state: [''],
      pincode: [''],
      country: [''],
      receiving_person_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z\\s]+'),
      ]),
      receiving_person_contact: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
      transport: ['', Validators.required],
      vehicle_number: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]*$'),
      ]),
      driver: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z\\s]+'),
      ]),
      driver_contact_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
      remarks: [''],
      upload_photo: [''],
    });
  }
  get items() {
    return this.deliveryFormGroup.get('items') as FormArray;
  }

  createItemFormGroup(item: any = {}): FormGroup { 
    return this.fb.group({
      item_name: [item.item_name || ''],
      item_id: [item.item_id || ''],
      item_code: [item.item_code || ''],
      uom: [item.uom || ''],
      quantity: [item.quantity || ''],
      deliveryQty: [item.deliveryQty || '']
    });
  }

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    const signInUserData = localStorage.getItem('signInUser');
    this.assignAction = this._rbackService.accessAssignAction();
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.department_id = localStorage.getItem('department_id');
    this.financialYearId = localStorage.getItem('financial_id');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    this.activeroute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.view = res.view;
        this.edit = res.edit;
        if (this.view) {
          this.deliveryFormGroup.disable();
        } else {
          this.deliveryFormGroup.enable();
        }
        this.getDeliveryRecordByID(res.id, this.entityId);
      }
      this.sales_id = parseInt(res.sales_id);
    });
    if (this.sales_id) {
      // this.getApprovedSalesInvoiceDetailById(this.sales_id);
      this.getApprovedSalesInvoiceDetailById({ value: this.sales_id });
      this.deliveryFormGroup.get('sales_id_invoice')?.patchValue(this.sales_id);
    }
    this.delivery_doc_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();

    this.deliveryFormGroup.patchValue({
      delivery_doc_code: this.delivery_doc_code,
      create_date: this.now,
    });

    this.getDepartmentList();
    this.getApprovedSales(this.entityId);
    this.getemployeeList();
    this.getItemCategoryList();
    this.getItemsList();
    this.getAllWarehouseList();
  }

  getDeliveryRecordByID(id: any, entity_id: any) {
    this.salesManagementService
      .getDeliveryById(id, entity_id)
      .subscribe((res: any) => {
        if (res) {
          this.getPatchData = res.data;
          this.getApprovedSalesInvoiceDetailById({
            value: this.getPatchData.sales_id_invoice,
          });
          const { upload_photo, ...otherData } = res.data;
          this.deliveryFormGroup.patchValue(otherData);

          this.upload_photo = upload_photo;
        }
      });
  }
  getApprovedSalesInvoiceDetailById(e: any) {
    this.salesManagementService
      .getApprovedSalesInvoiceDetailById(e.value)
      .subscribe((res: any) => {
        this.salesDetails = res?.data[0];
        this.delivery_created=res.data[0].delivery_created
        this.deliveryFormGroup.patchValue({
          shipping_address: this.salesDetails.shipping_address,
          city: this.salesDetails.city_name,
          state: this.salesDetails.states_name,
          pincode: this.salesDetails.shipping_zip_code,
          country: this.salesDetails.countryss_name,
          customer_name: this.salesDetails.customer_name,
          ref_invoice_no: this.salesDetails.invoice_doc_code,
        });
        this.getItemsData(this.salesDetails.quotation_id);
      });
  }

  getAllWarehouseList() {
    this.inventoryService
      .getAllACtiveWarehouseList(this.entityId,this.financialYearId)
      .subscribe((response: any) => {
        this.warehouseList = response.data;
        this.warehouseList1 = this.warehouseList.map((res: any) => res.name);
        this.warehouseList2 = this.warehouseList;
      });
  }
  warehouseSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.warehouseList2.filter((item: any) =>
      tempVal.includes(item.name)
    );
    this.warehouseList = filteredVariable;
  }

  onVehicleNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    this.deliveryFormGroup
      .get('vehicle_number')
      ?.setValue(input.value, { emitEvent: false });
  }

  getItemsList() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
      this.itemsList1 = this.itemsList.map((res: any) => res.item_name);
      this.itemsList2 = this.itemsList;
    });
  }
  itemSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.itemsList2.filter((item: any) =>
      tempVal.includes(item.item_name)
    );
    this.itemsList = filteredVariable;
  }
  getApprovedSales(id: any) {
    this.salesManagementService
      .getApprovedSalesInvoice(id)
      .subscribe((res: any) => {
        this.approvedSalesList = res?.data.reverse();
      });
  }

  getItemsData(id: any) {
    this.salesManagementService.getItemsDataById(id).subscribe((res: any) => {
      this.itemsdata = res?.data;
      this.items.clear();
      this.deliveryFormGroup.get('quotation_id')?.setValue(id);
      this.itemsdata.forEach((element:any) => {
        const itemFormGroup = this.createItemFormGroup(element);
        this.items.push(itemFormGroup);
      });
    });
  }

  getemployeeList() {
    this._empService
      .grtEmployeeList(this.entityId, this.getUserRole)
      .subscribe((res: any) => {
        this.employeeList = res.data;
        this.employeeList1 = this.employeeList.map(
          (res: any) => res.first_name + res.middle_name + res.last_name
        );
        this.employeeList2 = this.employeeList;
      });
  }
  employeeSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.employeeList2.filter((item: any) =>
      tempVal.includes(item.first_name + item.middle_name + item.last_name)
    );
    this.employeeList = filteredVariable;
  }
  getItemCategoryList() {
    this._configurationalMasterService
      .getAssetMasterList()
      .subscribe((res: any) => {
        this.itemCategoryList = res.data;

        this.itemCategoryList1 = this.itemCategoryList.map(
          (res: any) => res.asset_category_name
        );
        this.itemCategoryList2 = this.itemCategoryList;
      });
  }
  categorySearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.itemCategoryList2.filter((item: any) =>
      tempVal.includes(item.asset_category_name)
    );
    this.itemCategoryList = filteredVariable;
  }

  back() {
    this.deliveryFormGroup.reset();
    this.upload_photo = null;
    this.router.navigate(['master/sales-management/delivery-order']);
  }
  upload_photo: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.deliveryFormGroup.patchValue({ upload_photo: null });
        return (this.upload_photo = '');
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.upload_photo = `uploaded_files/${response?.url}`;
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
    window.open(this.baseUrl + '/' + this.upload_photo, '_blank');
  }
  getDepartmentList() {
    // this._configurationalMasterService.getDepartmentAll(this.entityId).subscribe((res: any) => {
    //   this.departmentList = res.data.filter((department: any) => department.dept_id == 127);
    //   this.deliveryFormGroup.patchValue({
    //     department_id: this.departmentList[0].dept_id,
    //   });
    // })
    this._configurationalMasterService
      .getDepartmentAll(this.entityId)
      .subscribe((res: any) => {
        this.departmentList = res.data;
        const departmentList = res.data.find(
          (department: any) => department.dept_id == this.department_id
        );
        this.deliveryFormGroup.patchValue({
          department_id: departmentList?.dept_id,
        });
      });
  }

  onSubmit() {
    if (this.deliveryFormGroup.invalid) {
      Object.keys(this.deliveryFormGroup.controls).forEach((controlName) => {
        const control = this.deliveryFormGroup.get(controlName);
        if (control && control.invalid) {
        }
      });
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    // if(this.delivery_created==1){
    //   return this.toast.error('Delivery order already exists for this sales invoice.'); 
    // }
    let val: any = this.deliveryFormGroup.value;
    let req = {
      ...val,
      upload_photo: this.upload_photo ? this.upload_photo : null,
      entity_id: this.entityId,
      sales_rep_id: this.mainEmpId,
    };
    this.salesManagementService.createDeliveryOrder(req).subscribe(
      (res: any) => {
        if (res) {
          this.toast.success(res.message);
          this.router.navigate(['/master/sales-management/delivery-order']);
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }
}
