import { Location } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray,AbstractControl,ValidatorFn } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { StoreManagementService } from '../../store-management.service';
import { debounceTime } from 'rxjs';

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
  selector: 'app-create-stock-transfer',
  templateUrl: './create-stock-transfer.component.html',
  styleUrls: ['./create-stock-transfer.component.scss']
})
export class CreateStockTransferComponent {
  createStockTransfer: any;
  file: any;
  itemsList: any;
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  warehouseList: any;
  randomId: any;
  filterSourceStockControl = new FormControl();
  filterTargetStockControl = new FormControl();
  filterItemControl = new FormControl();
  filterSourceStock : any;
  filterTargetStock : any;
  closeIcon : any;
  targetWarehouseCloseIcon:any;
  finance_id:any;
  sourseStoreList: any;
  targetStoreList:any;
  employee_id: any;
  store_id:any = [];
  filterItem: any;
  loginUserDetails: any;
  role: any;
  constructor(private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private store_services:StoreManagementService,
    private $common: CommonService,
    private router: Router,
    private location: Location,
    private toaster:ToastrService,
    private acctivate: ActivatedRoute
  ) {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.finance_id = localStorage.getItem("financial_id");
    this.employee_id = localStorage.getItem("EmpMainId");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    
    this.createStockTransfer = this.fb.group({
      stock_entry_type: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      source_store_id: new FormControl(null, [Validators.required]),
      target_store_id: new FormControl(null, [Validators.required]),
      expected_transfer_date: new FormControl(null, [Validators.required]),
      driver_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      vehicle_no: new FormControl(null, [Validators.required]),
      uploadedFile: new FormControl(null),
      remarks: new FormControl(null,[Validators.required]),
      random_id: new FormControl(null),
      item_details : new FormArray([
        new FormGroup({
          item_id: new FormControl(null,[Validators.required]),
          quantity: new FormControl(null,[Validators.required]),
          item_code: new FormControl(null)
        }),
      ]),
    })
  }
id:any;
  ngOnInit(): void {
    this.acctivate.queryParams.subscribe((params:any) => {
    this.id = params.id;
      if(this.id){
        this.getAllStockTransferById();
      }
    });
    this.createStockTransfer.get('stock_entry_type').setValue('transfer');
    this.getItemMasterlist();
    this.getAssignedStockList();
    this.generateRandomStockId();
    this.getFilterStore();
  }

