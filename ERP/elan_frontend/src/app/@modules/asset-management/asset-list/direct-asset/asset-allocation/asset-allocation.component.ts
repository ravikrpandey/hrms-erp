import { Component, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { debounceTime } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss']
})
export class AssetAllocationComponent {
  allocateAssetForm: FormGroup;
  entity_id:any;
  financial_year_id:any;
  assetCategoryList:any;
  itemsList:any;
  filterItem:any;
  loginUser:any;
  employee_id:any;
  allDepartment:any;
  filemployeeList: any;
  filterdeptList: any;
  allocationType:any;
  branchList: any;
  filterbranchList:any;
  filterdepartControl = new FormControl();
  filterEmpControl = new FormControl();
  filterBranchControl = new FormControl();
  constructor(private fb: FormBuilder,
    private empRegisterService: EmpRegistrationService,
    private router: Router,
    private toast: ToastrService,
    private asset_service:AssetListService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private dialog: MatDialogRef<AssetAllocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.allocateAssetForm = this.fb.group({
      allocation_type: new FormControl(null),
      department_id: new FormControl(null),
      employee_id: new FormControl(null),
      branch_id: new FormControl(null),
      remarks: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;
    this.filterSearch();
    this.getDepartment();
    this.getBranchList();
  }

  close(){
    this.dialog.close();
  }

  employeeList: any = [];
  getEmployee(dept_id:any) {
    try {
      this.filemployeeList = [];
      this.employeeList = [];
      this.empRegisterService.grtEmployeeList(this.entity_id,this.loginUser?.role).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data.filter((employee: any) =>
            employee.department_id === dept_id
          );
          this.filemployeeList = this.employeeList;
          if(this.employeeList.length < 1){
            return this.toast.error('There are no employees in this department')
          }
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  getDepartment() {
    this._configurationalMasterService
      .getDepartmentAll(this.entity_id)
      .subscribe(
        (res: any) => {
          this.allDepartment = res.data.filter((element: any) => {
            return element.status === "ACTIVE";
          });
          this.filterdeptList = this.allDepartment;
        },
        (err: any) => {
          this.allDepartment = [];
        }
      );
  }

  getBranchList() {
    this._configurationalMasterService.getListActiveBranchSetup().subscribe((res: any) => {
      this.branchList = res.data;
      this.filterbranchList = this.branchList;
    })
  }

  onRadio(event: any) {
    this.allocationType = event;
    const branchControl = this.allocateAssetForm.get('branch_id');
    const departmentControl = this.allocateAssetForm.get('department_id');
    const employeeControl = this.allocateAssetForm.get('employee_id');
  
    if (event === 'transfer to other location') {
      this.filemployeeList = [];
      this.employeeList = [];
      // branchControl?.setValidators([Validators.required]);
  
      // departmentControl?.clearValidators();
      departmentControl?.setValue(null);
  
      // employeeControl?.clearValidators();
      employeeControl?.setValue(null);
    } else {
      // departmentControl?.setValidators([Validators.required]);
      // employeeControl?.setValidators([Validators.required]);
  
      // branchControl?.clearValidators();
      branchControl?.setValue(null);
    }
  
    // branchControl?.updateValueAndValidity();
    // departmentControl?.updateValueAndValidity();
    // employeeControl?.updateValueAndValidity();
  }
  

  async Ondepartment(dept_id:any){
    if(dept_id){
      this.getEmployee(dept_id);
    }else{
      return
    }
    
  }

  filterSearch(){
    this.filterEmpControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.employeeList = this.filemployeeList.filter((employee:any) =>
        employee.first_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterdepartControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.allDepartment = this.filterdeptList.filter((dept:any) =>
        dept.department_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterBranchControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.branchList = this.filterbranchList.filter((branch:any) =>
        branch.branch_name.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  

  onSubmitForm(){
    // if(this.allocateAssetForm.invalid){
    //   return this.toast.warning('please fill all require field !');
    // }
    const endpoint = {
      assign_by: this.employee_id,
      grn_item_status_id: this.data.grn_item_status_id,
      grn_id: this.data.grn_id
    }
    this.asset_service.allocateAssetForm(this.allocateAssetForm.value,endpoint).subscribe((res: any) => {
      this.toast.success(res.message || 'Asset created Successfully');
      this.dialog.close();
      this.reloadCurrentRoute()
    },
    (err: any) => {
      // if (Array.isArray(err.error?.errors)) {
      //   let errorMsg = '';
      //   err.error.errors.forEach((validationErr: any) => {
      //     if (validationErr?.msg) {
      //       errorMsg += validationErr.msg + '\n';
      //     }
      //   });
      //   this.toast.error(errorMsg.trim());
      //   return;
      // }     
      
      if (Array.isArray(err.error?.errors)) {
        Object.values(this.allocateAssetForm.controls).forEach(control => {
          control.markAsTouched();
        });
        err.error.errors.forEach((validationErr: any) => {
          const field = validationErr.param;
          const message = validationErr.msg;
      
          if (field && this.allocateAssetForm.controls[field]) {
            this.allocateAssetForm.controls[field].setErrors({ serverError: message });
          }
        });
        return
      }
    
      const backendMessage = err?.error?.message || err?.message || 'Something went wrong!';
      this.toast.error(backendMessage);
      
      })
  }
}

