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
  selector: 'app-division-dialog',
  templateUrl: './division-dialog.component.html',
  styleUrls: ['./division-dialog.component.scss'],
})
export class DivisionDialogComponent {
  country_id: any;
  listGrade: any;
  singleGrade: any;
  gradeForm: FormGroup
  entity_Id: any;
  loginUser: any;
  constructor(
    private dialog: MatDialogRef<DivisionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService, private _fb: FormBuilder, private route: Router, private toaster: ToastrService
  ) {
    this.gradeForm = _fb.group({
      division_name: new FormControl(null, [Validators.required, noLeadingSpaces()])
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
    if(this.editGrade == "edit" || this.visible){
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
      .divisiondetails(this.listGrade)
      .subscribe((res: any) => {
        this.singleGrade = res.data;
        if (this.editGrade == 'edit') {
          this.gradeForm.patchValue({
            division_name: this.singleGrade.division_name
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
    if (this.gradeForm.invalid) {
      return
    }
    if (this.listGrade) {
      this._configurationalmasterService.divisionupdate(this.listGrade, data).subscribe(
        (res: any) => {
          if (res.message == "division already exists!") {
            this.toaster.warning('Division already exists!');
          }
          else {
            this.toaster.success('Division Update Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.gradeForm.reset();
          }
        }, (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toaster.error('Division is Already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        });
    }
    else {
      data.entity_id = this.entity_Id
      this._configurationalmasterService.division(data).subscribe(
        (res: any) => {
          if (res.message == "division already exists!") {
            this.toaster.warning('Division already exists!');
          }
          else {
            this.toaster.success('Division Added Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.gradeForm.reset();
          }
        },
        (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toaster.error('Division is Already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }

  }
}
