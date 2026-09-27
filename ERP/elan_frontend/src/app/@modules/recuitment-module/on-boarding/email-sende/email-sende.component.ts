import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-email-sende',
  templateUrl: './email-sende.component.html',
  styleUrls: ['./email-sende.component.scss'],
})
export class EmailSendeComponent {
  public Editor = ClassicEditor;
  ccOpenClick: boolean;
  public opened = true;
  editMode: boolean = false;
  bccOpenClick: boolean = false;
  minimizeClick: boolean = true;
  emailorm: any;
  mailTo: any = [];
  val: any;
  errorMsg: string = '';
  filename: any;

  fileName = '';
  // employeeId: string | null;
  employeeId: any;
  createAnnounceData: any;

  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  tomailData: any;
  newStr: any = [];
  tomail: any;
  candidate: any;
  singData: any;
  constructor(
    private _empmasterservive: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    public dialogRef: MatDialogRef<EmailSendeComponent>,
    private fb: FormBuilder,
    private toater: ToastrService,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private recruitService: RecruitService
  ) {
    this.emailorm = this.fb.group({
      to_email: new FormControl(null,[ Validators.required, Validators.email]),
      cc_email: new FormControl(null,  Validators.email),
      bcc_email: new FormControl(null,  Validators.email),
      subject: new FormControl(null, Validators.required),
      text: new FormControl(null ,[Validators.required, Validators.maxLength(600)]),
      file: new FormControl(null, Validators.required ),
    });
    this.candidate = this.data.id;
    console.log('gg', this.candidate);
  }

  ngOnInit() {
    this.ccOpenClick = false;
    this.employeeId = localStorage.getItem('EmpMainId');

    this.recruitService
      .singleCandidateInfoById(this.candidate)
      .subscribe((res: any) => {
        this.singData = res.data;
        this.emailorm.patchValue({
          to_email: this.singData.email,
        });
      });
  }

  ccOpen() {
    this.ccOpenClick = !this.ccOpenClick;
  }
  bccOpen() {
    this.bccOpenClick = !this.bccOpenClick;
  }
  onFileSelected(fileInput: File[] | any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      const fileSizeInMb = file.size / 1024 ** 2;
      if (fileSizeInMb > 30) {
        this.errorMsg = 'File size should be less than 30MB';
        return;
      }
      reader.onload = (e: any) => {
        this.fileDetails.filePath = reader.result;
      };
      reader.readAsDataURL(file);
      this.fileDetails.file = file;
    } else {
      this.fileDetails = { filePath: '', file: null };
    }

    this.filename = this.fileDetails.file.name;
  }

  sendMail() {
    console.log(this.emailorm);
    
    this.val = this.emailorm.value;
    if (this.emailorm.invalid) {
      this.toater.error('Required fields should not be empty', 'Fields Error');
      return;
    }
  
    this.mailTo = this.val.to_email.split(',');

    const formData = new FormData();
    formData.append('to_email', JSON.stringify(this.mailTo));
    formData.append('cc_email', this.val.cc_email);
    formData.append('bcc_email', this.val.bcc_email);
    formData.append('subject', this.val.subject);
    formData.append('text', this.val.text);
    formData.append('employee_id', this.employeeId);
    formData.append('document', this.fileDetails.file);

    this._empmasterservive
      .send_LIO_to_candidate(this.candidate, formData)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.toater.success('Email send successfully');
          this.dialogRef.close();
        },
        (err: any) => {
          this.toater.error(err.error.message);
          return;
        }
      );
  }

  // public opened = true;
  public dataSaved = false;
  public openClose(isOpened: boolean): void {
    this.opened = isOpened;
  }
  maximaize() {
    this.editMode = false;
    this.dialogRef.updateSize('35%', '61%');
  }
  minimize() {
    this.editMode = true;
    this.dialogRef.updateSize('65%', '81%');
  }


}
