import { Location } from '@angular/common';
import { Component} from '@angular/core';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray,AbstractControl,ValidatorFn } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { InventoryManagementService } from '../../inventory-management.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

const databaseKey: any = environment.servralUrl;
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
  itemsList: any;
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  warehouseList: any;
  categoryList: any;
  getAllUses: any;
  getAllProducts: any;
  batchNumber: any;
  goodsInventoryHistory: any = [];
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  financial_year_id: string | null;
  constructor(private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private inventory_services: InventoryManagementService,
    private $common: CommonService,
    private router: Router,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private toaster:ToastrService,
  ) {
    this.rowClass = 'rowClass';
    this.createGoodsInventory = this.fb.group({
      item_id: new FormControl(null, [Validators.required]),
      asset_id: new FormControl(null, [Validators.required]),
      product_id: new FormControl(null, [Validators.required]),
      batch_number: new FormControl('', [Validators.required]),
      inward_date: new FormControl(null, [Validators.required]),
      batch_expiry_date: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      basic_rate: new FormControl(null, [Validators.required]),
      total_value: new FormControl(null, [Validators.required]),
      warehouse_id: new FormControl(null, [Validators.required]),
      row_id: new FormControl(null),
      shelf_id: new FormControl(null ),
      section_id: new FormControl(null ),
      uses_id: new FormControl(null, [Validators.required]),
      uploadedFile: new FormControl(''),
      remarks: new FormControl(null,[Validators.required,noLeadingSpaces()]),
      item_details : new FormArray([

      ]),
    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getItemMasterlist();
    this.getAllWarehouseList();
    this.getAllCategory();
    this.getAllUsesData();
    this.getAllProductsData();
    this.generateBatchNumber();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Item',
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
      headerName: 'Batch Number',
      field: 'batch_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Inward Date',
      field: 'inward_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Expiry Date',
      field: 'batch_expiry_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Base Rate',
      field: 'basic_rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Value (Q*R)',
      field: 'value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Manufacture',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Usage',
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Outward Date',
      field: '--',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,

    },
  ];

  getGoodsInventoryHistory(item_id:any){
    this.createGoodsInventory.setControl('item_details', this.fb.array([]));
    this.inventory_services.getGoodsInventoryHistory(item_id).subscribe((response: any) => {
      this.goodsInventoryHistory = response.data;
      this.goodsInventoryHistory.forEach((element:any) => {
        this.addStakeHoldersRow(element);
      });
    });
  }

  getAllWarehouseList(){
    this.inventory_services.getAllWarehouseList(this.entity_id,this.financial_year_id).subscribe((response: any) => {
      this.warehouseList = response.data;
    })
  }

  getWarehouseRowList(event: any): void {
    this.getAllRowList(event.value);
  }
  rowList:any=[]
  getAllRowList(warehouse_id:any){
    this.inventory_services.getAllRowList(this.entity_id,this.financial_year_id, warehouse_id).subscribe((res: any) => {
      this.rowList = res.data;
      const rowControl = this.createGoodsInventory.get('row_id');
      if (this.rowList.length) {
        rowControl?.addValidators([Validators.required]);
      } else {
        rowControl?.clearValidators();
      }
      rowControl?.updateValueAndValidity();
    });
  }
  selfList:any=[]
  getAllSelfList(row_id:any){
    this.inventory_services.getAllSelfList(row_id).subscribe(
      (res: any) => {
        this.selfList = res.data;
        const shelfControl = this.createGoodsInventory.get('shelf_id');
        if (this.selfList.length) {
          shelfControl?.addValidators([Validators.required]);
        } else {
          shelfControl?.clearValidators();
        }
        shelfControl?.updateValueAndValidity();
      },
      (err: any) => {
        this.toast.error("Self data not found!", "Error Message");
      }
    );
  }


  sectionList:any=[]
  getAllSectionList(row_id:any){
    this.inventory_services.getAllSectionList(row_id).subscribe(
      (res: any) => {
        this.sectionList = res.data;
        const sectionControl = this.createGoodsInventory.get('section_id');
        if (this.sectionList.length) {
          sectionControl?.addValidators([Validators.required]);
        } else {
          sectionControl?.clearValidators();
        }
        sectionControl?.updateValueAndValidity();
      },
      (err: any) => {
        this.toast.error("Section data not found!", "Error Message");
      }
    );
  }


  generateBatchNumber(){
    this.inventory_services.generateBatchNumber().subscribe((res: any) => {
      this.batchNumber = res.data;
      this.createGoodsInventory.get('batch_number').setValue(this.batchNumber);
    });
  }

  getItemMasterlist(){
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
    });
  }

  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.categoryList = res.data || [];
    })
  }

  getAllUsesData(){
    this._configurationalMasterService.getAllUsesData().subscribe((res:any)=>{
     this.getAllUses=res.data;
    })
  }

  getAllProductsData(){
    this._configurationalMasterService.getProductMasterListData().subscribe((res:any)=>{
      this.getAllProducts=res.data;
    })
  }

  CalculateValue() {
    let quantity = Number(this.createGoodsInventory.get('quantity').value);
    let basicRate = Number(this.createGoodsInventory.get('basic_rate').value);
    if (quantity && basicRate) {
      let totalValue = basicRate * quantity;
      this.createGoodsInventory.get('total_value').setValue(totalValue);
    } else {
      this.createGoodsInventory.get('total_value').setValue(null);
    }
  }

  getItemDetails(event:any){
    let selectedItem = this.itemsList.find((item: any) => item.id === event.value);
    this.createGoodsInventory.get('asset_id').setValue(selectedItem.asset_id);
    this.createGoodsInventory.get('product_id').setValue(selectedItem.product_id);
    this.getGoodsInventoryHistory(event.value);
  }

  getItemCode(event:any,index:any){
    let selectedItem = this.itemsList.find((item: any) => item.id === event.value);
    if(selectedItem) {
      const itemCode = selectedItem.item_code;
      this.createGoodsInventory.get('item_details').at(index)?.get('item_code')?.setValue(itemCode);
    } else {
      this.toast.error('Item code not found for this item');
    }
  }

  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.createGoodsInventory.get('item_details') as FormArray;
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type.split('/').pop().toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false,true,false);
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

  addStakeHoldersRow(formdata:any) {
    let data= this.fb.group({
      item_id: new FormControl(formdata.item_id),
      item_code: new FormControl(formdata.item_code),
      batch_number: new FormControl(formdata.batch_number),
      inward_date: new FormControl(formdata.inward_date),
      expiry_date: new FormControl(formdata.batch_expiry_date),
      outward_date: new FormControl(null),
    });
    this.stakeHoldersFormArray.push(data);
    return
  }

  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmitForm(){
    if(this.createGoodsInventory.invalid){
      this.markFormGroupTouched(this.createGoodsInventory);
      return
    }
    this.inventory_services.createGoodsInventory(this.createGoodsInventory.value,this.entity_id).subscribe((res:any)=>{
      if(res){
        this.toaster.success(res.message);
        this.router.navigate(["master/inventory-management/goods-inventory"]);
        }
      },(err:any)=>{
          this.toaster.error(err.error.message);
    });
  }
}


