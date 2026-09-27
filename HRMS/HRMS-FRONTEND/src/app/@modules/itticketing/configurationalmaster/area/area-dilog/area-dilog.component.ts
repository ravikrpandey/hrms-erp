import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-area-dilog',
  templateUrl: './area-dilog.component.html',
  styleUrls: ['./area-dilog.component.scss'],
})
export class AreaDilogComponent {
  filterdepartment: any = [];
  entityId: any = [];
  filterEntitylist: any = [];
  entityList: any;
  isAllSelect: boolean = false;
  areaForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  areaData: any;
  service_categoryId: any;
  view: any;
  departmentList: any;
  entity_id: any;
  entityides: any;
  area_name: any;
  department_name: any;
  old_area_name: any;
  department_id: any;
  patchDept_id: any;
  oldAreaName: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<AreaDilogComponent>,
    private entityService: EntityMasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.areaForm = this.fb.group({
      area_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      department_name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.id = this.data?.id;
    this.view = this.data?.view;
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute?.queryParams?.subscribe((params) => {
      // this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.loginUserID = this.loginUser.id;
    this.getDepartment();
    this.patchDatasubdepartment();
  }

  patchDatasubdepartment() {
    if (this.id) {
      this._configurationalMasterService
        .getByIdAreaMaster(this.id)
        .subscribe((res: any) => {
          this.areaData = res.data;
          console.log('areadata', this.areaData);
          this.areaForm.patchValue({
            area_name: this.areaData?.area_name,
            department_name: this.areaData.department_name,
          });

          this.oldAreaName = this.areaData?.area_name;
        });
    }
  }

  getDepartment() {
    this._configurationalMasterService
      .getDepartment(this.entity_id)
      .subscribe((res: any) => {
        this.departmentList = res.data;
        this.filterdepartment = this.departmentList;
      });
  }
  selectdepartmentname(event: any): void {
    const departmentValue = event.value;
    this.areaForm.get('department_name')?.setValue(departmentValue);
  }

  onSubmitForm() {
    Object.keys(this.areaForm.controls).forEach((key) => {
      this.areaForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.areaForm.invalid) {
      this.toast.error(
        'Required fields should not be empty.',
        'Error Occurred!'
      );
      return;
    }
    let val = this.areaForm.value;
    const data = {
      area_name: val.area_name,
      department_name: val.department_name,
    };
    this._configurationalMasterService.createAreaMaster(data).subscribe(
      (res: any) => {
        if (res.message == 'Area Name is Already Exists!') {
          this.toast.warning('Sub Department Name Already Exist!');
        } else {
          this.toast.success('Sub Department Added Successfully');
          this.route.navigate(['master/configurational-master/area']);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.warning('Sub Department Name Already Exist!');
        } else if (err.error.message) {
          this.toast.warning(err.error.message);
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.areaForm.controls).forEach((key) => {
      this.areaForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.areaForm.invalid) {
      this.toast.error(
        'Required fields should not be empty.',
        'Error Occurred!'
      );
      return;
    }
    const val = this.areaForm.value;
    const data = {
      old_area_name: this.oldAreaName,
      new_area_name: val.area_name,
      department_name: val.department_name,
    };

    this._configurationalMasterService
      .areaMasterUpdate(this.id, data)
      .subscribe(
        (res: any) => {
          if (res.message == 'Area Name is Already Exists!') {
            this.toast.warning('Sub Department Name Already Exist!');
          } else {
            this.toast.success('Sub Department Update Successfully');
            this.route.navigate(['master/configurational-master/area']);
            this.confirmDialog();
            this.reloadCurrentRoute();
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toast.error('Sub Department Already Exist!');
          } else if (err.error.message) {
            this.toast.warning(err.error.message);
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
  }

  confirmDialog() {
    this.dialog.close(this.areaForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  filterDepartment(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterdepartment = [...this.departmentList];
    } else {
      this.filterdepartment = this.departmentList.filter((item: any) =>
        item?.department_name?.toLowerCase().includes(searchValue)
      );
    }
  }
}
