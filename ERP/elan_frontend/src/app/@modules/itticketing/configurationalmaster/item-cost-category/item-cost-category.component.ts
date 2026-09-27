import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-item-cost-category',
  templateUrl: './item-cost-category.component.html',
  styleUrls: ['./item-cost-category.component.scss']
})
export class ItemCostCategoryComponent {
  rowClass: any;
  itemCostForm: any;
  non_register: boolean = false;
 
  private gridApi!: GridApi<any>;
  // supplier_purchase: boolean = false;
  vendor_id: any;
  codeGet: any;
  cccodeGet: any;
  codeSncGet: any;
  checkRegister: string;
  supplierCheck: string;
  editBankData: any;
  supplierPurchaseChecked: boolean =false;
  type: any;
  data:any=[]
  rowData:any=[]
  entity_id: any= null;
  constructor(
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    private _finaceService : FinaceService,
  ) {
    this.rowClass = 'rowClass';

    this.itemCostForm = this.fb.group({
    
     
      itemCostForm: this.fb.array([this.createItemsField()])
    
    })

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this.activeroute.queryParams.subscribe((params: any) => {
    this.vendor_id = params.id;
     this.type=params?.type;

    });
     this.getAccountChart();
     this.getChartAccountList();
     this.getAllItemcostCategory();
 
    // this.getAccountChart();
    
   
  }

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  chartedAccount:any=[]
  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

    });
  }
  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }
   
  getAllItemcostCategory(){
    this._configurationalMasterService.getAllItemcostCategory().subscribe((res:any)=>{
      if(res){
        console.log(res,'res')
         if(res.data?.length){
          this.itemCostFormFormArray.removeAt(0)
         }
        res.data.forEach((element:any,i:any) => {
         let controls=  this.fb.group({
            cost_type: [element.cost_type],
            chart_of_account_id: [element.chart_account_id],    
            entity_id: [this.entity_id],    
          
          });
          this.itemCostFormFormArray.push(controls)
        });
      }
    })
  }

  createItemsField(): FormGroup {
    
    return this.fb.group({
      cost_type: ['', Validators.required],
      chart_of_account_id: [''],    
      entity_id: [this.entity_id],    
    
    });
  }

  addItem() {
    for (let control of this.itemCostFormFormArray.controls) {
      if (control.invalid) {
        control.markAllAsTouched(); 
        this.toast.warning('Please fill all required fields before adding a new item.')
        return; 
      }
    }
    this.itemCostFormFormArray.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.itemCostFormFormArray.removeAt(index);
  }


  get itemCostFormFormArray(): FormArray {
    return this.itemCostForm.get('itemCostForm') as FormArray;
  }

 

natureData:any=[]
  getTdsById(data:any,i:any){
    this._configurationalMasterService.getTdsDataByIdVendor(data.id).subscribe((res:any)=>{
    this.natureData[i] = res.data;
    })
     
     this.itemCostForm.controls[i]?.get('nature')?.setValue(data.nature)
   
  }

  getNatureData(data:any,i:any){
    this.itemCostForm.patchValue({
      threshold_limit:data.threshold_limit,
      tds_rate:data.rate,
      maximum_amount:data.maximum_amount
    })
    this.itemCostForm.controls[i]?.get('threshold_limit')?.setValue(data.threshold_limit)
    this.itemCostForm.controls[i]?.get('maximum_amount')?.setValue(data.maximum_amount)
    this.itemCostForm.controls[i]?.get('tds_rate')?.setValue(data.rate)
  }

 

  

  getAccountChart(){
    ;
    // this._commonService?.showLoader()
    this.vendorService.getAccountChart(this.entity_id).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.data=res?.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  cancels(path: any) {
    this.route.navigate([path])
  }


  onSubmit(){
let val=this.itemCostForm.value;
console.log(val,'vall');
if (this.itemCostForm.invalid) {
  this.itemCostForm.markAllAsTouched();
  this.toast.error('Required fields should not be empty', 'Fields Error');

  return;
}
this._configurationalMasterService.item_cost_category(val).subscribe(
  (res: any) => {
    this._commonService?.hideLoader();
    if (res.code == 200) {
      this.toast.success(res.message);
      this.reloadCurrentRoute()
 
    }
  },
  (err) => {
    this._commonService?.hideLoader();
    this.toast.error(err.error.message);
  }
);
}


reloadCurrentRoute() {
  let currentUrl = this.route.url;
  this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.route.navigate([currentUrl]);
  })
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

}
