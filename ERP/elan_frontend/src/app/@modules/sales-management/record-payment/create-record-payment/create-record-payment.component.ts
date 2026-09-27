import { Component } from '@angular/core';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-create-record-payment',
  templateUrl: './create-record-payment.component.html',
  styleUrls: ['./create-record-payment.component.scss']
})
export class CreateRecordPaymentComponent {
  recordPaymentFormGroup: FormGroup;
  selectedCategory: any = null;
  selectedItemCode: any = null;
  selectedItem: any = null;
  assignAction: any;
  selectedbank:any;
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
  bankBankList: any;

  constructor(
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _finaceservice: FinaceService,
    private fb: FormBuilder,
    private route: Router,
  ) {
    this.recordPaymentFormGroup = this.fb.group({
      customer: ['', Validators.required],
      createDate: ['', Validators.required],
      reference_invoice_number: ['',Validators.required],
      category: ['', Validators.required],
      payment_receive_mode: ['',Validators.required],
      items: this.fb.array([this.createItemFormGroup()]),
      bank: ['', Validators.required],
      bank_account: ['', Validators.required],
      cheque_number: ['', Validators.required],
      total_amount: ['', Validators.required],
      advance_received: ['', Validators.required],
      amount_due: ['', Validators.required],
      amount_paid: ['', Validators.required],
      additionalDetails: [''],
      terms: [''],
      remarks: [''],
    });
  }
  get items() {
    return this.recordPaymentFormGroup.get('items') as FormArray;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      payment_reference: ['', Validators.required],
      document_number: [{ value: this.newCodeVal, disabled: true }],
      total: ['', Validators.required],
      out_standing: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }
  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }
  onSubmit() {
    console.log(this.recordPaymentFormGroup.value);
  }

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    const signInUserData = localStorage.getItem('signInUser');
    this.assignAction = this._rbackService.accessAssignAction();

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }

    this.getCoustomersList();
    this.getemployeeList();
    this.getItemCategoryList();
    this.getItemsList();
    this.getBankAccount();
  }

  getBankAccount(){
    this._finaceservice.getCashInBankCOA(this.entityId).subscribe((res:any)=>{
      this.bankBankList = res.data;
    })
  }

  getItemsList() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
      this.itemsList1 = this.itemsList.map((res: any) => res.item_name);
      this.itemsList2 = this.itemsList;
      console.log(this.itemsList, 'All Items List');
    });
  }
  itemSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.itemsList2.filter((item: any) =>
      tempVal.includes(item.item_name)
    );
    this.itemsList = filteredVariable;
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
        console.log(this.customersList, 'All Customers List');
      });
  }
  customerSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.customersList2.filter((item: any) =>
      tempVal.includes(item.business_name)
    );
    this.customersList = filteredVariable;
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
        console.log(this.employeeList, 'All Employees List');
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
        console.log(this.itemCategoryList, 'All Item Category List');
      });
  }
  categorySearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.itemCategoryList2.filter((item: any) =>
      tempVal.includes(item.asset_category_name)
    );
    this.itemCategoryList = filteredVariable;
  }

  back(){
    this.route.navigate(['master/sales-management/record-payments'])
  }
}


