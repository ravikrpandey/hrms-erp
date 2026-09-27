import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-shift-allocation',
  templateUrl: './shift-allocation.component.html',
  styleUrls: ['./shift-allocation.component.scss'],
})
export class ShiftAllocationComponent {
  isAllSelect: boolean = false;
  shiftAllocated: FormGroup;
  departments: any;
  id: any = [];
  dummy: any;
  dept_id: any;
  departmentdata: any[] = [];
  filteredDepartments: any[] = [];
  employeeName: any[] = [];
  departmentId: any[] = [];
  employeeNameData: any[] = [];
  shiftAllocationData: any[] = [];
  shiftMasterids: any = [];
  shiftMaster: any = [];
  selectedEntityId: any;
  allShiftMasterData: any = [];
  mode: any;
  deptid: any;
  selectid: any;
  shiftid: any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private shiftAllocatedservices: ShiftAllocationService,
    private router: Router
  ) {
    this.shiftAllocated = this.fb.group({
      dept_id: [null, Validators.required],
      employee_id: [[]],
      shift_id: [null, Validators.required],
      entity_id: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllDepartmentData();
    this.getAllShift();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = +params['id'];
      this.shiftid = +params['shift_id'];
      this.mode = params['mode'];
      if (this.mode === 'view' || this.mode === 'edit') {
        this.loadShiftAllocationData();
      }
    });
  }

  loadShiftAllocationData() {
    if (!this.selectedEntityId) {
      const entity = localStorage.getItem('selectedEntityId');
      this.selectedEntityId = entity ? parseInt(entity, 10) : null;
    }

    if (!this.selectedEntityId || !this.id || !this.shiftid) {
      console.warn('Missing required params');
      return;
    }

    forkJoin({
      departmentData: this.shiftAllocatedservices.getAllDepartmentData(
        this.selectedEntityId
      ),
      userData: this.shiftAllocatedservices.getSingleUserDataInShiftAllocation(
        this.id,
        this.shiftid
      ),
    }).subscribe(
      ({ departmentData, userData }) => {
        const uniqueDepartments = departmentData.data
          ? departmentData.data.filter(
              (dept: any, index: number, self: any[]) =>
                index === self.findIndex((d) => d.dept_id === dept.dept_id)
            )
          : [];

        this.departmentdata = uniqueDepartments;
        this.employeeName = departmentData.data || [];
        this.filteredDepartments = [...this.departmentdata];

        this.shiftAllocationData = userData.data;
        this.shiftMasterids = userData.employeedata;

        if (this.shiftAllocationData && this.shiftAllocationData.length > 0) {
          const shift =
            this.shiftAllocationData.find(
              (item: any) => item.id === this.selectid
            ) || this.shiftAllocationData[0];

          this.deptid = shift.dept_id;
          this.shiftAllocated.patchValue({
            dept_id: shift.dept_id,
            shift_id: shift.shift_master_id,
            employee_id: this.shiftMasterids || [],
          });

          this.selectedDepartmentName(this.deptid);
        }
      },
      (error) => {
        console.error('Error loading shift allocation data', error);
      }
    );
  }

  filterthealldepartment: any;
  getAllDepartmentData() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      return;
    }
    this.shiftAllocatedservices
      .getAllDepartmentData(this.selectedEntityId)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            const uniqueDepartments = res.data
              ? res.data.filter(
                  (dept: any, index: number, self: any[]) =>
                    index === self.findIndex((d) => d.dept_id === dept.dept_id)
                )
              : [];
            this.departmentdata = uniqueDepartments;
            this.employeeName = res.data || [];
            this.filteredDepartments = [...this.departmentdata];
            this.filterthealldepartment = [...this.filteredDepartments];
          } else {
            this.departmentdata = [];
            this.employeeName = [];
          }
        },
        (error) => {
          console.error('Error fetching department data:', error);
        }
      );
  }

  getSingleUserdata() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const shiftId = +params['shift_id'];
      const deptIdFromQuery = +params['id'];
      this.shiftAllocatedservices
        .getSingleUserDataInShiftAllocation(deptIdFromQuery, shiftId)
        .subscribe((res: any) => {
          this.shiftAllocationData = res.data;
          this.shiftMasterids = res.employeedata;
          if (this.shiftAllocationData && this.shiftAllocationData.length > 0) {
            const selectedShift =
              this.shiftAllocationData.find(
                (item: any) => +item.id === this.selectid
              ) || this.shiftAllocationData[0];
            this.deptid = selectedShift.dept_id;
            this.shiftAllocated.patchValue({
              dept_id: selectedShift.dept_id,
              shift_id: selectedShift.shift_master_id,
              employee_id: this.shiftMasterids || [],
            });
            this.selectedDepartmentName(this.deptid);
          }
        });
    });
  }

  filterShiftMasterdata: any;
  getAllShift() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');
      return;
    }
    this.shiftAllocatedservices
      .getAllShiftMasterdata(this.selectedEntityId)
      .subscribe((res: any) => {
        this.shiftMaster = res.data;
        this.filterShiftMasterdata = [...this.shiftMaster];
        this.allShiftMasterData = [...res.data];
      });
  }
  filterShift(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.shiftMaster = [...this.allShiftMasterData];
      return;
    }
    if (!this.allShiftMasterData || !Array.isArray(this.allShiftMasterData)) {
      console.error('allShiftMasterData is not properly initialized');
      return;
    }
    this.shiftMaster = this.allShiftMasterData.filter((item: any) =>
      item.shift_name?.toLowerCase().includes(searchValue)
    );
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

  filterEmployeeNameRecord: any;
  selectedDepartmentName(deptId: any) {
    if (!deptId) {
      console.log('No department ID selected, falling back to default.');
      deptId = this.deptid;
    }
    this.departmentId = this.employeeName.filter(
      (item: any) => item.dept_id === deptId
    );
    this.dept_id = deptId;
    if (this.departmentId.length === 0) {
      console.log('No employees found in the selected department.');
      this.employeeNameData = [
        {
          first_name: 'No',
          last_name: 'Employees Available',
          employee_id: null,
        },
      ];
    } else {
      this.employeeNameData = this.departmentId.map((employee: any) => ({
        first_name: employee.first_name,
        last_name: employee.last_name,
        employee_id: employee.employee_id,
      }));
    }
    this.filterEmployeeNameRecord = [...this.employeeNameData];
    this.checkIfAllSelected();
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
  selectAllEmployee(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeeNameData.map(
        (emp: any) => emp.employee_id
      );
      this.shiftAllocated.patchValue({ employee_id: allEmployeeIds });
    } else {
      this.shiftAllocated.patchValue({ employee_id: [] });
    }
  }
  checkIfAllSelected() {
    const selectedEmployees =
      this.shiftAllocated.get('employee_id')?.value || [];
    this.isAllSelect =
      selectedEmployees.length === this.employeeNameData.length;
  }
  Onsubmit() {
    this.shiftAllocated.get('entity_id')?.setValue(this.selectedEntityId);
    this.shiftAllocatedservices
      .CreateShiftAllocationData(this.shiftAllocated.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Data Saved Successfully');
          this.router.navigate(['/master/hrms/shift-allocation']);
        },
        (err: any) => {
          const errorMessage = err?.error?.message || 'Error saving data';
          this.toaster.error(errorMessage);
        }
      );
  }
  onUpdate() {
    if (!this.id) {
      this.toaster.error('Invalid ID! Update failed.');
      return;
    }
    this.shiftAllocated.get('entity_id')?.setValue(this.selectedEntityId);
    this.shiftAllocatedservices
      .ShiftAllocationUpdateTheRecord(this.id, this.shiftAllocated.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Data Updated Successfully');
          this.router.navigate(['/master/hrms/shift-allocation']);
        },
        (error: any) => {
          console.error('Update Error:', error);
          this.toaster.error('Update failed. Please try again.');
        }
      );
  }
}
