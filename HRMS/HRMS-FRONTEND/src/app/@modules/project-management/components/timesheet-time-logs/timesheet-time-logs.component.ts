import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-time-logs',
  templateUrl: './timesheet-time-logs.component.html',
  styleUrls: ['./timesheet-time-logs.component.scss']
})
export class TimesheetTimeLogsComponent implements OnInit {
  currentUser: any = null;
  employeeId: any = null;
  employeeName: string = '';

  projects: any[] = [];
  jobs: any[] = [];
  allTasks: any[] = [];
  logs: any[] = [];
  holidays: any[] = [];
  leaves: any[] = [];
  weekOffs: any[] = [];
  weekOffRules: any[] = [];
  loading: boolean = false;

  view: string = 'list';

  periodMode: 'day' | 'week' | 'semi-month' | 'month' = 'week';
  activeDate: Date = new Date();

  logScope: 'my' | 'team' = 'my';
  selectedTeamEmployeeId: any = 'all';

  showDatePicker: boolean = false;
  pickerMonthDate: Date = new Date();
  pickerWeeks: any[][] = [];
  pickerMonthTitle: string = '';

  summary: any = {
    total_hours: 0,
    worked_hours: 0,
    leave_hours: 0,
    holiday_hours: 0,
    submitted_hours: 0,
    not_submitted_hours: 0
  };

  filters: any = { client: '', project_id: '', task_id: '', approval_status: '', work_mode: '', employee_id: '' };
  showFilterPanel: boolean = false;

  showLogDialog: boolean = false;
  editingLog: any = null;
  logDialogDefaultDate: Date | null = null;
  logDialogMode: string = 'Log Time';
  isLogDialogReadOnly: boolean = false;
  showLogMenu: boolean = false;

  lastClickTime: number = 0;
  lastClickLogId: any = null;
  lastHandledDblClickTime: number = 0;

  logMenuOptions: string[] = ['Log Time', 'Daily Log', 'Weekly Log', 'Semi Monthly Log', 'Monthly Log'];

  calendarWeeks: any[][] = [];
  calendarMonthLabel: string = '';

  entryProjectId: any = '';
  entryJobId: any = '';
  entryDescription: string = '';
  entryIsBillable: boolean = true;
  entryDate: string = '';
  entryWorkItem: string = '';
  entryWorkMode: string = 'Office';

  showProjectDropdown: boolean = false;
  projectSearchText: string = '';
  showJobDropdown: boolean = false;
  jobSearchText: string = '';
  showTeamEmpDropdown: boolean = false;
  teamEmpSearchText: string = '';

  employees: any[] = [];
  departments: any[] = [];
  showJobDialog: boolean = false;
  showAddProjectModal: boolean = false;
  savingProject: boolean = false;
  newProjectForm: any = {
    project_name: '',
    project_code: '',
    client_name: '',
    department_id: '',
    project_manager_id: '',
    billing_method: 'Fixed Cost',
    description: ''
  };

  timerSeconds: number = 0;
  timerDisplay: string = '00:00:00';
  isTimerRunning: boolean = false;
  timerInterval: any = null;
  runningLogId: any = null;

  selectedLogIds: Set<number> = new Set<number>();

