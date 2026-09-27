import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-employee-map-with-level-create',
  templateUrl: './employee-map-with-level-create.component.html',
  styleUrls: ['./employee-map-with-level-create.component.scss']
})
export class EmployeeMapWithLevelCreateComponent {
  getAllEmpData: any[] = [];
  employeeFilterCtrl: FormControl = new FormControl();
  filteredEmployees: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  form: FormGroup;
  submitted = false;
  levels: any[] = [];
  getUserRole: any;
  getAllData: any;
  userRole: any;
  id: any;
  _allEmpData: any;
  mode: string;
  usedLevels: number[] = [];
  viewMode: any;

  constructor(
    private fb: FormBuilder,
    private service: ConfigurationalmasterService,
    private toaster: ToastrService,
    private location: Location,
    private route: Router,
    private router: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      level: [null, Validators.required],
      employee_ids: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.getLevels();

    this.service.getEmployeeListForMapLevel().subscribe((res: any) => {
      
      this.getAllData = res.employees.map((row: any) => {
        row.full_name = row.first_name + " " + row.last_name + " [" + row.employee_code + "]";
        row.employee_id = Number(row.employee_id);
        this._allEmpData = res.employees;
        return row;
      });
console.log('wwwwwwwwwwwwwwwww',this.getAllData)
      this.usedLevels = res.usedLevels || [];
      this.router.queryParams.subscribe((params: any) => {
        this.id = params['id'] || null;
        this.viewMode = params.mode;
        this.mode = this.id ? 'edit' : 'create';

        if (this.id) this.loadRecordForEdit(this.id);
      });
    });
    this.employeeFilterCtrl.valueChanges.subscribe(() => this.filterEmployees());

  }

  getLevels() {
    const entityId = localStorage.getItem('selectedEntityId');
    this.service.getLevelType(entityId).subscribe((res: any) => {
      this.levels = res.data || [];
    });
  }

  getLevelName(levelId: number): string {
    const level = this.levels.find((lvl: any) => lvl.id === levelId);
    return level ? level.level_type : `Level ${levelId}`;
  }


  filterEmployees() {
    let search = this.employeeFilterCtrl.value;
    if (!search) {
      this.getAllData = [...this.getAllData];
      return;
    }
    search = search.toLowerCase();
    this.getAllData = this.getAllData.filter((emp: any) =>
      emp.full_name.toLowerCase().includes(search)
    );
  }



  loadRecordForEdit(id: any) {
    this.service.get_EmpMappingLevelById(id).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const record = res.data;
          const employeeIds = (record.employee_ids || []).map((id: any) => Number(id));
          const missingEmps = employeeIds.filter(
            (id: number) => !this.getAllData.some((emp: any) => emp.employee_id === id)
          );

          if (missingEmps.length > 0) {
            const extraEmps = missingEmps.map((id: number) => {
              const emp = this._allEmpData.find((emp: any) => emp.employee_id === id);

              if (emp) {
                return {
                  employee_id: id,
                  full_name: emp.first_name + " " + emp.last_name
                };
              } else {
                return {
                  employee_id: id,
                  full_name: `Employee ${id}`
                };
              }
            });
            this.getAllData = [...this.getAllData, ...extraEmps];
          }

          this.form.patchValue({
            level: record.level,
            employee_ids: employeeIds
          });

          const employeeNames = employeeIds.map((id: number) => {
            const emp = this.getAllData.find((emp: any) => emp.employee_id === id);
            return emp ? emp.full_name : `Employee ${id}`;
          });

          this.form.patchValue({
            employee_names: employeeNames
          });
        }
      },
      error: (err) => {
        console.error("Error loading record:", err);
        this.toaster.error("Failed to load record details");
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.toaster.error('Please fill all required fields');
      return;
    }

    const payload = {
      level: this.form.value.level,
      employee_ids: this.form.value.employee_ids
    };

    if (this.mode === 'edit' && this.id) {
      this.service.updateLevelEmployee(this.id, payload).subscribe({
        next: () => {
          this.toaster.success('Record updated successfully');
          this.location.back();
        },
        error: (err: any) => {
          console.error('Error updating record:', err);
          this.toaster.error('Something went wrong while updating');
        }
      });
    } else {
      this.service.createLevelEmployee(payload).subscribe({
        next: () => {
          this.toaster.success('Record created successfully');
          this.location.back();
        },
        error: (err: any) => {
          console.error('Error creating record:', err);
          this.toaster.error('Something went wrong while creating');
        }
      });
    }
  }


  goBack() {
    this.location.back();
  }

}
