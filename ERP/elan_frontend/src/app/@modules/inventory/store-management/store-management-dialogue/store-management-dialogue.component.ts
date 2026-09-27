import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { StoreManagementService } from 'src/app/@shared/services/inventory/store-management.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-store-management-dialogue',
  templateUrl: './store-management-dialogue.component.html',
  styleUrls: ['./store-management-dialogue.component.scss']
})
export class StoreManagementDialogueComponent {

    store_Id: any;
    branch_Dropdown : any;
    store_Management: FormGroup;
    id: any;
    mainId: any;
    submitted: boolean | undefined;
    loginUser: any;
    loginUserID: any;
    view: any;
  getStoreById: any;

    constructor(
      private toast: ToastrService,
      private fb: FormBuilder,
      private _configurationalMasterService: ConfigurationalmasterService,
      private store_Management_Service:StoreManagementService,
      private route: Router,
      private activeroute: ActivatedRoute,
      private dialog: MatDialogRef<StoreManagementDialogueComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.store_Management = this.fb.group({
        store_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
        branch: new FormControl(null, [Validators.required]),
      });
    }
    ngOnInit() {
      this.apiOnLoad()
      this.store_Id = this.data.id
      this.view = this.data.view
      this.mainId = localStorage.getItem('EmpMainId');
      this.activeroute.queryParams.subscribe((params) => {
        this.id = params;
      });
      let a: any = localStorage.getItem('signInUser');
      this.loginUser = JSON.parse(a)
      this.loginUserID = this.loginUser.employee_id;
      console.log(this.loginUserID, 'loginn');
      if (this.store_Id) {
        this.getStoreByID();
      }
    }

    apiOnLoad(){
      this.branchSetup_get()
    }

    branchSetup_get() {
      this.store_Management_Service.branchSetup_get().subscribe((res: any) => {
        this.branch_Dropdown = res.data;
      })
    }
  
    getStoreByID() {
      this.store_Management_Service.getStoreByID(this.store_Id).subscribe((res: any) => {
        this.getStoreById = res.data;
        this.store_Management.patchValue({
          store_name: this.getStoreById?.store_name,
          branch: this.getStoreById?.branch_id,
        })
      },
        (err: any) => {
          this.toast.warning('Please Activate Status of this Record ',
            'Error Message'
          );
  
        }
      );
    }
    onSubmitForm() {
      Object.keys(this.store_Management.controls).forEach(key => {
        this.store_Management.controls[key].markAsTouched();
      });
      this.submitted = false;
      if (this.store_Management.invalid) {
        this.toast.error('Required fields should not be empty.', 'Error Occurred!');
        return;
      }
      let val = this.store_Management.value;
      const data = {
        store_name: val.store_name,
        branch_id: val.branch

      };
      this.store_Management_Service.save_store(data).subscribe(
        (res: any) => {
          if (res.message === "save_store Name is Already Exits!") {
            this.toast.warning('Save Store Name Already Exists!');
          }
          else {
            this.toast.success('Save Store Added Successfully');
            this.route.navigate([
              'master/inventory-management/store-management',
            ]);
            this.confirmDialog();
            this.reloadCurrentRoute();
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toast.error('Save Store Name Already Exists!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
  
    onUpdateForm() {
      Object.keys(this.store_Management.controls).forEach(key => {
        this.store_Management.controls[key].markAsTouched();
      });
      this.submitted = false;
      if (this.store_Management.invalid) {
        this.toast.error('Required fields should not be empty.', 'Error Occurred!');
        return;
      }
      let val = this.store_Management.value;
      const data = {
        "id": this.store_Id,
        "values": {
          store_name: val.store_name,
          branch_id: val.branch
        }
      };
      this.store_Management_Service.update_store(data).subscribe(
        (res: any) => {
          if (res.message == "save_store Name is Already Exits!") {
            this.toast.warning('Save Store Name Already Exists!');
          }
          else {
            this.toast.success('Save Store Update Successfully');
            this.route.navigate([
              'master/inventory-management/store-management',
            ]);
            this.confirmDialog();
            this.reloadCurrentRoute();
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toast.error('Save Store Name Already Exists!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
    confirmDialog() {
      this.dialog.close(this.store_Management.value);
    }
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
  
  
}
