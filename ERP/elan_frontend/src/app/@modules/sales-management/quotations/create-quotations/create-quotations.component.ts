import { Component, ViewChild } from '@angular/core';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DecimalPipe } from '@angular/common';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-create-quotations',
  templateUrl: './create-quotations.component.html',
  styleUrls: ['./create-quotations.component.scss'],
  providers: [DecimalPipe],
})
export class CreateQuotationsComponent {
  quotationFormGroup: FormGroup;
  selectedCategory: any = null;
  selectedItem: any = null;
  assignAction: any;
  baseUrl: any;
  temp_items_array: any[] = [];
  entityId: any;
  customerTypeList: any = [];
  customersList: any;
  customersList1: any = [];
  customersList2: any = [];
  itemsListForCode1: any = [];
  itemsListForCode2: any = [];
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
  formMappedData1: any = [];
  formMappedData2: any = [];
  quotation_doc_code: string;
  quotationCodeId: any;
  discount: number = 0;
  quantity: number = 1;
  view: any;
  edit: any;
  getPatchData: any;
  mainEmpId: string | null;
  departmentList: any;
  displayedColumns: string[] = ['item_code', 'item_name', 'action'];
  dataSource: MatTableDataSource<any>;
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  noMatchFound: boolean = false;
  customerTypeList1: any;
  customerTypeList2: any;
  categoryMatchingItems: any = [];
  department_id: any;
  constructor(
    private salesManagementService: SalesManagementService,
    private _empService: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private fb: FormBuilder,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private decimalPipe: DecimalPipe
  ) {
    this.baseUrl = environment.servralUrl;

    this.quotationFormGroup = this.fb.group({
      quotation_doc_code: ['', Validators.required],
      customer_id: ['', Validators.required],
      customer_type_id: ['', Validators.required],
      create_date: ['', Validators.required],
      sales_rep_id: ['', Validators.required],
      department_id: ['', Validators.required],
      category_id: ['', Validators.required],
      items: this.fb.array([]),
      tax_temp: [''],
      rate: [''],
      tax_amount: [''],
      delivery: [''],
      delivery_days: [''],
      charges_amount: [''],
      grand_total: [''],
      details_photo: [''],
      terms: [''],
      remarks: ['', [Validators.required, noLeadingSpaces()]],
    });
  }

  ngOnInit() {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.department_id = localStorage.getItem('department_id');

    const signInUserData = localStorage.getItem('signInUser');
    this.assignAction = this._rbackService.accessAssignAction();

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }

