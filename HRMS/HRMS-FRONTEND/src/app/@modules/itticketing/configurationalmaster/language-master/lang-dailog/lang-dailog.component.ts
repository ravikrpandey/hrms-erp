import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-lang-dailog',
  templateUrl: './lang-dailog.component.html',
  styleUrls: ['./lang-dailog.component.scss']
})
export class LangDailogComponent {
  language_id: number;
  singleData: any;
  languageForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<LangDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.languageForm = this.fb.group({
      language_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.language_id = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute?.queryParams?.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.language_id) {
      this.getByIdCategory();
    }
  }

  getByIdCategory() {
    this._configurationalMasterService.getlangById(this.language_id).subscribe((res: any) => {
      this.singleData = res.data;
      this.languageForm.patchValue({
        language_name: this.singleData?.language_name,
      })
    })
  }

  onSubmitForm() {
    Object.keys(this.languageForm.controls).forEach(key => {
      this.languageForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.languageForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.languageForm.value;
    const data = {
      language_name: val.language_name,
    };
    this._configurationalMasterService.create_new_language(data).subscribe(
      (res: any) => {
        if (res.message === "Language Name is Already Exits!") {
          this.toast.warning('Language Name is Already Exits!');
        }
        else {
          this.toast.success('Language Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/language-master',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Language Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.languageForm.controls).forEach(key => {
      this.languageForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.languageForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.languageForm.value;
    const data = {
      language_name: val.language_name,
    };
    this._configurationalMasterService.updateLang(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "Language Name is Already Exits!") {
          this.toast.warning('Language Name is Already Exits!');
        }
        else {
          this.toast.success('Language Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/language-master',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Language Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.languageForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
