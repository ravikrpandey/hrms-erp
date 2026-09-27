import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ScheduledInterviewService } from 'src/app/@shared/services/service/recruitment/scheduled-interview.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import { OfferLetterService } from 'src/app/@shared/services/service/recruitment/offer-letter.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-candidate-offer-letter',
  templateUrl: './create-candidate-offer-letter.component.html',
  styleUrls: ['./create-candidate-offer-letter.component.scss']
})
export class CreateCandidateOfferLetterComponent {
  personalForm: FormGroup;

  candidate_id: any;
  offer_id: any;
  actionFor: any;
  interview_round: any;
  final_remarks: any;
  userDetails: any;
  entity_id: any;
  user_id: any;
  status: any;
  actionType: any;
  reportingManagerList: any = [];
  typeOfContractList: any = [];
  allowanceList: any = [];
  allowanceList2: any = [];
  allowances: any = []
  currentDate = new Date();
  salary_type: any;

  ratingList: any = [
    {
      id: 1,
      descr: 'Bad'
    },
    {
      id: 2,
      descr: 'Not Satisfied'
    },
    {
      id: 3,
      descr: 'Satisfied'
    },
    {
      id: 4,
      descr: 'Good'
    },
    {
      id: 5,
      descr: 'Excellent'
    },
  ]

  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  reportingManagerList2: any;
  employees: any;
  typeOfContractList2: any;
  contracts: any;
  locationList: any;
  locations2: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private $shortlistedCandidate: ShortlistedCandidateService,
    private toast: ToastrService,
    private location: Location,
    private $offerLetter: OfferLetterService,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.personalForm = this.fb.group({
      reference_number: new FormControl(null, Validators.required),
      created_date: new FormControl(new Date(), Validators.required),
      positoin_name: new FormControl(null, Validators.required),
      salary_type: new FormControl(null, Validators.required),
      base_salary: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)]),
      reporting_manager_id: new FormControl(null, Validators.required),
      // contract_types_id: new FormControl(null),
      probation_period: new FormControl(null, [Validators.pattern(/^[0-9]{1,3}$/)]),
      location_id: new FormControl(null, Validators.required),
      exp_joining_date: new FormControl(null, Validators.required),
      role_master_id: new FormControl(null, Validators.required),
      approval_id: new FormControl(null, Validators.required),
      offer_remarks: new FormControl(null),
      approval_remarks: new FormControl(null),
      candidate_remarks: new FormControl(null),

    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    localStorage.removeItem("jobId")

    this.route.queryParams.subscribe((params: any) => {
      this.candidate_id = params?.id;
      this.offer_id = params?.offer_id;
      this.actionFor = params?.actionFor;
      this.interview_round = params?.interview_round;
      this.status = params?.status;
      this.actionType = params?.actionType;

      let currentDate = new Date();
      let year = currentDate?.getFullYear();
      let month = currentDate?.getMonth();
      let refNumber = this.candidate_id + '/DRH' + '/' + month + '/' + year;
      this.personalForm?.patchValue({ reference_number: refNumber });
      if (this.candidate_id || this.offer_id) {
        if (this.actionType) {
          this.getoffer_detailsBYID();
        } else {
          this.get_candidate_interview_details_by_id();
        }
        this.getActive_Allowance();
        this.get_Active_ContractTypes();
        this.registrationall();
        this.getLocations()
        this.getAllrole()
      }
    });
  }

  locations: any = [];
  getLocations() {
    this.configMaster
      .branch_get_active()
      .subscribe((params: any) => {
        this.locations = params.data;
        this.locations2 = params.data;
        this.locationList = this.locations.map((value: any) => value.branch_name)
      });
  }

  //  Get start 
  basicDetails: any = {};
  skill_list: any = [];
  get_candidate_interview_details_by_id() {

    let query = {
      candidate_id: this.candidate_id,
      interview_round: this.interview_round
    }

    this.$shortlistedCandidate.get_shortlisted_candidateBYID(query).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.personalForm?.patchValue({ positoin_name: this.basicDetails?.designation_name, base_salary: this.basicDetails?.salary })
      this.skill_list = this.basicDetails?.skill_list;
    })
  }


  //  Get from request start 
  // get allowanceDetailArray() {
  //   return this.personalForm.get('allowance_details') as FormArray;
  // }
  getoffer_detailsBYID() {
    this.$offerLetter.getoffer_detailsBYID(this.offer_id).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.personalForm?.patchValue(this.basicDetails)
      this.personalForm?.patchValue({
        // offer_remarks: null,
        offer_remarks: this.basicDetails?.offer_remarks,
        positoin_name: this.basicDetails?.designation_name,
        candidate_remarks: this.basicDetails?.candidate_remarks,
      })
    })
  }

  // view get start
  getActive_Allowance(length?: any) {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    }
    this.$shortlistedCandidate.getActive_Allowance_migration(req).subscribe((res: any) => {
      console.log(res);
      this.allowanceList[0] = res?.data;
      this.allowanceList2[0] = res?.data;
      this.allowances[0] = this.allowanceList[0].map((value: any) => value.allowance_name)

      if (length) {
        for (let i = 1; i < length; i++) {
          this.allowanceList[i] = this.allowanceList[0];
          this.allowanceList2[i] = this.allowanceList2[0];
          this.allowances[i] = this.allowances[0]
        }
      }
    })
  }

  // view get start
  get_Active_ContractTypes() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    loginUserDetails = JSON.parse(loginUserDetails)
    let query = {
      entity_id: entity_id,
      role_master_name: loginUserDetails?.roles,
    }
    this.$shortlistedCandidate.get_Active_ContractTypes(query).subscribe((res: any) => {
      console.log(res);
      this.typeOfContractList = res?.data;
      this.typeOfContractList2 = res?.data;
      this.contracts = this.typeOfContractList.map((value: any) => value.contract_type)
    })
  }

  // view get start
  registrationall() {

    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    loginUserDetails = JSON.parse(loginUserDetails)
    let query = {
      entity_id: entity_id,
      role_master_name: loginUserDetails?.roles,
    }
    this.$shortlistedCandidate.registrationall(query).subscribe((res: any) => {
      console.log(res);
      this.reportingManagerList = res?.data;
      this.reportingManagerList2 = res?.data;
      this.employees = this.reportingManagerList.map((value: any) => value.first_name + " " + value.last_name + " " + value.employee_code)
    })
  }

  // Submit start
  handleSubmit() {
    try {
      let selectedEntityId = localStorage.getItem("selectedEntityId");
      let financial_year_id = localStorage.getItem("financial_id");
      if (this.personalForm.invalid) {
        return this.toast.error('Required fields should not be empty', 'Fields Error');
      }
      let value = this.personalForm?.value;
      value.candidate_id = this.candidate_id;
      value.entity_id = selectedEntityId;
      value.financial_year_id = financial_year_id;
      value.created_by = this.user_id;
      this.$shortlistedCandidate.create_candidate_offer_letter(value).subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.toast.success(res?.message);
          this.goBack();
        }
      }, err => {
        this.toast.error(err?.error?.message);
      })
    } catch (err) {
      console.log(err)
    }
  }

  // approval start
  approveOfferLetter() {
    let value = this.personalForm?.value;
    let req = {
      offer_id: this.offer_id,
      approval_status: 'APPROVED',
      approval_remarks: value?.approval_remarks,
    }
    this.$offerLetter.approve_offer_letter(req).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.toast.success(res?.message);
        this.goBack();
      }
    })
  }


  employeeFilter(e: any) {
    const aa = e
    let filteredVariable = this.reportingManagerList2.filter((item: any) => aa.includes(item?.first_name + " " + item?.last_name + " " + item.employee_code));
    this.reportingManagerList = filteredVariable
  }

  roleFilter(e: any) {
    const aa = e
    let filteredVariable = this.roleListOriginal.filter((item: any) => aa.includes(item?.role_master_name));
    this.roleList = filteredVariable
  }

  contractFilter(e: any) {
    const aa = e
    let filteredVariable = this.typeOfContractList2.filter((item: any) => aa.includes(item.contract_type));
    this.typeOfContractList = filteredVariable
  }

  locationFilter(e: any) {
    const aa = e
    let filteredVariable = this.locations2.filter((item: any) => aa.includes(item.branch_name));
    this.locations = filteredVariable
  }

  allowanceFilter(e: any, i: any) {
    const aa = e
    let filteredVariable = this.allowanceList2[i].filter((item: any) => aa.includes(item.allowance_name));
    this.allowanceList[i] = filteredVariable
  }

  goBack() {
    this.location.back();
  }

  // Form array start
  get CF_1(): any {
    return this.personalForm.controls;
  };

  addRow() {
    const allowance_details = this.personalForm.get('allowance_details') as FormArray;
    let i = allowance_details['controls'].length;
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    }
    this.$shortlistedCandidate.getActive_Allowance_migration(req).subscribe((res: any) => {
      console.log(res);
      this.allowanceList[i] = res?.data;
      this.allowanceList2[i] = res?.data;
      this.allowances[i] = this.allowanceList[i].map((value: any) => value.allowance_name)
    })
  }

  deleteallowance_details(i: number, d: any) {
    if (this.CF_1.allowance_details.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want be delete !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#858586',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.allowance_details.length >= 1) {
            this.CF_1.allowance_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  roleList: any = [];
  roleListForFilter: any = [];
  roleListOriginal: any = [];
  getAllrole() {
    let a: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(a)
    this.configMaster.getAllRole(loginUser.role).subscribe((res: any) => {
      this.roleList = res.data;
      this.roleListForFilter = this.roleList.map((item: any) => item = item.role_master_name);
      this.roleListOriginal = this.roleList;
    })
  }

  employeeList: any = [];
  emplistForFilter: any = [];
  emplistOriginal: any = [];
  get_all_employeeBy_User_role(event: any) {
    let entity_id = localStorage.getItem("selectedEntityId");
    this.configMaster.get_all_employeeBy_User_role(event?.value, entity_id).subscribe((res: any) => {
      this.employeeList = res.data;
      this.emplistForFilter = this.employeeList.map((item: any) =>  item = item?.first_name + item?.last_name);
      this.emplistOriginal = this.employeeList;
    })

  }

  employeelistFilter(e: any) {
    const aa = e
    let filteredVariable = this.emplistOriginal.filter((item: any) => aa.includes(item?.first_name + item?.last_name));
    this.employeeList = filteredVariable
  }

}