import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SelfAssessmentService } from '../../self-assessment/self-assessment.service';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import Swal from 'sweetalert2';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ColleagueReviewService } from 'src/app/@shared/services/colleague-review.service';

@Component({
  selector: 'app-colleague-review',
  templateUrl: './colleague-review.component.html',
  styleUrls: ['./colleague-review.component.scss'],
})
export class ColleagueReviewComponent {
  review: FormGroup;
  roles: any;
  employees: any = [];
  entity_id: any;
  loginUser: any;
  EmpMainId: any;
  financial_year_id: string | null;
  selfAssessmentRating: any;
  Competence: string[] = [
    'Leadership',
    'Innovation',
    'Ethic',
    'Excellence',
    'Accountability',
  ];
  paramsType: any;
  isDisabled = false;
  isButtonDisabled = false;
  yearlyAssessment: any;
  financialYear: any;
  filter_fy: string | null;
  assessments: any;
  id: any;
  login_id: any;
  ColleagueReview: any;
  submit_assessment_id: any;
  financialYear2: any;
  assessments2: any;
  roles2: any;
  employees2: any;
  years: any;
  assessmentList: any;
  rolesList: any;
  employeeList: any;
  collouageReview: any;
  yearly_assessment_id: any;
  matchedReviews: any[];
  Finaldata: any[];
  selfrating: any = [];
  collouagedata: any = [];
  numberArray: any = [];
  employee_id: any = [];
  departments: any
  departmentdata: any[] = [];
  filteredDepartments: any[] = [];
  employeeName: any[] = [];
  departmentId: any[] = [];
  employeeNameData: any[] = [];
  dept_id: any = [];
  EmployeeId: any = [];

  constructor(
    private fb: FormBuilder,
    private selfAssessmentService: SelfAssessmentService,
    private toaster: ToastrService,
    private config: ConfigurationalmasterService,
    private assessmentService: YearlyAssessmentService,
    private $miscellaneous: MiscellaneousService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private colleagueReviewService: ColleagueReviewService,
    private _commonService: CommonService,

    public dialog: MatDialog
  ) {
    this.review = this.fb.group({
      financial_year_id: ['', [Validators.required]],
      assessment_name: ['', [Validators.required]],
      dept_id: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
      colleague_id: [''],
      reviews: this.fb.array([]),
      employee: [[]],
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.paramsType = params.type;
      this.id = params.id;
      if (this.paramsType == 'view') this.isDisabled = true;
    });
  }

  selectedAssessmentRecord: any;
  updateValues = (event: any) => {
    this.selectedAssessmentRecord = event;
    this.review.get('role_id')?.setValue(null);
    this.review.get('employee_id')?.setValue(null);
    this.review.get('dept_id')?.setValue(this.selectedAssessmentRecord?.dept_id);
    this.review.get('employee')?.setValue(this.selectedAssessmentRecord?.department_employee_ids);
    this.selectedDepartmentName(this.selectedAssessmentRecord?.dept_id);
    // this.colleagueReviewService
    //   .get_employee_based_assessment_subbmitedd_id(selectedAssessmentId)
    //   .subscribe(
    //     (res: any) => {
    //       if (res.code === 200) {
    //         this.employees = res.data;
    //         this.employees.forEach((employee: any) => {
    //           this.employee_id = employee.user_id;
    //           localStorage.setItem('employee_id', employee.user_id);
    //         });
    //         const selectedEmployee = this.employees.find(
    //           (item: any) => item.yearly_assessment_id === selectedAssessmentId
    //         );
    //         if (selectedEmployee) {
    //           this.submit_assessment_id = selectedEmployee.id;
    //           localStorage.setItem(
    //             'submit_assessment_id',
    //             this.submit_assessment_id
    //           );
    //         } else {
    //           console.log(
    //             'No employee found with the selected yearly_assessment_id.'
    //           );
    //           this.submit_assessment_id = null;
    //         }
    //       } else {
    //         this.employees = [];
    //         this.submit_assessment_id = null;
    //       }
    //     },
    //     (err: any) => {
    //       this.employees = [];
    //       this.submit_assessment_id = null;
    //     }
    //   );
  };

