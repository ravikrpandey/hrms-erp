import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { DownloadCsvService } from 'src/app/@shared/services/service/download-csv.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

interface EmailItem {
  value: string;
  invalid: boolean;
}

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {
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
  employeeId: any;
  createAnnounceData: any;
  // fileDetails: { filePath: string | any; file: any } = {
  //   filePath: '',
  //   file: null,
  // };
  tomailData: any;
  newStr: any = [];
  tomail: any;
  cc_email: any;
  bcc_email: any;
  backendUrl: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _empmasterservive: EmpMasterService,
    private toast: ToastrService,
    private $proposal: ProposalService,
    private spellCheckService : DownloadCsvService,
    public dialogRef: MatDialogRef<SendEmailComponent>,
    private fb: FormBuilder,private cdr: ChangeDetectorRef,
    private router: Router,) {
    this.emailorm = this.fb.group({
      to_email: new FormControl([],[Validators.required]),
      cc_email: new FormControl(null),
      bcc_email: new FormControl(null),
      subject: new FormControl(null,[Validators.required]),
      text: new FormControl(null),
      file: new FormControl(null)
    });
  }


  ngOnInit() {
    this.ccOpenClick = false;
    this.employeeId = localStorage.getItem('EmpMainId');
  }
  ccOpen() {
    this.ccOpenClick = !this.ccOpenClick;
  }
  bccOpen() {
    this.bccOpenClick = !this.bccOpenClick;
  }


  // onFileSelected(fileInput: File[] | any) {
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];
  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / (1024 ** 2);
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetails.filePath = reader.result;
  //       this.filename = file.name;
  //       // this.onFileChangeUrl(file);
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetails.file = file;
  //   } else {
  //     this.fileDetails = { filePath: '', file: null };
  //   }
  // }
  fileDetails: { files: File[]; filePaths: string[] } = { files: [], filePaths: [] };

  onFileSelected(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      const files = Array.from(fileInput.target.files) as File[];
      this.fileDetails.files = [];
      this.fileDetails.filePaths = [];
      for (const file of files) {
        const fileSizeInMb = file.size / (1024 ** 2);
        if (fileSizeInMb > 30) {
          this.errorMsg = 'File size should be less than 30MB';
          continue; // skip large files
        }
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileDetails?.filePaths.push(reader.result as string);
        };
        reader.readAsDataURL(file);
        this.fileDetails?.files.push(file);
      }
    } else {
      this.fileDetails = { files: [], filePaths: [] };
    }
  }
  
  onFileChangeUrl(fileDetails: any) {
    const formData = new FormData();
    formData.append('file', fileDetails);
    console.log(formData, "these are the file details");

    this.$proposal.uploadDoc(formData).subscribe((res: any) => {
      console.log(res, "this is the api res")
      this.backendUrl = res.backendUrl
    })
  }
 
sppinerRotate:boolean=false;
  sendMail() {

    if(this.emailorm.invalid){
      this.toast.error('Please fill all required field');
      return;
    }
    this.sppinerRotate=true
    console.log(this.data, "received data")
    this.val = this.emailorm.value;
    let formData = new FormData();

    this.mailTo = this.val.to_email ? (this.val.to_email.includes(',') ? this.val.to_email.split(',') : [this.val.to_email]) : [];
    if (this.ccOpenClick) {
      this.cc_email = this.val.cc_email ? (this.val.cc_email.includes(',') ? this.val.cc_email.split(',') : [this.val.cc_email]) : [];
    }
    if (this.bccOpenClick) {
      this.bcc_email = this.val.bcc_email ? (this.val.bcc_email.includes(',') ? this.val.bcc_email.split(',') : [this.val.bcc_email]) : [];
    }
   
    // let data = {     
      
    //     mailObject: {
    //       to_email: this.mailTo,
    //       cc_email: this.cc_email,
    //       bcc_email: this.bcc_email,
    //       subject: this.val.subject,
    //       message: this.val.text,
    //       employee_id: this.employeeId,
    //       attach_file: this.backendUrl
    //     }
    // };
    if(this.mailTo){

      formData.append('to_email', JSON.stringify(this.mailTo));
    }
    if(this.cc_email){

      formData.append('cc_email', JSON.stringify(this.cc_email));
    }
    if(this.bcc_email){
      formData.append('bcc_email', JSON.stringify(this.bcc_email));

    }
    formData.append('subject', this.val.subject);
    formData.append('message', this.val.text);
    formData.append('employee_id', this.employeeId);
  
    
    // if (this.backendUrl) {
      
    //   formData.append('attach_file', this.backendUrl);
    // } else if (this.fileDetails?.file) {
   
    //   formData.append('file', this.fileDetails.file);
    // }
    if (this.fileDetails?.files?.length > 0) {
      this.fileDetails.files.forEach((file, index) => {
        formData.append('files', file); // backend should handle as array
      });
    }
    console.log("📤 FormData contents:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    
    
  
    this.dialogRef.close({formData});
    // this.$proposal.sendEmailSalesOrder(data).subscribe((response:any)=>{
    //   if(response){
    //     this.toast.success(response.message)
    //     this.sppinerRotate=false;
    //   }
    // },(err:any)=>{
    //   this.toast.error(err.error.message)
    //   this.sppinerRotate=false;
    // })

    // console.log(this.fileDetails.filePath, "this is file ")

    // this.dialogRef.close(data);
    

  }


  public dataSaved = false;

  public openClose(isOpened: boolean): void {
    this.opened = isOpened;
  }
  maximaize() {
    this.editMode = false;
    this.dialogRef.updateSize('35%', '61%');
    this.cdr.detectChanges();
  }
  minimize() {
    this.editMode = true;
    this.dialogRef.updateSize('65%', '81%');
    this.cdr.detectChanges();

  }

  googleGeminiAi(){
    let data = this.emailorm.get('text').value;

    const formData = new FormData();
    formData.append('text', data); 
    this.$proposal.googleGeminiAi(formData).subscribe({
        next:(res:any)=>{
console.log('hello',res);
this.emailorm.get('text')?.patchValue(res.data);
        },error:(err)=>{
console.log('hello',)
        }
    })
}
 
readonly separatorKeysCodes = [ENTER, COMMA] as const;
addOnBlur = true;
removable = true;

emailList: EmailItem[] = [];
add(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  if (value) {
    // Validate email
    const isValid = this.validateEmail(value);

    // Push full object matching EmailItem
    this.emailList.push({ value: value, invalid: !isValid });

    // If invalid, set form error
    if (!isValid) {
      this.emailorm.controls['to_email'].setErrors({ incorrectEmail: true });
    }
  }

  // Clear input field
  event.chipInput?.clear();

  // Update FormControl value
  this.emailorm.controls['to_email'].setValue(this.emailList);
}


removeEmail(email: EmailItem): void {
  const index = this.emailList.indexOf(email);
  if (index >= 0) this.emailList.splice(index, 1);

  // Update FormControl value
  this.emailorm.controls['to_email'].setValue(this.emailList);
}
private validateEmail(email: string): boolean {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}
}
