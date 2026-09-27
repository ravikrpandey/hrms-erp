import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bvg-list',
  templateUrl: './bvg-list.component.html',
  styleUrls: ['./bvg-list.component.scss']
})
export class BvgListComponent {

  errorMsg: string = '';
  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  backgroundForm: FormGroup;
  loading: boolean = false;
  resumeUploaded: any;
  emailVerify: any;
  clicked: boolean = false;
  clickedTwo: boolean = false;
  clickedSix: boolean = false;
  clickedFive: boolean = false;
  clickedThree: boolean = false;
  clickedFour: boolean = false;
  phoneVerify: any;
  previousJob: any;
  bvg_id: any;
  candidateArray: any;
  candidateId: any;
  interviewGetId: any;
  verifyValue: any;
  candidateSearch: any = [];
  candidateSearch1: any = [];


  // ---------------------------------------------------------
  VerifyData: any = { precious_job_status: [] };
  // for email
  emailBtn: boolean = false;
  verifyEmail: boolean = false;
  notVerifyEmail: boolean = false;

  // for mobile
  mobileBtn: boolean = false;
  verifyMobile: boolean = false;
  notVerifyMobile: boolean = false;

  // for job

  curentIndex: any;



  constructor(
    private fb: FormBuilder, private recruitService: RecruitService, private toast: ToastrService,
    private route: Router
  ) {
    this.backgroundForm = this.fb.group({
      candidate: new FormControl(null),
      email: new FormControl(null, [
        Validators.required,
      ]),
      mobile_no: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      others_documents: new FormControl(null),
      previousJobRow: this.fb.array([
        this.createPreviousJobRow() // Initial row
      ]),
    });

  }
  createPreviousJobRow(): FormGroup {
    return this.fb.group({
      precious_job_status: new FormControl(null),
      precious_job_status_verification: new FormControl(null)
    });
  }
  ngOnInit() {
    this.getCandidateList();
  }

  getCandidateList() {
    let ApprovedCandidate: any = []
    this.recruitService.get_approved_candidates().subscribe(
      (res: any) => {

        let c_Arr = res.data;
        for (let i = 0; i < c_Arr.length; i++) {
          ApprovedCandidate.push({
            candidate_id: c_Arr[i].candidate_id,
            condidate_name: c_Arr[i].condidate_name,
          })
        }
        this.candidateArray = ApprovedCandidate;
        this.candidateSearch = this.candidateArray.map((res: any) => res.condidate_name);
        this.candidateSearch1 = this.candidateArray
      }, (err: any) => {

      }
    )
  }

  productFilter(e: any) {
    const aa = e;
    let filteredVariable = this.candidateSearch1?.filter((item: any) =>
      aa.includes(item.condidate_name)
    );
    this.candidateArray = filteredVariable;


  }
  candidateClick(e: any) {
    // this.backgroundForm.reset()
    this.candidateId = e;
    this.recruitService.interViewGetIdBy(e).subscribe((res: any) => {
      this.interviewGetId = res.data;


      this.backgroundForm.patchValue({
        email: this.interviewGetId.email,
        mobile_no: this.interviewGetId.mobile,
      })

    })
  }

  get CF_1(): any { return this.backgroundForm.controls };

  fileInputChange(fileInput: File[] | any) {
    this.errorMsg = '';
    // 
    // this.resumeUploaded = fileInput.target.files[0].name
    const data: FileList = fileInput.target.files;
    this.resumeUploaded = data.item(0);
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
  };

  addRow(j: any) {
    const jobStatusLimit = 4;

    let existVal = this.CF_1.previousJobRow.controls[j].controls.existValue;
    if (!existVal && !this.CF_1.previousJobRow.controls[j].preJobBtn) {
      this.toast.error(' Verified or not Verified', 'Please Action on Preview Job Status');
      return;
    }

    if (j === jobStatusLimit) {
      this.CF_1.previousJobRow.controls[j].showAddBtn = false;
    } else {
      this.CF_1.previousJobRow.controls[j].showAddBtn = true;
    };


    if (this.CF_1.previousJobRow.controls.length !== 5) {
      <FormArray>this.CF_1.previousJobRow.push(
        new FormGroup({
          precious_job_status: new FormControl(null),
          precious_job_status_verification: new FormControl(null)
        })
      )
      for (let i = 1; i < this.CF_1.previousJobRow.controls.length; i++) {
        let verifyPreJob = this.CF_1.previousJobRow.controls[i + j]?.verifyPreJob;
        verifyPreJob = false;

        let notVerifyPreJob = this.CF_1.previousJobRow.controls[i + j]?.notVerifyPreJob;
        notVerifyPreJob = false;

        let preJobBtn = this.CF_1.previousJobRow.controls[i + j]?.preJobBtn;
        preJobBtn = false;

        let showAddBtn = this.CF_1.previousJobRow.controls[i + j]?.showAddBtn;
        showAddBtn = false;
      };
    } else {
      this.toast.error('Verify atleast five previous job status', 'Atleast five');
    }
  };

