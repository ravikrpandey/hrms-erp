import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  departments: string[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'All';
  selectedDepartment: string = 'All';

  allCount: number = 0;
  activeCount: number = 0;
  completedCount: number = 0;
  onHoldCount: number = 0;
  overdueCount: number = 0;

  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private pmService: ProjectManagementService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.projects = res.data;
          this.computeDepartments();
          this.computeCounts();
          this.applyFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching projects:', err);
        this.toast.error('Failed to load projects');
      }
    });
  }

  computeDepartments(): void {
    const deptSet = new Set<string>();
    this.projects.forEach(p => {
      if (p.department_name && p.department_name.trim()) {
        deptSet.add(p.department_name.trim());
      }
    });
    this.departments = Array.from(deptSet).sort();
  }

  computeCounts(): void {
    this.allCount = this.projects.length;
    this.activeCount = this.projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;
    this.completedCount = this.projects.filter(p => p.status === 'Completed').length;
    this.onHoldCount = this.projects.filter(p => p.status === 'On Hold').length;
    this.overdueCount = this.projects.filter(p => p.is_overdue).length;
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.projects];

    if (this.selectedStatus === 'Active') {
      result = result.filter(p => p.status === 'Active' || p.status === 'In Progress');
    } else if (this.selectedStatus === 'Completed') {
      result = result.filter(p => p.status === 'Completed');
    } else if (this.selectedStatus === 'On Hold') {
      result = result.filter(p => p.status === 'On Hold');
    } else if (this.selectedStatus === 'Overdue') {
      result = result.filter(p => p.is_overdue);
    }

    if (this.selectedDepartment !== 'All') {
      result = result.filter(p => p.department_name === this.selectedDepartment);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        (p.project_name && p.project_name.toLowerCase().includes(term)) ||
        (p.project_code && p.project_code.toLowerCase().includes(term)) ||
        (p.client_name && p.client_name.toLowerCase().includes(term)) ||
        (p.department_name && p.department_name.toLowerCase().includes(term)) ||
        (p.project_manager_name && p.project_manager_name.toLowerCase().includes(term))
      );
    }

    this.filteredProjects = result;
    this.currentPage = 1;
  }

  get paginatedProjects(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjects.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.pageSize) || 1;
  }

  get totalCount(): number {
    return this.filteredProjects.length;
  }

  get startItemIndex(): number {
    if (this.totalCount === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalCount ? this.totalCount : end;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToCreate(): void {
    this.router.navigate(['/master/project-management/projects/create']);
  }

  goToDetail(project: any): void {
    this.router.navigate(['/master/project-management/projects', project.project_id]);
  }

  goToEdit(project: any, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/master/project-management/projects/edit', project.project_id]);
  }

  deleteProject(project: any, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete project "${project.project_name}"?`)) {
      this.pmService.deleteProject(project.project_id).subscribe({
        next: (res: any) => {
          this.toast.success('Project deleted successfully');
          this.loadProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          this.toast.error('Failed to delete project');
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatBudget(val: any): string {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  getInitials(name: string): string {
    if (!name) return 'PR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
      case 'In Progress':
        return 'badge-active';
      case 'Completed':
        return 'badge-completed';
      case 'On Hold':
        return 'badge-onhold';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }
}
