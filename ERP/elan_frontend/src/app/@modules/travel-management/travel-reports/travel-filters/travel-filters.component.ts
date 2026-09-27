import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-travel-filters',
  templateUrl: './travel-filters.component.html',
  styleUrls: ['./travel-filters.component.scss']
})
export class TravelFiltersComponent {
  @Input() selectedMonth: any = null;
  @Input() selectedDepartment: any = null;
  @Input() selectedEmployee: any = null;
  @Input() selectedLocation: any = null;
  @Input() selectedYear: any = null;
  @Input() selectedStatus: any = null;
  @Input() selectedCategory: any = null;
  @Input() selectedYearID: any = null;
  @Input() filtersToShow: string[] = [];
  @Output() filtersChanged = new EventEmitter<any>();

  entity_id: any;
  departments: any;
  rawEmp: any;
  employeesList: any;
  years: any;
  months: any;
  employees: any;
  expenseCategories:any;
  mainEmpId: string | null;

  statuses = [
    { id: 1, status_name: 'APPROVED' },
    { id: 2, status_name: 'REJECTED' },
    { id: 3, status_name: 'PENDING' },
  ];

  constructor(
    private hrmsService: HrmServiceService,
    private monthService: TimesheetService,
    private _projectService: ProjectManagementService,
    private configurationService : ConfigurationalmasterService
  ) { }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getAllDepartments();
    this.getMonthList();
    this.getEmployees();
    this.getYears();
    this.getExpenseTypes();
  }
  onSelectionChange() {
    this.filtersChanged.emit({
      selectedMonth: this.selectedMonth,
      selectedDepartment: this.selectedDepartment,
      selectedEmployee: this.selectedEmployee,
      selectedLocation: this.selectedLocation,
      selectedYear: this.selectedYear,
      selectedYearID: this.selectedYearID,
      selectedStatus : this.selectedStatus,
      selectedCategory: this.selectedCategory
    });
  }
  getMonthList(){
    this.monthService.getMonthList().subscribe((res:any)=>{
      this.months = res.data;
    })
  }
  getYears(){
    this.hrmsService.getFinancialYear().subscribe((res:any)=>{
      this.years = res.data;
    })
  }
  getExpenseTypes() {
    this.configurationService.listTypeOfExpenseCategory().subscribe({
      next: (res: any) => {
        this.expenseCategories = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.expenseCategories = [];
          console.error('No expense categories data not found!.');
        } else {
          console.error('Error fetching report:', err);

        }
      }
    });
  }
  getAllDepartments() {
    this.hrmsService.getAllDepartments(this.entity_id).subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.departments = [];
          console.error('No Deparment data not found!.');
        } else {
          console.error('Error fetching report:', err);

        }
      }
    });
  }
  getEmployees() {
    this._projectService.getEmployees().subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.rawEmp = response.data;
          this.employeesList = response.data;
          this.employees = response.data.map((res: any) => res.first_name + res.last_name);
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.rawEmp.filter((item: any) => aa.includes(item.first_name + item.last_name));
    this.employeesList = filteredVariable
  }

  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedDepartment = null;
    this.selectedEmployee = null;
    this.selectedLocation = null;
    this.selectedYear = null;
    this.selectedYearID = null;
    this.selectedStatus = null;
    this.selectedCategory = null;
    this.filtersChanged.emit({
      selectedMonth: this.selectedMonth,
      selectedDepartment: this.selectedDepartment,
      selectedEmployee: this.selectedEmployee,
      selectedLocation: this.selectedLocation,
      selectedYear: this.selectedYear,
      selectedYearID: this.selectedYearID,
      selectedStatus : this.selectedStatus,
      selectedCategory : this.selectedCategory
    });
  }
}
