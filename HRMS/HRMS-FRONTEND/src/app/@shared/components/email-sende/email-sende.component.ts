import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmpMasterService } from '../../services/emp-master.service';
import { EmpRegistrationService } from '../../services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-email-sende',
  templateUrl: './email-sende.component.html',
  styleUrls: ['./email-sende.component.scss']
})
export class EmailSendeComponent {
  public Editor = ClassicEditor;
  ccOpenClick:boolean;
public opened = true;
editMode:boolean=false;
  bccOpenClick:boolean = false;
  minimizeClick:boolean = true;
emailorm:any;
mailTo:any=[];
val:any;
errorMsg: string = '';
filename:any;

fileName = '';
  // employeeId: string | null;
  employeeId:any;
  createAnnounceData: any;

fileDetails: { filePath: string | any; file: any } = {
  filePath: '',
  file: null,

};
  tomailData: any;
  newStr: any=[];
  tomail: any;
  constructor( private _empmasterservive: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    public dialogRef: MatDialogRef<EmailSendeComponent>,
    private fb: FormBuilder,
    private toater: ToastrService,
    private route: Router,){
    this.emailorm = this.fb.group({
      to_email: new FormControl(null),
      cc_email: new FormControl(null),
      bcc_email: new FormControl(null),
      subject: new FormControl(null),
      text: new FormControl(null),
     file:new FormControl(null)
    });
  }

  
  ngOnInit(){
    
    this.ccOpenClick = false;
  
  
    this.employeeId = localStorage.getItem('EmpMainId');
    // 
  
    // this.departmentSelect();
  }
  ccOpen(){
    this.ccOpenClick =!this.ccOpenClick;
  }
  bccOpen(){
    this.bccOpenClick= !this.bccOpenClick;
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
    
     this.filename=this.fileDetails.file.name;
     
     
    // const file:File = event.target.files[0];

    // if (file) {

    //     this.fileName = file.name;

    //     const formData = new FormData();

    //     formData.append("thumbnail", file);

    //     // const upload$ = this.http.post("/api/thumbnail-upload", formData);

    //     // upload$.subscribe();
    // }
}
  // filename(filename: any) {
  //   throw new Error('Method not implemented.');
  // }
  sendMail(){
    this.val = this.emailorm.value;
    const formData = new FormData();
    // let file: File = this.fileAuth;
    // 
    // 
    // for(var i=0;i<this.fileAuth.length;i++){
    //   let file: File = this.fileAuth[i];
    // formData.append("upload_trainer_document", file)
    // }
    // let em = "";
    // this.tomail=this.val.to_email
    // let abc=this.tomail.push(this.tomail.length)
      // this.newStr = em
      
      // let val2=this.emailorm.value;
      
      
    

    this.mailTo= this.val.to_email.split(',');
    
    
    // let mail=[]

    // for(let abc of val2.to_email){
    //      mail=abc.split(' , ')
    // }
    // 
    
    // formData.append("to_email",this.mailTo);
    // formData.append("cc_email", this.val.cc_email);
    // formData.append("bcc_email", this.val.bcc_email);
    // formData.append("subject", this.val.subject);
    // formData.append("text", this.val.text);
    // formData.append("attach_file",this.fileDetails.file);
    // formData.append("employee_id",this.employeeId);
    

    let data = {
      to_email: JSON.stringify( this.mailTo),
      cc_email:  this.val.cc_email,
      bcc_email:  this.val.bcc_email,
      subject:  this.val.subject,
      text:  this.val.text,
      employee_id: this.employeeId,
      // attach_file:this.fileDetails,
    };

    
    

    this._empmasterservive.createEmailSender(data,this.fileDetails.file).subscribe(
      (res: any) => {
        this.createAnnounceData = res;
        
        // let abc=JSON.parse(res.data.to_email);
        // let abc1=JSON.parse(res.data.cc_email);
        // 
        // 
  
        this.toater.success('Email send successfully');
        // this.route.navigate([
        //   'master/hrms/employee-master/announcement-list',
        // ]);
        this.dialogRef.close()
      },
      (err:any) => {
        this.toater.error('Something Went Wrong');
        return;
      }
    );
  }

  
    // public opened = true;
    public dataSaved = false;
    // public close(): void {
    //   this.opened = false;
    // }

    // public open(): void {
    //   this.opened = true;
    // }

//     minimize(e:any){
//     this.minimizeClick= !this.minimizeClick;
//     
// }

    public openClose(isOpened: boolean): void {
        this.opened = isOpened;
    }
    maximaize() {
      this.editMode = false;
      this.dialogRef.updateSize('35%', '61%');
    }
    minimize(){
      this.editMode = true;
      this.dialogRef.updateSize('65%', '81%');
      
    }
}

