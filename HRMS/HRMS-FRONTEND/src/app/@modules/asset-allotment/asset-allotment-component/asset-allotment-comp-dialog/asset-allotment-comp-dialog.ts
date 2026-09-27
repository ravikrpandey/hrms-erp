import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { AssetallotmentService } from '../../assetallotment-service';

@Component({
  selector: 'app-asset-allotment-comp-dialog',
  templateUrl: './asset-allotment-comp-dialog.html',
  styleUrls: ['./asset-allotment-comp-dialog.scss'],
})
export class AssetAllotmentCompDialog {
  listAssetcategory: any;
  singleGrade: any;
  assetallotmentForm: FormGroup;
  isAllSelectDepartment: boolean = false;
  entity_Id: any;
  loginUser: any;
  mainId: any;
  add_assetallotment: any;
  editAssetallotment: any;
  assetmasterlist: any = [];
  visible: any;
  startDate: any;
  isDisabled: boolean = false;

  constructor(
    private dialog: MatDialogRef<AssetAllotmentCompDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _assetAllotmentService: AssetallotmentService,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.assetallotmentForm = _fb.group({
      asset_master_id: new FormControl(null, [Validators.required]),
      department_list: new FormControl(null, [Validators.required]),
      assigned_to: new FormControl(null, [Validators.required]),
      asset_allotment_date: new FormControl(null, [Validators.required]),
      condition_on_allotment: new FormControl(null, [Validators.required]),
      remark: new FormControl(null, [Validators.required]),
    });
    this.listAssetcategory = data.id;
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.localStorage();
    this.add_assetallotment = this.data.assetallotment;
    this.editAssetallotment = this.data.assetallotment;
    this.visible = this.data.visible;
    if (this.editAssetallotment == "edit" || this.visible) {
      this.getassetAllotmentById();
    }
    this.getAllDepartment_dropDown();
    this.getAllAvailableAssetMaster();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  getAllAvailableAssetMaster() {
    this._assetAllotmentService.getAllAvailableAssetMaster(this.entity_Id).subscribe((res: any) => {
      this.assetmasterlist = res.data;

    });
  }
  getassetAllotmentById() {
    this._assetAllotmentService
      .getassetAllotmentById(this.listAssetcategory)
      .subscribe((res: any) => {
        this.singleGrade = res.data;

        const category = this.assetmasterlist.find((cat: any) =>
          cat.asset_category_id === res.data.asset_category_id
        );

        this.singleGrade.asset_category_name = category?.asset_category_name || 'N/A';

        this.assetallotmentForm.patchValue({
          asset_master_id: res.data.asset_master_id,
          department_list: res.data.dept_id ? [res.data.dept_id] : [], // FIXED
          assigned_to: res.data.assigned_to,
          asset_allotment_date: res.data.asset_allotment_date,
          condition_on_allotment: res.data.condition_on_allotment,
          remark: res.data.remark
        });
        if (res.data.dept_id) {
          this.getAllDepartmentChange([res.data.dept_id]);
        }
      });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  ngSubmitEmp(data: any) {
    if (this.assetallotmentForm.invalid) {
      this.toaster.warning('Please fill all required fields');
      return;
    }
    // Get category name from ID
    const selectedCategory = this.assetmasterlist.find(
      (c: any) => c.asset_category_id === this.assetallotmentForm.value.asset_category_id
    );

    const payload = {
      asset_master_id: this.assetallotmentForm.value.asset_master_id,
      assigned_to: this.assetallotmentForm.value.assigned_to,
      asset_allotment_date: this.assetallotmentForm.value.asset_allotment_date,
      condition_on_allotment: this.assetallotmentForm.value.condition_on_allotment,
      remark: this.assetallotmentForm.value.remark?.trim(),
      entity_id: this.entity_Id,
      alloted_by: this.mainId
    };
    console.log('Submitting payload:', payload); // Debug log

    if (this.listAssetcategory) {
      // UPDATE MODE
      this._assetAllotmentService.assetAllotmentUpdate(this.listAssetcategory, payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.message === "Asset subcategory already exists!") {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Updated successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.assetallotmentForm.reset();
          }
        },
        (err: any) => {
          console.error('Update error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 409) {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (err.status === 404) {
            this.toaster.error('Record not found!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    } else {
      // CREATE MODE
      this._assetAllotmentService.assetAllotmentCreate(payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.code === 201 || res.message === "Asset subcategory already exists!") {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Added successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.assetallotmentForm.reset();
          }
        },
        (err: any) => {
          console.error('Create error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 201 || err.status === 409) {
            this.toaster.error('Asset subcategory already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }
  }
  // Department
  getAllDepartment: any;
  getAllDepartment2: any = [];
  departments: any = [];
  getAllDepartment_dropDown() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {
        this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");
        this.getAllDepartment2 = this.getAllDepartment;
        this.departments = this.getAllDepartment2.map((res: any) => res.department_name);
      }
    );
  };

  departmentSearch(e: any) {
    const aa = e
    let filteredVariable = this.getAllDepartment2.filter((item: any) => aa.includes(item.department_name));
    this.getAllDepartment = filteredVariable
  }

  // get all employee
  employeeListName: string;
  kpaEmp: any;
  employeeList: any = [];
  employeeList2: any;
  employees: any;
  employeeNameList: any;
  selectedEmployee: any;
  selectedDepartment: any;
  disableField: boolean = false;

  getAllDepartmentChange(event: any) {
    console.log("Hiiiii", event)

    this._hrmkpaService.getemployeeById(event).subscribe((res: any) => {
      if (res) {
        this.employeeList = [];
        this.employeeList = res.data;
        this.employeeList2 = res.data;
        this.employees = this.employeeList2.map((res: any) => `${res.first_name} ${res?.middle_name || ''} ${res.last_name} ${res?.employee_code}`);
        this.employeeNameList = this.getEmp(this.employeeList)
      }
    }, err => {
      this.toaster.error(err.error.message);
      this.employeeList = [];
      this.selectedEmployee = "";
      this.assetallotmentForm.get('employee_list')?.setValue([]);
    });
  }

  getEmp = (empList: any) => {
    this.employeeListName = ""
    empList.forEach((empName: any) => {
      this.kpaEmp.forEach((empId: any) => {
        if (empId.employee_id == empName.employee_id) {
          this.employeeListName += empName.first_name + " " + empName.last_name + ",";
        }
      })
    })

    if (this.employeeListName.length >= 2) {
      this.employeeListName = this.employeeListName.slice(0, -1)
    }
  }

  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.employeeList2.filter((item: any) => aa.includes(`${item.first_name} ${item?.middle_name || ''} ${item.last_name} ${item?.employee_code}`));
    this.employeeList = filteredVariable
  }

  isAllSelect: boolean = false;
  selectAllEmployee(event: any): void {

    let checked = event?.target?.checked;

    if (checked) {
      this.selectedEmployee = this.employeeList.map((emp: { employee_id: any; }) => emp.employee_id);
    } else {
      this.selectedEmployee = [];
    }
    this.isAllSelect = checked;

  }
  selectAllDepartment(event: any): void {
    let checked = event?.target?.checked;

    if (checked) {
      this.selectedDepartment = this.getAllDepartment.map((emp: { dept_id: any; }) => emp.dept_id);
    } else {
      this.selectedDepartment = [];
    }
    this.isAllSelectDepartment = checked;
    this.getAllDepartmentChange(this.selectedDepartment)
  }
}