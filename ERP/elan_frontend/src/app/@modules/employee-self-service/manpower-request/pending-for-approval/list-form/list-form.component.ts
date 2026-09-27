import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RemarkJobRequestComponent } from '../../my-request-manpower/remark-job-request/remark-job-request.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss'],
  providers: [DatePipe],
})
export class ListFormComponent {
  public requestNewPositionForm: any;
  public designationList: any;
  public locations: any;
  public departments: any;
  public jdToUpload: any;
  public areaList: any;
  getContractData: any;
  getAllSuperviserData: any;
  selectJob: boolean;
  getAllReasonData: any;
  // $common: any;
  createPrForm: any;
  imageToUpload: any;
  imagePath: any;
  employee_id: any;
  branchAllData: any;
  typeData: { type: string; id: number }[];
  jobId: any;
  jobData: any;
  budgetCheck: boolean;
  // dialog: any;
  remarkData: any;
  fileBind: any;
  entity_id: any;
  loginUser: any;
  financial_id: any;
  finacial_id: any;
  htmlEditorValue2: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private configMaster: ConfigurationalmasterService,
    private _commonService: CommonService,
    private _empService: EmpRegistrationService,
    private $common: CommonService,
    private empSelfService: EmployeSelfService,
    public dialog: MatDialog
  ) {
    this.requestNewPositionForm = this.fb.group({
      job_title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(300),
      ]),
      selectPosition: new FormControl(null, Validators.required),
      leaderPosition: new FormControl(null, Validators.required),
      contractType: new FormControl(null, Validators.required),
      recruitmentReason: new FormControl(null, Validators.required),
      expectedStartDate: new FormControl(null, Validators.required),
      expectedEndDate: new FormControl(null, Validators.required),
      hierarchicalSuperior: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      jobSpecification: new FormControl(null, Validators.required),
      jobDescriptionFiles: new FormControl(null),
      text: new FormControl(null),
      budget: new FormControl(null, Validators.required),
      costCenter: new FormControl(1),
      remark: new FormControl(null),
      justification: new FormControl(null),
      file: new FormControl(null),
      financial_id: new FormControl(1),

      // leaderPosition: new FormControl(null, Validators.required),
      // leaderPosition: new FormControl(null, Validators.required),
      // leaderPosition: new FormControl(null, Validators.required),

      // leadershipPosition: new FormControl(null, Validators.required),

      // jdEditor: new FormControl(null,),
    });
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id);
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    this.apiOnLoad();
    this.requestNewPositionForm?.get('jobSpecification')?.setValue('Yes');
    this.requestNewPositionForm?.get('budget')?.setValue('Yes');

    // this.onSelectedJobSpecification()
    this.activeroute.queryParams.subscribe((params: any) => {
      console.log(params, 'params');
      this.jobId = Number(params?.id);
      this.getByIdJob();
    });
    this.getContract();
    this.getAllSuperviser();
    this.getAllReason();
  }
  apiOnLoad() {
    this.getDesignations();
    this.getLocations();
    this.getDepartment();
    this.getArea();
    this.getTYpe();
  }

  getByIdJob() {
    this._commonService?.showLoader();
    this.empSelfService.getByJobRequest(this.jobId).subscribe(
      (res: any) => {
        console.log(res, 'resss');
        this.jobData = res?.data;
        this.fileBind = res?.data?.upload_document;
        this.htmlEditorValue2 = this.jobData?.editor_msg;
        this.requestNewPositionForm.patchValue({
          job_title: this.jobData?.job_title,
          selectPosition: this.jobData?.designation_id,
          leaderPosition: this.jobData?.leadership,
          contractType: this.jobData?.contract_types_id,
          recruitmentReason: this.jobData?.reason_id,
          expectedStartDate: this.jobData?.start_date,
          expectedEndDate: this.jobData?.end_date,
          hierarchicalSuperior: this.jobData?.user_id,
          department: this.jobData?.department_id,
          location: this.jobData?.branch_id,
          area: this.jobData?.area_name,
          jobSpecification: this.jobData?.job_specification,
          jobDescriptionFiles: this.jobData?.jobDescriptionFiles,
          text: this.jobData?.editor_msg,
          budget: this.jobData?.budget_status,
          costCenter: this.jobData?.cost_center_name,
          remark: this.jobData?.budget_Justification,
          justification: this.jobData?.justification,
          file: this.jobData?.file,
          financial_id: this.jobData?.financial_id,
        });
        if (this.jobData?.job_specification == 'YES') {
          this.selectJob = true;
        } else if (this.jobData?.job_specification == 'NO') {
          this.selectJob = false;
        }
        if (this.jobData?.budget_status == 'YES') {
          this.budgetCheck = true;
        } else if (this.jobData?.budget_status == 'NO') {
          this.budgetCheck = false;
        }
        this._commonService?.hideLoader();
      },
      (err: any) => {
        this.toast.error(`${err?.error?.message}`);
        this._commonService?.hideLoader();
      }
    );
  }
  getTYpe() {
    this.typeData = [{ type: 'Job Request', id: 1 }];
    console.log(this.typeData, 'data');
  }
  getDesignations() {
    this.configMaster.getDesignation().subscribe((res: any) => {
      this.designationList = res.data;
    });
  }
  getLocations() {
    this.configMaster.getListBranchSetup().subscribe((params: any) => {
      this.locations = params.data;
    });
  }
  getDepartment() {
    this.configMaster.getDepartment(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    });
  }
  getArea() {
    this.configMaster.getAreaMasterList().subscribe((res: any) => {
      this.areaList = res.data;
    });
  }
  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type
      .split('/')
      .pop()
      .toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false);
    if (!isValidExtension)
      return (
        this.createPrForm.value.file.setValue(null) &&
        this.requestNewPositionForm.value.file.setValue(null)
      );
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath =
          uploadedFileType == 'pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
  }
  onSubmitForm(value: any) {}
  cancel() {}
  onSelectedJobSpecification(e: any) {
    console.log(e, 'eeeeeee');
    if (e.value == 'YES') {
      this.selectJob = true;
    } else if (e.value == 'NO') {
      this.selectJob = false;
    }
    // this.updateValidations()
    // let x = this.requestNewPositionForm?.get('jobSpecification')?.value;
    // if ( x == "Yes" ) {
    //   // ckeditor
    //   this.requestNewPositionForm?.get('jdEditor')?.setValue(null);
    // }
    // if ( x == "No" ) {
    //   // files
    //   this.requestNewPositionForm?.get('jobDescriptionFiles')?.setValue(null);
    //   this.jdToUpload = []
    // }
  }

  updateValidations() {
    if (this.requestNewPositionForm?.get('jobSpecification')?.value === 'Yes') {
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.setValidators(Validators.required);

      this.requestNewPositionForm?.get('jdEditor')?.clearValidators();
      this.requestNewPositionForm?.get('jdEditor')?.updateValueAndValidity();
    }
    if (this.requestNewPositionForm?.get('jobSpecification')?.value === 'No') {
      this.requestNewPositionForm
        ?.get('jdEditor')
        ?.setValidators(Validators.required);
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.clearValidators();
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.updateValueAndValidity();
      this.jdToUpload = [];
    }
  }

  onSelectedBudget(e: any) {
    if (e?.value == 'YES') {
      this.budgetCheck = true;
    } else if (e?.value == 'NO') {
      this.budgetCheck = false;
    }
    // this.updateValidations2()
    // let x = this.requestNewPositionForm?.get('budget')?.value;
    // if ( x == "YES" ) {
    //   this.requestNewPositionForm?.get('remark')?.setValue(null);
    //   this.requestNewPositionForm?.get('justification')?.setValue(null);
    // }
    // if ( x == "NO" ) {
    //   this.requestNewPositionForm?.get('costCenter')?.setValue(null);
    // }
  }

  updateValidations2() {
    if (this.requestNewPositionForm?.get('budget')?.value === 'Yes') {
      this.requestNewPositionForm
        ?.get('costCenter')
        ?.setValidators(Validators.required);

      this.requestNewPositionForm?.get('remark')?.clearValidators();
      this.requestNewPositionForm?.get('remark')?.updateValueAndValidity();
      this.requestNewPositionForm?.get('justification')?.clearValidators();
      this.requestNewPositionForm
        ?.get('justification')
        ?.updateValueAndValidity();
    }
    if (this.requestNewPositionForm?.get('budget')?.value === 'No') {
      this.requestNewPositionForm
        ?.get('remark')
        ?.setValidators(Validators.required);
      this.requestNewPositionForm
        ?.get('justification')
        ?.setValidators(Validators.required);

      this.requestNewPositionForm?.get('costCenter')?.clearValidators();
      this.requestNewPositionForm?.get('costCenter')?.updateValueAndValidity();
    }
  }
  ngSubmit() {
    let val = this.requestNewPositionForm.value;
    console.log(val);

    let data = {
      employee_id: this.employee_id,
      approvel_status: 'APPROVED',
      progressStatus: 'CLOSE',
      // "employee_id": 2,
      final_status: 'APPROVED',
    };

    const dialogRef = this.dialog.open(RemarkJobRequestComponent, {
      width: '400px',
      data: { cellData: data, id: this.jobId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.remarkData = result;
    });

    // this.emp_self_service.updateMyRequest(this.jobId,data).subscribe((res:any)=>{
    // console.log(res,'resssss');
    // this.route.navigate(['master/ess/manpower-request/approval'])
    // },
    // ((err:any)=>{
    //   this.toast.error(`${err.error.message}`)
    // })
    // )
  }

  reject() {
    this.route.navigate(['master/ess/manpower-request/pending-for-approval']);
    //     let data={

    //       employee_id: this.employee_id,
    //       Approvel_status: "REJECTED",
    //       progressStatus: "CLOSE",
    //       // "employee_id": 2,
    //       final_status: "REJECTED"
    //       }

    // const dialogRef = this.dialog.open(RemarkJobRequestComponent, {
    //   width: '400px',
    //   data: { cellData: data, id:this.jobId },
    // });
    // dialogRef.afterClosed().subscribe((result:any) => {

    //   this.remarkData = result;
    // });
    // this.emp_self_service.updateMyRequest(this.jobId,data).subscribe((res:any)=>{
    // console.log(res,'resssss');
    // this.route.navigate(['master/ess/manpower-request/reject'])
    // },
    // ((err:any)=>{
    //   this.toast.error(`${err.error.message}`)
    // })
    // )
  }
  // curl --location 'http://localhost:5000/api/v1/createJob_request' \
  // --form 'entity_id="1"' \
  // --form 'contract_type_id="13"' \
  // --form 'financial_id="1"' \
  // --form 'user_id="1"' \
  // --form 'department_id="3"' \
  // --form 'area_id="3"' \
  // --form 'branch_id="1"' \
  // --form 'designation_id="1"' \
  // --form 'job_title="Software Engineer"' \
  // --form 'leadership="YES"' \
  // --form 'start_date="2024-07-01"' \
  // --form 'end_date="2024-12-31"' \
  // --form 'job_specification="YES"' \
  // --form 'editor_msg="Urgent position to fill"' \
  // --form 'budget_status="YES"' \
  // --form 'budget_justification="Needed for upcoming project"' \
  // --form 'upload_document=@"/C:/Users/Mindz/Downloads/Employee Module-Masters.drawio (3).pdf"' \
  // --form 'reason_id="1"' \
  // --form 'budget_Justification=""' \
  // --form 'cost_center_id="1"' \
  // --form 'job_request_id="3"'
  // start new

  getContract() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(entity_id);
    console.log(this.entity_id, 'this.entity_id');

    let financial_id = localStorage.getItem('financial_id');
    this.financial_id = Number(financial_id);
    // const data = {
    //   // user_id:idEmp,
    //   entity_id:Number(this.entity_id),
    //   financial_id: Number(this.financial_id)
    // }
    this.configMaster
      .getContractTypes_active(this.entity_id, this.finacial_id)
      .subscribe((res: any) => {
        this.getContractData = res.data;
      });
  }

  getAllSuperviser() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empService
      .grtEmployeeList(entity_id, this.loginUser?.role)
      .subscribe((res: any) => {
        this.getAllSuperviserData = res.data;
        //
        // const userId: any = []
        // for (let i = 0; i < res.data.length; i++) {
        //   userId.push(res.data[i].user_role);
        //   this.userRole = userId;
        // }
      });
  }
  generateImageUrl() {
    return environment.servralUrl + '/uploaded_files/';
  }

  getAllReason() {
    this.configMaster.getAllReason_active(this.entity_id).subscribe(
      (res: any) => {
        this.getAllReasonData = res.data;
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }

  branchData() {
    this.configMaster.getListBranchSetup().subscribe((res: any) => {
      this.branchAllData = res.data;
    });
  }
}
