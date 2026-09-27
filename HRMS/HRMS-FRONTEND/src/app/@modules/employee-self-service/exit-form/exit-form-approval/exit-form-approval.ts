import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ExitFormService } from '../exit-form-service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-exit-form-approval',
  templateUrl: './exit-form-approval.html',
  styleUrls: ['./exit-form-approval.scss'],
})
export class ExitFormApproval {
  exitForm!: FormGroup;
  entity_id: number;
  financial_id: number;
  employee_id: any;
  resignation_id: any;
  exit_form_id: any;
  type: any;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private exitFormService: ExitFormService,
    private toast: ToastrService,
    private route: Router
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.financial_id = Number(localStorage.getItem('financial_id'));
    this.employee_id = localStorage.getItem('EmpMainId');
    this.activeRoute.queryParams.subscribe((params: any) => {
      this.resignation_id = params?.resignation_id;
      this.exit_form_id = params?.exit_form_id;
      this.type = params?.type;
      if (this.resignation_id) {
        this.getIdResignation(this.resignation_id);
      }
      if (this.resignation_id) {
        this.getIdResignation(this.resignation_id);
      }
      if (this.exit_form_id) {
        this.getExitFormById(this.exit_form_id);
      }
    });
    this.getUserById();
  }

  buildForm() {
    this.exitForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeCode: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      lastWorkingDay: ['', Validators.required],

      primaryReason: ['', Validators.required],
      decisionTrigger: ['', Validators.required],
      preventReason: ['', Validators.required],

      jobMatch: ['', Validators.required],
      workEnvironment: ['', Validators.required],
      challenges: ['', Validators.required],

      managerRelation: ['', Validators.required],
      managerSupport: ['', Validators.required],
      teamCommunication: ['', Validators.required],

      compensationSatisfaction: ['', Validators.required],
      growthFeedback: ['', Validators.required],

      recommendation: ['', Validators.required],
      suggestions: ['', Validators.required],
      approver_remarks: ['', Validators.required],
      rehire_eligibility: [false, Validators.required],
    });
  }

  getUserById() {
    this._empRegistration
      .getByUserId(this.employee_id)
      .subscribe((res: any) => {
        let user_data = res.data;
        this.exitForm.patchValue({
          employeeCode: user_data?.employee_code,
          employeeName: user_data?.first_name + ' ' + user_data?.last_name,
          department: user_data?.department_name,
          designation: user_data?.designation_name,
          dateOfJoining: user_data?.emp_join_date,
        });
      });
  }

  formatDate(d: string): string {
    const [day, month, year] = d.split('-');
    return `${year}-${month}-${day}`;
  }

  getIdResignation(id: any): void {
    this.recruitService.getIdResignation(id).subscribe((res: any) => {
      let val = res.data;
      let rawDate = val?.[0].last_working_day;
      const convertedDate = this.formatDate(rawDate);
      this.exitForm.patchValue({
        lastWorkingDay: convertedDate,
      });
    });
  }

  getExitFormById(exit_form_id: any): void {
    this.exitFormService.getExitFormById(exit_form_id).subscribe(
      (res: any) => {
        const val = res.data && res.data.length ? res.data[0] : null;

        if (!val) {
          console.warn('No exit form found.');
          return;
        }

        this.exitForm.patchValue({
          primaryReason: val.primaryReason,
          decisionTrigger: val.decisionTrigger,
          preventReason: val.preventReason,
          jobMatch: val.jobMatch,
          workEnvironment: val.workEnvironment,
          challenges: val.challenges,
          managerRelation: val.managerRelation,
          managerSupport: val.managerSupport,
          teamCommunication: val.teamCommunication,
          compensationSatisfaction: val.compensationSatisfaction,
          growthFeedback: val.growthFeedback,
          recommendation: val.recommendation,
          suggestions: val.suggestions,
          approver_remarks: val.approver_remarks,
          rehire_eligibility: val.rehire_eligibility,
        });

        console.log('Exit form patched:', this.exitForm.value);
      },
      (err: any) => {
        console.error('Failed to fetch exit form:', err);
      }
    );
  }

  approve() {
    if (this.exitForm.invalid) {
      this.exitForm.markAllAsTouched();
      return;
    }

    const payload = {
      approval_status: 'APPROVED',
      exit_form_id: this.exit_form_id,
      approver_id: this.employee_id,
      approver_remarks: this.exitForm.get('approver_remarks')?.value,
      rehire_eligibility: this.exitForm.get('rehire_eligibility')
        ?.value,
    };

    this.exitFormService.approveRejExitFormStatus(payload).subscribe(
      (res) => {
        this.toast.success('Exit form approved successfully!');
        this.route.navigate(['/master/ess/exit-form/approval-list']);
      },
      (err) => {
        this.toast.error('Something went wrong!');
      }
    );
  }

  reject() {
    if (this.exitForm.invalid) {
      this.exitForm.markAllAsTouched();
      return;
    }
    const payload = {
      approval_status: 'REJECTED',
      exit_form_id: this.exit_form_id,
      approver_id: this.employee_id,
      approver_remarks: this.exitForm.get('approver_remarks')?.value,
      rehire_eligibility: this.exitForm.get('rehire_eligibility')
        ?.value,
    };

    this.exitFormService.approveRejExitFormStatus(payload).subscribe(
      (res) => {
        this.toast.success('Exit form rejected sucessfully!');
        this.route.navigate(['/master/ess/exit-form/approval-list']);
      },
      (err) => {
        this.toast.error('Something went wrong!');
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
