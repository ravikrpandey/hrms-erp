import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddActionComponent } from './add-action/add-action.component';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { ToastrService } from 'ngx-toastr';
import { StoreManagementService } from '../../store-management.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-add-goods-inventory',
  templateUrl: './add-goods-inventory.component.html',
  styleUrls: ['./add-goods-inventory.component.scss']
})
export class AddGoodsInventoryComponent {
  createGoodsInventory: any;
  file: any;
  itemsList: any = [];
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  storeList: any;
  categoryList: any;
  getAllUses: any;
  getAllProducts: any;
  batchNumber: any;
  selectedItem: any;
  quantity: any;
  discount: any = 0;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedCategory: any;
  arrayList: any;
  totalLength: number;
  itemsListForCode1: any;
  navWidth: number;
  itemsList1: any;
  itemsListForCode2: any;
  itemsList2: any;
  noMatchFound: boolean;
  dataSource: any;
  VendorData: any;
  vendors: any;
  backupitemList: any;
  rowData: any[];
  baseUrl: string;
  finance_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;
  constructor(private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private storeServices: StoreManagementService,
    private $common: CommonService,
    private router: Router,
    private toast: ToastrService,
    private location: Location,
    private vendorService: VendorManagementService,
  ) {
    this.rowClass = 'rowClass';
    this.createGoodsInventory = this.fb.group({
      po_supplier_vendor_name: new FormControl(null, [Validators.required]),
      grn_number: new FormControl(null),
      po_number: new FormControl(null),
      po_date: new FormControl(''),
      invoice_number: new FormControl(''),
      asset_id: new FormControl(null),
      invoice_date: new FormControl(null, [Validators.required]),
      po_type: new FormControl(null, [Validators.required]),
      store_id: new FormControl(null, [Validators.required]),
      uses_id: new FormControl(null, [Validators.required]),
      uploadedFile: new FormControl('', [Validators.required]),
      remarks: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      financial_year_id: new FormControl(''),
      employee_id: new FormControl(''),
      item_details: this.fb.array([])
    });
    this.employee_id = localStorage.getItem("EmpMainId")
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    const financial_year_id = localStorage.getItem("financial_id");
    this.createGoodsInventory.get('employee_id').setValue(this.employee_id);
    this.createGoodsInventory.get('financial_year_id').setValue(financial_year_id);
  }

  ngOnInit(): void {
    this.baseUrl = environment.servralUrl;
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.finance_id = localStorage.getItem("financial_id");
    this.getItemMasterlist();
    this.getAllStoreList();
    this.getAllCategory();
    this.getAllUsesData();
    this.generateBatchNumber();
    this.getVendorData();
    // this.generateGRNInvoiceNumber();
    this.storeServices.data$.subscribe((newData) => {
      this.selectedItem = newData;
    });
  }