  onSubmit() {
    if (this.review.invalid) {
      this.reviews.controls.forEach((control) => {
        control.markAllAsTouched();
      });
      this.toaster.error('All Fields are not valid');
      return;
    }

    let id = localStorage.getItem('submit_assessment_id');
    let employee_id = localStorage.getItem('employee_id');
    let collouageid = localStorage.getItem('collouageid');
    let payload = {
      review: this.review.value,
      entity_id: this.entity_id,
      filter_fy: this.filter_fy,
      login_id: this.EmpMainId,
      submit_assessment_id: id,
      employee_id: employee_id,
      colleague_id: collouageid,
    };
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader();
        this.colleagueReviewService.addReview(payload).subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            if (res.code == 200) {
              this.toaster.success('Successfully Submitted');
              // localStorage.removeItem('submit_assessment_id')
              // localStorage.removeItem('employee_id')
              // localStorage.removeItem('collouageid')
              setTimeout(() => {
                this.route.navigate(['/master/ess/colleague-review']);
              }, 500);
            } else {
              this.toaster.error(res.message);
            }
          },
          (err: any) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
            this.isButtonDisabled = false;
          }
        );
      }
    });
  }

  mode: any = [];
  ngOnInit() {
    this.onLoadApi();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.mode = params.mode;
    });
    if (this.mode === 'view') {
      this.getList();
      // const value = this.yearly_assessment_id
      // this.getAssessment({value})
    }
    this.review.get('employee')?.valueChanges.subscribe((selected: any[]) => {
       const currentDeptEmployeeIds = this.employeeNameData.map((emp) => emp.employee_id);
        if (
          selected?.length === currentDeptEmployeeIds.length &&
          currentDeptEmployeeIds.every((id) => selected.includes(id))
        ) {
          this.isAllSelect = true;
        } else {
          this.isAllSelect = false;
        }
      });
      this.getAllDepartmentData();
  }

  onLoadApi = () => {
    this.getAllRole();
    this.localStorage();
    this.setCompetence();
    this.SelfAssessentRating();
    this.getFinancialYear();
    if (this.id) {
      this.getByID();
    }
  };

  localStorage = () => {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.login_id = this.EmpMainId;
    this.filter_fy = localStorage.getItem('financial_id');
    this.entity_id = parseInt(JSON.parse(entity), 10);
    console.log('dfghjk', this.entity_id);
  };
  filterfinancialYear: any;
  // getFinancialYear = () => {
  //   this.$miscellaneous.getAllActivefinancial_year().subscribe((res: any) => {
  //     if (res.code == 200) {
  //       this.yearlyAssessment = res.data;
  //       const currentYear = new Date().getFullYear();
  //       this.financialYear = this.yearlyAssessment.filter((assessment: any) => {
  //         if (this.filter_fy == assessment.id) {
  //           return true;
  //         }
  //       });
  //       this.filterfinancialYear = [...this.financialYear];
  //       this.financialYear2 = this.financialYear;
  //       this.years = this.financialYear.map(
  //         (value: any) => value.financial_year
  //       );
  //     }
  //   });
  // };
