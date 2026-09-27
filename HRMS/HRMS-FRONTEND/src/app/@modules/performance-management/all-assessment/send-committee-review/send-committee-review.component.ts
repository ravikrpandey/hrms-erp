import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelfAssessmentService } from 'src/app/@shared/services/performance-management/self-assessment.service';
import { saveAs } from 'file-saver';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-send-committee-review',
  templateUrl: './send-committee-review.component.html',
  styleUrls: ['./send-committee-review.component.scss']
})
export class SendCommitteeReviewComponent {
  public Editor = ClassicEditor;
  employeeDetail: FormGroup;
  technicalAssement: FormGroup;
  behaviorAssessment: FormGroup;
  skillDevelopmentForm: FormGroup;
  suggestSkillDevelopmentForm: FormGroup;
  // selfAssessmentForm:FormGroup;
  endDate: any;
  startDate: any;
  sdpEndDate: any;
  sdpStartDate: any;
  entity_id: any;
  financial_id: any;
  techAssessment: any = [];
  selfAssessmentRating: any = [];
  selfEmployee: any = [];
  EmpMainId: string | null;
  currentDate: any;
  Competence: string[] = ['Leadership', 'Innovation', 'Ethic', 'Excellence', 'Accountability']
  baseUrl = environment.serverUrl;
  skill_document: any;
  loginUser: any;
  Rating_status: any = "Pending For Manager Review";
  yearly_assessment_id: any;
  endpoints: { id: any, financial_id: any; entity_id: any; employee_id: any; };
  getAllBehavior: any = [];
  getSkillDevelopment: any = [];
  getKpaMaster: any = [];
  paramsType: any;
  financial_year_id: any;
  paramsEndpoints: { entity_id: any; financial_id: any; employee_id: string | null; };
  assessmentName: any;
  kpa_assessment: any = [];
  isDisabled: boolean = false;
  isDisabledSkill: boolean = false;
  emp_id: any;
  endpoints2: { financial_id: number; entity_id: number; employee_id: number; };
  minStartDate: any = null;
  minEndDate: any = null;
  id: any;
  minEndDate2: any = [];
  mode: any;
  submitted_assessment_id: any = null;
  Months: string[];
  finalRatings2: any = [];
  finalRatings1: any = [];
  primary_key_id: any;
  behaviorAssessmentValue: any;
  technicalAssementValue: any;
  committee_review_form: any;
  committeeReviewForm: any;
  designationList: any;
  employeeList: any = [[], []];
  viewMode: any;
  suggestSkillDevelopment: any;
  roles: any = [];
  employees: any = [[]];
  employees2: any = [[]];
  params: any;
  committeeAssignUser: any = [];
  status: any;
  s_date: any;
  e_date: any;
  end_date: any = [];
  inn_date: any = [];
  colleaguesReview: FormGroup;
  colleagueReviewsData: any = [];
  averageColleagueReview: Map<string, number> = new Map<string, number>();
  roles2: any = [];
  rolesList: any = [];
  employeesList: any = [];
  employeesList2: any;
  disableCommittee: boolean = false;
  assess_name: any;
  constructor(private fb: FormBuilder, private selfAssessmentService: SelfAssessmentService, private toaster: ToastrService,
    private config: ConfigurationalmasterService,
    private _commonService: CommonService,
    private route: Router, private activeroute: ActivatedRoute, public dialog: MatDialog,) {
    this.employeeDetail = this.fb.group({
      emp_name: [''],
      emp_number: [''],
      department_name: [''],
      area_name: [''],
      hierarchical_superio: [''],
      start_date: [''],
      end_date: [''],
      assessment_name: ['']
    });

    // this.technicalAssement = this.fb.group({
    //   self_rating_id:[null],
    //   kpa_id:[this.techAssessment[0]?.id]
    // });

    this.technicalAssement = this.fb.group({
      technicalItems: this.fb.array([])
    });

    this.behaviorAssessment = this.fb.group({
      behaviorItems: this.fb.array([])
    });

    this.colleaguesReview = this.fb.group({
      colleaguesReviews: this.fb.array([]),
      remark: [null, [Validators.required]],
    });

    for (let data of this.Competence) {
      this.behaviorItems.push(
        this.fb.group({
          self_rating_id: [null, [Validators.required]],
          manager_rating_id: [null, [Validators.required]],
          Competence: [data],
          approval_manager_rating_Id: [""],
          final_rating: [null, []]
        })
      )
      this.colleaguesReviews?.push(
        this.fb.group({
          Competence: [data],
          rating: [null, [Validators.required]]
        })
      )
    }

    this.suggestSkillDevelopmentForm = this.fb.group({
      remark: [''],
      remark_by_employee: [''],
      current_date: ['', Validators.required],
      
      suggestDevelopment: this.fb.array([
        this.fb.group({
          development: ['', [Validators.required]],
        })
      ])
    });

    this.skillDevelopmentForm = this.fb.group({
      remark: [''],
      frequency: ['']
      // items: this.fb.array([

      // ])
    });

    this.committeeReviewForm = this.fb.group({
      committee: this.fb.array([
        this.fb.group({
          designation_id: ['', [Validators.required]],
          employee_id: ['', [Validators.required]],
        })
      ])
    })

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.params = params;
      this.paramsType = params.type;
      this.mode = params.mode;
      this.yearly_assessment_id = Number(params?.id);
      this.financial_year_id = params.financial_year_id;
      this.assessmentName = params?.assessment_name;
      this.emp_id = params?.employee_id;
      this.primary_key_id = params?.primary_key_id;
      this.status = params.status;
      this.assess_name = params.assess_name;
    });
  }

  get items() {
    return this.skillDevelopmentForm.get('items') as FormArray;
  }

  get behaviorItems() {
    return this.behaviorAssessment.get('behaviorItems') as FormArray;
  }

  get suggestDevelopment() {
    return this.suggestSkillDevelopmentForm.get('suggestDevelopment') as FormArray;
  }

  get technicalItems() {
    return this.technicalAssement.get('technicalItems') as FormArray;
  }

  get colleaguesReviews() {
    return this.colleaguesReview.get('colleaguesReviews') as FormArray;
  }

  get committee() {
    return this.committeeReviewForm.get('committee') as FormArray;
  }

  getMonth() {
    this.Months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  ngOnInit() {
    this.localStorage();
    this.getMonth()
    this.getAllRole()
    this.currentDate = new Date()
    this.currentDate = this.formatDate(this.currentDate)
    this.suggestSkillDevelopmentForm.controls['current_date'].setValue(this.currentDate)
    if (this.mode != "innitiate") {
      // this.getKpi();
      this.SelfAssessentRating();
      // this.getEmployee();
    }
    if (this.mode == "innitiate") {
      this.getKpi()
      this.SelfAssessentRating();
      this.getEmployee();
    }
    if (this.mode != "Innitiate" && (this.paramsType == "view" || this.mode == "view" || this.mode == "edit")) {
      //  this.getSelfAssessment();
      this.getCompleteSelfAssessment();
    }
    else {
      this.addRow();
    }
  }

  convert(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Months are 0-based in JavaScript
    const dayFormatted = ('0' + date.getDate()).slice(-2);
    const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
    const yearFormatted = date.getFullYear();
    return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
  }

  getCompleteSelfAssessment() {
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      yearly_assessment_id: this.yearly_assessment_id,
    }
    this._commonService?.showLoader()
    this.selfAssessmentService.getCompleteSelfAssessment(paramsEndpoints.entity_id, paramsEndpoints.financial_id, paramsEndpoints.employee_id, paramsEndpoints.yearly_assessment_id, this.EmpMainId).subscribe((res: any) => {
      this._commonService?.hideLoader()
      if (res.code == 200) {
        this.getAllBehavior = res.data.behavioral_assessments;
        this.submitted_assessment_id = res.data.submitted_assessment_id
        this.s_date = this.convert(res.data.start_date);
        this.e_date = this.convert(res.data.end_date);

        this.employeeDetail.patchValue({
          emp_name: res.data.first_name,
          emp_number: res.data.employee_code,
          department_name: res.data.department_name,
          area_name: res.data.area_name,
          hierarchical_superio: res.data.reporting_manager,
          start_date: res.data.start_date,
          end_date: res.data.end_date,
          assessment_name: res.data.assessment_name
        });

        this.isDisabled = true;
        if (this.getAllBehavior.length > 0) {
          this.getAllBehavior.forEach(async (element: any, index: any) => {
            let findIndex = -1;
            this.Competence.forEach((value: any, index: any) => {
              if (value == element.competence) findIndex = index;
            })
            const formGroup = await this.behaviorItems.at(findIndex) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating_id || null,
              manager_rating_id: element.manager_self_rating || null,
              final_rating: element.final_rating,
              approval_manager_rating_Id: element.approval_manager_rating_Id
            });
            this.mode == "view" ? this.behaviorItems.controls[findIndex]?.get('manager_rating_id')?.disable() : null;
            this.mode == "view" ? this.behaviorItems.controls[findIndex]?.get('self_rating_id')?.disable() : null;
            this.mode == "view" ? this.behaviorItems.controls[index]?.get('approval_manager_rating_Id')?.disable() : null;
          });
        }

        this.getSkillDevelopment = res.data.skill_development_plans;
        this.suggestSkillDevelopment = res.data.suggest_skill_development_plans;
        this.colleagueReviewsData = res.data.colleague_reviews;
        this.getKpaMaster = res.data.getKpaMaster;
        this.techAssessment = res.data.technical_assessments;
        this.committeeAssignUser = []
        if (res.data.committee_assign_user) {
          this.committeeAssignUser = res.data.committee_assign_user.length > 0 ? res.data.committee_assign_user : [];
        }// bellow line use for backup the data please do not remove this code
        this.kpa_assessment = this.techAssessment;

        this.createTecnicalField();
        if (this.kpa_assessment?.length > 0) {
          // this.kpa_assessment = [];

          this.kpa_assessment?.forEach(async (element: any, index: any) => {
            const formGroup = await this.technicalItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.kpa_self_rating_id,
              manager_rating_id: element.kpa_manager_rating_id,
              final_rating: element.kpa_final_rating,
              approval_manager_rating_Id: element.approval_manager_rating_Id
            });
            this.mode == "view" ? this.technicalItems.controls[index]?.get('self_rating_id')?.disable() : null;
            this.mode == "view" ? this.technicalItems.controls[index]?.get('manager_rating_id')?.disable() : null;
            this.mode == "view" ? this.technicalItems.controls[index]?.get('approval_manager_rating_Id')?.disable() : null;

          });
        }

        if (this.colleagueReviewsData?.length > 0) {

          let x = this.colleagueReviewsData?.length / 5;
          this.colleagueReviewsData.forEach((element: any) => {
            const key = element.colleague_competence;
            const value = Number(element.colleague_self_rating_value);

            // Check if the competence already exists in the map
            if (this.averageColleagueReview.has(key)) {
              // Update the existing value
              this.averageColleagueReview.set(key, this.averageColleagueReview.get(key)! + value);
            } else {
              // Add a new entry
              this.averageColleagueReview.set(key, value);
            }
          });

          // Example: logging the map contents
          this.averageColleagueReview.forEach((value, key) => {
            value = value / x;

            value = Math.round(value);
            this.averageColleagueReview.set(key, value);
            console.log(`${key}: ${value}`);
          });



          this.averageColleagueReview.forEach((value, key) => {
            this.selfAssessmentRating.forEach((value2: any, ind: any) => {
              if (Number(value2.self_rating_value) == Number(value)) {
                this.averageColleagueReview.set(key, value2.id);
              }
            })
          })

          this.averageColleagueReview.forEach(async (value: any, key: any) => {
            let findIndex = -1;
            this.Competence.forEach(async (value2: any, index: any) => {
              if (value2 == key) {
                findIndex = index;
              }
            })
            const formGroup = await this.colleaguesReviews?.at(findIndex) as FormGroup;
            if (formGroup) {
              formGroup.patchValue({
                rating: value
              });
            }
            this.mode == "view" ? this.colleaguesReviews?.controls[findIndex]?.get('competence')?.disable() : null;
            this.mode == "view" ? this.colleaguesReviews?.controls[findIndex]?.get('rating')?.disable() : null;
          });
        }

        if (this.getSkillDevelopment.length > 0) {

          this.getSkillDevelopment.forEach(async (element: any, index: any) => {
            this.items.push(
              this.fb.group({
                development: [''],
                action_plan: [''],
                initiate_date: [null],
                end_date: [null],
                files: ['']
              })
            )
            const formGroup = await this.items.at(index) as FormGroup;
            this.inn_date[index] = this.convert(element.initiate_date)
            this.end_date[index] = this.convert(element.end_date)
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan: element.action_plan || "",
              initiate_date: element.initiate_date || null,
              end_date: element.end_date || null,
              files: element.file_document
            });
            // this.getFileName(index);
            if (this.mode != 'edit') {
              this.isDisabledSkill = true;
            }
            // this.items.controls[index].get('development')?.disable();
            // this.items.controls[index].get('action_plan')?.disable();
            // this.items.controls[index].get('initiate_date')?.disable();
            // this.items.controls[index].get('end_date')?.disable();
          });

          this.suggestSkillDevelopmentForm.patchValue({ remark_by_employee: res.data.remark });
          this.suggestSkillDevelopmentForm.patchValue({ remark: res.data.manager_remark });
          this.mode == "view" ? this.suggestSkillDevelopmentForm.get('remark_by_employee')?.disable() : null;
        }
        if (this.suggestSkillDevelopment.length > 0) {
          this.suggestSkillDevelopment.forEach(async (element: any, index: any) => {
            if (index > 0) {
              this.suggestDevelopment.push(
                this.fb.group({
                  development: [''],
                })
              )
            }
            const formGroup = await this.suggestDevelopment.at(index) as FormGroup;
            formGroup.patchValue({
              development: element.need_for_development || "",
            });
            // this.suggestDevelopment.controls[index].get('development')?.disable();
          });
        }
        if (this.committeeAssignUser.length > 0) {
          this.committeeAssignUser.forEach(async (element: any, index: any) => {

            if (index > 0) {
              this.committee.push(
                this.fb.group({
                  designation_id: ['', [Validators.required]],
                  employee_id: ['', [Validators.required]],
                })
              )
            }

            this.config.get_all_employeeBy_User_role(element.role_master_id, this.entity_id).subscribe(async (res: any) => {
              if (res.code == 200) {
                this.employees[index] = res.data;
                this.roles[index] = this.roles[0];
                this.roles2[index] = this.roles[0];
                this.rolesList[index] = this.roles[0].map((value: any) => value.role_master_name)
                this.employees2[index] = res.data;
                this.employeesList[index] = res.data.map((value: any) => value.first_name + " " + value.last_name);
                const formGroup = await this.committee.at(index) as FormGroup;
                formGroup.patchValue({
                  designation_id: element.role_master_id,
                  employee_id: element.assign_user_id
                });
                this.disableCommittee = true;
                // this.committee.controls[index]?.get('designation_id')?.disable()
                // this.committee.controls[index]?.get('employee_id')?.disable()
              }
            })
            // this.suggestDevelopment.controls[index].get('development')?.disable();
          });
        }
      }
    }, (err: any) => {
      this.getEmployee();
      this._commonService?.hideLoader()
    })
  }

  getSelfAssessment() {
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      submit_assessment_id: this.yearly_assessment_id,
    }

    this.selfAssessmentService.getSelfAssessment(paramsEndpoints).subscribe((res: any) => {
      if (res.code == 200) {
        this.getAllBehavior = res.data.getAllBehavior;
        this.getSkillDevelopment = res.data.getSkillDevelopment;
        this.getKpaMaster = res.data.getKpaMaster;
        if (this.getKpaMaster.length > 0) {
          this.kpa_assessment = [];
          this.getKpaMaster?.forEach(async (element: any, index: any) => {
            const formGroup = await this.technicalItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating_id
            });
            this.technicalItems.controls[index]?.get('self_rating_id')?.disable();
          });

          this.techAssessment.forEach((kpadata: any) => {
            this.getKpaMaster.forEach((technical_assessment: any) => {
              if (kpadata.id === technical_assessment.kpa_id) {
                this.kpa_assessment.push(kpadata);
              }
            });
          });
        }

        if (this.getAllBehavior.length > 0) {
          this.getAllBehavior.forEach(async (element: any, index: any) => {
            const formGroup = await this.behaviorItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating || null
            });
            this.behaviorItems.controls[index]?.get('self_rating_id')?.disable();
          });
        }

        if (this.getSkillDevelopment.length > 0) {
          this.getSkillDevelopment.forEach(async (element: any, index: any) => {
            this.items.push(
              this.fb.group({
                development: [''],
                action_plan: [''],
                initiate_date: [null],
                end_date: [null],
                files: ['']
              })
            )
            const formGroup = await this.items.at(index) as FormGroup;
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan: element.action_plan || "",
              initiate_date: element.initiate_date || null,
              end_date: element.end_date || null,
              files: element.file_document
            });
            // this.getFileName(index);
            this.skillDevelopmentForm.patchValue({
              remark: element.remarks
            });
            if (this.mode != 'edit') {
              this.isDisabledSkill = true;
            }
            // this.isDisabledSkill = true;
            // this.items.controls[index].get('development')?.disable();
            // this.items.controls[index].get('action_plan')?.disable();
            // this.items.controls[index].get('initiate_date')?.disable();
            // this.items.controls[index].get('end_date')?.disable();
          });
          this.skillDevelopmentForm.get('remark')?.disable();
        }
      }
    })
  }

  downloadFileUsingXHR(url: string, fileName: string): void {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const reader = new FileReader();
        reader.onload = function () {
          // Create a link element to trigger download
          const link = document.createElement('a');
          link.href = reader.result as string;
          link.download = fileName;
          link.click();
        };
        reader.readAsDataURL(blob);
      } else {
        console.error('Download failed:', xhr.statusText);
      }
    };

    xhr.onerror = function () {
      console.error('Request failed');
    };

    xhr.send();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  createTecnicalField() {
    if (this.mode != "innitiate") {
      for (let data of this.kpa_assessment) {
        this.technicalItems.push(
          this.fb.group({
            self_rating_id: [null, [Validators.required]],
            kpa_id: [data.kpa_master_id],
            final_rating: [null],
            manager_rating_id: [null, [Validators.required]],
            approval_manager_rating_Id: [""]
          })
        )
      }
    } else {
      for (let data of this.kpa_assessment) {
        this.technicalItems.push(
          this.fb.group({
            self_rating_id: [null, [Validators.required]],
            kpa_id: [data.id],
            final_rating: [null]
          })
        )
      }
    }
  }

  startDateValidator(index: number, items: AbstractControl[]): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const initiateDate = items[index]?.get('initiate_date')?.value;
      const endDate = items[index]?.get('end_date')?.value;
      const previousEndDate = items[index - 1]?.get('end_date')?.value;
      if (endDate && endDate <= initiateDate) {
        return { 'currentendDateInvalid': true };
      }
      return initiateDate && initiateDate < previousEndDate
        ? { 'startDateInvalid': true }
        : null;
    };
  }

  endDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const parentGroup = control.parent as FormGroup | null;
    if (!parentGroup) {
      return null;
    }

    const startDate = parentGroup.controls['initiate_date'].value;
    const endDate = control.value;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { 'endDateInvalid': true };
    }
    if (startDate && endDate && new Date(startDate) < new Date(endDate)) {
      parentGroup.controls['initiate_date'].setErrors(null);
      parentGroup.controls['initiate_date'].updateValueAndValidity();
    }
    return null;
  }


  addRow() {
    const newRowIndex = this.items.length;
    this.items.push(
      this.fb.group({
        development: ['', [Validators.required]],
        action_plan: ['', [Validators.required]],
        initiate_date: [null, [Validators.required, this.startDateValidator(newRowIndex, this.items.controls)]],
        end_date: [null, [Validators.required, this.endDateValidator]],
        files: ['']
      })
    )
  }

  romoveRow(index: any) {
    this.items.removeAt(index);
  }

  SuggestAddRow() {
    this.suggestDevelopment.push(
      this.fb.group({
        development: ['', [Validators.required]],
      })
    )
  }

  romoveSuggestRow(index: any) {
    this.suggestDevelopment.removeAt(index);
  }

  addCommitteeRow(index: any) {
    this.config.getAllRole('Super Admin').subscribe((res: any) => {
      if (res.code == 200) {
        this.roles[index + 1] = res.data;
        this.roles2[index + 1] = res.data;
        this.rolesList[index + 1] = res.data.map((value: any) => value.role_master_name);
      }
    }, (err: any) => this.roles[index] = []);
    this.committee.push(
      this.fb.group({
        designation_id: ['', [Validators.required]],
        employee_id: ['', [Validators.required]],
      })
    )
    this.employeeList[index] = [];
  }

  removeCommitteeRow(index: any) {
    this.committee.removeAt(index);
  }

  getKpi() {
    this.selfAssessmentService.getSelfAssessentKpi(this.endpoints2).subscribe((res: any) => {
      if (res.code == 200) {
        this.techAssessment = res.data;
        // bellow line use for backup the data please do not remove this code
        this.kpa_assessment = this.techAssessment;
        this.createTecnicalField();
      }
    });
  }

  getAllRole() {
    this.config.getAllRole('Super Admin').subscribe((res: any) => {
      if (res.code == 200) {
        this.roles[0] = res.data;
        this.roles2[0] = res.data;
        this.rolesList[0] = this.roles[0].map((value: any) => value.role_master_name)
        console.log("+++++++++", this.roles)
      }
    });
  }

  roleFilter(e: any, i: any) {
    const aa = e
    let filteredVariable = this.roles2[i].filter((item: any) => aa.includes(item.role_master_name));
    this.roles[i] = filteredVariable
  }

  employeeFilter(e: any, i: any) {
    const aa = e
    let filteredVariable = this.employees2[i].filter((item: any) => aa.includes(item.first_name + " " + item.last_name));
    this.employees[i] = filteredVariable
  }

  onSelectionChange(e: any, i: any) {
    console.log(e.value)
    console.log(e.value)
    this.config.get_all_employeeBy_User_role(e.value, this.entity_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.employees[i] = res.data;
        this.employees2[i] = res.data;
        this.employeesList[i] = res.data.map((value: any) => value.first_name + " " + value.last_name);
        console.log("}}}}}}}}}}}{{{{{{{{{", this.employees[i])
        this.committeeReviewForm.get('committee')?.get(i.toString())?.get('employee_name')?.setValue(null)
      } else {
        this.employees[i] = []
        this.employeesList[i] = [];
        this.committeeReviewForm.get('committee')?.get(i.toString())?.get('employee_name')?.setValue(null)
      }
    }, (err: any) => {
      this.employees[i] = []
    })
  }


  back() {
    this.route.navigate([`/master/performance/all-assessment/list`], { queryParams: { id: this.params.dept_id, assess_id: this.yearly_assessment_id, assess_name: this.assess_name } })
  }

  SelfAssessentRating() {
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessentRating().subscribe((res: any) => {
      this.selfAssessmentRating = res.data;
      this._commonService?.hideLoader()
    }, (err: any) => {
      this._commonService?.hideLoader()
    });
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = JSON.parse(entity);
    this.setEndPoint();
    // when save initiate then save current financial year id not that main financial id
    this.paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.EmpMainId
    }
  }

  setEndPoint() {
    this.endpoints = {
      id: Number(this.id),
      financial_id: Number(this.financial_year_id),
      entity_id: Number(this.entity_id),
      employee_id: Number(this.emp_id),
    }
    this.endpoints2 = {
      financial_id: Number(this.financial_year_id),
      entity_id: Number(this.entity_id),
      employee_id: Number(this.EmpMainId),
    }
  }


  getEmployee() {
    this.selfAssessmentService.getSelfAssessentemployee(this.endpoints).subscribe((res: any) => {
      if (res.code == 200) {
        this.selfEmployee = res.data[0];
        this.s_date = this.convert(this.selfEmployee.start_date);
        this.e_date = this.convert(this.selfEmployee.end_date);
        this.employeeDetail.patchValue({
          emp_name: this.selfEmployee.first_name,
          emp_number: this.selfEmployee.employee_code,
          department_name: this.selfEmployee.department_name,
          area_name: this.selfEmployee.area_name,
          hierarchical_superio: this.selfEmployee.reporting_manager,
          start_date: this.selfEmployee.start_date,
          end_date: this.selfEmployee.end_date,
          assessment_name: this.assess_name
        });

        this.isDisabled = true;
        // this.employeeDetail.get('emp_name')?.disable();
        // this.employeeDetail.get('emp_number')?.disable();
        // this.employeeDetail.get('department_name')?.disable();
        // this.employeeDetail.get('area_name')?.disable();
        // this.employeeDetail.get('hierarchical_superio')?.disable();
        // this.employeeDetail.get('start_date')?.disable();
        // this.employeeDetail.get('end_date')?.disable();
        // if(this.paramsType == "view"){
        //   this.getSelfAssessment();
        // }
      }
    });
  }

  onManagerRatingChange2(e: any, i: any) {
    let ManagerRatingIndex = 0;
    let userRatingIndex = 0;
    let finalIndex = 0;

    let id = this.behaviorItems?.controls[i]?.get('self_rating_id')?.value;

    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (value.id == id) {
        userRatingIndex = ind;
      }
    })

    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (value.id == e.target.value) {
        ManagerRatingIndex = ind;
      }
    })

    let avgRating = (Number(this.selfAssessmentRating[ManagerRatingIndex].self_rating_value) + Number(this.selfAssessmentRating[userRatingIndex].self_rating_value)) / 2;
    avgRating = Math.round(avgRating);

    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (Number(value.self_rating_value) == Number(avgRating)) {
        this.finalRatings2[i] = ind;
      }
    })

    this.behaviorItems?.controls[i]?.get('final_rating')?.setValue(this.selfAssessmentRating[this.finalRatings2[i]]?.self_rating + "  (" + this.selfAssessmentRating[this.finalRatings2[i]]?.self_rating_value + ")")

  }

  onManagerRatingChange1(e: any, i: any) {
    let ManagerRatingIndex = 0;
    let userRatingIndex = 0;
    let finalIndex = 0;

    let id = this.technicalItems?.controls[i]?.get('self_rating_id')?.value;

    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (value.id == id) {
        userRatingIndex = ind;
      }
    })

    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (value.id == e.target.value) {
        ManagerRatingIndex = ind;
      }
    })

    let avgRating = (Number(this.selfAssessmentRating[ManagerRatingIndex].self_rating_value) + Number(this.selfAssessmentRating[userRatingIndex].self_rating_value)) / 2;
    avgRating = Math.round(avgRating);
    this.selfAssessmentRating.forEach((value: any, ind: any) => {
      if (Number(value.self_rating_value) == Number(avgRating)) {
        this.finalRatings1[i] = ind;
      }
    })

    this.technicalItems?.controls[i]?.get('final_rating')?.setValue(this.selfAssessmentRating[this.finalRatings1[i]]?.self_rating + "  (" + this.selfAssessmentRating[this.finalRatings1[i]]?.self_rating_value + ")")
  }

  getFileName(index: number): string {
    const file: any = this.items.at(index).get('files')?.value as File;
    return file
  }

  getFileExtension(index: number): string {

    const file: any = this.items.at(index).get('files')?.value as File;
    const parts = file.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }

  download(url: string, index: number): void {

    let name = this.getFileName(index)
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const reader = new FileReader();
        reader.onload = function () {
          // Create a link element to trigger download
          const link = document.createElement('a');
          link.href = reader.result as string;
          link.download = name;
          link.click();
        };
        reader.readAsDataURL(blob);
      } else {
        console.error('Download failed:', xhr.statusText);
      }
    };

    xhr.onerror = function () {
      console.error('Request failed');
    };

    xhr.send();
  }

  download2(url: string, index: number): void {

    let name = this.getFileName(index)
    window.open(url, '_blank');
  };

  uploadDoc(index: any, evemt: any) {
    try {
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.selfAssessmentService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.skill_document = response?.url;
          this.patchFilesValue(index, this.skill_document);
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  patchFilesValue(formGroupIndex: number, filesValue: any) {
    const formGroup = this.items.at(formGroupIndex) as FormGroup;
    formGroup.get('files')?.patchValue('/uploaded_files/' + filesValue);
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>, i: any) {
    const startDate = event.value ? new Date(event.value) : null;
    const nextDay = startDate ? new Date(startDate) : null;
    nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
    this.minEndDate2[i] = nextDay;
    (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(null);
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>, i: any) {
    const endDate: any = event.value ? new Date(event.value) : null;
    const formattedDate = this.formatDate(endDate);
    (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(formattedDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }



  view(kpiData: any) {
    // const dialogRef = this.dialog.open(ViewAssessmentComponent, {
    //   data: { data:kpiData, action: "view" },
    //   width: '500px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   // this.reloadCurrentRoute();
    // });
  }

  onSubmit() {
    if (this.committeeReviewForm.invalid) {

      this.committee.controls.forEach(control => {
        control.markAllAsTouched();
      })
      return
    }

    let payload = {
      committee_assign_users: this.committeeReviewForm.value.committee,
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      submitted_assessment_id: this.submitted_assessment_id,
      login_id: this.EmpMainId,
      status: "Pending Committee Review"
    }

    this._commonService?.showLoader()
    this.selfAssessmentService.assignCommittee(payload).subscribe((res: any) => {
      this._commonService?.hideLoader()
      if (res.code == 200) {
        this.toaster.success(res.message);
        this.route.navigate(['/master/performance/all-assessment/list'], { queryParams: { assess_id: this.params.id, id: this.params.dept_id } });
      }
      else {
        this.toaster.error(res.message);
      }
    }, err => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message)
    });
  }
}