  public columnDefs = [
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AddActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },

  ];

  get item_details() {
    return this.createGoodsInventory.get('item_details') as FormArray;
  }

  // generateGRNInvoiceNumber() {
  //   this._GrnService.generateGRNInvoiceNumber().subscribe((res: any) => {
  //     this.createGoodsInventory.patchValue({
  //       invoice_number: res.data,
  //     });
  //   });
  // }

  receiveRowData(data: any[]) {
    this.rowData = data;
  }

  IsAlphaNumeric(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    if ((charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)) {
      return true;
    }
    return false;
  }


  getAllStoreList() {
    this.storeServices.getAllStockList(this.entity_id, this.finance_id, this.employee_id, this.role).subscribe((response: any) => {
      this.storeList = response.data;
    })
  }

  getVendorData() {
    this.$common?.showLoader()
    this.vendorService.getAllVendorList(this.entity_id).subscribe((res: any) => {
      this.$common?.hideLoader()
      this.VendorData = res.data;
      this.vendors = this.VendorData.map((value: any) => value.vendor_name)
    },

      ((err: any) => {
        this.$common?.hideLoader()
        this.VendorData = []
      }))
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  generateBatchNumber() {
    this.storeServices.generateBatchNumber().subscribe((res: any) => {
      this.batchNumber = res.data;
      this.createGoodsInventory.get('grn_number').setValue(this.batchNumber);
    });
  }

  getItemMasterlist() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.backupitemList = res.data;
    });
  }

  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.categoryList = res.data || [];
    })
  }

  getAllUsesData() {
    this._configurationalMasterService.getAllUsesData().subscribe((res: any) => {
      this.getAllUses = res.data;
    })
  }

  goBack() {
    this.location.back();
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type.split('/').pop().toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false, true, false);
    if (!isValidExtension) return this.createGoodsInventory.value.file.setValue(null)
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = uploadedFileType == 'pdf' ? "/assets/icons/pdfimg.png" : e.target.result
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    let formData = new FormData();

    formData.append('file', this.imageToUpload);

    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      let fileUpload = res?.url ? res?.url : null;
      this.createGoodsInventory.get('uploadedFile').setValue(fileUpload);
    })
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getItemsListCatWise(event: any) {
    this.itemsList = [];
    this.itemsList = this.backupitemList.filter((item: any) => item.asset_id === event.value);
    this.createGoodsInventory.get('asset_id').setValue(event.value);
  }

  addToCart() {
    if (!this.selectedItem) {
      alert('No item selected!');
      return;
    }
    if (!this.quantity) {
      return
    }
    const tempItem = {
      asset_id: this.selectedItem.asset_id || '',
      item_id: this.selectedItem.id || '',
      item_code: this.selectedItem.item_code || '',
      price: parseInt(this.selectedItem.MVP),
      quantity: this.quantity,
      discount: this.discount,
      total_discount: this.discount * this.quantity,
      amount: (this.selectedItem.MVP - this.discount) * this.quantity,
    };

    this.item_details.push(this.createItemFormGroup(tempItem));
    this.toast.success('Item added to cart successfully');
    this.selectedItem = null;
    this.quantity = 1;
    this.discount = 0;
    this.closeNav();
  }

  createItemFormGroup(item: any = {}): FormGroup {
    return this.fb.group({
      asset_id: [item.asset_id || '', Validators.required],
      item_id: [item.item_id || '', Validators.required],
      item_code: [item.item_code || '', Validators.required],
      quantity: [item.quantity || '', Validators.required],
      invoice_quantity: [Validators.required],
      price: [item.price || '', Validators.required],
      discount: [item.discount || 0],
      total_discount: [item.total_discount || 0],
      amount: [item.amount || 0]
    });
  }

  openNav() {
    this.navWidth = 700;
  }

  closeNav() {
    this.navWidth = 0;
  }


  onSubmitForm() {
    if (this.createGoodsInventory.invalid) {
      this.markFormGroupTouched(this.createGoodsInventory);
      return
    }
    if (this.item_details.length < 1) {
      this.toast.error('Please add at least one Item!');
      return
    }
    let mismatchFound = false;
    this.item_details.controls.forEach((formGroup: any) => {
      let quantity = formGroup.get('quantity').value;
      let invoice_quantity = formGroup.get('invoice_quantity').value;
      if (quantity != invoice_quantity) {
        mismatchFound = true;
      }
    });
    if (mismatchFound) {
      this.toast.error('Quantity and invoice Quantity do not match!');
      return;
    }
    this.storeServices.createGoodsInventory(this.createGoodsInventory.value, this.entity_id).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate(["/master/store-management/goods-inventory"]);
      }
    }, (err: any) => {
      this.toast.error(err.error.message);
    });
  }

  removeItem(index: number) {
    if (this.item_details.length <= 1) {
      this.toast.error('Can Not Delete All Items');
      return;
    } else {
      this.item_details.removeAt(index);
    }
  }
}