getFinancialYear = () => {
  this.$miscellaneous.getAllActivefinancial_year().subscribe((res: any) => {
    if (res.code == 200) {
      this.yearlyAssessment = res.data;
      this.financialYear = this.yearlyAssessment.filter((assessment: any) => {
          if (this.filter_fy == assessment.id) {
            return true;
          }
        });

      // use the full list instead of filtering
      this.financialYear = [...this.yearlyAssessment];
      this.filterfinancialYear = [...this.yearlyAssessment];

      this.financialYear2 = this.financialYear;
      this.years = this.financialYear.map(
        (value: any) => value.financial_year
      );
    }
  });
};

  filterassessments: any;
  getAssessment = (e: any) => {
    this.review.get('assessment_name')?.setValue(null);
    this.review.get('role_id')?.setValue(null);
    this.review.get('employee_id')?.setValue(null);
    this.colleagueReviewService
      .getAllAssessment(this.filter_fy, this.entity_id, e.value)
      .subscribe((res) => {
        if (res.code == 200) {
          this.assessments = res.data;
          this.assessments2 = res.data;
          this.filterassessments = [...this.assessments];
          console.log('hii>>>>>>>>>>>>>>>>>> ', this.assessments);
          this.assessmentList = this.assessments.map(
            (value: any) => value.assessment_name
          );
        }
      });
  };
  getAllDepartmentData() {
    const selectedEntityId = localStorage.getItem('selectedEntityId');
    this.assessmentService.getAllDepartmentData(selectedEntityId).subscribe(
      (res: any) => {
        this.departmentdata = res.data.departments;
        this.employeeName = res.data.employees;
        this.filteredDepartments = [...this.departmentdata];
        // this.selectedDepartmentName(this.selectedAssessmentRecord?.dept_id);
        // let employees_id = this.assessmentYearData.data.employees.map(
        //   (item: any) => item.employee_id
        // );
        // console.log('Employee IDs:', employees_id);
        // if (this.action == 'edit') {
        //   this.review.patchValue({
        //     employee: employees_id,
        //   });
        // }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
  selectedDepartmentName(deptIds: any) {

    // Ensure deptIds is an array
    const selectedDeptIds = Array.isArray(deptIds) ? deptIds : [deptIds];

    this.dept_id = selectedDeptIds;

    console.log('Selected dept_ids:', selectedDeptIds);
    console.log('Type of selected dept_ids:', typeof selectedDeptIds);

    // Filter employees matching any of the selected dept_ids
    this.departmentId = this.employeeName.filter((item: any) =>
      selectedDeptIds.includes(item.dept_id)
    );

    this.employeeNameData = [];

    if (this.departmentId.length === 0) {
      console.log('No employees found in the selected departments.');
      this.review.patchValue({ employee: [] });
      this.isAllSelect = false;
    } else {
      this.departmentId.forEach((employee: any) => {
        this.employeeNameData.push({
          first_name: employee.first_name,
          last_name: employee.last_name,
          employee_id: employee.employee_id,
        });
      });

      const allEmployeeIds = this.employeeNameData.map(emp => emp.employee_id);
      this.review.patchValue({ employee: allEmployeeIds });

      const selectedEmployees = this.review.get('employee')?.value || [];
      const currentDeptEmployeeIds = this.employeeNameData.map(emp => emp.employee_id);

      const allSelected = currentDeptEmployeeIds.every(empId =>
        selectedEmployees.includes(empId)
      );
      this.isAllSelect = allSelected;
    }
  }
  filterDepartment(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!Array.isArray(this.departmentdata)) {
      console.error('departmentdata is not properly initialized');
      return;
    }
    if (!searchValue) {
      this.filteredDepartments = [...this.departmentdata];
      return;
    }
    this.filteredDepartments = this.departmentdata.filter((item: any) =>
      item.department_name?.toLowerCase().includes(searchValue)
    );
  }
  filterEmployee(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!Array.isArray(this.employeeNameData)) {
      console.error('employeeNameData is not properly initialized');
      return;
    }
    if (!searchValue) {
      this.employeeNameData = this.employeeName.filter(
        (employee: any) => employee.dept_id === this.dept_id
      );
      return;
    }
    this.employeeNameData = this.employeeName
      .filter((employee: any) => employee.dept_id === this.dept_id)
      .filter((employee: any) =>
        (employee.first_name + ' ' + employee.last_name)
          .toLowerCase()
          .includes(searchValue)
      );
  }

  isAllSelect: boolean = false;
  isIndeterminate = false;

  selectAllEmployee(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeeNameData.map(
        (emp: any) => emp.employee_id
      );
      this.review.patchValue({ employee: allEmployeeIds });
    } else {
      this.review.patchValue({ employee: [] });
    }
  }

  get reviews() {
    return this.review.get('reviews') as FormArray;
  }

  getByID = () => {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.colleagueReviewService.getById(1).subscribe((res) => {
      if (res.code == 200) {
        this.ColleagueReview = res.data;
        this.isDisabled = true;
        this.colleagueReviewService
          .getAllAssessment(
            this.filter_fy,
            this.entity_id,
            this.ColleagueReview.financial_year_id
          )
          .subscribe((res) => {
            if (res.code == 200) {
              this.assessments = res.data;
              console.log('hi i am ravi', this.assessments);
              this.colleagueReviewService
                .get_all_employeeBy_User_role(
                  this.ColleagueReview.roleId,
                  this.entity_id,
                  this.ColleagueReview.assessment_name,
                  this.filter_fy,
                  this.login_id
                )
                .subscribe((res: any) => {
                  if (res.code == 200) {
                    this.employees = res.data;
                    console.log(this.employees);
                    this.review.patchValue({
                      emp_name: res.data.first_name,
                      emp_number: res.data.employee_code,
                      department_name: res.data.department_name,
                      area_name: res.data.area_name,
                      hierarchical_superio: res.data.reporting_manager,
                    });

                    if (this.ColleagueReview.reviews.length > 0) {
                      this.ColleagueReview.reviews.forEach(
                        async (element: any, index: any) => {
                          const formGroup = (await this.reviews.at(
                            index
                          )) as FormGroup;
                          formGroup.patchValue({
                            self_rating_id: element.self_rating || null,
                          });
                        }
                      );
                    }
                  }
                });
            }
          });
      }
    });
  };

  setCompetence = () => {
    for (let data of this.Competence) {
      this.reviews.push(
        this.fb.group({
          Competence: [data],
          rating: [null, [Validators.required]],
        })
      );
    }
  };

  filterByroles: any;
  getAllRole() {
    this.config.getAllRole('Super Admin').subscribe((res: any) => {
      if (res.code == 200) {
        this.roles = res.data;
        this.filterByroles = [...this.roles];
        this.roles2 = res.data;
        this.rolesList = this.roles.map((value: any) => value.role_master_name);
        console.log('+++++++++', this.roles);
      }
    });
  }

  filteremployees: any;
  onSelectionChange(e: any) {
    this.review.get('employee_id')?.setValue(null);
    this.colleagueReviewService
      .get_all_employeeBy_User_role(
        e.value,
        this.entity_id,
        this.review.get('assessment_name')?.value,
        this.filter_fy,
        this.login_id
      )
      .subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.employees = res.data;
            this.filteremployees = [...this.employees];
            this.employees2 = res.data;
            this.employeeList = this.employees.map(
              (value: any) => value.employee_name
            );
            console.log(this.employees);
          } else {
            this.employees = [];
          }
        },
        (err: any) => {
          this.employees = [];
        }
      );
  }

  onSelect(e: any) {
    console.log('Selection changed:', e);
    if (e && e.value) {
      const selectedEmployeeId = e.value;
      localStorage.setItem('collouageid', selectedEmployeeId.toString());
      this.employees.forEach((value: any) => {
        if (value.employee_id === selectedEmployeeId) {
          this.submit_assessment_id = value.submit_assessment_id;
        }
      });
    } else {
      console.error(
        'Employee ID is undefined or not in the correct format:',
        e
      );
    }
  }

  back() {
    this.route.navigate([`/master/ess/colleague-review`]);
  }

  SelfAssessentRating() {
    this.selfAssessmentService
      .getSelfAssessentRating()
      .subscribe((res: any) => {
        this.selfAssessmentRating = res.data;
      });
  }

  yearSearch(e: any) {
    const aa = e;
    let filteredVariable = this.financialYear2.filter((item: any) =>
      aa.includes(item.financial_year)
    );
    this.financialYear = filteredVariable;
  }

  assessmentSearch(e: any) {
    const aa = e;
    let filteredVariable = this.assessments2.filter((item: any) =>
      aa.includes(item.assessment_name)
    );
    this.assessments = filteredVariable;
  }

  roleSearch(e: any) {
    const aa = e;
    let filteredVariable = this.roles2.filter((item: any) =>
      aa.includes(item.role_master_name)
    );
    this.roles = filteredVariable;
  }

  employeeSearch(e: any) {
    const aa = e;
    let filteredVariable = this.employees2.filter((item: any) =>
      aa.includes(item.employee_name)
    );
    this.employees = filteredVariable;
  }

  async getList() {
    let fy = localStorage.getItem('financial_id');
    this.colleagueReviewService
      .getAllAssessment(this.filter_fy, this.entity_id, fy)
      .subscribe((res) => {
        if (res.code == 200) {
          this.assessments = res.data;
          this.assessments2 = res.data;
          console.log('hii>>>>>>>>>>>>>>>>>> ', this.assessments);
          this.assessmentList = this.assessments.map(
            (value: any) => value.assessment_name
          );
        }
      });
    this._commonService?.showLoader();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.submit_assessment_id = params.submit_assessment_id;
      this.yearly_assessment_id = params.yearly_assessment_id;
      this.employee_id = params.employee_id;
      this.entity_id = params.entity_id;
    });
    this.colleagueReviewService
      .getAllReviews(this.filter_fy, this.EmpMainId, this.entity_id)
      .subscribe((res) => {
        this.collouageReview = res.data;
        console.log('hii', this.collouageReview);
        this.matchedReviews = this.collouageReview.filter((review: any) => {
          return (
            review.submit_assessment_id == this.submit_assessment_id &&
            review.yearly_assessment_id == this.yearly_assessment_id &&
            review.employee_id == this.employee_id &&
            review.entity_id == this.entity_id
          );
        });
        this.Finaldata = this.matchedReviews;
        this.Finaldata.forEach((item: any) => {
          this.review.patchValue({
            financial_year_id: item.filter_fy,
            role_id: item.role_master_id,
            assessment_name: item.yearly_assessment_id,
            employee_id: item.colleague_id,
          });
          if (this.mode == 'view') {
            this.review.get('financial_year_id')?.disable();
            this.review.get('role_id')?.disable();
            this.review.get('assessment_name')?.disable();
          }
          this.employees = this.Finaldata.map((review: any) => ({
            employee_id: review.colleague_id,
            employee_name: `${review.first_name} ${review.middle_name} ${review.last_name}`,
          }));

          if (this.mode == 'view') {
            this.review.get('employee_id')?.disable();
          }
          const selfRatingIds = item.self_rating_id
            .split(',')
            .map((id: string) => parseInt(id));
          selfRatingIds.forEach((ratingId: any, index: number) => {
            const reviewGroup = this.reviews.at(index) as FormGroup;
            reviewGroup.patchValue({
              rating: ratingId,
            });
            reviewGroup.patchValue({
              [`Competence${index + 1}`]: `Competence ${index + 1}`,
            });
            if (this.mode == 'view') {
              reviewGroup.get('rating')?.disable();
            }
          });
        });
      });
  }
}