  Verify_Email(e: any) {
    if (this.CF_1.email.value === null) {
      this.toast.error('Select Candidate');
      return
    };
    Swal.fire({
      title: 'Are you sure to verify this Email',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.emailBtn = true;
        this.verifyEmail = true;
        this.VerifyData.email = this.backgroundForm.value.email;
        this.VerifyData.email_verification = e;
        this.toast.success('Email verified');
      }
    });
  };

  NotVerify_Email(e: any) {
    if (this.CF_1.email.value === null) {
      this.toast.error('Select Candidate');
      return
    };

    Swal.fire({
      title: 'Are you sure to not verify this Email',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.VerifyData.email = this.backgroundForm.value.email;
        this.VerifyData.email_verification = e;
        this.emailBtn = true;
        this.notVerifyEmail = true;
      }
    });
  };

  Verify_Mobile(e: any) {
    if (this.CF_1.mobile_no.value === null) {
      this.toast.error('Select Candidate');
      return;
    };

    Swal.fire({
      title: 'Are you sure to verify this Mobile Number',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.VerifyData.mobile_no = this.backgroundForm.value.mobile_no;
        this.VerifyData.phone_verification = e;
        this.mobileBtn = true;
        this.verifyMobile = true;

        this.toast.success('Mobile number verified');
      }
    });
  };

  NotVerify_Mobile(e: any) {
    if (this.CF_1.mobile_no.value === null) {
      this.toast.error('Select Candidate');
      return;
    };
    Swal.fire({
      title: 'Are you sure to not verify this Mobile Number',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.VerifyData.mobile_no = this.backgroundForm.value.mobile_no;
        this.VerifyData.phone_verification = e;
        this.mobileBtn = true;
        this.notVerifyMobile = true;
      }
    });

  };
  // Helper method to get the FormArray
  get previousJobRowArray(): FormArray {
    return this.backgroundForm.get('previousJobRow') as FormArray;
  }

  // Helper method to get a specific FormGroup within the FormArray
  getPreviousJobRow(index: number): FormGroup {
    return this.previousJobRowArray.at(index) as FormGroup;
  }
  Verify_preJob(e: any, control: any, i: any) {
    if (control.value.precious_job_status === null) {
      this.toast.error('Fields should not be blank');
      return;
    }

    Swal.fire({
      title: 'Are you sure to verify this Previous Job Status',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {

        this.VerifyData.precious_job_status.push({
          precious_job_status: control.value.precious_job_status,
          precious_job_status_verification: e,
        });
        const row: any = this.getPreviousJobRow(i);
        row.get('precious_job_status_verification').setValue(true);


        this.CF_1.previousJobRow.controls[i].verifyPreJob = true;
        this.CF_1.previousJobRow.controls[i].preJobBtn = true;
        control.disable();
      }
    });

  };

  NotVerify_preJobf(e: any, control: any, i: any) {
    if (control.value.precious_job_status === null) {
      this.toast.error('Fields should not be blank');
      return;
    }


    Swal.fire({
      title: 'Are you sure to not verify this Previous Job Status',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.VerifyData.precious_job_status.push({
          precious_job_status: control.value.precious_job_status,
          precious_job_status_verification: e,
        });
        const row: any = this.getPreviousJobRow(i);
        row.get('precious_job_status_verification').setValue(false);
        this.CF_1.previousJobRow.controls[i].notVerifyPreJob = true;
        this.CF_1.previousJobRow.controls[i].preJobBtn = true;

        control.disable();
      }
    });
  };

  saveDetails() {
    // this.loading=true;
    if (this.backgroundForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Required fields')
      return;
    }

    if (!this.emailBtn && !this.mobileBtn) {
      this.toast.error('perform action on Email & Mobile number', 'Verify or Not Verify')
      return;
    }



    this.VerifyData.candidate_id = this.candidateId;
    this.VerifyData.candidate_name = this.backgroundForm.value.candidate;
    this.VerifyData.precious_job_status = this.CF_1.previousJobRow.value

    console.log(this.CF_1.previousJobRow.value);
    console.log('verify data-->', this.VerifyData)

    this.loading = true
    this.recruitService.backgroundVerification(this.VerifyData, this.resumeUploaded).subscribe(
      (res: any) => {
        this.loading = false;
        this.toast.success("Background verified successfully");
        this.route.navigate(['master/recuitment/verification-list']);
      }, (err: any) => {

        this.toast.error(err.error.message);
        this.loading = false;
      }
    )
    //upload outher document
    // if (this.backgroundForm.value.others_documents !== null) {
    //   this.uploadOutherDoc(this.candidateId, this.resumeUploaded)
    // }

  };

  uploadOutherDoc(id: any, file: File) {
    this.recruitService.createPdf(id, file).subscribe(
      (res: any) => {

        this.toast.success('Document Uploaded Successfully')
      }, (err) => {
        this.toast.error(err.error.message);

      }
    )
  }
  deletePreviousJobRow(index: number) {
    const previousJobRowArray = this.backgroundForm.get('previousJobRow') as FormArray;


    previousJobRowArray.removeAt(index);
    let newArray: any = [... this.VerifyData.precious_job_status]; // Create a copy of the array
    newArray.splice(index, 1);








  }
}
