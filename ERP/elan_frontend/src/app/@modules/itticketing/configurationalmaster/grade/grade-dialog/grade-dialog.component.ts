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
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss'],
})
export class GradeDialogComponent {
  country_id: any;
  listGrade: any;
  singleGrade: any;
  gradeForm: FormGroup
  constructor(
    private dialog: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService, private _fb: FormBuilder, private route: Router, private toaster: ToastrService
  ) {
    this.gradeForm = _fb.group({
      grade_name: new FormControl(null, [Validators.required, noLeadingSpaces()])
    })
    this.listGrade = data.id;
  }
  add_grade: any
  editGrade: any;
  visible: any
  ngOnInit() {
    this.getByIdRole();
    this.add_grade = this.data.grade;
    this.editGrade = this.data.grade;
    this.visible = this.data.visible;
  }

  getByIdRole() {
    this._configurationalmasterService
      .getByIdGrade(this.listGrade)
      .subscribe((res: any) => {
        this.singleGrade = res.data;
        if (this.editGrade == 'edit') {
          this.gradeForm.patchValue({
            grade_name: this.singleGrade[0].grade_name
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
      this._configurationalmasterService.editGrade(this.listGrade, data).subscribe(
        (res: any) => {
          if (res.message == "Grade is Already Exits!") {
            this.toaster.warning('Grade is Already Exits!');
          }
          else {
            this.toaster.success('Grade Update Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.gradeForm.reset();
          }
        }, (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toaster.error('Grade is Already Exits!');
          } else {
            this.toaster.error('Error in submission!');
          }
        });
    }
    else {
      this._configurationalmasterService.creategrade(data).subscribe(
        (res: any) => {
          if (res.message == "Grade is Already Exits!") {
            this.toaster.warning('Grade is Already Exits!');
          }
          else {
            this.toaster.success('Grade Added Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.gradeForm.reset();
          }
        },
        (err: any) => {
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toaster.error('Grade is Already Exits!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }

  }
}