  getFilterStore(){
    this.filterSourceStockControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.sourseStoreList = this.filterSourceStock.filter((store:any) =>
        store.name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterTargetStockControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.targetStoreList = this.filterTargetStock.filter((store:any) =>
        store.store_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterItemControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.itemsList = this.filterItem.filter((item:any) =>
        item.item_name.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  getAllStockTransferById(){
    this.store_services.getAllStockTransferById(this.id).subscribe((resp:any) => {
      let res=resp.data;
      let list = resp.list;
      this.createStockTransfer.patchValue({
        stock_entry_type: res.stock_entry_type,
        date: res.date,
        reason: res.reason,
        source_store_id: res.source_store_id,
        target_store_id: res.target_store_id,
        expected_transfer_date: res.expected_transfer_date,
        driver_name: res.driver_name,
        vehicle_no: res.vehicle_no,
        // uploadedFile: res.uploadedFile,
        remarks:res.remarks,
       })

       for (let i = 0; i < list.length; i++) {
        let control = this.stakeHoldersFormArray.at(i);
        if (!control) {
          control = this.fb.group({
            item_id: [list[i].item_id],
            quantity: [list[i].quantity],
            item_code: [list[i].item_code]
          });
          this.stakeHoldersFormArray.push(control);
          this.store_id.push([list[i].item_id]);
        } else {
          control.patchValue({
            item_id: list[i].item_id,
            quantity: list[i].quantity,
            item_code: list[i].item_code
          });
          this.store_id.push([list[i].item_id]);
        }
      }
      this.getTargetStockList(this.stakeHoldersFormArray.value);
    })
  }

  generateRandomStockId(){
    this.store_services.generateRandomStockId().subscribe((response: any) => {
      this.randomId = response.data;
      this.createStockTransfer.get('random_id').setValue(this.randomId);
    })
  }

  onSourceSelectionChange(event:any){
    this.targetStoreList.map((element:any) => {
      element['hidden']= false;
      if(element.id == event.value){
        element['hidden']= true;
      }
    });
    let target_store_id = this.createStockTransfer.get('target_store_id').value;
    if(target_store_id && event.value == target_store_id){
      this.createStockTransfer.get('target_store_id').setValue(null);
    }
  }

  onTargetSelectionChange(event:any){
    this.sourseStoreList.map((element:any) => {
      element['hidden']= false;
      if(element.id == event.value){
        element['hidden']= true;
      }
    });
    let source_store_id = this.createStockTransfer.get('source_store_id').value;
    if(source_store_id && event.value == source_store_id){
      this.createStockTransfer.get('source_store_id').setValue(null);
    }
  }

  getTargetStockList(itemId:any) {
    this.store_services.getTargetStockList(this.entity_id,this.finance_id,itemId).subscribe(async (response: any) => {
      const seenStoreIds = new Set();
      this.targetStoreList = await response.data?.filter((store:any) => {
        if (!seenStoreIds.has(store.store_id)) {
          seenStoreIds.add(store.store_id);
          return true;
        }
        return false;
      });
      this.filterTargetStock = this.targetStoreList;
    },(err)=>{
      if (err.status === 404) {
        this.toaster.error(err.error.message);
        this.filterTargetStock = [];
        this.targetStoreList = [];
        this.createStockTransfer.get('target_store_id').setValue([])
      } else {
        this.toaster.error('An error occurred while fetching the target stock list.');
        this.filterTargetStock = [];
        this.targetStoreList = [];
        this.createStockTransfer.get('target_store_id').setValue([])
      }
    });
  }

  onQuantity(){
    this.getTargetStockList(this.stakeHoldersFormArray.value);
  }

  getAssignedStockList() {
    this.store_services.getAssignedStoreList(this.entity_id,this.finance_id,this.employee_id,this.role).subscribe((response: any) => {
      this.sourseStoreList = response.data || [];
      this.filterSourceStock = this.sourseStoreList;
    });
  }

  clearTargetWarehouse(){
    this.createStockTransfer.get('target_store_id').patchValue(null);
  }

  clearWarehouse(){
    this.createStockTransfer.get('source_store_id').patchValue(null);
  }

  getItemMasterlist(){
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
      this.filterItem = this.itemsList;
    });
  }
 
  itemCloseIcon:boolean[]=[];
  clearItem(i:number){
    this.itemCloseIcon[i]=false;
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(i) as FormGroup;
    itemControl.patchValue({
      item_code:null,
      item_id:null,
      quantity:null,
    });
  }

  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.createStockTransfer.get('item_details') as FormArray;
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type.split('/').pop().toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false,true,false);
    if (!isValidExtension) return this.createStockTransfer.value.file.setValue(null)
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
      let fileUpload = res?.url;
      this.createStockTransfer.patchValue({
        uploadedFile: fileUpload
      });
    })
  }
  itemDetailsArray:any=[]
  addNewItem() {
     this.itemDetailsArray = (this.createStockTransfer.get('item_details') as FormArray);
     this.itemDetailsArray.push(this.createItemGroup());
  }


  createItemGroup(): FormGroup {
    return this.fb.group({
      item_id: new FormControl(null,[Validators.required]),
          quantity: new FormControl(null,[Validators.required]),
          item_code: new FormControl(null),

    });
  }
  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
    this.store_id = this.store_id.slice(0, index);
  }
 
  getItemDetail(data: any, index: number) {
    this.itemCloseIcon[index]=true;
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(index) as FormGroup;
    itemControl.patchValue({
      item_code: data.item_code
    });
    this.store_id = this.store_id.slice(0, index);
    this.store_id.push(data.id);
    this.getTargetStockList(this.stakeHoldersFormArray.value);
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
    if(this.createStockTransfer.invalid){
      this.markFormGroupTouched(this.createStockTransfer);
      return
    }
    this.store_services.createStockTransfer(this.createStockTransfer.value,this.entity_id).subscribe((res:any)=>{
      if(res){
        this.toaster.success(res.message);
        this.router.navigate(["/master/store-management/stock-transfer"]);
        }
      },(err:any)=>{
          this.toaster.error(err.error.message);
    });
  }
}

