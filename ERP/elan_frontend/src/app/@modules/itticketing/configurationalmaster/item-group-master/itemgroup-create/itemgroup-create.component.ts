import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control?.value && control?.value?.trimLeft() !== control?.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-subcategory-create',
  templateUrl: './itemgroup-create.component.html',
  styleUrls: ['./itemgroup-create.component.scss'],
})
export class SubcategoryCreateComponent {
  createPrItemForm: FormGroup;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  entity_id: any;
  itemGroupFrom: FormGroup;
  id : any;
  action_type:any;
  data:any = [];
  response:any = null;
  financial_year_id: string | null;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router
  ) {
    this.itemGroupFrom = this.fb.group({
      item_master_id: new FormControl(null),
      Item_group: new FormControl(null, [Validators.required]),
      Item_group_code: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit() {
    
  

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
      if ( this.action_type != 'view' && this.action_type != 'edit') {
        this.entity_id = localStorage.getItem('selectedEntityId');
        this.financial_year_id = localStorage.getItem('financial_id');
        const Item_group_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();
        this.itemGroupFrom.patchValue({
          Item_group_code: Item_group_code
        });
      }
      this.getAllCategory()
    });
  }

  getitemgroupId = (id: any) => {
    this._commonService?.showLoader();
    console.log("fdafaddf",id)
    this._configurationalMasterService
      .getitemgroupId(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          this.itemGroupFrom.patchValue({
            item_master_id: this.response.item_master_id,
            Item_group: this.response.Item_group,
            Item_group_code: this.response.Item_group_code,
           
          });
          ;
          console.log("++++",res)
          this._commonService?.hideLoader();
          this.toaster.success(res.message);
          // this.route.navigate(['master/configurational-master/pr-item']);
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
  }

  getAllCategory() {
      this._commonService?.showLoader()
      this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.data = res.data;
      console.log("++++",this.data)
      if ( this.id ) {
        this.getitemgroupId(this.id);
      }
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
  })
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/itemgroup-master']);
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

  onSubmit() {
    if (this.itemGroupFrom.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    let val = this.itemGroupFrom.value;
    
    const data = {
      item_master_id:val?.item_master_id,
      Item_group:val?.Item_group.trim(),
      Item_group_code:val?.Item_group_code,
      entity_id:this.entity_id,
      financial_year_id:this.financial_year_id

      
    };


    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updateitemGroup(this.id,data)
        .subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/itemgroup-master']);
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          }
        );
    } else {
      this._commonService?.showLoader();
      // console.log("som e text her")
      this._configurationalMasterService.createitemgroup(data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/itemgroup-master']);
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
