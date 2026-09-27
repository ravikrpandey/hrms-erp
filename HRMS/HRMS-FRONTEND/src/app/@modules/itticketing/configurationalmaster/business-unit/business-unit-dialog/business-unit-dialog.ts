import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-business-unit-dialog',
  templateUrl: './business-unit-dialog.html',
  styleUrls: ['./business-unit-dialog.scss'],
})
export class BusinessUnitDialog {
  country_id: any;
  listGrade: any;
  singleGrade: any;
  businessunitForm: FormGroup
  entity_Id: any;
  loginUser: any;
  constructor(
    private dialog: MatDialogRef<BusinessUnitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService, private _fb: FormBuilder, private route: Router, private toaster: ToastrService
  ) {
    this.businessunitForm = _fb.group({
      businessunit_name: new FormControl(null, [Validators.required, noLeadingSpaces()])
    })
    this.listGrade = data.id;
  }
  add_grade: any
  editGrade: any;
  visible: any
  ngOnInit() {
    this.localStorage()
    this.add_grade = this.data.grade;
    this.editGrade = this.data.grade;
    this.visible = this.data.visible;
    if (this.editGrade == "edit" || this.visible) {
      this.getByIdRole();
    }
  }
  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }


  getByIdRole() {
    this._configurationalmasterService
      .getbusinessUnitById(this.listGrade)
      .subscribe((res: any) => {
        this.singleGrade = res.data;
        if (this.editGrade == 'edit') {
          this.businessunitForm.patchValue({
            businessunit_name: this.singleGrade.businessunit_name
          })
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
    if (this.businessunitForm.invalid) {
      return
    }
    if (this.listGrade) {
      this._configurationalmasterService.businessUnitEdit(this.listGrade, data).subscribe(
        (res: any) => {
          if (res.message == "Business Unit already exists!") {
            this.toaster.warning('Business Unit already exits!');
          }
          else {
            this.toaster.success('Updated successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.businessunitForm.reset();
          }
        }, (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toaster.warning('Business Unit already exits!');
          } else {
            this.toaster.error('Error in submission!');
          }
        });
    }
    else {
      data.entity_id = this.entity_Id
      this._configurationalmasterService.businessunitCreate(data).subscribe(
        (res: any) => {
          if (res.message == " already exists!") {
            this.toaster.warning('Business Unit already exits!');
          }
          else {
            this.toaster.success('Added successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.businessunitForm.reset();
          }
        },
        (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toaster.error('Business Unit is Already Exits!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }

  }
}