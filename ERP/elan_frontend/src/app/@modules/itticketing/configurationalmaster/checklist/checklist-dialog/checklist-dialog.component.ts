import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
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
  selector: 'app-checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  styleUrls: ['./checklist-dialog.component.scss']
})
export class ChecklistDialogComponent {

  listEmpt: any;
  singleEmpt: any;
  checklistType: FormGroup
  constructor(
    private dialog: MatDialogRef<ChecklistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _commonService : CommonService, 
    private _fb: FormBuilder, private route: Router, private toaster: ToastrService
  ) {
    this.listEmpt = data.id;
    this.checklistType = _fb.group({
      checklist_name: new FormControl(null, [Validators.required, noLeadingSpaces()])
    })
  }
  AddChecklist_type: any;
  editChecklist: any;
  visibility: any;
  ngOnInit() {
    this.editChecklist = this.data.edit;
    this.AddChecklist_type = this.data.add_checklist;
    this.visibility = this.data.visible
    if (this.visibility === 'visible') {
      this.getByIdRole();
    }
    if (this.editChecklist == 'edit') {
      this.getByIdRole();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getByIdRole() {
    this._commonService?.showLoader()
    this._configurationalmasterService
      .getByIdCHECKLIST(this.listEmpt)
      .subscribe((res: any) => {
        this._commonService?.hideLoader()
        this.singleEmpt = res.data;
        if (this.listEmpt) {
          this.checklistType.patchValue({
            checklist_name: this.singleEmpt?.checklist_name
          })
        }

      },(err:any) => {
        this._commonService?.hideLoader()
      });
  }
  ngSubmitEmp(data: any) {
    if (this.checklistType.invalid) {
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    if (this.listEmpt) {
      this._commonService?.showLoader()
      this._configurationalmasterService.updateCHECKLIST(this.listEmpt, data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader()
          if (res.message == "Checklist Already Exits!") {
            this.toaster.warning('Checklist Already Exists!');
          }
          else {
            this.toaster.success('Checklist Updated Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
          }
        }, (err: any) => {
          this._commonService?.hideLoader()
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 409) {
            this.toaster.error('Checklist Name Already Exists!');
          }else if (err.message) {
            this.toaster.error(err.message);
          }  else {
            this.toaster.error('Error in submission!');
          }
        });

    }
    else {
      this._commonService?.showLoader()
      this._configurationalmasterService.createchecklist(data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader()
          if (res.message === "Checklist Type Already Exits!") {
            this.toaster.warning('Checklist Type Already Exists!');
          }
          else {
            this.toaster.success('Checklist Added Successfully');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        },
        (err: any) => {
          this._commonService?.hideLoader()
          if (err.status == 400) {
            this.toaster.error('Something went Wrong!');
          } else if (err.status == 201) {
            this.toaster.error('Checklist Name Already Exists!');
          }else if (err.error.message) {
            this.toaster.error(err.error.message);
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }

  }


}
