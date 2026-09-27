import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';

@Component({
  selector: 'app-comp-off-form',
  templateUrl: './comp-off-form.component.html',
  styleUrls: ['./comp-off-form.component.scss'],
})
export class CompOffFormComponent {
  compForm: FormGroup;
  employeedata: any;
  isAllSelect: boolean = false;
  filterEmployeedata: any;
  entity_id: any;
  createdby: any;
  id: any;
  compdata: any;
  mode: any;
  constructor(
    private comservice: CompServiceService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.compForm = this.fb.group(
      {
        employee_id: ['', Validators.required],
        from_date: ['', Validators.required],
        to_date: ['', Validators.required],
        reason: ['', Validators.required],
        entity_id: [''],
        created_by: [''],
      },
      { validators: this.dateRangeValidator }
    );
  }

  ngOnInit() {
    this.getEmployeeBasedOnEntity();
    this.compForm.get('from_date')?.valueChanges.subscribe((fromDate) => {
      const toDate = this.compForm.get('to_date')?.value;
      if (toDate && new Date(toDate) < new Date(fromDate)) {
        this.compForm.get('to_date')?.setValue(null);
      }
    });
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.createdby = localStorage.getItem('EmpMainId');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = +params['id'];
      this.mode = params['mode'];
      if (this.id) {
        this.patchCompRecord();
      }
    });
  }

  patchCompRecord() {
    this.comservice.getCompRecordById(this.id).subscribe((res: any) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        this.compdata = res.data[0];
        let empIds = this.compdata.employee_id;
        if (typeof empIds === 'string') {
          empIds = empIds.split(',').map((id: string) => Number(id.trim()));
        }
        this.compForm.patchValue({
          employee_id: empIds,
          from_date: this.compdata.from_date,
          to_date: this.compdata.to_date,
          reason: this.compdata.reason,
        });
      }
    });
  }

  getEmployeeBasedOnEntity() {
    const primary_entity_id = localStorage.getItem('selectedEntityId');
    this.comservice
      .getEmployeeBasedOnEntity(primary_entity_id)
      .subscribe((res: any) => {
        this.employeedata = res.data;
        this.filterEmployeedata = [...this.employeedata];
      });
  }

  selectAllEmployee(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeedata.map(
        (emp: any) => emp.employee_id
      );
      this.compForm.patchValue({ employee_id: allEmployeeIds });
    } else {
      this.compForm.patchValue({ employee_id: [] });
    }
  }

  dateRangeValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const fromDate = formGroup.get('from_date')?.value;
    const toDate = formGroup.get('to_date')?.value;

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  toDateFilter = (date: any | null): boolean => {
    const fromDate = this.compForm.get('from_date')?.value;
    if (!fromDate) return true;
    return date >= new Date(fromDate);
  };

  onSubmit() {
    if (this.compForm.invalid) {
      this.compForm.markAllAsTouched();
      this.toaster.error('Please fill out all required fields correctly.');
      return;
    }

    this.compForm.get('entity_id')?.setValue(this.entity_id);
    this.compForm.get('created_by')?.setValue(this.createdby);

    if (this.mode == 'edit') {
      debugger
      this.comservice.updateCompOff(this.id, this.compForm.value).subscribe(
        (res: any) => {
          this.toaster.success('Record updated successfully');
          this.route.navigate(['/master/comp-off/assign-comp-off']);
          this.compForm.reset();
        },
        (err) => {
          if (err.status === 400 && err.error?.error) {
            this.toaster.error(err.error.error);
          } else {
            this.toaster.error('Error updating record. Please try again.');
          }
          console.error(err);
        }
      );
    } else {
      this.comservice.saveRecordAssignCompOff(this.compForm.value).subscribe(
        (res: any) => {
          this.toaster.success('Record saved successfully');
          this.route.navigate(['/master/comp-off/assign-comp-off']);
          this.compForm.reset();
        },
        (err) => {
          if (err.status === 400 && err.error?.error) {
            this.toaster.error(err.error.error);
          } else {
            this.toaster.error('Error saving record. Please try again.');
          }
          console.error(err);
        }
      );
    }
  }

  
}
