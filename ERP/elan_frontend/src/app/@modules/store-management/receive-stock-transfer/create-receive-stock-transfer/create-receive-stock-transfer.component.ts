import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { StoreManagementService } from '../../store-management.service';
import { log } from 'console';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-create-receive-stock-transfer',
  templateUrl: './create-receive-stock-transfer.component.html',
  styleUrls: ['./create-receive-stock-transfer.component.scss']
})
export class CreateReceiveStockTransferComponent {
  createStockTransfer: any;
  file: any;
  itemsList: any;
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  warehouseList: any;
  randomId: any;
  targetStoreList: any;
  sourseStoreList: any;
  isView: boolean = false;
  employee_id: any;
  role:any;
  finance_id: any;
  loginUserDetails: any;
  constructor(private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private StoreManagementService: StoreManagementService,
    private $common: CommonService,
    private router: Router,
    private toast: ToastrService,
    private location: Location,
    private toaster: ToastrService,
    private acctivate: ActivatedRoute
  ) {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId")
    this.finance_id = localStorage.getItem("financial_id");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;

    this.createStockTransfer = this.fb.group({
      stock_entry_type: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      source_store_id: new FormControl(null, [Validators.required]),
      target_store_id: new FormControl(null, [Validators.required]),
      expected_transfer_date: new FormControl(null, [Validators.required]),
      recieve_by: new FormControl(null, [Validators.required]),
      date_recieved: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null, [Validators.required]),
      random_id: new FormControl(null),
      acknowledge: new FormControl(null),
      item_details: new FormArray([
        new FormGroup({
          item_id: new FormControl(null, [Validators.required]),
          quantity: new FormControl(null, [Validators.required]),
          item_code: new FormControl(null, [Validators.required]),
          // damaged_qty: new FormControl(null,[Validators.required]),
          accepted_qty: new FormControl(null, [Validators.required]),

        }),
      ]),
    })
  }
  id: any;
  status: any;
  ngOnInit(): void {
    this.acctivate.queryParams.subscribe((params: any) => {
      this.id = params.id;
      let type = params?.view;
      let default_status = params.status;
      if (type === 'view') {
        this.isView = true;
      }
      if(default_status == 'Completed'){
        this.getAllReceiveStockTransferById();
      }else{
        this.getAllStockTransferById();
      }

    });
   
    this.getItemMasterlist();
    this.generateRandomStockId();
    this.getAllStockList();
    this.storeMasterList();
  }

  calculateValue(index: any) {
    let basicRate = this.createStockTransfer.get('item_details')?.get(index.toString())?.get('basic_rate').value;
    let quantity = this.createStockTransfer.get('item_details')?.get(index.toString())?.get('quantity').value;
    let value = basicRate * quantity;
    this.createStockTransfer.get('item_details')?.get(index.toString())?.get('value').setValue(value);
  }

  generateRandomStockId() {
    this.StoreManagementService.generateRandomStockId().subscribe((response: any) => {
      this.randomId = response.data;
      this.createStockTransfer.get('random_id').setValue(this.randomId);
    })
  }


  onSourceSelectionChange(event: any) {
    this.targetStoreList.map((element: any) => {
      element['hidden'] = false;
      if (element.id == event.value) {
        element['hidden'] = true;
      }
    });
    let target_store_id = this.createStockTransfer.get('target_store_id').value;
    if (target_store_id && event.value == target_store_id) {
      this.createStockTransfer.get('target_store_id').setValue(null);
    }
  }

  onTargetSelectionChange(event: any) {
    this.sourseStoreList.map((element: any) => {
      element['hidden'] = false;
      if (element.id == event.value) {
        element['hidden'] = true;
      }
    });
    let source_store_id = this.createStockTransfer.get('source_store_id').value;
    if (source_store_id && event.value == source_store_id) {
      this.createStockTransfer.get('source_store_id').setValue(null);
    }
  }

  getAllStockTransferById(){
    this.StoreManagementService.getAllStockTransferById(this.id).subscribe((resp:any) => {
      let res=resp.data;
      let list = resp.list;
      this.createStockTransfer.patchValue({
        stock_entry_type: res.stock_entry_type,
        date: res.date,
        reason: res.reason,
        source_store_id: res.source_store_id,
        target_store_id: res.target_store_id,
        expected_transfer_date: res.expected_transfer_date,
        date_recieved: new Date(),
        remarks: res.remarks,
        random_id: res.random_id,
        acknowledge: res.acknowledge,
      });

      if (!this.itemsList) {
        this.itemsList = [];
      }

      for (let i = 0; i < list.length; i++) {
        const item_id_num = list[i].item_id ? Number(list[i].item_id) : null;
        if (item_id_num && !this.itemsList.some((item: any) => Number(item.id) === item_id_num)) {
          this.itemsList.push({
            id: item_id_num,
            item_name: list[i].item_name || 'Item Name',
            item_code: list[i].item_code
          });
        }

        let control = this.stakeHoldersFormArray.at(i);
        if (!control) {
          control = this.fb.group({
            item_id: [item_id_num],
            quantity: [list[i].quantity],
            item_code: [list[i].item_code],
            accepted_qty:[list[i].accepted_qty],
          });
          this.stakeHoldersFormArray.push(control);
        } else {
          control.patchValue({
            item_id: item_id_num,
            quantity: list[i].quantity,
            item_code: list[i].item_code,
            accepted_qty:[list[i].accepted_qty],
          });
        }
      }
    })
    const employee_name = this.loginUserDetails.first_name +' '+ this.loginUserDetails.last_name;
    this.createStockTransfer.get('recieve_by').setValue(employee_name);
  }

  getAllReceiveStockTransferById(){
    this.StoreManagementService.getAllReceiveStockTransferById(this.id).subscribe((resp:any) => {
      let res=resp.data;
      let list = resp.list;
      this.createStockTransfer.patchValue({
        stock_entry_type: res.stock_entry_type,
        date: res.date,
        reason: res.reason,
        source_store_id: res.source_store_id,
        target_store_id: res.target_store_id,
        expected_transfer_date: res.expected_transfer_date,
        date_recieved: res.date_recieved,
        recieve_by: res.recieve_by,
        remarks: res.remarks,
        random_id: res.random_id,
        acknowledge: res.acknowledge,
      });

      if (!this.itemsList) {
        this.itemsList = [];
      }

      for (let i = 0; i < list.length; i++) {
        const item_id_num = list[i].item_id ? Number(list[i].item_id) : null;
        if (item_id_num && !this.itemsList.some((item: any) => Number(item.id) === item_id_num)) {
          this.itemsList.push({
            id: item_id_num,
            item_name: list[i].item_name || 'Item Name',
            item_code: list[i].item_code
          });
        }

        let control = this.stakeHoldersFormArray.at(i);
        if (!control) {
          control = this.fb.group({
            item_id: [item_id_num],
            quantity: [list[i].quantity],
            item_code: [list[i].item_code],
            accepted_qty:[list[i].accepted_qty],
          });
          this.stakeHoldersFormArray.push(control);
        } else {
          control.patchValue({
            item_id: item_id_num,
            quantity: list[i].quantity,
            item_code: list[i].item_code,
            accepted_qty:[list[i].accepted_qty],
          });
        }
      }
    })
  }

  getAllStockList() {
    this.StoreManagementService.getAllStockList(this.entity_id,this.finance_id,this.employee_id,this.role).subscribe((response: any) => {
      this.sourseStoreList = response.data || [];
      // this.filterSourceStock = this.sourseStoreList;
      // this.filterTargetStock = this.targetStoreList
    });
  }

  storeMasterList() {
    this.StoreManagementService.storeMasterList(this.entity_id).subscribe((response: any) => {
      this.targetStoreList = response.data || [];
    });
  }

  getItemMasterlist() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
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
    let isValidExtension = this.$common.checkForValidFile(e, false, true, false);
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
  itemDetailsArray: any = []
  addNewItem() {
    this.itemDetailsArray = (this.createStockTransfer.get('item_details') as FormArray);
    this.itemDetailsArray.push(this.createItemGroup());
  }


  createItemGroup(): FormGroup {
    return this.fb.group({
      item_id: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      item_code: new FormControl(null),

    });
  }
  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
  }

  getItemDetail(data: any, index: number) {
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(index) as FormGroup;
    itemControl.patchValue({
      item_code: data.item_code
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
 
  validateItems(data: any) {
    for (let item of data) {
      const quantity = parseInt(item.quantity);
      // const damaged_qty = parseInt(item.damaged_qty);
      const accepted_qty = parseInt(item.accepted_qty);
      if (+accepted_qty !== quantity) {
        return false;
      }
    }
    return true;
  }


  onSubmitForm() {
    console.warn(this.createStockTransfer.value, 'values');

    if (this.createStockTransfer.invalid) {
      this.markFormGroupTouched(this.createStockTransfer);
      return this.toast.error('Required Field Should be Empty')
    }
    const isValid = this.validateItems(this.createStockTransfer?.value?.item_details);
    if (isValid) {
      this.createStockTransfer.value.id = this.id,
        this.StoreManagementService.createReceivedStoreStockTransfer(this.createStockTransfer.value, this.entity_id).subscribe((res: any) => {
          if (res) {
            this.toaster.success(res.message);
            this.router.navigate(["/master/store-management/receive-stock-transfer"]);
          }
        }, (err: any) => {
          this.toaster.error(err.error.message);
        });
    } else {
      return this.toast.error("Validation failed for item , Accepted quantities don't match the total quantity.")
    }
  }

}
