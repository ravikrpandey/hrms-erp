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
  selector: 'app-level-dialog',
  templateUrl: './level-dialog.component.html',
  styleUrls: ['./level-dialog.component.scss']
})

export class LevelDialogComponent {
  level_slab_id: any;
  singleLevelSlabData: any;
  levelSlabForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  view: any;
  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<LevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.levelSlabForm = this.fb.group({
      level_slab_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.level_slab_id = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.level_slab_id) {
      this.getByIdLevelSlab();
    }
  }

  getByIdLevelSlab() {
    this._configurationalMasterService.getByIdSlab(this.level_slab_id).subscribe((res: any) => {
      this.singleLevelSlabData = res.data;
      this.levelSlabForm.patchValue({
        level_slab_name: this.singleLevelSlabData?.level_slab_name,
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
    Object.keys(this.levelSlabForm.controls).forEach(key => {
      this.levelSlabForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.levelSlabForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.levelSlabForm.value;
    const data = {
      level_slab_name: val.level_slab_name,
    };
    this._configurationalMasterService.CreateLevelSlab(data).subscribe(
      (res: any) => {
        if (res.message === "level_slab Name is Already Exits!") {
          this.toast.warning('Level Slab Name is Already Exits!');
        }
        else {
          this.toast.success('Level Slab Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/level-slab',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Level Slab Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.levelSlabForm.controls).forEach(key => {
      this.levelSlabForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.levelSlabForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.levelSlabForm.value;
    const data = {
      level_slab_name: val.level_slab_name,
    };
    this._configurationalMasterService.updateSingleLevelSlab(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "level_slab Name is Already Exits!") {
          this.toast.warning('Level Slab Name is Already Exits!');
        }
        else {
          this.toast.success('Level Slab Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/level-slab',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Level Slab Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.levelSlabForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}

