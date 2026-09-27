import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-add-voucher-master',
  templateUrl: './add-voucher-master.component.html',
  styleUrls: ['./add-voucher-master.component.scss']
})
export class AddVoucherMasterComponent {
  createForm: FormGroup;
  financial_year_id: any;
  entity_id: any;
  id: any;
  action_type: any;
  response: any = null;
  categoryList:any;
  subCategoryList:any[]=[];
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router
  ) {
    this.createForm = this.fb.group({
      voucher_id: new FormControl(null, [Validators.required]),
      voucherList: this.fb.array([this.createItemsField()])
    });
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.view;
      if (this.id) {
        this.getAllVoucherById(this.id);
      }
      this.financial_year_id = localStorage.getItem('financial_id');
      this.entity_id = localStorage.getItem('selectedEntityId');
    });
  this.getAllVoucherDataMain()
  }
getAllVoucherData:any=[]
  getAllVoucherDataMain(){
    this._configurationalMasterService.getAllVoucherDataMain().subscribe((res:any)=>{
      this.getAllVoucherData = res.data;
    })
  }

  get voucherList(): FormArray {
    return this.createForm.get('voucherList') as FormArray;
  }

  createItemsField(): FormGroup {
    return this.fb.group({
      voucher_name: ['', Validators.required],
      series: ['', Validators.required],    
      
       
    });
  }

  addItem() {
    for (let control of this.voucherList.controls) {
      if (control.invalid) {
        control.markAllAsTouched(); 
        this.toaster.warning('Please fill all required fields before adding a new item.')
        return; 
      }
    }
    this.voucherList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.voucherList.removeAt(index);
  }


  getAllVoucherById = (id: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService
      .getAllVoucherById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          this.createForm.patchValue({
            voucher_id: this.response.id,
            
            // discount_flat_type: this.response.discount_flat_type,
            // discount_percent: this.response.discount_percent,
          });
          const voucherListFormArray = this.createForm.get('voucherList') as FormArray;
          voucherListFormArray.clear();
    
          if (this.response.voucherList && this.response.voucherList.length) {
            this.response.voucherList.forEach((item: any,i:number) => {
             
              voucherListFormArray.push(
                this.fb.group({
                  voucher_name: [item.voucher_name || ''],
                  series: [item.series || ''],
                  
                   
                })
              );
            });
          }
          this._commonService?.hideLoader();
          
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/master-voucher-type']);
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }

  onKeyChange(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
    ];

    // Allow numbers and allowedKeys
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }
 
    
    if (this.id) {
      this._commonService?.showLoader();
      this.createForm.value.entity_id= this.entity_id
      this.createForm.value.id= this.id,
       
        
      
      this._configurationalMasterService.updateVoucherTypeData(this.createForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/master-voucher-type']);
          }
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
    
    } else {
      this._commonService?.showLoader();
      this.createForm.value.entity_id= this.entity_id
      this._configurationalMasterService.createVoucherList(this.createForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/master-voucher-type']);
          }
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
    }
  }
}
