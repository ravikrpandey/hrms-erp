import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-add-tds',
  templateUrl: './add-tds.component.html',
  styleUrls: ['./add-tds.component.scss']
})
export class AddTdsComponent {
  createForm: FormGroup;
  financial_year_id: any;
  entity_id: any;
  id: any;
  action_type: any;
  response: any = null;
  categoryList:any;
  subCategoryList:any[]=[];
  FromDate: string;
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
      section: new FormControl(null, [Validators.required]),
      nature: new FormControl(null, [Validators.required]),
      // maximum_amount: new FormControl(null, ),
      tdsList: this.fb.array([this.createItemsField()])
    });
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.view;
      if (this.id) {
        this.getTdsDataById(this.id);
      }
      this.financial_year_id = localStorage.getItem('financial_id');
      this.entity_id = localStorage.getItem('selectedEntityId');
    });
  
  }
  get tdsList(): FormArray {
    return this.createForm.get('tdsList') as FormArray;
  }

  createItemsField(): FormGroup {
    return this.fb.group({
      nature_of_transaction: ['', Validators.required],
      threshold_limit: ['', Validators.required],    
      maximum_amount: [null],
      current_rate: [null],
      new_rate:[null],
      from_date:[null]
    });
  }

  addItem() {
    for (let control of this.tdsList.controls) {
      if (control.invalid) {
        control.markAllAsTouched(); 
        this.toaster.warning('Please fill all required fields before adding a new item.')
        return; 
      }
    }
    this.tdsList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.tdsList.removeAt(index);
  }
 
 

  getTdsDataById = (id: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService
      .getTdsDataById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          this.createForm.patchValue({
            section: this.response.section,
            nature: this.response.nature,
            // maximum_amount: this.response.maximum_amount,
            // discount_flat_type: this.response.discount_flat_type,
            // discount_percent: this.response.discount_percent,
          });
          const tdsListFormArray = this.createForm.get('tdsList') as FormArray;
          tdsListFormArray.clear();
    
          if (this.response.tdsList && this.response.tdsList.length) {
            this.response.tdsList.forEach((item: any,i:number) => {
             
              tdsListFormArray.push(
                this.fb.group({
                  nature_of_transaction: [item.nature_of_transaction || ''],
                  threshold_limit: [item.threshold_limit || ''],
                 maximum_amount:[item.maximum_amount || ''],
                  current_rate:[item.current_rate || ''],new_rate:[item.new_rate || ''],
                  from_date:[item.from_date || ''],
                  id: [item.id || ''],
                  deleted_flag:[item.deleted_flag || '']
                   
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
    this.route.navigate(['master/configurational-master/tds-list']);
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
      this.createForm.value.id= this.id
      this._configurationalMasterService.updateTdsData(this.createForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/tds-list']);
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
      this._configurationalMasterService.createTDSData(this.createForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/tds-list']);
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
