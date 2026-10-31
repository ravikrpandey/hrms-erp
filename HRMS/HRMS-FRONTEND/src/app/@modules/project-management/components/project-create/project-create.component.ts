import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode: boolean = false;
  projectId: any = null;
  loading: boolean = false;
  submitting: boolean = false;
  activeTab: string = 'details';

  departments: any[] = [];
  filteredDepartments: any[] = [];
  employees: any[] = [];
  filteredManagers: any[] = [];
  filteredSupervisors: any[] = [];
  filteredMemberOptions: any[] = [];
  billingMethods: string[] = ['Fixed Cost', 'Hourly', 'Staff Rate', 'Non-Billable', 'Other'];
  projectTypes: string[] = ['Client Project', 'Internal', 'Retainer', 'Support & Maintenance', 'Other'];
  priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];
  statuses: string[] = ['Active', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  selectedMembers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pmService: ProjectManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode = true;
    } else {
      const userStr = localStorage.getItem('signInUser');
      const detailsStr = localStorage.getItem('loginUserDetails');
      let user: any = {};
      if (detailsStr) {
        try { user = { ...user, ...JSON.parse(detailsStr) }; } catch (e) {}
      }
      if (userStr) {
        try { user = { ...user, ...JSON.parse(userStr) }; } catch (e) {}
      }
      const rId = Number(user.role_master_id || user.role_id || localStorage.getItem('role_master_id'));
      const rName = (user.role_name || user.role_master_name || user.roles || user.role || localStorage.getItem('role') || '').toString().toLowerCase();
      const canCreate = rId === 1 || rName.includes('admin') || rName.includes('super') || rName.includes('project head') || rName.includes('head');
      if (!canCreate) {
        this.toast.error('Project creation is only allowed to Super Admin or Project Head');
        this.router.navigate(['/master/project-management/projects']);
        return;
      }
    }
    this.initForm();
    this.loadDropdownData();

    if (this.isEditMode) {
      this.loadProjectDetails(this.projectId);
    } else {
      this.loadDefaultProjectCode();
    }
  }

  loadDefaultProjectCode(): void {
    this.pmService.getNextProjectCode().subscribe({
      next: (res: any) => {
        if (res.success && res.data && res.data.project_code) {
          this.projectForm.patchValue({ project_code: res.data.project_code });
        }
      },
      error: () => {
        const fallback = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
        this.projectForm.patchValue({ project_code: fallback });
      }
    });
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      project_name: ['', [Validators.required]],
      project_code: [''],
      client_name: [''],
      department_id: [null, [Validators.required]],
      department_name: [''],
      project_manager_id: [null, [Validators.required]],
      project_manager_name: [''],
      project_manager_email: [''],
      supervisor_id: [null],
      supervisor_name: [''],
      supervisor_email: [''],
      project_type: ['Client Project'],
      custom_project_type: [''],
      billing_method: ['Fixed Cost'],
      custom_billing_method: [''],
      budget: [0, [Validators.min(0)]],
      priority: ['Medium'],
      status: ['Active'],
      start_date: [null],
      end_date: [null],
      initial_progress: [0, [Validators.min(0), Validators.max(100)]],
      description: [''],
      members: [[]]
    });
  }

  loadDropdownData(): void {
    this.pmService.getDepartments().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const seen = new Set<string>();
          const list: any[] = [];
          for (const d of res.data) {
            const name = (d.department_name || '').trim();
            const key = name.toLowerCase();
            if (name && !seen.has(key)) {
              seen.add(key);
              list.push({ dept_id: d.dept_id, department_name: name });
            }
          }
          this.departments = list.sort((a, b) => a.department_name.localeCompare(b.department_name));
          this.filteredDepartments = [...this.departments];

          const currentDeptId = this.projectForm.get('department_id')?.value;
          const currentDeptName = this.projectForm.get('department_name')?.value;
          if (currentDeptName && !this.departments.some(d => d.dept_id == currentDeptId)) {
            const matched = this.departments.find(d => d.department_name.toLowerCase() === currentDeptName.toLowerCase());
            if (matched) {
              this.projectForm.patchValue({ department_id: matched.dept_id });
            }
          }
        }
      },
      error: (err) => console.error('Error fetching departments:', err)
    });

    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.employees = res.data.map((e: any) => {
            const rawName = e.name || e.fullName || e.employee_name || `${e.first_name || ''} ${e.last_name || ''}`.trim();
            const displayName = rawName && rawName !== 'Employee' ? rawName : (e.employee_code ? `Employee (${e.employee_code})` : `Emp #${e.employee_id}`);
            const desig = e.designation || e.role_name || e.role_master_name || e.department || '';
            const empCode = e.employee_code || '';
            return {
              employee_id: e.employee_id,
              employee_code: empCode,
              name: displayName,
              email: e.email || e.official_email || e.employee_official_email || '',
              department: e.department || '',
              designation: desig,
              displayText: empCode ? `[${empCode}] ${displayName}${desig ? ' (' + desig + ')' : ''}` : `${displayName}${desig ? ' (' + desig + ')' : ''}`
            };
          });
          this.filteredManagers = [...this.employees];
          this.filteredSupervisors = [...this.employees];
          this.filteredMemberOptions = [...this.employees];

          const currentMgrId = this.projectForm.get('project_manager_id')?.value;
          if (currentMgrId) {
            const mgr = this.employees.find(e => e.employee_id == currentMgrId);
            if (mgr) {
              this.projectForm.patchValue({
                project_manager_name: mgr.name,
                project_manager_email: mgr.email || ''
              });
            }
          }

          const currentSupId = this.projectForm.get('supervisor_id')?.value;
          if (currentSupId) {
            const sup = this.employees.find(e => e.employee_id == currentSupId);
            if (sup) {
              this.projectForm.patchValue({
                supervisor_name: sup.name,
                supervisor_email: sup.email || ''
              });
            }
          }
        }
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  loadProjectDetails(id: any): void {
    this.loading = true;
    this.pmService.getProjectById(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          const p = res.data;

          let deptId = p.department_id;
          if (this.departments.length > 0) {
            const hasId = this.departments.some(d => d.dept_id == deptId);
            if (!hasId && p.department_name) {
              const matched = this.departments.find(d => d.department_name.toLowerCase() === p.department_name.toLowerCase());
              if (matched) deptId = matched.dept_id;
            }
          }

          let mgrName = p.project_manager_name;
          if (p.project_manager_id && this.employees.length > 0) {
            const mgr = this.employees.find(e => e.employee_id == p.project_manager_id);
            if (mgr) mgrName = mgr.name;
          }

          let supName = p.supervisor_name;
          if (p.supervisor_id && this.employees.length > 0) {
            const sup = this.employees.find(e => e.employee_id == p.supervisor_id);
            if (sup) supName = sup.name;
          }

          let bMethod = p.billing_method || 'Fixed Cost';
          let customBMethod = '';
          if (!['Fixed Cost', 'Hourly', 'Staff Rate', 'Non-Billable'].includes(bMethod)) {
            customBMethod = bMethod;
            bMethod = 'Other';
          }

          let pType = p.project_type || 'Client Project';
          let customPType = '';
          if (!['Client Project', 'Internal', 'Retainer', 'Support & Maintenance'].includes(pType)) {
            customPType = pType;
            pType = 'Other';
          }

          this.projectForm.patchValue({
            project_name: p.project_name,
            project_code: p.project_code || '',
            client_name: p.client_name || '',
            department_id: deptId,
            department_name: p.department_name,
            project_manager_id: p.project_manager_id,
            project_manager_name: mgrName,
            project_manager_email: p.project_manager_email,
            supervisor_id: p.supervisor_id,
            supervisor_name: supName,
            supervisor_email: p.supervisor_email,
            project_type: pType,
            custom_project_type: customPType,
            billing_method: bMethod,
            custom_billing_method: customBMethod,
            budget: p.budget || 0,
            priority: p.priority || 'Medium',
            status: p.status || 'Active',
            start_date: p.start_date,
            end_date: p.end_date,
            initial_progress: p.initial_progress || p.progress || 0,
            description: p.description || '',
          });

          if (p.members && Array.isArray(p.members)) {
            const memberIds = p.members.map((m: any) => m.employee_id);
            this.projectForm.patchValue({ members: memberIds });
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading project:', err);
        this.toast.error('Failed to load project details');
      }
    });
  }

  onDepartmentChange(deptId: any): void {
    const selected = this.departments.find(d => d.dept_id == deptId);
    if (selected) {
      this.projectForm.patchValue({ department_name: selected.department_name });
    }
  }

  onManagerChange(empId: any): void {
    const selected = this.employees.find(m => m.employee_id == empId);
    if (selected) {
      this.projectForm.patchValue({
        project_manager_name: selected.name,
        project_manager_email: selected.email
      });
    }
  }

  onSupervisorChange(empId: any): void {
    const selected = this.employees.find(m => m.employee_id == empId);
    if (selected) {
      this.projectForm.patchValue({
        supervisor_name: selected.name,
        supervisor_email: selected.email
      });
    } else {
      this.projectForm.patchValue({
        supervisor_name: '',
        supervisor_email: ''
      });
    }
  }

  isDateRangeInvalid(): boolean {
    const start = this.projectForm?.get('start_date')?.value;
    const end = this.projectForm?.get('end_date')?.value;
    if (start && end) {
      return new Date(end).getTime() < new Date(start).getTime();
    }
    return false;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      if (
        this.projectForm.get('project_name')?.invalid ||
        this.projectForm.get('department_id')?.invalid ||
        this.projectForm.get('project_manager_id')?.invalid
      ) {
        this.activeTab = 'details';
      }
      this.toast.warning('Please fill in all required fields');
      return;
    }

    if (this.isDateRangeInvalid()) {
      this.toast.error('Project end date cannot be earlier than start date');
      return;
    }

    this.submitting = true;
    const formVal = this.projectForm.value;

    let billingMethod = formVal.billing_method || 'Fixed Cost';
    if (billingMethod === 'Other' && formVal.custom_billing_method?.trim()) {
      billingMethod = formVal.custom_billing_method.trim();
    }

    let projectType = formVal.project_type || 'Client Project';
    if (projectType === 'Other' && formVal.custom_project_type?.trim()) {
      projectType = formVal.custom_project_type.trim();
    }

    const payload: any = {
      ...formVal,
      billing_method: billingMethod,
      project_type: projectType,
      progress: formVal.initial_progress || 0
    };
    delete payload.custom_billing_method;
    delete payload.custom_project_type;

    if (payload.start_date) {
      const d = new Date(payload.start_date);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        payload.start_date = `${year}-${month}-${day}`;
      }
    }
    if (payload.end_date) {
      const d = new Date(payload.end_date);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        payload.end_date = `${year}-${month}-${day}`;
      }
    }

    if (Array.isArray(payload.members) && payload.members.length > 0) {
      payload.members = payload.members.map((empId: any) => {
        const emp = this.employees.find(e => e.employee_id == empId);
        return {
          employee_id: empId,
          employee_name: emp ? emp.name : '',
          employee_email: emp ? emp.email : '',
          role: 'Member'
        };
      });
    }

    if (this.isEditMode) {
      this.pmService.updateProject(this.projectId, payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Project updated successfully');
          this.router.navigate(['/master/project-management/projects', this.projectId]);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error updating project:', err);
          this.toast.error(err.error?.message || 'Failed to update project');
        }
      });
    } else {
      this.pmService.createProject(payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Project created successfully');
          const createdId = res.data?.project_id;
          if (createdId) {
            this.router.navigate(['/master/project-management/projects', createdId]);
          } else {
            this.router.navigate(['/master/project-management/projects']);
          }
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error creating project:', err);
          this.toast.error(err.error?.message || 'Failed to create project');
        }
      });
    }
  }

  getSelectedMembers(): any[] {
    const memberIds = this.projectForm?.get('members')?.value || [];
    if (!Array.isArray(memberIds) || memberIds.length === 0) return [];
    return this.employees.filter(e => memberIds.includes(e.employee_id));
  }

  removeMember(empId: any): void {
    const current = this.projectForm?.get('members')?.value || [];
    const updated = current.filter((id: any) => id != empId);
    this.projectForm.patchValue({ members: updated });
  }

  selectAllMembers(): void {
    const allIds = this.employees.map(e => e.employee_id);
    this.projectForm.patchValue({ members: allIds });
  }

  clearAllMembers(): void {
    this.projectForm.patchValue({ members: [] });
  }

  onStatusToggle(event: any): void {
    const isChecked = event.target.checked;
    this.projectForm.patchValue({
      status: isChecked ? 'Active' : 'Cancelled'
    });
  }

  cancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/master/project-management/projects', this.projectId]);
    } else {
      this.router.navigate(['/master/project-management/projects']);
    }
  }
}
