import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepper } from '@angular/material/stepper';
import { ColDef } from 'ag-grid-community';
import { ButtonComponent } from '../../../@shared/button/button.component';
import { TableviewComponent } from '../../../@shared/tableview/tableview.component';
import { SelfAssessmentSurveyService } from '../self-assessment-survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageheadingComponent } from '../../../@shared/pageheading/pageheading.component';

@Component({
  selector: 'app-create-self-assesment-survey',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    ButtonComponent,
    TableviewComponent,
    PageheadingComponent
  ],
  templateUrl: './create-self-assesment-survey.component.html',
  styleUrls: ['./create-self-assesment-survey.component.css']
})
export class CreateSelfAssesmentSurveyComponent {
  @ViewChild(TableviewComponent) tableView!: TableviewComponent;
  @ViewChild('stepper') stepper!: MatStepper;

  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;

  jobRoles: any[] = [];
  departmentdata: any[] = [];
  slilldata: any[] = [];

  rowData: any[] = [];
  originalRowData: any[] = [];
  filteredRowData: any[] = [];

  searchText = '';
  selectedDept = '';
  selectedRole = '';
  selectedEmployeeIds: string[] = [];
  selectedManagerIds: string[] = [];
  mode: 'create' | 'edit' | 'view' = 'create';

  createdSurveyId: string = ''; 


  ratingLabels: { value: number, label: string }[] = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Developing' },
  { value: 3, label: 'Proficient' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
];

  columnDefs: ColDef[] = [
    {
      headerName: '',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: 'select',
      width: 50,
      suppressSizeToFit: true,
      pinned: 'left'
    },
    { headerName: 'Employee Name', field: 'login_username' },
    { headerName: 'Department', field: 'dept_departmentName' },
    { headerName: 'Position', field: 'rm_role' },
     { headerName: 'Manager', field: 'reportingManagerName' },
  ];

  surveydata: any;
  loginUser: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private selfassessment: SelfAssessmentSurveyService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      skillArea: ['', Validators.required],
      department: ['', Validators.required],
      jobRole: ['', Validators.required],
      questions: this.fb.array([this.createQuestion()]),
      remarks: ['']
    });

    this.form1 = this.fb.group({
      degreeAssessment: ['180', Validators.required],
      employeeIds: [[],],
      managerIds: [[],],
      instructionForManager: ['', Validators.required],
      instructionForSelf: ['', Validators.required],
      surveyId: ['', Validators.required]
    });

    this.form2 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reminderFrequency: [''],
      notificationSettings: [''],
      surveyId: ['', Validators.required]
    });
  }
entity_id :any
  ngOnInit(): void {
       this.entity_id = localStorage.getItem("selectedEntityId");
       let lg: any = localStorage.getItem('signInUser');
       let loginUser = JSON.parse(lg);
    this.loginUser = JSON.parse(lg);
    this.getroleList();
    this.getdepatmentList();
    this.getskillList();
    this.getemployeeList();

    const path = this.router.url;
    if (path.includes('edit')) this.mode = 'edit';
    else if (path.includes('view')) this.mode = 'view';

    if (this.mode === 'view') {
      this.form.disable();
      this.form1.disable();
      this.form2.disable();
    }

    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) this.getSurveyById(surveyId);
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required],
      rating: [{ value: null, disabled: true }]
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  applyFilters(): void {
    this.filteredRowData = this.originalRowData.filter(emp => {
      const matchesSearch = !this.searchText || emp.login_username?.toLowerCase().includes(this.searchText);
      const matchesDept = !this.selectedDept || emp.dept_departmentName === this.selectedDept;
      const matchesRole = !this.selectedRole || emp.rm_role === this.selectedRole;
      return matchesSearch && matchesDept && matchesRole;
    });
    this.rowData = [...this.filteredRowData];
  }

  onSearchChange(event: any): void {
    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onDepartmentFilterChange(dept: string): void {
    this.selectedDept = dept;
    this.applyFilters();
  }

  onJobRoleFilterChange(role: string): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  getroleList(): void {
     
    this.selfassessment.getRoleList(this.loginUser.role).subscribe((res:any )=> {
      this.jobRoles = res.data.filter((r: any) => r.isActive);
    });
  }

  getdepatmentList(): void {
    this.selfassessment.getdepartmentList(this.entity_id).subscribe(res => {
      this.departmentdata = res.data.filter((d: any) => d.IsActive);
    });
  }

  getskillList(): void {
    this.selfassessment.getskillList().subscribe(res => {
      this.slilldata = res.data.filter((s: any) => s.isActive);
    });
  }

  getemployeeList(): void {
    this.selfassessment.getemployeeList().subscribe(res => {
      this.rowData = res;
      this.originalRowData = res;
      this.filteredRowData = res;
    });
  }
  selectedPeers: any[] = [];
  searchTerm = '';
    filterPeers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRowData = this.originalRowData.filter(emp =>
      emp.login_username.toLowerCase().includes(term) 
    
    );
  }

  togglePeerSelection(emp: any): void {
    const index = this.selectedPeers.indexOf(emp);
    if (index > -1) {
      this.selectedPeers.splice(index, 1);
    } else {
      if (this.selectedPeers.length < 5) {
        this.selectedPeers.push(emp);
      }
    }
  }
