import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-excel-dialog',
  templateUrl: './upload-excel-dialog.component.html',
  styleUrls: ['./upload-excel-dialog.component.scss']
})
export class UploadExcelDialogComponent {
  showLoader: boolean = false;
  assetForm: FormGroup;
  filePath: any;
  selectedFileExc: any = null;
  allowedExtensions: string[] = ['xlsx', 'csv'];
  sourceList: any[];
  entity_id: any;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toaster: ToastrService,
    private asset_service: AssetListService,
    public dialog: MatDialogRef<UploadExcelDialogComponent>,
  ) {
    this.assetForm = this.fb.group({
      file: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
  };

  acceptFile(e: any): void {
    const file: File = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (this.allowedExtensions.includes(fileExtension || '')) {
        this.selectedFileExc = null;
        this.filePath = file;
        (this.assetForm.get('file') as FormControl).setErrors(null);
      } else {
        this.selectedFileExc = fileExtension;
        this.filePath = null;
        (this.assetForm.get('file') as FormControl).setErrors({ notAllowed: true });
      }
    } else {
      this.filePath = null;
    }
  };

  Upload() {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      this.filePath = this.filePath || null;
      this.selectedFileExc = "null";
      return;
    };
    const data = {
      file: this.filePath,
      entity_id: this.entity_id
    };
    this.upload_assetList(data);
  };

  upload_assetList(data: any) {
    this.showLoader = true;
    this.asset_service.upload_assetList(data).subscribe(
      (res: any) => {
        this.showLoader = false;
        this.assetForm.reset();
        console.log(res);
        this.toaster.success('File Uploaded Successfully');
        this.dialog.close();
      }, (err: any) => {
        this.showLoader = false;
        this.toaster.error('Something went wrong please try again.');
        console.log(err);
      }
    )
  };


}
