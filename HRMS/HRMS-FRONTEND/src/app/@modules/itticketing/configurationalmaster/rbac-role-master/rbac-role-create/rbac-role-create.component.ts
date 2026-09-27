import { Component } from '@angular/core';
import { FormBuilder,FormControl,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-rbac-role-create',
  templateUrl: './rbac-role-create.component.html',
  styleUrls: ['./rbac-role-create.component.scss']
})
export class RbacRoleCreateComponent {
  checked = true;
  roleMasterForm: any;
  roleData: any;
  id: any;
  roleGetByData: any;
  role_id: any;
  employee_id: any;
  loginUser: any;
  branchData: any;
  getLocal: any;
  constructor(private route:Router, private fb: FormBuilder,private _configurationalMasterService: ConfigurationalmasterService, private _rbacMasterService: RbacMasterService, private activetRoute: ActivatedRoute, private toaster:ToastrService,private location: Location) {
    this.roleMasterForm = this.fb.group({
      role_master_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      // branch_id: new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.employee_id= this.id.employee_id
      debugger
      this.role_id = this.id.role_master_id
      
    })
    this.getByIdRole();
    this.getRole();
    let getLocal:any=localStorage.getItem("entityList")
    this.getLocal = JSON.parse(getLocal);
    console.log(this.getLocal[0]?.entity_id,'getLocal');

    let data={
      entity_id:this.getLocal[0]?.entity_id
    }
    this._configurationalMasterService.getListBranchSetup(data).subscribe((res: any) => {
      this.branchData = res.data
    })
  }
  goBack() {
    this.location.back();
  }

  roleSubmitForm() {
    debugger
    let val = this.roleMasterForm.value;
    if (this.roleMasterForm.invalid) {
      this.toaster.error('required fields should not be blank', 'Required fields');
      return
    }
    if(!this.role_id){

      this._rbacMasterService.createRole(val).subscribe((res: any) => {
        
        this.toaster.success('Master Role Created');
        this.route.navigate(['master/hrms/rbacmaster/rbac-role-master'])
      },
      (err)=>{
        if(err.status==403){
          this.toaster.error("Role Master Name is Already Exits!")
        }
      }
      )
    }else{
      
      this._rbacMasterService.updateRole(this.role_id,val).subscribe((res:any)=>{
       
       this.toaster.success('Master Role Updated');
       this.route.navigate(['master/hrms/rbacmaster/rbac-role-master'])
      })
    }
   }

  getRole() {
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleData = res.data;
      

    })
  }

  getByIdRole() {
    this._rbacMasterService.getByIdRole(this.role_id).subscribe((res: any) => {
      this.roleGetByData = res.data;
      
      this.roleMasterForm.patchValue({
        role_master_name: this.roleGetByData?.role_master_name,
        branch_id: this.roleGetByData?.branch_id
      })
    })
  }

  back(){
    this.route.navigate(['master/hrms/rbacmaster/rbac-role-master'])
  }
}