feedbackType: any;


  createSurveyForm(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload = {
        surveyTitle: formValue.title,
        skillArea: formValue.skillArea,
        department: formValue.department,
        jobRole: formValue.jobRole,
        questions: formValue.questions,
        remark: formValue.remarks
      };

      if (this.createdSurveyId) {
        this.selfassessment.updatesurvey(this.createdSurveyId, payload).subscribe({
          next: (res) => {
            this.stepper.next();
          },
          error: (err) => {
            console.error('Survey update failed:', err);
          }
        });
      } else {
        this.selfassessment.createsurveyform(payload).subscribe({
          next: (res) => {
            this.createdSurveyId = res?.data?.id;
            this.form1.get('surveyId')?.setValue(this.createdSurveyId);
            this.form2.get('surveyId')?.setValue(this.createdSurveyId);
            this.stepper.next();
          },
          error: (err) => {
            console.error('Survey creation failed:', err);
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitAssignSurvey(): void {
    if (this.form1.valid) {
      const payload = this.form1.value;

      if (this.surveydata?.a_id) {
        this.selfassessment.updateAssignedSurvey(this.surveydata.a_id, payload).subscribe({
          next: (res) => this.stepper.next(),
          error: (err) => console.error('Error updating assigned survey:', err)
        });
      } else {
        this.selfassessment.Assignsurvey(payload).subscribe({
          next: (res) => this.stepper.next(),
          error: (err) => console.error('Error assigning survey:', err)
        });
      }
    } else {
      this.form1.markAllAsTouched();
    }
  }

  submitSetTimeline(): void {
    if (this.form2.valid) {
      const payload = this.form2.value;

      if (this.surveydata?.sts_id) {
        this.selfassessment.updateSetTimeline(this.surveydata.sts_id, payload).subscribe({
          next: (res) => this.stepper.next(),
          error: (err) => console.error('Error updating timeline:', err)
        });
      } else {
        this.selfassessment.submitSetTimeline(payload).subscribe({
          next: (res) => this.stepper.next(),
          error: (err) => console.error('Error creating timeline:', err)
        });
      }
    } else {
      this.form2.markAllAsTouched();
    }
  }

  onEmployeesSelected(event: any[]): void {
    const ids = event.map(e => e.login_id);
    const managerIds = event.map(e => e.user_reportingManagerId);
    this.selectedEmployeeIds = ids;
    this.selectedManagerIds = managerIds;
    this.form1.get('employeeIds')?.setValue(ids);
    this.form1.get('managerIds')?.setValue(managerIds);
  }

  onFeedbackChange(degree: string): void {
    this.form1.get('degreeAssessment')?.setValue(degree);
      this.feedbackType = degree;
  }

  getSurveyById(id: string): void {
    this.selfassessment.getSurveyById(id).subscribe({
      next: (res) => {
        const data = res.data;
        this.surveydata = data;
        this.createdSurveyId = data.s_id;

        this.form.patchValue({
          title: data.s_surveyTitle,
          skillArea: data.s_skillArea,
          department: data.s_department,
          jobRole: data.s_jobRole,
          remarks: data.s_remark
        });

        this.questions.clear();
        data.s_questions.forEach((q: any) => {
          this.questions.push(this.fb.group({ skill: q.skill, rating: [{ value: q.rating, disabled: true }] }));
        });

        this.form1.patchValue({
          degreeAssessment: data.a_degreeAssessment,
          instructionForManager: data.a_instructionForManager,
          instructionForSelf: data.a_instructionForSelf,
          surveyId: data.s_id,
          employeeIds: data.a_employeeIds || [],
          managerIds: data.a_managerIds || []
        });

        this.form2.patchValue({
          startDate: data.sts_startDate,
          endDate: data.sts_endDate,
          reminderFrequency: data.sts_reminderFrequency,
          notificationSettings: data.sts_notificationSettings,
          surveyId: data.s_id
        });
      },
      error: (err) => {
        console.error('Error loading survey:', err);
      }
    });
  }

  publishSurvey(): void {
    this.location.back();
  }

  selectAll(): void {
    this.tableView.gridApi.selectAll();
  }

  deselectAll(): void {
    this.tableView.gridApi.deselectAll();
  }
}