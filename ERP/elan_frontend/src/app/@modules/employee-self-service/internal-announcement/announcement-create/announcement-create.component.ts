import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EmpMasterService } from '../../../../@shared/services/emp-master.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-announcement-create',
  templateUrl: './announcement-create.component.html',
  styleUrls: ['./announcement-create.component.scss'],
})
export class AnnouncementCreateComponent implements OnInit {
  @ViewChild('editer') editer: any;
  // announcementForm:FormGroup;
  announcementForm: FormGroup;
  createAnnounceData: any;
  id: any;
  draftData: any;
  employeeId: any;
  emailId: any;
  mailTo: any = [];
  announceGetIdData: any;
  announceId: any;
  tomail: any = [];
  ccmail: any = [];
  bccmail: any = [];
  inboxData: any;
  imageToUpload: any;
  imagePath: any;
  getAllDepartment: any;
  getDepartment: any;
  departmentValue: any;
  departmentname: any;
  filename: any;
  errorMsg: string = '';
  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,

  };
  val: any;
  constructor(
    private _empmasterservive: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toater: ToastrService,
    private route: Router,
    private activeted: ActivatedRoute,
    private location: Location
  ) {
    this.announcementForm = this.fb.group({
      to_email: new FormControl(null, [Validators.required]),
      cc_email: new FormControl(null),
      bcc_email: new FormControl(null),
      subject: new FormControl(null, Validators.required),
      text: new FormControl(null),
      department: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.activeted.queryParams.subscribe((params: any) => {
      this.emailId = params;
      
      this.announceId = params.email_id;
      

      this.getByAnnounce();
    });

    this._empmasterservive.get();
    
    this.employeeId = localStorage.getItem('EmpMainId');
    
    this.getAllDepartment_dropDown();
    // this.departmentSelect();
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
    

    // const file:File = event.target.files[0];

    // if (file) {

    //     this.fileName = file.name;

    //     const formData = new FormData();

    //     formData.append("thumbnail", file);

    //     // const upload$ = this.http.post("/api/thumbnail-upload", formData);

    //     // upload$.subscribe();
    // }
  }
  getByAnnounce() {
    
    this._empmasterservive
      .getByIdAnnouncement(this.announceId)
      .subscribe((res: any) => {
        // 
        this.announceGetIdData = res.data;
        

        // 

        // let em = "";
        // let cc = "";
        // let bc = "";

        // let tomail = res.data.to_email
        // let ccmail =  res.data.cc_email;
        // let bccmail = res.data.bcc_email

        // 
        // 
        // 

        // for (let i of tomail) {
        //   em += i + ','
        // }
        // let newStr = em.slice(0, -1)
        // 

        // for (let i of ccmail) {
        //   cc += i + ','
        // }
        // let newStr2 = cc.slice(0, -1)
        // 

        // for (let i of bccmail) {
        //   bc += i + ','
        // }
        // let newStr3 = bc.slice(0, -1)
        // 
        //  

        
        this.announcePatch(this.announceGetIdData);
      });
  }

  announcePatch(announceGetIdData: any) {
    this.announcementForm.patchValue({
      to_email: announceGetIdData?.to_email,
      cc_email: announceGetIdData?.cc_email,
      bcc_email: announceGetIdData?.bcc_email,
      subject: announceGetIdData?.subject,
      text: announceGetIdData?.text,
    });
  }

  announcmentSubmit() {
    let val = this.announcementForm.value;
    if (this.announcementForm.invalid) {
      this.toater.error('To E-mail And Subject Field Required');
      return;
    }
    
    
    

    if (!this.announceId) {
      if (!this.departmentname) {
        // let val = this.announcementForm.value;
        this.val = this.announcementForm.value;
        this.mailTo = this.val.to_email.split(',');
        //  alert("create")
        let data = {
          to_email: JSON.stringify(this.mailTo).toLowerCase(),
          cc_email: val.cc_email.toLowerCase(),
          bcc_email: val.bcc_email.toLowerCase(),
          subject: val.subject,
          text: val.text,
          employee_id: this.employeeId,
        };
        
        

        this._empmasterservive.createAnnouncement(data, this.fileDetails.file).subscribe(
          (res: any) => {
            this.createAnnounceData = res;
            
            // let abc=JSON.parse(res.data.to_email);
            // let abc1=JSON.parse(res.data.cc_email);
            // 
            // 

            this.toater.success('Email send success');
            this.route.navigate([
              'master/ess/announcement-list',
            ]);
          },
          (err) => {
            this.toater.error('Something Went Wrong');
            return;
          }
        );
      } else {
        // alert("department")
        if (!this.departmentname) {
          this.val = this.announcementForm.value;
          this.mailTo = this.val.to_email.split(',');
          let data = {
            to_email: JSON.stringify(this.mailTo),
            cc_email: val.cc_email,
            bcc_email: val.bcc_email,
            employee_id: this.employeeId,
            subject: val.subject,
            message: val.text,
          };

          

          this._empmasterservive.getByDepartment(this.departmentname, data).subscribe(
            (res: any) => {
              this.getDepartment = res.result;
              
              this.route.navigate([
                'master/ess/announcement-list',
              ]);
              this.toater.success('Email send success');
              this.announcementForm.patchValue({
                to_email: this.getDepartment.accepted,
              });
            },
            (error: any) => {
              
              if (error.status == 404) {
                this.toater.warning('Data Not Available For This Id');
              } else if (error.status == 500) {
                this.toater.warning(error.statusText);
              }
            }
          );
        }

        else {
          let data = {
            to_email: val.to_email,
            cc_email: val.cc_email,
            bcc_email: val.bcc_email,
            employee_id: this.employeeId,
            subject: val.subject,
            message: val.text,
          };

          

          this._empmasterservive.getByDepartment(this.departmentname, data).subscribe(
            (res: any) => {
              this.getDepartment = res.result;
              
              this.route.navigate([
                'master/ess/announcement-list',
              ]);
              this.toater.success('Email send success');
              this.announcementForm.patchValue({
                to_email: this.getDepartment.accepted,
              });
            },
            (error: any) => {
              
              if (error.status == 404) {
                this.toater.warning('Data Not Available For This Id');
              } else if (error.status == 500) {
                this.toater.warning(error.statusText);
              }
            }
          );
        }

      }
    }
    else {
      let update_data = {
        to_email: val.to_email,
        cc_email: val.cc_email,
        bcc_email: val.bcc_email,
        subject: val.subject,
        text: val.text,
        email_status: "send",
        employee_id: parseInt(this.employeeId)
      }
      

      this._empmasterservive.updateAnnounce(this.announceId, update_data).subscribe((res: any) => {
        
        this.toater.success(" Update Successfully");
        this.route.navigate(['master/ess/announcement-list'])

      },
        (err) => {

          this.toater.error("Something Went Wrong");
          return
        }
      )
    }

  }

  announcmentDraft() {

    let val = this.announcementForm.value;
    
    if (this.announcementForm.invalid) {
      this.toater.error('To E-mail And Subject Field Required');
      return;
    }

    // 

    if (!this.announceId) {
      // alert("drfat")

      if (!this.departmentname) {
        let data = {
          to_email: val.to_email.split(','),
          cc_email: val.cc_email,
          bcc_email: val.bcc_email,
          subject: val.subject,
          text: val.text,
          employee_id: Number(this.employeeId),
        };
        

        this._empmasterservive.draftAnnouncement(data,this.fileDetails.file).subscribe(
          (res: any) => {
            this.draftData = res;
            
            this.toater.success('Draft Successfully');
            this.route.navigate([
              'master/ess/announcement-list',
            ]);
          },
          (err) => {
            this.toater.error('Something Went Wrong');
            return;
          }
        );
      } else {
        let data = {
          to_email: val.to_email,
          cc_email: val.cc_email,
          bcc_email: val.bcc_email,
          subject: val.subject,
          text: val.text,
          employee_id: Number(this.employeeId),
        };
        

        this._empmasterservive.draftAnnouncement(data,this.fileDetails.file).subscribe(
          (res: any) => {
            this.draftData = res;
            
            this.toater.success('Draft Successfully');
            this.route.navigate([
              'master/ess/announcement-list',
            ]);
          },
          (err) => {
            this.toater.error('Something Went Wrong');
            return;
          }
        );
      }
    }
    else {
      // alert("draft Updated")
      if (!this.departmentname) {
        let update_dataDraft = {
          to_email: val.to_email,
          cc_email: val.cc_email,
          bcc_email: val.bcc_email,
          subject: val.subject,
          text: val.text,
          employee_id: Number(this.employeeId),
        };
        

        this._empmasterservive
          .updateDraft(this.announceId, update_dataDraft)
          .subscribe((res: any) => {
            
            this.toater.success('Draft Data Update Successfully');
            this.route.navigate([
              'master/ess/announcement-list',
            ]);
          });
      } else {
        let update_dataDraft = {
          to_email: val.to_email,
          cc_email: val.cc_email,
          bcc_email: val.bcc_email,
          subject: val.subject,
          text: val.text,
          employee_id: Number(this.employeeId),
        };
        

        this._empmasterservive
          .updateDraft(this.announceId, update_dataDraft)
          .subscribe((res: any) => {
            
            this.toater.success('Draft Data Update Successfully');
            this.route.navigate([
              'master/ess/announcement-list',
            ]);
          });
      }

    }




  }
  
  cancel() {
    window.location.reload();
    history.back();
  }

  getAllDepartment_dropDown() {
    this._empRegistration.getAllDepartment_dropDown().subscribe((res) => {
      
      this.getAllDepartment = res.data;
    });
  }
  departmentSelect(e: any) {
    

    this.departmentname = e;
    let val = this.announcementForm.value;
    
    
    let data = {
      subject: val.subject,
      message: val.text,
    };

    

    this._empmasterservive.getDepartmentById(this.departmentname).subscribe(
      (res: any) => {
        this.getDepartment = res.data;
        

        this.announcementForm.patchValue({
          to_email: this.getDepartment,
        });
      },
      (error: any) => {
        
        if (error.status == 404) {
          this.toater.warning('Data Not Available For This Id');
        } else if (error.status == 500) {
          this.toater.warning(error.statusText);
        }
      }
    );
  }
  goBack() {
    this.location.back();
  }
  
}
