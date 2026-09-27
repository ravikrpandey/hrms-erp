import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ButtonComponent } from "../../../../../@shared/button/button.component";
import { ActivatedRoute, Router } from '@angular/router';
import { WebinarSessionService } from '../../webinar-session.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputfieldComponent } from "../../../../../@shared/inputfield/inputfield.component";
import { PageheadingComponent } from "../../../../../@shared/pageheading/pageheading.component";
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { SelfAssessmentSurveyService } from 'src/app/@modules/self-assesment-survey/self-assessment-survey.service';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ButtonComponent,
    InputfieldComponent,
    PageheadingComponent
  ],
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent {

  sessionForm!: FormGroup;
  instructors: any[] = [];
  employees: any[] = [];
  mode: 'create' | 'edit' | 'view' = 'create';
  sessionId: string | null = null;
  jobRoles: any[] = [];
  departmentdata: any[] = [];
  entity_id: any;
  loginUser: any;
  empMainId: any;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmpRegistrationService,
    private webinarService: WebinarSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private selfassessment: SelfAssessmentSurveyService,
    private toast: ToastrService
  ) {
    this.sessionForm = this.fb.group({
      meetingUrl: ['']
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);

      this.empMainId = localStorage.getItem('EmpMainId');
    this.initForm();
    this.getEmployeeList();
    this.getRoleList();
    this.getdepatmentList();
    this.getInstructorList();

    this.sessionId = this.route.snapshot.paramMap.get('id');
    if (this.sessionId) {
      if (this.router.url.includes('edit')) {
        this.mode = 'edit';
      } else if (this.router.url.includes('view')) {
        this.mode = 'view';
      }
      this.loadSession(this.sessionId);
    }
  }

  initForm() {
    this.sessionForm = this.fb.group({
      session_title: ['', Validators.required],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      platform: ['', Validators.required],
      description: ['', Validators.required],
      instructor: ['', Validators.required],
      jobRole: [''],
      employee: [[], Validators.required],
      meetingUrl: ['',],
      meetingId: [''],
      recordSession: [false],
      recurring: [false],
      externalParticipant: [false],
      externalParticipants: this.fb.array([])
    });
  }


  getEmployeeList() {
    this.employeeService.getemployeeListData(this.entity_id).subscribe({
      next: (res: any) => {
        const employees = Array.isArray(res) ? res : res?.data || [];
        this.employees = employees.map((emp: any) => ({
          employee_id: emp.employee_id,
          full_name: `${(emp.first_name || '').trim()} ${(emp.last_name || '').trim()}`
        }));
        console.log('Employee list:', this.employees);
      },
      error: (err) => console.error('Error fetching employee list:', err)
    });
  }




  getInstructorList() {
    this.employeeService.getemployeeListData(this.entity_id).subscribe((res: any) => {
      const instructors = Array.isArray(res) ? res : res?.data || [];
      this.instructors = instructors.map((emp: any) => ({
        login_id: emp.employee_id,
        login_username: `${emp.first_name} ${emp.last_name}`.trim()
      }));
    });
  }



  onInstructorChange(event: any) {
    this.sessionForm.get('instructor')?.setValue(event.value);
  }


  loadSession(id: string) {
  this.webinarService.getSessionById(id).subscribe((res: any) => {
    const data = res.data;
    if (data) {
      // ✅ Convert string to array safely
      let employeeArray: any[] = [];
      let instructorValue: any = null;

      try {
        employeeArray = JSON.parse(data.employee || '[]');
      } catch {
        employeeArray = [];
      }

      try {
        // if it's a number in string form
        instructorValue = isNaN(Number(data.instructor))
          ? data.instructor
          : Number(data.instructor);
      } catch {
        instructorValue = data.instructor;
      }

      // 🧩 Patch form
      this.sessionForm.patchValue({
        session_title: data.session_title,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        platform: data?.platform,
        description: data.description,
        instructor: instructorValue,
        jobRole: data.jobRole,
        employee: employeeArray,
        meetingUrl: data.meetingUrl,
        meetingId: data.meetingId,
        recordSession: data.recordSession,
        recurring: data.recurring,
        externalParticipant: data.externalParticipant || false
      });

      // 🧩 Patch external participants if any
      let participants = [];
      try {
        participants = JSON.parse(data.externalParticipants || '[]');
      } catch {
        participants = [];
      }

      if (participants.length) {
        participants.forEach((p: any) => {
          this.externalParticipants.push(this.fb.group({
            name: [p.name],
            email: [p.email]
          }));
        });
      }

      // if (this.mode === 'view') {
      //   this.sessionForm.disable();
      // }
    }
  });
}


  createParticipant(): FormGroup {
    return this.fb.group({
      name: ['',],
      email: ['',]
    });
  }

  get externalParticipants(): FormArray {
    return this.sessionForm.get('externalParticipants') as FormArray;
  }

  addParticipant() {
    this.externalParticipants.push(this.createParticipant());
  }

  removeParticipant(i: number) {
    this.externalParticipants.removeAt(i);
  }

  onSubmit() {
  console.log('🔹 Submit button clicked'); // 👈 check 1

  if (this.sessionForm.invalid) {
    console.warn('⚠️ Form invalid:', this.sessionForm.value); // 👈 check 2
    this.sessionForm.markAllAsTouched();
    return;
  }

  console.log('✅ Form valid, preparing payload...'); // 👈 check 3

  const selectedUsernames: string[] = this.sessionForm.value.employee || [];
  const employeeIds = this.instructors
    .filter(emp => selectedUsernames.includes(emp.login_username))
    .map(emp => emp.login_id);

  const payload = {
    entity_id: this.entity_id,
    ...this.sessionForm.value,
    created_by: this.empMainId
  };

  console.log('📦 Final payload:', payload); // 👈 check 4

  if (this.mode === 'edit' && this.sessionId) {
    console.log('✏️ Updating existing session:', this.sessionId);
    this.webinarService.updateSession(this.sessionId, payload).subscribe({
      next: () => {
        console.log('✅ Update successful');
        this.router.navigate(['/master/hrms/webnar-session']);
      },
      error: (err) => console.error('❌ Update failed:', err)
    });
  } else {
    console.log('🆕 Creating new session...');
    this.webinarService.createSession(payload).subscribe({
      next: () => {
        console.log('✅ Create successful');
        this.router.navigate(['/master/hrms/webnar-session']);
      },
      error: (err) => console.error('❌ Create failed:', err)
    });
  }
}


  getRoleList(): void {
    this.selfassessment.getRoleList(this.loginUser.role).subscribe((res: { data: any[] }) => {
      console.log('Role API Response:', res.data);
      this.jobRoles = res.data
        .filter((r: any) => r.status === 'ACTIVE')
        .map((r: any) => ({
          id: r.role_master_id,
          roleType: r.role_master_name
        }));
    });
  }




  getdepatmentList(): void {
    this.selfassessment.getdepartmentList(this.entity_id).subscribe((res: { data: any[]; }) => {
      this.departmentdata = res.data.filter((d: any) => d.IsActive);
    });
  }

  cancel() {
    this.router.navigate(['/webnar-session']);
  }

generateMeetLink() {
  this.webinarService.generateMeetLink().subscribe({
    next: (meeting) => {
      console.log('📡 Google Meet API returned:', meeting);

      if (meeting?.join_url) {
        this.sessionForm.patchValue({
          meetingUrl: meeting.join_url,
          meetingId: meeting.meeting_id,
          platform: 'Google Meet',
        });

        console.log('✅ Form after patch:', this.sessionForm.value);
        this.toast.success('Google Meet link generated successfully!');
      } else {
        this.toast.warning('No Google Meet link generated, please try again.');
      }
    },
    error: (err) => {
      console.error('❌ Google Meet generation error:', err);
      this.toast.error('Failed to generate Google Meet link');
    },
  });
}




  
  generateZoomLink() {
    const sessionTitle = this.sessionForm.get('session_title')?.value || 'My Zoom Meeting';
    const date = this.sessionForm.get('date')?.value;
    const startTime = this.sessionForm.get('start_time')?.value;

    const payload = {
      entity_id:this.entity_id,
      topic: sessionTitle,
      startTime: date && startTime ? `${date}T${startTime}:00` : new Date().toISOString(),
      timezone: 'Asia/Kolkata',
    };

    this.webinarService.generateZoomMeeting(payload).subscribe({
      next: (meeting: any) => {
        if (meeting?.join_url && meeting?.id) {
          this.sessionForm.patchValue({
            meetingUrl: meeting.join_url,
            meetingId: meeting.id,
            meetingPassword: meeting.password, // <-- patch Zoom password too
          });

          this.toast.success("Zoom link generated successfully!");
        } else {
          this.toast.warning("Meeting details not found in response");
        }
      },
      error: (err) => {
        console.error('Zoom meeting generation error:', err);
        this.toast.error('Failed to generate Zoom meeting');
      }
    });
  }

}
