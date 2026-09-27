import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DepartmentDialogComponent } from '../../department/department-dialog/department-dialog.component';

@Component({
  selector: 'app-add-cost-profit-center',
  templateUrl: './add-cost-profit-center.component.html',
  styleUrls: ['./add-cost-profit-center.component.scss']
})
export class AddCostProfitCenterComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  entity_id: any;
 

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    public dialog: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      selected_type: new FormControl(null, [Validators.required, ]),
      name: new FormControl(null, [Validators.required, ]),
    });
  }
  ngOnInit() {
  
    this.view = this.data?.view
    this.entity_id = localStorage.getItem('selectedEntityId');
   if(this.data?.status == 'view'|| this.data?.status == 'edit' ){
      this.departmentForm.patchValue({
        selected_type:this.data.data?.selected_type,
        name:this.data.data?.name,
        
      })
   }
  
  }









  onSubmitForm() {
    this._commonService?.showLoader()
    let val = this.departmentForm.value;
    const data = {
      id:this.data?.data?.id?this.data?.data?.id:null,
      selected_type: val.selected_type.trim(),
      name: val.name.trim(),
      entity_id: this.entity_id
    };
   
    this._configurationalMasterService.createCostProfitType(data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.toast.success(res.message)
        this.dialog.close()
        this.reloadCurrentRoute()
      },
      (err) => {
        this._commonService?.hideLoader()
        this.toast.error(err.error.message)
        
      }
    );
   
    
  }

   reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  
  confirmDialog() {
    this.dialog.close(this.departmentForm.value);
  }

 
}
