import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/miscellaneous.service';


@Component({
  selector: 'app-upload-excel-dialog',
  templateUrl: './upload-excel-dialog.component.html',
  styleUrls: ['./upload-excel-dialog.component.scss']
})
export class UploadExcelDialogComponent implements OnInit {

  fileFormSetupObj: FormGroup = new FormGroup({});
  config: any;
  loginUser: any;
  fileToUpload: any ;
  title:any;
  dropdownlist:any;
  header:any;
  fYears: any = [];
  monthList:any = [];
  depreciationType:any = [];
  filter_fy:any;
  entity_id:any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: Router,
    private _commonService : CommonService,
    private toast: ToastrService,
    public dialog: MatDialogRef<UploadExcelDialogComponent>,
    public toaster: ToastrService,
    public miscellaneousService: MiscellaneousService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileFormSetupObj = this.fb.group({
      file: new FormControl(null,[Validators.required]),
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let lg: any = localStorage.getItem('signInUser')
    this.filter_fy = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(lg);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onChange(e: any) {
    const currentFile: File = e.target.files[0];
    this.fileToUpload = currentFile;
  }

  // onPanelClose() {
  //   this.filterControl.setValue('');
  // }

  // On click submit start
  saveDetails() {
    this.submitForm()
  }
  // On click submit end

  // Form save start
  submitForm() {
    try {

      debugger
      this.markFormGroupTouched(this.fileFormSetupObj);
      if(this.fileFormSetupObj.invalid){
        this.toaster.error('Please upload file first','Error')
        return
      }

      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this._commonService?.showLoader()
      this.miscellaneousService.exportToExcel(formData).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader();
          this.toast.success(response.message);
          this.dialog.close();
          // this.reloadCurrentRoute();
        }
      }, err => {
        this._commonService?.hideLoader()
        this.toast.error(err?.error?.message);
        console.log(err);
        this.dialog.close();
      })
    } catch (error) {
      this._commonService?.hideLoader()
      console.log(error);
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    })
  };
  // Form update end

}