    this.activeroute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.quotationCodeId = res.id;
        this.view = res.view;
        this.edit = res.edit;
        if (this.view) {
          this.quotationFormGroup.disable();
        } else {
          this.quotationFormGroup.enable();
        }
        this.getQuotationRecordByID(res.id, this.entityId);
      }
    });
    this.quotationFormGroup?.get('items')?.valueChanges.subscribe(() => {
      this.calculateTotalTax();
      this.calculateGrandTotal();
    });
    this.quotationFormGroup
      ?.get('charges_amount')
      ?.valueChanges.subscribe(() => {
        this.calculateGrandTotal();
      });
    this.quotationFormGroup?.get('rate')?.valueChanges.subscribe(() => {
      this.calculateTotalTax();
      this.calculateGrandTotal();
    });

    this.quotation_doc_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();

    this.quotationFormGroup.patchValue({
      quotation_doc_code: this.quotation_doc_code,
      create_date: this.now,
    });
    this.getCoustomersList();
    this.getCustomerType();
    this.getemployeeList();
    this.getItemCategoryList();
    this.getDepartmentList();
  }

  get items() {
    return this.quotationFormGroup.get('items') as FormArray;
  }

  createItemFormGroup(item: any = {}): FormGroup {
    return this.fb.group({
      item_id: [item.item_id || '', Validators.required],
      item_code: [item.item_code || '', Validators.required],
      uom: [item.uom || '', Validators.required],
      quantity: [item.quantity || '', Validators.required],
      price: [item.price || '', Validators.required],
      discount: [item.discount || 0],
      total_discount: [item.total_discount || 0],
      amount: [item.amount || 0],
    });
  }
  openNav() {
    this.navWidth = 700;
    this.getItemsListCatWise();
  }

  closeNav() {
    this.navWidth = 0;
  }
  back() {
    this.router.navigate(['master/sales-management/quotation']);
  }
  onCatChange() {
    this.items.clear();
  }
  arrayList: any = [];
  validateCategorySelection(event: any): void {
    if (!this.quotationFormGroup?.get('customer_type_id')?.value) {
      this.toast.warning('Please Select Customer Type First.');
      this.selectedCategory = null;
      this.quotationFormGroup.get('category_id')?.reset();
      return;
    }
    this.onCatChange();
    this.getItemsListCatWise();
  }
  onCustomerTypeChange(event: any): void {
    this.selectedCategory = null;
    this.quotationFormGroup.get('category_id')?.reset();
  }

  getItemsListCatWise() {
    this._configurationalMasterService.getAllActiveItem().subscribe((res: any) => {
      this.itemsList = res.data;
      const formArrayValues = this.items.getRawValue();
      this.categoryMatchingItems = this.itemsList.filter(
        (item: any) => item.asset_id == this.selectedCategory
      );

      this.arrayList = this.categoryMatchingItems.filter((item: any) => {
        const matchingItem = formArrayValues.find(
          (i: any) => i.item_id == item.id
        );
        return !matchingItem;
      });

      if (this.arrayList.length <= 0) {
        this.totalLength = 0;
        this.updateDataSource(0, 5);
      } else {
        const customerTypeId =
          this.quotationFormGroup.get('customer_type_id')?.value;

        this.arrayList.forEach((item: any) => {
          item.price_amount = null;

          const customerTypeData = item.customerTypeData?.find(
            (data: any) => data.id === customerTypeId
          );

          if (customerTypeData) {
            item.price_amount = customerTypeData.amount;
          } else {
            console.log(
              `No matching customerTypeData found for item: ${item.item_name}`
            );
          }
        });

        this.itemsListForCode1 = res.data;
        this.itemsList1 = this.arrayList.map((res: any) => res.item_name);
        this.itemsListForCode2 = this.arrayList.map((res: any) => res);
        this.itemsList2 = this.arrayList;
        this.totalLength = this.arrayList.length;
        this.updateDataSource(0, 5);
      }
    });
  }

  addToCart() {
    if (!this.selectedItem) {
      alert('No item selected!');
      return;
    }
    const tempItem = {
      item_id: this.selectedItem.id || '',
      item_code: this.selectedItem.item_code || '',
      uom: this.selectedItem.MASTER_UOM.uom_name || '',
      price: parseFloat(this.selectedItem.price_amount),
      quantity: this.quantity,
      discount: this.discount,
      total_discount: this.discount * this.quantity,
      amount: (this.selectedItem.price_amount - this.discount) * this.quantity,
    };

    this.temp_items_array.push(tempItem);
    this.items.push(this.createItemFormGroup(tempItem));
    this.temp_items_array = [];
    this.toast.success('Item added to cart successfully');
    this.selectedItem = null;
    this.quantity = 1;
    this.discount = 0;
    this.closeNav();
  }

  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  // onPositiveIntegerRate(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.replace(/[^0-9.,]/g, '');
  //   const decimalCount = (input.value.match(/\./g) || []).length;
  //   if (decimalCount > 1) {
  //     input.value = input.value.replace(/\.(?=.*\.)/g, '');
  //   }
  //   this.quotationFormGroup
  //     .get('rate')
  //     ?.setValue(input.value, { emitEvent: false });
  // }
  onPositiveIntegerRate(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      // 'ArrowLeft',
      // 'ArrowRight',
      'Delete',
      '.',
      ',',
    ];
    const inputChar = event.key;
    const input = event.target as HTMLInputElement;
    if (!allowedKeys.includes(inputChar) && !/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
    }
    if (
      (inputChar === '.' && input.value.includes('.')) ||
      (inputChar === ',' && input.value.includes(','))
    ) {
      event.preventDefault();
    }

    // Check if the value is greater than 100
    const newValue = input.value + inputChar;
    const numericValue = parseFloat(newValue.replace(',', '.'));

    if (numericValue > 100) {
      event.preventDefault();
    }
  }

  // onPositiveIntegerChargeAmount(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.replace(/[^0-9.,]/g, '');
  //   const decimalCount = (input.value.match(/\./g) || []).length;
  //   if (decimalCount > 1) {
  //     input.value = input.value.replace(/\.(?=.*\.)/g, '');
  //   }
  //   this.quotationFormGroup
  //     .get('charges_amount')
  //     ?.setValue(input.value, { emitEvent: false });
  // }

  onPositiveIntegerChargeAmount(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      // 'ArrowLeft',
      // 'ArrowRight',
      'Delete',
      '.',
      ',',
    ];
    const inputChar = event.key;
    const input = event.target as HTMLInputElement;
    if (!allowedKeys.includes(inputChar) && !/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
    }
    if (
      (inputChar === '.' && input.value.includes('.')) ||
      (inputChar === ',' && input.value.includes(','))
    ) {
      event.preventDefault();
    }
  }

  // onPositiveIntegerDeliveryDays(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.replace(/[^0-9]/g, '');
  //   this.quotationFormGroup
  //     .get('delivery_days')
  //     ?.setValue(input.value, { emitEvent: false });
  // }
  onPositiveIntegerDeliveryDays(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'Delete', ','];
    const inputChar = event.key;
    const input = event.target as HTMLInputElement;
    if (!allowedKeys.includes(inputChar) && !/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
    }
    if (inputChar === '.' && input.value.includes('.')) {
      event.preventDefault();
    }
  }

  onInputClick(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.setSelectionRange(input.value.length, input.value.length);
  }

  resetForm() {
    this.quotationFormGroup.reset();
    this.details_photo = null;
    this.items.clear();
    this.quotationFormGroup.reset();
    this.router.navigate(['master/sales-management/quotation']);
  }
  removeItem(index: number) {
    if (this.items.length <= 1) {
      this.toast.error('Can Not Delete All Items');
      return;
    } else {
      this.items.removeAt(index);
      this.calculateTotalDiscount(index);
      this.calculateGrandTotal();
    }
  }
  get itemsFormArray() {
    return this.quotationFormGroup.get('items') as FormArray;
  }
  clearTaxData() {
    this.quotationFormGroup.get('tax_temp')?.setValue(null);
    this.quotationFormGroup.get('rate')?.setValue(null);
    this.quotationFormGroup.get('tax_amount')?.setValue(null);
    this.calculateGrandTotal();
  }
  clearDeliveryData() {
    this.quotationFormGroup.get('delivery')?.setValue(null);
    this.quotationFormGroup.get('charges_amount')?.setValue(null);
    this.calculateGrandTotal();
  }
  calculateTotalDiscount(index: number) {
    const itemsFormArray = this.quotationFormGroup.get('items') as FormArray;
    const itemControl = itemsFormArray.at(index);
    const quantity = itemControl.get('quantity')?.value || 0;
    const discount = itemControl.get('discount')?.value || 0;
    const totalDiscount = quantity * discount;
    itemControl.patchValue({ total_discount: totalDiscount });
    this.calculateGrandTotal();
  }

  // calculateTotalTax() {
  //   const itemsFormArray = this.quotationFormGroup.get('items') as FormArray;
  //   
  //   let totalTaxAmount = 0;
  //   let totAmount = 0;
  //   

  //   itemsFormArray.controls.forEach((itemControl) => {
  //     const amount = itemControl.get('amount')?.value || 0;
  //     

  //     const rate = this.quotationFormGroup.get('rate')?.value || 0;
  //     

  //     totAmount += amount;
  //     

  //     const itemTaxAmount = (totAmount * rate) / 100;
  //     

  //     totalTaxAmount = itemTaxAmount;
  //     

  //   });
  //   this.quotationFormGroup.patchValue({ tax_amount: totalTaxAmount });
  //   this.calculateGrandTotal();
  // }
  calculateTotalTax() {
    const itemsFormArray = this.quotationFormGroup.get('items') as FormArray;    
    let totalTaxAmount = 0;   
    itemsFormArray.controls.forEach((itemControl) => {
      const amount = parseFloat(itemControl.get('amount')?.value) || 0;
        const rate = parseFloat(this.quotationFormGroup.get('rate')?.value) || 0;
        const itemTaxAmount = (amount * rate) / 100;
        totalTaxAmount += itemTaxAmount;
    });
      this.quotationFormGroup.patchValue({ tax_amount: totalTaxAmount });
      this.calculateGrandTotal();
  }
  

  // calculateGrandTotal() {
  //   const itemsFormArray = this.quotationFormGroup.get('items') as FormArray;
  //   let grandTotal = 0;
  //   itemsFormArray.controls.forEach((itemControl) => {
  //     const totalAmount = itemControl.get('amount')?.value || 0;
  //     grandTotal += totalAmount;
  //   });
  //   const taxAmount = this.quotationFormGroup.get('tax_amount')?.value || 0;
  //   const chargesAmount =
  //     this.quotationFormGroup.get('charges_amount')?.value || 0;
  //   const taxamt = taxAmount.toString().includes('.')
  //     ? parseFloat(taxAmount.toString().replace(/,/g, ''))
  //     : parseInt(taxAmount.toString().replace(/,/g, ''));
  //   const chargetax = chargesAmount.toString().includes('.')
  //     ? parseFloat(chargesAmount.toString().replace(/,/g, ''))
  //     : parseInt(chargesAmount.toString().replace(/,/g, ''));

  //   const finalGrandTotal = grandTotal + taxamt + chargetax;
  //   this.quotationFormGroup.patchValue({ grand_total: finalGrandTotal });
  //   this.patchGrandTotal(finalGrandTotal);
  // }
  calculateGrandTotal() {
    const itemsFormArray = this.quotationFormGroup.get('items') as FormArray;
    let grandTotal = 0;
    itemsFormArray.controls.forEach((itemControl) => {
      const totalAmount = Number(itemControl.get('amount')?.value || 0); // Use Number() for conversion
      grandTotal += totalAmount;
    });
    const taxAmount = Number(
      (this.quotationFormGroup.get('tax_amount')?.value || 0)
        .toString()
        .replace(/,/g, '')
    );
    const chargesAmount = Number(
      (this.quotationFormGroup.get('charges_amount')?.value || 0)
        .toString()
        .replace(/,/g, '')
    );
    const finalGrandTotal = grandTotal + taxAmount + chargesAmount;
    this.quotationFormGroup.patchValue({ grand_total: finalGrandTotal });
    this.patchGrandTotal(finalGrandTotal);
  }

  itemSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.itemsList2.filter((item: any) =>
      tempVal.includes(item.item_name)
    );
    this.arrayList = filteredVariable;
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
  getCustomerType() {
    this._configurationalMasterService
      .getAllActiveCustomer()
      .subscribe((res: any) => {
        this.customerTypeList = res.data;
        this.customerTypeList1 = this.customerTypeList.map(
          (res: any) => res.customer_type_name
        );
        this.customerTypeList2 = this.customerTypeList;
      });
  }
  customerTypeSearch(val: any) {
    const tempVal = val;
    let filteredVariable = this.customerTypeList2.filter((item: any) =>
      tempVal.includes(item.customer_type_name)
    );
    this.customerTypeList = filteredVariable;
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
        this.employeeList = res.data.filter(
          (employee: any) => employee.employee_id == this.mainEmpId
        );
        this.quotationFormGroup
          ?.get('sales_rep_id')
          ?.patchValue(this.employeeList[0].employee_id);
      });
  }

  getDepartmentList() {
    this._configurationalMasterService
      .getDepartmentAll(this.entityId)
      .subscribe((res: any) => {
        this.departmentList = res.data;
        const departmentList = res.data.find(
          (department: any) => department.dept_id == this.department_id
        );
        this.quotationFormGroup.patchValue({
          department_id: departmentList?.dept_id,
        });
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
      .getActiveAssetMasterList()
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

  details_photo: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.quotationFormGroup.patchValue({ details_photo: null });
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
  navWidth: number = 0;
  patchGrandTotal(value: number): void {
    const formattedValue = this.decimalPipe.transform(value, '1.2-2');
    this.quotationFormGroup.patchValue({ grand_total: formattedValue });
  }
  getQuotationRecordByID(id: any, entity_id: any) {
    this.salesManagementService
      .getQuotationById(id, entity_id)
      .subscribe((res: any) => {
        if (res) {
          this.getPatchData = res.data;
          console.log(this.getPatchData,"this.getPatchData")
          this.getItemsListCatWise();
          const { details_photo, ...otherData } = res.data;
          this.quotationFormGroup.patchValue(otherData);
          this.details_photo = details_photo;
          this.items.clear();
          if (res.data.items && Array.isArray(res.data.items)) {
            res.data.items.forEach((item: any) => {
              this.items.push(this.createItemFormGroup(item));
            });
          }
          let newGrandTotal = res.data.grand_total;
          this.quotationFormGroup
            ?.get('grand_total')
            ?.patchValue(newGrandTotal);
        }
      });
  }

  updateDataSource(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = this.arrayList.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource(paginatedData);
  }

  onPageChange(event: any) {
    this.updateDataSource(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      this.updateDataSource(0, 5);
      this.noMatchFound = false;
    } else {
      const filteredData = this.arrayList.filter((data: any) =>
        data.item_name.toLowerCase().includes(filterValue)
      );

      if (filteredData.length === 0) {
        this.noMatchFound = true;
        this.dataSource.data = filteredData;
      } else {
        this.noMatchFound = false;
        this.dataSource.data = filteredData;
      }
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelect(item: any) {
    this.selectedItem = this.selectedItem === item ? null : item;
  }
  onSubmit() {
    if (this.quotationFormGroup.invalid) {
      Object.keys(this.quotationFormGroup.controls).forEach((controlName) => {
        const control = this.quotationFormGroup.get(controlName);
        if (control && control.invalid) {
        }
      });
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    if (this.items.length <= 0) {
      return this.toast.error('Please Add Atleast One Item');
    }

    const removeCommasAndSetValue = (fieldName: string) => {
      const control = this.quotationFormGroup.get(fieldName);

      if (!control) {
        console.error(`Form control '${fieldName}' does not exist.`);
        return;
      }

      const value = control.value;

      if (value == null || value === '') {
        console.warn(`Field '${fieldName}' has no value to process.`);
        return;
      }

      const newValue = value.toString().replace(/,/g, '');
      control.setValue(newValue);
    };

    removeCommasAndSetValue('rate');
    removeCommasAndSetValue('tax_amount');
    removeCommasAndSetValue('charges_amount');
    removeCommasAndSetValue('grand_total');

    let val: any = this.quotationFormGroup.value;

    let req = {
      ...val,
      details_photo: this.details_photo ? this.details_photo : null,
      entity_id: this.entityId,
    };
    this.salesManagementService.createQuotation(req).subscribe(
      (res: any) => {
        if (res) {
          this.toast.success(res.message);
          this.router.navigate(['/master/sales-management/quotation']);
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }
}