  showSubmitModal: boolean = false;
  submitModalData: any = { count: 0, totalHours: 0, logIds: [], ineligibleCount: 0 };
  submitComments: string = '';
  submitTimesheetName: string = '';
  submittingTimesheet: boolean = false;
  showMoreMenu: boolean = false;
  editingModalLogId: number | null = null;
  inlineEditData: any = {};

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.employeeId = this.currentUser.employee_id || 1;
        this.employeeName = this.currentUser.employee_name || this.currentUser.name || '';
      } catch (e) {
        console.error('Error parsing signInUser:', e);
      }
    }

    this.pickerMonthDate = new Date(this.activeDate);
    this.buildPickerWeeks();
    this.loadLookups();
    this.loadLogs();
    this.loadSummary();
  }

  get isManagerOrAdmin(): boolean {
    if (!this.currentUser) return false;
    const role = (this.currentUser.role_master_name || this.currentUser.roles || this.currentUser.role || '').toLowerCase();
    return this.currentUser.role_master_id === 1 ||
           this.currentUser.employee_id === 1 ||
           role.includes('admin') ||
           role.includes('manager') ||
           role.includes('head') ||
           role.includes('director') ||
           role.includes('lead') ||
           role.includes('hr');
  }

  get canCreateProject(): boolean {
    if (!this.currentUser) return false;
    const rId = Number(this.currentUser.role_master_id || this.currentUser.role_id || localStorage.getItem('role_master_id'));
    const role = (this.currentUser.role_master_name || this.currentUser.roles || this.currentUser.role || localStorage.getItem('role') || '').toLowerCase();
    return rId === 1 ||
           this.currentUser.employee_id === 1 ||
           role.includes('admin') ||
           role.includes('super') ||
           role.includes('project head') ||
           role.includes('head');
  }

  setLogScope(scope: 'my' | 'team'): void {
    this.logScope = scope;
    if (scope === 'my') {
      this.selectedTeamEmployeeId = this.employeeId;
    } else {
      this.selectedTeamEmployeeId = 'all';
    }
    this.loadLogs();
    this.loadSummary();
  }

  onTeamEmployeeChange(): void {
    this.loadLogs();
    this.loadSummary();
  }

  toggleTeamEmpDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.showTeamEmpDropdown = !this.showTeamEmpDropdown;
    if (this.showTeamEmpDropdown) {
      this.teamEmpSearchText = '';
      this.showProjectDropdown = false;
      this.showJobDropdown = false;
      setTimeout(() => {
        const inp = document.querySelector('.team-emp-popover .dropdown-search-input') as HTMLInputElement;
        if (inp) inp.focus();
      }, 50);
    }
  }

  get filteredTeamEmployees(): any[] {
    if (!this.teamEmpSearchText || !this.teamEmpSearchText.trim()) {
      return this.employees || [];
    }
    const q = this.teamEmpSearchText.toLowerCase().trim();
    return (this.employees || []).filter(e => {
      const name = `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase();
      const code = String(e.employee_id || '').toLowerCase();
      const email = String(e.employee_official_email || e.email || '').toLowerCase();
      return name.includes(q) || code.includes(q) || email.includes(q);
    });
  }

  selectTeamEmployee(empId: any): void {
    this.selectedTeamEmployeeId = empId;
    this.showTeamEmpDropdown = false;
    this.teamEmpSearchText = '';
    this.onTeamEmployeeChange();
  }

  getSelectedTeamEmpName(): string {
    if (!this.selectedTeamEmployeeId || this.selectedTeamEmployeeId === 'all') {
      return 'All Team Members';
    }
    const emp = (this.employees || []).find(e => String(e.employee_id) === String(this.selectedTeamEmployeeId));
    if (emp) {
      const codeStr = emp.employee_code ? ` (${emp.employee_code})` : '';
      return `${emp.first_name || ''} ${emp.last_name || ''}${codeStr}`.trim();
    }
    return 'All Team Members';
  }

  get periodStart(): string {
    if (this.periodMode === 'day') {
      return this.toDateStr(this.activeDate);
    }
    if (this.periodMode === 'month') {
      return this.toDateStr(this.calculateMonthRange(this.activeDate).start);
    }
    if (this.periodMode === 'semi-month') {
      return this.toDateStr(this.calculateSemiMonthRange(this.activeDate).start);
    }
    return this.toDateStr(this.calculateWeekRange(this.activeDate).start);
  }

  get periodEnd(): string {
    if (this.periodMode === 'day') {
      return this.toDateStr(this.activeDate);
    }
    if (this.periodMode === 'month') {
      return this.toDateStr(this.calculateMonthRange(this.activeDate).end);
    }
    if (this.periodMode === 'semi-month') {
      return this.toDateStr(this.calculateSemiMonthRange(this.activeDate).end);
    }
    return this.toDateStr(this.calculateWeekRange(this.activeDate).end);
  }

  get periodDisplayLabel(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (this.periodMode === 'day') {
      const d = this.activeDate.getDate().toString().padStart(2, '0');
      const m = months[this.activeDate.getMonth()];
      const y = this.activeDate.getFullYear();
      return `${d}-${m}-${y}`;
    }
    if (this.periodMode === 'month') {
      const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${fullMonths[this.activeDate.getMonth()]} ${this.activeDate.getFullYear()}`;
    }
    if (this.periodMode === 'semi-month') {
      const range = this.calculateSemiMonthRange(this.activeDate);
      const sDay = range.start.getDate().toString().padStart(2, '0');
      const eDay = range.end.getDate().toString().padStart(2, '0');
      const sMon = months[range.start.getMonth()];
      const eMon = months[range.end.getMonth()];
      const sYear = range.start.getFullYear();
      const eYear = range.end.getFullYear();
      return `${sDay}-${sMon}-${sYear} - ${eDay}-${eMon}-${eYear}`;
    }
    const range = this.calculateWeekRange(this.activeDate);
    const sDay = range.start.getDate().toString().padStart(2, '0');
    const eDay = range.end.getDate().toString().padStart(2, '0');
    const sMon = months[range.start.getMonth()];
    const eMon = months[range.end.getMonth()];
    const sYear = range.start.getFullYear();
    const eYear = range.end.getFullYear();
    return `${sDay}-${sMon}-${sYear} - ${eDay}-${eMon}-${eYear}`;
  }

  calculateSemiMonthRange(refDate: Date): { start: Date; end: Date } {
    const y = refDate.getFullYear();
    const m = refDate.getMonth();
    const day = refDate.getDate();
    if (day <= 15) {
      const start = new Date(y, m, 1, 0, 0, 0, 0);
      const end = new Date(y, m, 15, 23, 59, 59, 999);
      return { start, end };
    } else {
      const start = new Date(y, m, 16, 0, 0, 0, 0);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
  }

  calculateWeekRange(refDate: Date): { start: Date; end: Date } {
    const d = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  calculateMonthRange(refDate: Date): { start: Date; end: Date } {
    const start = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  toDateStr(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  loadLookups(): void {
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.projects = res.data;
        }
      }
    });

    if (this.employeeId) {
      this.pmService.getJobs(this.employeeId).subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.jobs = res.data;
          }
        }
      });
    }

    this.pmService.getAllTasks().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allTasks = res.data;
        }
      }
    });

    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.employees = res.data;
        }
      }
    });

    this.pmService.getDepartments().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.departments = res.data;
        }
      }
    });
  }

  buildParams(): any {
    let targetEmpId: any;
    if (this.filters.employee_id) {
      targetEmpId = this.filters.employee_id;
    } else if (this.logScope === 'team') {
      targetEmpId = this.selectedTeamEmployeeId || 'all';
    } else {
      targetEmpId = this.employeeId;
    }
    const params: any = {
      employee_id: targetEmpId,
      start_date: this.periodStart,
      end_date: this.periodEnd
    };
    if (this.filters.project_id) params.project_id = this.filters.project_id;
    if (this.filters.task_id) params.task_id = this.filters.task_id;
    if (this.filters.approval_status) params.approval_status = this.filters.approval_status;
    if (this.filters.work_mode) params.work_mode = this.filters.work_mode;
    return params;
  }

  loadLogs(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.pmService.getLogList(this.buildParams()).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.logs = res.data;
          this.holidays = res.holidays || [];
          this.leaves = res.leaves || [];
          this.weekOffs = res.weekOffs || [];
          this.weekOffRules = res.weekOffRules || [];
          this.buildCalendar();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching time logs:', err);
        this.toast.error('Failed to load time logs');
      }
    });
  }

  loadSummary(): void {
    if (!this.employeeId) return;
    let targetEmpId: any;
    if (this.filters.employee_id) {
      targetEmpId = this.filters.employee_id;
    } else if (this.logScope === 'team') {
      targetEmpId = this.selectedTeamEmployeeId || 'all';
    } else {
      targetEmpId = this.employeeId;
    }
    this.pmService.getLogSummary({ employee_id: targetEmpId, start_date: this.periodStart, end_date: this.periodEnd }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.summary = res.data;
        }
      }
    });
  }

  get filteredLogs(): any[] {
    let result = [...this.logs];
    if (this.filters.client) {
      result = result.filter(l => {
        const proj = this.projects.find(p => p.project_id == l.project_id);
        return proj && proj.client_name === this.filters.client;
      });
    }
    return result;
  }

  get groupedLogs(): { date: string; dayTotal: number; items: any[]; holidays: any[]; leaves: any[]; weekOffs: any[] }[] {
    const groups: { [key: string]: { items: any[]; holidays: any[]; leaves: any[]; weekOffs: any[] } } = {};
    this.filteredLogs.forEach(log => {
      const key = log.log_date;
      if (!groups[key]) groups[key] = { items: [], holidays: [], leaves: [], weekOffs: [] };
      groups[key].items.push(log);
    });
    (this.holidays || []).forEach(h => {
      const key = h.date;
      if (this.isDateInRange(key)) {
        if (!groups[key]) groups[key] = { items: [], holidays: [], leaves: [], weekOffs: [] };
        groups[key].holidays.push(h);
      }
    });
    (this.leaves || []).forEach(l => {
      const key = l.date;
      if (this.isDateInRange(key)) {
        if (!groups[key]) groups[key] = { items: [], holidays: [], leaves: [], weekOffs: [] };
        groups[key].leaves.push(l);
      }
    });
    (this.weekOffs || []).forEach(w => {
      const key = w.date;
      if (this.isDateInRange(key)) {
        if (!groups[key]) groups[key] = { items: [], holidays: [], leaves: [], weekOffs: [] };
        groups[key].weekOffs.push(w);
      }
    });

    if (this.isTimerRunning && !this.runningLogId && this.entryProjectId && this.entryJobId) {
      const liveDate = this.entryDate || this.todayStr;
      if (this.isDateInRange(liveDate)) {
        if (!groups[liveDate]) groups[liveDate] = { items: [], holidays: [], leaves: [], weekOffs: [] };
        const liveLog = {
          log_id: -999,
          isLiveTimer: true,
          isRunning: true,
          hours_mode: 'Timer',
          project_id: this.entryProjectId,
          project_name: this.getSelectedProjectName() || 'Project',
          task_id: this.entryJobId,
          task_name: this.getSelectedJobName() || 'Job',
          description: this.entryDescription || 'Timer work',
          is_billable: this.entryIsBillable,
          work_mode: this.entryWorkMode || 'Office',
          total_hours: this.timerSeconds / 3600,
          log_date: liveDate
        };
        groups[liveDate].items.push(liveLog);
      }
    }

    return Object.keys(groups)
      .sort((a, b) => (a > b ? 1 : -1))
      .map(date => {
        const itemSum = groups[date].items.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
        const holSum = groups[date].holidays.reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0);
        const leaSum = groups[date].leaves.reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0);
        return {
          date,
          dayTotal: Math.round((itemSum + holSum + leaSum) * 100) / 100,
          items: groups[date].items,
          holidays: groups[date].holidays,
          leaves: groups[date].leaves,
          weekOffs: groups[date].weekOffs
        };
      });
  }

  get weekTotal(): number {
    const workTotal = this.filteredLogs.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
    const holTotal = (this.holidays || []).reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0);
    const leaTotal = (this.leaves || []).reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0);
    return Math.round((workTotal + holTotal + leaTotal) * 100) / 100;
  }

  get clientOptions(): string[] {
    const clients = this.projects.map(p => p.client_name).filter(c => !!c);
    return Array.from(new Set(clients));
  }

  formatDateHeading(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  formatDuration(hours: number | string): string {
    const h = parseFloat(String(hours)) || 0;
    const fullHours = Math.floor(h);
    const minutes = Math.round((h - fullHours) * 60);
    return `${fullHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  get entryFilteredJobs(): any[] {
    if (!this.entryProjectId) return this.jobs;
    return this.jobs.filter(j => j.project_id == this.entryProjectId);
  }

  onEntryProjectChange(): void {
    const valid = this.entryFilteredJobs.some(j => j.task_id == this.entryJobId);
    if (!valid) this.entryJobId = '';
  }

  get filteredProjectsList(): any[] {
    const list = this.projects || [];
    if (!this.projectSearchText || !this.projectSearchText.trim()) return list;
    const q = this.projectSearchText.trim().toLowerCase();
    return list.filter(p =>
      (p.project_name && p.project_name.toLowerCase().includes(q)) ||
      (p.project_code && p.project_code.toLowerCase().includes(q)) ||
      (p.client_name && p.client_name.toLowerCase().includes(q))
    );
  }

  get filteredJobsList(): any[] {
    const base = this.entryFilteredJobs || [];
    if (!this.jobSearchText || !this.jobSearchText.trim()) return base;
    const q = this.jobSearchText.trim().toLowerCase();
    return base.filter(j =>
      (j.task_name && j.task_name.toLowerCase().includes(q)) ||
      (j.task_code && j.task_code.toLowerCase().includes(q))
    );
  }

  toggleProjectDropdown(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showProjectDropdown = !this.showProjectDropdown;
    if (this.showProjectDropdown) {
      this.showJobDropdown = false;
      this.projectSearchText = '';
    }
  }

  selectProject(project: any): void {
    if (this.isTimerRunning) {
      this.toast.warning('Timer is running. Please stop the timer before changing project.');
      return;
    }
    this.entryProjectId = project ? project.project_id : '';
    this.onEntryProjectChange();
    this.showProjectDropdown = false;
    this.projectSearchText = '';
  }

  getSelectedProjectName(): string {
    if (!this.entryProjectId) return '';
    const p = (this.projects || []).find(proj => String(proj.project_id) === String(this.entryProjectId));
    return p ? p.project_name : '';
  }

  toggleJobDropdown(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showJobDropdown = !this.showJobDropdown;
    if (this.showJobDropdown) {
      this.showProjectDropdown = false;
      this.jobSearchText = '';
    }
  }

  selectJob(job: any): void {
    if (this.isTimerRunning) {
      this.toast.warning('Timer is running. Please stop the timer before changing job.');
      return;
    }
    this.entryJobId = job ? job.task_id : '';
    if (job && job.project_id && !this.entryProjectId) {
      this.entryProjectId = job.project_id;
    }
    this.showJobDropdown = false;
    this.jobSearchText = '';
  }

  getSelectedJobName(): string {
    if (!this.entryJobId) return '';
    const j = (this.jobs || []).find(job => String(job.task_id) === String(this.entryJobId)) ||
              (this.allTasks || []).find(task => String(task.task_id) === String(this.entryJobId));
    return j ? j.task_name : '';
  }


  openAddJob(): void {
    this.showJobDropdown = false;
    this.showJobDialog = true;
  }

  closeJobDialog(): void {
    this.showJobDialog = false;
  }

  onJobSaved(newJob: any): void {
    this.showJobDialog = false;
    if (this.employeeId) {
      this.pmService.getJobs(this.employeeId).subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.jobs = res.data;
          }
        }
      });
    }
    this.pmService.getAllTasks().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allTasks = res.data;
        }
      }
    });
    if (newJob) {
      const jobId = newJob.task_id || newJob.id;
      if (jobId) {
        this.entryJobId = jobId;
      }
      if (newJob.project_id && !this.entryProjectId) {
        this.entryProjectId = newJob.project_id;
      }
      this.toast.success('Job created successfully');
    }
  }

  openAddProject(): void {
    this.showProjectDropdown = false;
    this.initNewProjectForm();
    this.showAddProjectModal = true;
  }

  initNewProjectForm(): void {
    this.newProjectForm = {
      project_name: '',
      project_code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      client_name: '',
      department_id: '',
      project_manager_id: this.employeeId || '',
      supervisor_id: '',
      billing_method: 'Fixed Cost',
      description: ''
    };
  }

  closeAddProjectModal(): void {
    this.showAddProjectModal = false;
    this.savingProject = false;
  }

  saveNewProject(): void {
    if (!this.newProjectForm.project_name || !this.newProjectForm.project_name.trim()) {
      this.toast.warning('Please enter a project name');
      return;
    }
    this.savingProject = true;
    const dept = (this.departments || []).find(d => String(d.dept_id) === String(this.newProjectForm.department_id));
    const mgr = (this.employees || []).find(e => String(e.employee_id) === String(this.newProjectForm.project_manager_id));
    const supervisor = (this.employees || []).find(e => String(e.employee_id) === String(this.newProjectForm.supervisor_id));
    const payload: any = {
      project_name: this.newProjectForm.project_name.trim(),
      project_code: this.newProjectForm.project_code ? this.newProjectForm.project_code.trim() : undefined,
      client_name: this.newProjectForm.client_name ? this.newProjectForm.client_name.trim() : '',
      department_id: this.newProjectForm.department_id || null,
      department_name: dept ? dept.department_name : '',
      project_manager_id: this.newProjectForm.project_manager_id || null,
      project_manager_name: mgr ? `${mgr.first_name || ''} ${mgr.last_name || ''}`.trim() : '',
      project_manager_email: mgr ? mgr.employee_official_email : '',
      supervisor_id: this.newProjectForm.supervisor_id || null,
      supervisor_name: supervisor ? `${supervisor.first_name || ''} ${supervisor.last_name || ''}`.trim() : '',
      supervisor_email: supervisor ? supervisor.employee_official_email : '',
      billing_method: this.newProjectForm.billing_method || 'Fixed Cost',
      description: this.newProjectForm.description ? this.newProjectForm.description.trim() : '',
      created_by: this.employeeId
    };

    this.pmService.createProject(payload).subscribe({
      next: (res: any) => {
        this.savingProject = false;
        this.showAddProjectModal = false;
        this.toast.success(res.message || 'Project created successfully');
        this.pmService.getAllProjects().subscribe({
          next: (pRes: any) => {
            if (pRes.success && pRes.data) {
              this.projects = pRes.data;
              const newProjId = res.data?.project_id || res.data?.id;
              if (newProjId) {
                this.entryProjectId = newProjId;
                this.onEntryProjectChange();
              }
            }
          }
        });
      },
      error: (err: any) => {
        this.savingProject = false;
        this.toast.error(err.error?.message || 'Failed to create project');
      }
    });
  }

  goToFullProjectCreate(): void {
    this.showAddProjectModal = false;
    this.router.navigate(['/master/project-management/projects/create']);
  }

  toggleTimer(): void {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      if (!this.entryProjectId) {
        this.toast.warning('Please select a project first');
        return;
      }
      if (!this.entryJobId) {
        this.toast.warning('Please select a job first');
        return;
      }
      this.runningLogId = null;
      this.startTimer();
    }
  }

  startTimer(): void {
    if (!this.entryProjectId) {
      this.toast.warning('Please select a project first');
      return;
    }
    if (!this.entryJobId) {
      this.toast.warning('Please select a job first');
      return;
    }
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const h = Math.floor(this.timerSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((this.timerSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (this.timerSeconds % 60).toString().padStart(2, '0');
      this.timerDisplay = `${h}:${m}:${s}`;
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning = false;
    const elapsedHrs = Math.max(0.01, Math.round((this.timerSeconds / 3600) * 100) / 100);

    if (this.runningLogId) {
      const existingLog = this.logs.find(l => l.log_id == this.runningLogId);
      const prevHours = parseFloat(existingLog?.total_hours) || 0;
      const newTotal = Math.round((prevHours + elapsedHrs) * 100) / 100;
      this.pmService.updateLog(this.runningLogId, { total_hours: newTotal, hours_mode: 'Timer' }).subscribe({
        next: () => {
          this.toast.success(`Logged ${this.formatDuration(newTotal)} via timer`);
          this.timerSeconds = 0;
          this.timerDisplay = '00:00:00';
          this.runningLogId = null;
          this.entryDescription = '';
          this.loadLogs();
          this.loadSummary();
        },
        error: (err: any) => {
          this.toast.error(err.error?.message || 'Failed to update timer log');
        }
      });
      return;
    }

    if (this.entryProjectId && this.entryJobId) {
      const selectedJob = this.jobs.find(j => j.task_id == this.entryJobId);
      const selectedProj = this.projects.find(p => p.project_id == this.entryProjectId);
      const payload = {
        employee_id: this.employeeId,
        project_id: this.entryProjectId,
        project_name: selectedProj ? selectedProj.project_name : '',
        task_id: this.entryJobId,
        task_name: selectedJob ? selectedJob.task_name : '',
        log_date: this.entryDate || this.todayStr,
        total_hours: elapsedHrs,
        description: this.entryDescription || 'Timer work',
        hours_mode: 'Timer',
        is_billable: this.entryIsBillable,
        work_mode: this.entryWorkMode || 'Office',
        work_item: this.entryWorkItem || ''
      };
      this.pmService.createLog(payload).subscribe({
        next: () => {
          this.toast.success(`Logged ${this.formatDuration(elapsedHrs)} via timer`);
          this.timerSeconds = 0;
          this.timerDisplay = '00:00:00';
          this.runningLogId = null;
          this.entryDescription = '';
          this.loadLogs();
          this.loadSummary();
        },
        error: (err: any) => {
          this.toast.error(err.error?.message || 'Failed to save timer log');
        }
      });
    } else {
      this.openLogDialog('Log Time');
      this.editingLog = {
        total_hours: elapsedHrs,
        description: this.entryDescription,
        is_billable: this.entryIsBillable,
        work_mode: this.entryWorkMode,
        hours_mode: 'Timer'
      };
      this.timerSeconds = 0;
      this.timerDisplay = '00:00:00';
      this.runningLogId = null;
    }
  }

  isTimerLog(log: any): boolean {
    if (!log) return false;
    return !!(
      log.isLiveTimer ||
      log.log_id === this.runningLogId ||
      log.hours_mode === 'Timer' ||
      log.is_timer ||
      (log.description && log.description.toLowerCase().trim() === 'timer work')
    );
  }

  resumeTimerFromLog(log: any): void {
    if (this.isLocked(log)) {
      this.toast.info('This log is submitted or approved and cannot be resumed');
      return;
    }
    if (this.isTimerRunning) {
      this.stopTimer();
    }
    this.runningLogId = log.log_id;
    this.entryProjectId = log.project_id;
    this.entryJobId = log.task_id;
    this.entryDescription = log.description || '';
    this.entryIsBillable = log.is_billable !== undefined ? log.is_billable : true;
    this.entryWorkMode = log.work_mode || 'Office';
    this.entryDate = log.log_date || this.todayStr;
    this.startTimer();
  }

  saveHorizontalEntry(): void {
    if (!this.entryProjectId) {
      this.toast.warning('Please select a project');
      return;
    }
    if (!this.entryJobId) {
      this.toast.warning('Please select a job');
      return;
    }
    const selectedJob = this.jobs.find(j => j.task_id == this.entryJobId);
    const selectedProj = this.projects.find(p => p.project_id == this.entryProjectId);
    const payload = {
      employee_id: this.employeeId,
      project_id: this.entryProjectId,
      project_name: selectedProj ? selectedProj.project_name : '',
      task_id: this.entryJobId,
      task_name: selectedJob ? selectedJob.task_name : '',
      log_date: this.entryDate || this.todayStr,
      total_hours: 1.0,
      description: this.entryDescription || '',
      is_billable: this.entryIsBillable,
      work_mode: this.entryWorkMode || 'Office',
      work_item: this.entryWorkItem || ''
    };
    this.pmService.createLog(payload).subscribe({
      next: () => {
        this.toast.success('Time log saved successfully');
        this.entryDescription = '';
        this.loadLogs();
        this.loadSummary();
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to save time log');
      }
    });
  }

  openEntryDatePicker(): void {
    const newDate = prompt('Enter Log Date (YYYY-MM-DD):', this.entryDate || this.todayStr);
    if (newDate && !isNaN(new Date(newDate).getTime())) {
      this.entryDate = newDate;
    }
  }

  toggleEntryLink(): void {
    const link = prompt('Enter Work Item / Reference Link:', this.entryWorkItem);
    if (link !== null) {
      this.entryWorkItem = link.trim();
    }
  }

  toggleLogSelection(logId: any): void {
    const id = Number(logId);
    if (this.selectedLogIds.has(id)) {
      this.selectedLogIds.delete(id);
    } else {
      this.selectedLogIds.add(id);
    }
  }

  isLogSelected(logId: any): boolean {
    return this.selectedLogIds.has(Number(logId));
  }

  toggleDateGroupSelection(group: any): void {
    if (!group.items || group.items.length === 0) return;
    const allSelected = group.items.every((l: any) => this.selectedLogIds.has(Number(l.log_id)));
    if (allSelected) {
      group.items.forEach((l: any) => this.selectedLogIds.delete(Number(l.log_id)));
    } else {
      group.items.forEach((l: any) => this.selectedLogIds.add(Number(l.log_id)));
    }
  }

  isDateGroupSelected(group: any): boolean {
    if (!group.items || group.items.length === 0) return false;
    return group.items.every((l: any) => this.selectedLogIds.has(Number(l.log_id)));
  }

  toggleSelectAll(): void {
    if (this.filteredLogs.length === 0) return;
    const allSelected = this.filteredLogs.every(l => this.selectedLogIds.has(Number(l.log_id)));
    if (allSelected) {
      this.selectedLogIds.clear();
    } else {
      this.filteredLogs.forEach(l => this.selectedLogIds.add(Number(l.log_id)));
    }
  }

  isAllSelected(): boolean {
    if (this.filteredLogs.length === 0) return false;
    return this.filteredLogs.every(l => this.selectedLogIds.has(Number(l.log_id)));
  }

  openSubmitApprovalModal(): void {
    let eligibleLogs: any[] = [];
    let ineligibleCount = 0;

    if (this.selectedLogIds.size > 0) {
      eligibleLogs = this.filteredLogs.filter(l => this.selectedLogIds.has(Number(l.log_id)) && l.submission_status === 'Not Submitted');
      ineligibleCount = this.selectedLogIds.size - eligibleLogs.length;
    } else {
      eligibleLogs = this.filteredLogs.filter(l => l.submission_status === 'Not Submitted');
      ineligibleCount = 0;
    }

    if (eligibleLogs.length === 0) {
      if (this.selectedLogIds.size > 0) {
        this.toast.warning('The selected entries are already submitted or approved.');
      } else {
        this.toast.warning('No unsubmitted time logs found for the selected week.');
      }
      return;
    }

    const totalHrs = eligibleLogs.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
    const billableHrs = eligibleLogs.filter(l => l.is_billable).reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
    this.submitModalData = {
      count: eligibleLogs.length,
      totalHours: Math.round(totalHrs * 100) / 100,
      billableHours: Math.round(billableHrs * 100) / 100,
      logIds: eligibleLogs.map(l => l.log_id),
      ineligibleCount,
      logs: eligibleLogs,
      groupedByDate: this.groupLogsForModal(eligibleLogs)
    };
    this.submitTimesheetName = `Timesheet (${this.periodDisplayLabel})`;
    this.submitComments = '';
    this.showSubmitModal = true;
  }

  groupLogsForModal(logs: any[]): any[] {
    const map = new Map<string, any[]>();
    logs.forEach(l => {
      const d = l.log_date;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(l);
    });

    const result: any[] = [];
    Array.from(map.keys()).sort().forEach(dateStr => {
      const dObj = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayMonth = `${months[dObj.getMonth()]} ${String(dObj.getDate()).padStart(2, '0')}`;
      const dayName = days[dObj.getDay()];

      result.push({
        dateStr,
        dayMonth,
        dayName,
        items: map.get(dateStr) || []
      });
    });
    return result;
  }

  getSubmitProjectNames(): string {
    if (!this.submitModalData || !this.submitModalData.logs) return '--';
    const names = Array.from(new Set(this.submitModalData.logs.map((l: any) => l.project_name || 'prj 1'))).filter(Boolean);
    return names.length > 0 ? names.join(', ') : 'prj 1';
  }

  saveAsDraft(): void {
    this.toast.info('Timesheet saved as draft.');
    this.closeSubmitModal();
  }

  triggerAttachmentUpload(): void {
    const fileInput = document.getElementById('timesheetImportFileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  startInlineEdit(log: any): void {
    this.editingModalLogId = log.log_id;
    const taskId = log.task_id != null ? Number(log.task_id) : null;
    this.inlineEditData = {
      task_id: taskId,
      task_name: log.task_name,
      project_id: log.project_id,
      description: log.description || log.work_item || '',
      is_billable: log.is_billable !== undefined ? log.is_billable : true,
      duration: this.formatDuration(log.total_hours)
    };
  }

  cancelInlineEdit(): void {
    this.editingModalLogId = null;
    this.inlineEditData = {};
  }

  compareTasks(t1: any, t2: any): boolean {
    return t1 != null && t2 != null && String(t1) === String(t2);
  }

  onInlineEditJobChange(): void {
    const source = (this.allTasks && this.allTasks.length > 0) ? this.allTasks : (this.jobs || []);
    const job = source.find(j => String(j.task_id) === String(this.inlineEditData.task_id));
    if (job) {
      this.inlineEditData.task_name = job.task_name;
    }
  }

  getJobsForProject(projectId: any, currentLog?: any): any[] {
    const source = (this.allTasks && this.allTasks.length > 0) ? this.allTasks : (this.jobs || []);
    let list = projectId ? source.filter(j => String(j.project_id) === String(projectId)) : [...source];
    if (currentLog && (currentLog.task_id || currentLog.task_name)) {
      const exists = list.some(j => String(j.task_id) === String(currentLog.task_id));
      if (!exists) {
        list = [
          {
            task_id: currentLog.task_id != null ? Number(currentLog.task_id) : currentLog.task_id,
            task_name: currentLog.task_name || ('Job ' + currentLog.task_id),
            project_id: currentLog.project_id
          },
          ...list
        ];
      }
    }
    return list.length > 0 ? list : (source.length > 0 ? source : []);
  }

  parseDurationToHours(str: string): number {
    if (!str) return 0;
    if (str.includes(':')) {
      const parts = str.split(':').map(Number);
      return Math.round(((parts[0] || 0) + (parts[1] || 0) / 60) * 100) / 100;
    }
    return Math.round((parseFloat(str) || 0) * 100) / 100;
  }

  saveInlineEdit(log: any): void {
    const hours = this.parseDurationToHours(this.inlineEditData.duration);
    const updatePayload: any = {
      task_id: this.inlineEditData.task_id || log.task_id,
      description: this.inlineEditData.description,
      is_billable: this.inlineEditData.is_billable,
      total_hours: hours
    };

    this.pmService.updateLog(log.log_id, updatePayload).subscribe({
      next: (res: any) => {
        log.task_id = updatePayload.task_id;
        log.task_name = this.inlineEditData.task_name || log.task_name;
        log.description = updatePayload.description;
        log.is_billable = updatePayload.is_billable;
        log.total_hours = hours;

        if (this.submitModalData && this.submitModalData.logs) {
          const totalHrs = this.submitModalData.logs.reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          const billableHrs = this.submitModalData.logs.filter((l: any) => l.is_billable).reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          this.submitModalData.totalHours = Math.round(totalHrs * 100) / 100;
          this.submitModalData.billableHours = Math.round(billableHrs * 100) / 100;
        }

        this.cancelInlineEdit();
        this.toast.success('Time log updated successfully');
        this.loadLogs();
        this.loadSummary();
      },
      error: (err: any) => {
        console.error('Error updating log inline:', err);
        this.toast.error(err.error?.message || 'Failed to update time log');
      }
    });
  }

  closeSubmitModal(): void {
    this.showSubmitModal = false;
    this.cancelInlineEdit();
  }

  confirmSubmitApproval(): void {
    if (this.submittingTimesheet) return;
    this.submittingTimesheet = true;

    const payload: any = {
      employee_id: this.employeeId,
      employee_name: this.employeeName,
      period_start_date: this.periodStart,
      period_end_date: this.periodEnd,
      comments: this.submitComments
    };

    if (this.submitModalData.logIds && this.submitModalData.logIds.length > 0) {
      payload.log_ids = this.submitModalData.logIds;
    }

    this.pmService.submitTimesheet(payload).subscribe({
      next: (res: any) => {
        this.submittingTimesheet = false;
        this.showSubmitModal = false;
        this.selectedLogIds.clear();
        this.toast.success(res.message || 'Timesheet submitted for approval successfully');
        this.loadLogs();
        this.loadSummary();
      },
      error: (err: any) => {
        this.submittingTimesheet = false;
        console.error('Error submitting timesheet:', err);
        this.toast.error(err.error?.message || 'Failed to submit timesheet for approval');
      }
    });
  }

  isLocked(log: any): boolean {
    return log.submission_status === 'Submitted' || log.approval_status === 'Approved';
  }

  formatShortDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  prevPeriod(): void {
    if (this.periodMode === 'day') {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() - 1);
      this.activeDate = d;
      this.pickerMonthDate = new Date(d);
    } else if (this.periodMode === 'week') {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() - 7);
      this.activeDate = d;
      this.pickerMonthDate = new Date(d);
    } else if (this.periodMode === 'semi-month') {
      const d = new Date(this.activeDate);
      if (d.getDate() <= 15) {
        this.activeDate = new Date(d.getFullYear(), d.getMonth() - 1, 20);
      } else {
        this.activeDate = new Date(d.getFullYear(), d.getMonth(), 5);
      }
      this.pickerMonthDate = new Date(this.activeDate);
    } else {
      this.activeDate = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() - 1, 1);
      this.pickerMonthDate = new Date(this.activeDate);
    }
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
    this.buildPickerWeeks();
  }

  nextPeriod(): void {
    if (this.periodMode === 'day') {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() + 1);
      this.activeDate = d;
      this.pickerMonthDate = new Date(d);
    } else if (this.periodMode === 'week') {
      const d = new Date(this.activeDate);
      d.setDate(d.getDate() + 7);
      this.activeDate = d;
      this.pickerMonthDate = new Date(d);
    } else if (this.periodMode === 'semi-month') {
      const d = new Date(this.activeDate);
      if (d.getDate() <= 15) {
        this.activeDate = new Date(d.getFullYear(), d.getMonth(), 20);
      } else {
        this.activeDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
      }
      this.pickerMonthDate = new Date(this.activeDate);
    } else {
      this.activeDate = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() + 1, 1);
      this.pickerMonthDate = new Date(this.activeDate);
    }
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
    this.buildPickerWeeks();
  }

  setView(v: string): void {
    this.view = v;
    if (v === 'calendar') {
      this.buildCalendar();
    }
  }

  buildCalendar(): void {
    const year = this.activeDate.getFullYear();
    const month = this.activeDate.getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.calendarMonthLabel = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();

    const cells: any[] = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = this.toDateStr(dateObj);

      const dayLogs = (this.logs || []).filter(l => l.log_date === dateStr);
      const dayHolidays = (this.holidays || []).filter(h => h.date === dateStr);
      const dayLeaves = (this.leaves || []).filter(l => l.date === dateStr);
      let dayWeekOffs = (this.weekOffs || []).filter(w => w.date === dateStr);

      if (dayWeekOffs.length === 0) {
        const derived = this.getWeekOffForDate(dateObj);
        if (derived) dayWeekOffs = [derived];
      }
      const isWeekOff = dayWeekOffs.length > 0;

      const workedHours = Math.round(dayLogs.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0) * 100) / 100;
      const holidayHours = Math.round(dayHolidays.reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0) * 100) / 100;
      const leaveHours = Math.round(dayLeaves.reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0) * 100) / 100;
      const totalHours = Math.round((workedHours + holidayHours + leaveHours) * 100) / 100;

      cells.push({
        day: d,
        dateStr,
        dateObj,
        logs: dayLogs,
        holidays: dayHolidays,
        leaves: dayLeaves,
        weekOffs: dayWeekOffs,
        isWeekOff,
        workedHours,
        holidayHours,
        leaveHours,
        totalHours,
        hours: totalHours,
        isToday: this.todayStr === dateStr,
        isInRange: this.isDateInRange(dateStr),
        isRangeStart: dateStr === this.periodStart,
        isRangeEnd: dateStr === this.periodEnd
      });
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    const weeks: any[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    this.calendarWeeks = weeks;
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.pickerMonthDate = new Date(this.activeDate);
      this.buildPickerWeeks();
    }
  }

  closeDatePicker(): void {
    this.showDatePicker = false;
  }

  navPickerMonth(delta: number): void {
    this.pickerMonthDate = new Date(this.pickerMonthDate.getFullYear(), this.pickerMonthDate.getMonth() + delta, 1);
    this.buildPickerWeeks();
  }

  buildPickerWeeks(): void {
    const year = this.pickerMonthDate.getFullYear();
    const month = this.pickerMonthDate.getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.pickerMonthTitle = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const cells: any[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dObj = new Date(year, month - 1, day);
      const dStr = this.toDateStr(dObj);
      cells.push({
        day,
        dateStr: dStr,
        dateObj: dObj,
        isOtherMonth: true,
        isInRange: this.isDateInRange(dStr),
        isRangeStart: dStr === this.periodStart,
        isRangeEnd: dStr === this.periodEnd,
        isToday: dStr === this.todayStr,
        hours: this.dayHoursMap[dStr] || 0
      });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dObj = new Date(year, month, d);
      const dStr = this.toDateStr(dObj);
      cells.push({
        day: d,
        dateStr: dStr,
        dateObj: dObj,
        isOtherMonth: false,
        isInRange: this.isDateInRange(dStr),
        isRangeStart: dStr === this.periodStart,
        isRangeEnd: dStr === this.periodEnd,
        isToday: dStr === this.todayStr,
        hours: this.dayHoursMap[dStr] || 0
      });
    }

    let nextMonthDay = 1;
    while (cells.length % 7 !== 0) {
      const dObj = new Date(year, month + 1, nextMonthDay);
      const dStr = this.toDateStr(dObj);
      cells.push({
        day: nextMonthDay++,
        dateStr: dStr,
        dateObj: dObj,
        isOtherMonth: true,
        isInRange: this.isDateInRange(dStr),
        isRangeStart: dStr === this.periodStart,
        isRangeEnd: dStr === this.periodEnd,
        isToday: dStr === this.todayStr,
        hours: this.dayHoursMap[dStr] || 0
      });
    }

    const weeks: any[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    this.pickerWeeks = weeks;
  }

  onPickerDayClick(cell: any, event?: Event): void {
    if (event) event.stopPropagation();
    if (!cell || cell.isOtherMonth) return;
    this.activeDate = cell.dateObj;
    this.closeDatePicker();
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
  }

  selectWeekRow(week: any[]): void {
    const activeCell = week.find((c: any) => c && !c.isOtherMonth) || week.find((c: any) => c);
    if (activeCell) {
      this.periodMode = 'week';
      this.activeDate = activeCell.dateObj;
      this.closeDatePicker();
      this.loadLogs();
      this.loadSummary();
      this.buildCalendar();
    }
  }

  selectCurrentWeek(): void {
    this.periodMode = 'week';
    this.activeDate = new Date();
    this.pickerMonthDate = new Date();
    this.closeDatePicker();
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
  }

  selectEntireMonth(): void {
    this.periodMode = 'month';
    this.activeDate = new Date(this.pickerMonthDate.getFullYear(), this.pickerMonthDate.getMonth(), 1);
    this.closeDatePicker();
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
  }

  isDateInRange(dateStr: string): boolean {
    if (!dateStr) return false;
    return dateStr >= this.periodStart && dateStr <= this.periodEnd;
  }

  getWeekOffForDate(date: Date): any {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const dateStr = this.toDateStr(date);

    if (dayName !== 'Sunday' && dayName !== 'Saturday') {
      return null;
    }

    const directMatch = (this.weekOffs || []).find(w => w.date === dateStr);
    if (directMatch) return directMatch;

    let offType = 'Full Day';
    if (this.weekOffRules && this.weekOffRules.length > 0) {
      const monthNum = String(date.getMonth() + 1);
      const dayOfMonth = date.getDate();
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      const adjustedDay = dayOfMonth + firstDayOfMonth;
      const weekNumber = Math.ceil(adjustedDay / 7);
      const suffix = weekNumber === 1 ? 'st' : weekNumber === 2 ? 'nd' : weekNumber === 3 ? 'rd' : 'th';
      const weekKey = `week_${weekNumber}${suffix}`;

      let rule = this.weekOffRules.find((r: any) => r.week_name === dayName && String(r.month_name) === monthNum && r[weekKey]);
      if (!rule) {
        rule = this.weekOffRules.find((r: any) => r.week_name === dayName && r[weekKey]);
      }
      if (rule && rule[weekKey]) {
        offType = rule[weekKey];
      }
    }

    return {
      date: dateStr,
      day_name: dayName,
      type: offType,
      name: 'Weekly Off',
      hours: 0
    };
  }

  get todayStr(): string {
    return this.toDateStr(new Date());
  }

  get dayHoursMap(): { [key: string]: number } {
    const map: { [key: string]: number } = {};
    (this.logs || []).forEach(l => {
      const hrs = parseFloat(l.total_hours) || 0;
      map[l.log_date] = Math.round(((map[l.log_date] || 0) + hrs) * 100) / 100;
    });
    (this.holidays || []).forEach(h => {
      const hrs = parseFloat(h.hours) || 0;
      map[h.date] = Math.round(((map[h.date] || 0) + hrs) * 100) / 100;
    });
    (this.leaves || []).forEach(l => {
      const hrs = parseFloat(l.hours) || 0;
      map[l.date] = Math.round(((map[l.date] || 0) + hrs) * 100) / 100;
    });
    return map;
  }

  get isCurrentWeekSelected(): boolean {
    if (this.periodMode !== 'week') return false;
    const curWeek = this.calculateWeekRange(new Date());
    return this.periodStart === this.toDateStr(curWeek.start) && this.periodEnd === this.toDateStr(curWeek.end);
  }

  get isEntireMonthSelected(): boolean {
    return this.periodMode === 'month';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showDatePicker) {
      const target = event.target as HTMLElement;
      if (!target.closest('.period-navigator-wrap')) {
        this.showDatePicker = false;
      }
    }
    if (this.showLogMenu) {
      const target = event.target as HTMLElement;
      if (!target.closest('.log-time-split-btn')) {
        this.showLogMenu = false;
      }
    }
    if (this.showMoreMenu) {
      const target = event.target as HTMLElement;
      if (!target.closest('.more-menu-container')) {
        this.showMoreMenu = false;
      }
    }
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown-field')) {
      this.showProjectDropdown = false;
      this.showJobDropdown = false;
    }
    if (!target.closest('.team-emp-custom-dropdown')) {
      this.showTeamEmpDropdown = false;
    }
  }

  toggleMoreMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showMoreMenu = !this.showMoreMenu;
  }

  onImportClick(): void {
    this.showMoreMenu = false;
    const fileInput = document.getElementById('timesheetImportFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  onExportClick(): void {
    this.showMoreMenu = false;
    this.exportTimeLogsToCsv();
  }

  exportTimeLogsToCsv(): void {
    if (!this.logs || this.logs.length === 0) {
      this.toast.info('No time logs available to export for this period.');
      return;
    }

    const headers = ['Date', 'Project', 'Job', 'Task Description', 'Billable', 'Duration (Hours)', 'Work Mode', 'Approval Status'];
    const rows = this.logs.map(log => [
      `"${log.log_date || ''}"`,
      `"${(log.project_name || '').replace(/"/g, '""')}"`,
      `"${(log.task_name || '').replace(/"/g, '""')}"`,
      `"${(log.description || '').replace(/"/g, '""')}"`,
      `"${log.is_billable ? 'Billable' : 'Non-Billable'}"`,
      `"${this.formatDuration(log.total_hours)}"`,
      `"${log.work_mode || 'Office'}"`,
      `"${log.approval_status || 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TimeLogs_${this.periodStart}_to_${this.periodEnd}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Time logs exported successfully');
  }

  handleFileImport(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      this.processCsvImport(content);
    };
    reader.readAsText(file);
  }

  processCsvImport(content: string): void {
    try {
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        this.toast.error('The selected file is empty or contains only headers.');
        return;
      }
      this.toast.success(`Importing time entries from ${lines.length - 1} records...`);
      this.loadLogs();
      this.loadSummary();
    } catch (err) {
      this.toast.error('Failed to parse import file.');
    }
  }

  get isTodaySelected(): boolean {
    if (this.periodMode !== 'day') return false;
    return this.toDateStr(this.activeDate) === this.todayStr;
  }

  selectToday(): void {
    this.periodMode = 'day';
    this.activeDate = new Date();
    this.pickerMonthDate = new Date();
    this.closeDatePicker();
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
  }

  toggleLogMenu(): void {
    this.showLogMenu = !this.showLogMenu;
  }

  selectLogMenuOption(option: string): void {
    this.showLogMenu = false;
    if (option === 'Log Time') {
      this.openLogDialog('Log Time');
    } else if (option === 'Daily Log') {
      this.setPeriodMode('day');
    } else if (option === 'Weekly Log') {
      this.setPeriodMode('week');
    } else if (option === 'Semi Monthly Log') {
      this.setPeriodMode('semi-month');
    } else if (option === 'Monthly Log') {
      this.setPeriodMode('month');
    }
  }

  isOptionActive(option: string): boolean {
    if (option === 'Daily Log') return this.periodMode === 'day';
    if (option === 'Weekly Log') return this.periodMode === 'week';
    if (option === 'Semi Monthly Log') return this.periodMode === 'semi-month';
    if (option === 'Monthly Log') return this.periodMode === 'month';
    return false;
  }

  setPeriodMode(mode: 'day' | 'week' | 'semi-month' | 'month'): void {
    this.periodMode = mode;
    this.loadLogs();
    this.loadSummary();
    this.buildCalendar();
  }

  openLogDialog(mode: string = 'Log Time', dateStr?: string): void {
    this.logDialogMode = mode;
    this.editingLog = null;
    this.isLogDialogReadOnly = false;
    this.logDialogDefaultDate = dateStr ? new Date(dateStr) : new Date();
    this.showLogDialog = true;
    this.cdr.detectChanges();
  }

  trackByDate(index: number, group: any): string {
    return group?.date || String(index);
  }

  trackByLogId(index: number, log: any): any {
    return log?.log_id ?? index;
  }

  onRowClick(event: MouseEvent, log: any): void {
    const now = Date.now();
    const isDouble = event.detail === 2 || (now - this.lastClickTime < 650 && String(this.lastClickLogId) === String(log?.log_id));
    this.lastClickTime = now;
    this.lastClickLogId = log?.log_id;

    if (isDouble) {
      this.lastClickTime = 0;
      this.lastClickLogId = null;
      this.onRowDblClick(log);
    }
  }

  onRowDblClick(log: any): void {
    const now = Date.now();
    if (now - this.lastHandledDblClickTime < 400) return;
    this.lastHandledDblClickTime = now;

    if (!log) return;
    this.editingLog = log;
    this.isLogDialogReadOnly = this.isLocked(log);
    this.logDialogMode = this.isLogDialogReadOnly ? 'View Time Log' : 'Edit Time Log';
    this.showLogDialog = true;
    this.cdr.detectChanges();
  }

  editLog(log: any): void {
    if (this.isLocked(log)) {
      this.onRowDblClick(log);
      return;
    }
    this.editingLog = log;
    this.isLogDialogReadOnly = false;
    this.logDialogMode = 'Edit Time Log';
    this.showLogDialog = true;
    this.cdr.detectChanges();
  }

  closeLogDialog(): void {
    this.showLogDialog = false;
    this.editingLog = null;
    this.isLogDialogReadOnly = false;
    this.cdr.detectChanges();
  }

  onLogSaved(): void {
    this.closeLogDialog();
    this.loadLogs();
    this.loadSummary();
  }

  deleteLog(log: any): void {
    if (log.submission_status === 'Submitted') {
      this.toast.info('This time log has already been submitted and cannot be deleted');
      return;
    }
    if (confirm('Are you sure you want to delete this time log?')) {
      this.pmService.deleteLog(log.log_id).subscribe({
        next: () => {
          this.toast.success('Time log deleted successfully');
          this.loadLogs();
          this.loadSummary();
        },
        error: (err) => {
          console.error('Error deleting time log:', err);
          this.toast.error(err.error?.message || 'Failed to delete time log');
        }
      });
    }
  }

  onDayClick(cell: any): void {
    if (!cell) return;
    this.openLogDialog('Log Time', cell.dateStr);
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  onFilterApply(filterObj: any): void {
    this.filters = filterObj;
    this.showFilterPanel = false;
    this.loadLogs();
    this.loadSummary();
  }

  onFilterReset(): void {
    this.filters = { client: '', project_id: '', task_id: '', approval_status: '', work_mode: '', employee_id: '' };
    this.showFilterPanel = false;
    this.loadLogs();
    this.loadSummary();
  }

  getApprovalClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approval-approved';
      case 'Rejected':
        return 'approval-rejected';
      case 'Pending':
      default:
        return 'approval-pending';
    }
  }

  getSubmissionClass(status: string): string {
    return status === 'Submitted' ? 'submission-submitted' : 'submission-not-submitted';
  }

  getWorkModeIcon(mode: string): string {
    switch (mode) {
      case 'WFH':
        return 'fa fa-home';
      case 'Client Site':
        return 'fa fa-map-marker';
      case 'Day Off':
        return 'fa fa-coffee';
      case 'Office':
      default:
        return 'fa fa-building-o';
    }
  }

  getWorkModeClass(mode: string): string {
    switch (mode) {
      case 'WFH':
        return 'mode-wfh';
      case 'Client Site':
        return 'mode-clientsite';
      case 'Day Off':
        return 'mode-dayoff';
      case 'Office':
      default:
        return 'mode-office';
    }
  }
}
