import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { debounceTime } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-bulk-allocation',
  templateUrl: './bulk-allocation.component.html',
  styleUrls: ['./bulk-allocation.component.scss']
})

export class BulkAllocationComponent {
  allocateAssetForm: FormGroup;
  entity_id: any;
  financial_year_id: any;
  assetCategoryList: any;
  itemsList: any;
  filterItem: any;
  loginUser: any;
  employee_id: any;
  allDepartment: any;
  filemployeeList: any;
  filterdeptList: any;
  allocationType: any;
  branchList: any;
  filterbranchList: any;
  selectedNames: any;
  //    selectedNames: {
  //   item_name: string;
  //   asset_tagId: string;
  //   grn_item_status_id: number;
  // }[] = [];
  filterdepartControl = new FormControl();
  filterEmpControl = new FormControl();
  filterBranchControl = new FormControl();
  constructor(private fb: FormBuilder,
    private empRegisterService: EmpRegistrationService,
    private router: Router,
    private toast: ToastrService,
    private asset_service: AssetListService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private dialog: MatDialogRef<BulkAllocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectedNames = data.selectedNames;
    this.allocateAssetForm = this.fb.group({
      allocation_type: new FormControl(null, Validators.required),
      department_id: new FormControl(null, Validators.required),
      employee_id: new FormControl(null),
      branch_id: new FormControl(null),
      assign_by: new FormControl(null, Validators.required),
      remarks: new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;
    this.allocateAssetForm.get('assign_by')?.setValue(this.employee_id);
    this.filterSearch();
    this.getDepartment();
    this.getBranchList();
  }
  selectedAssets: any = [];

  removeName(index: number): void {
    this.selectedNames.splice(index, 1);
  }
  //  removeName(index:any): void {
  //   
  //   this.selectedNames

  //   this.selectedNames.removeAt(index);
  // this.selectedNames = this.data.selectedNames.filter(
  //   (chip:any) => chip.grn_item_status_id !== item.grn_item_status_id
  // );

  // this.selectedAssets = this.selectedAssets.filter(
  //   (asset:any) => asset.grn_item_status_id !== item.grn_item_status_id
  // );
  // }

  close() {
    this.dialog.close();
  }

  employeeList: any = [];
  getEmployee(dept_id: any) {
    try {
      this.filemployeeList = [];
      this.employeeList = [];
      this.empRegisterService.grtEmployeeList(this.entity_id, this.loginUser?.role_master_id).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data.filter((employee: any) =>
            employee.department_id === dept_id
          );
          this.filemployeeList = this.employeeList;
          if (this.employeeList.length < 1) {
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

    // Reset values
    branchControl?.setValue(null);
    departmentControl?.setValue(null);
    employeeControl?.setValue(null);

    // Clear all existing validators first
    branchControl?.clearValidators();
    departmentControl?.clearValidators();
    employeeControl?.clearValidators();

    if (event === 'transfer to other location') {
      this.filemployeeList = [];
      this.employeeList = [];

      branchControl?.setValidators([Validators.required]);
    } else {
      departmentControl?.setValidators([Validators.required]);
      employeeControl?.setValidators([Validators.required]);
    }

    // Update validity of controls
    branchControl?.updateValueAndValidity();
    departmentControl?.updateValueAndValidity();
    employeeControl?.updateValueAndValidity();
  }



  async Ondepartment(dept_id: any) {
    if (dept_id) {
      this.getEmployee(dept_id);
    } else {
      return
    }

  }

  filterSearch() {
    this.filterEmpControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.employeeList = this.filemployeeList.filter((employee: any) =>
        employee.first_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterdepartControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.allDepartment = this.filterdeptList.filter((dept: any) =>
        dept.department_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterBranchControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.branchList = this.filterbranchList.filter((branch: any) =>
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


  onSubmitForm() {
    let payload = {
      formdata: this.allocateAssetForm.value,
      assets: this.selectedNames
    }
    if (this.selectedNames.length < 1) {
      return this.toast.error('Asset is required !');
    }
    if (this.allocateAssetForm.invalid) {
      this.allocateAssetForm.markAllAsTouched();
      const invalidFields = Object.keys(this.allocateAssetForm.controls).filter(field => this.allocateAssetForm.get(field)?.invalid);
      console.warn('Invalid fields:', invalidFields);
      return;
    }
    this.asset_service.allocateBulkAsset(payload).subscribe((res: any) => {
      this.toast.success(res.message || 'Asset created Successfully');
      this.dialog.close();
      this.reloadCurrentRoute()
    },
      (err: any) => {
        const backendMessage = err?.error?.message || err?.message || 'Something went wrong!';
        this.toast.error(backendMessage);
      })
  }
}


