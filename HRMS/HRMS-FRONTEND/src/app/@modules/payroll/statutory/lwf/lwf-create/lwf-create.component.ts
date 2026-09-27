import { Component, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { LWF_STATES } from 'src/app/constants/lwf-states';
import { MatSelectFilterComponent } from 'mat-select-filter';

@Component({
  selector: 'app-lwf-create',
  templateUrl: './lwf-create.component.html',
  styleUrls: ['./lwf-create.component.scss'],
})
export class LwfCreateComponent {
  lwfForm: FormGroup;
  monthsList: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedState: any = null;
  LWF_STATES = LWF_STATES;
  stateSearch: string = '';
  filteredStates: any[] = [];
  lwfId: any; // if you want disable-pointer logic
  @ViewChild('stateFilter') stateFilter!: MatSelectFilterComponent;
  lwfData: any;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private toaster: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute
  ) {
    this.lwfForm = this.fb.group({
      state: ['', Validators.required],
      employee: this.buildContributionGroup(),
      employer: this.buildContributionGroup(),
      government: this.buildContributionGroup(),
    });
  }
  ngOnInit() {
    this.filteredStates = this.LWF_STATES;
    this.activeroute.queryParams.subscribe((params: any) => {
      this.lwfId = params.lwf_id;
    });
    if (this.lwfId != undefined || null) {
      this.getLwfById(this.lwfId);
    }
     ['employee', 'employer', 'government'].forEach(section => {
    this.lwfForm.get(`${section}.frequency`)?.valueChanges.subscribe((freq) => {
      const control = this.lwfForm.get(`${section}.deductionMonths`);
      if (!control) return;

      // reset field
      control.reset(null, { emitEvent: false });

      // clear old validators
      control.clearValidators();

      // set new validators depending on frequency
      if (freq === 'YEARLY') {
        control.setValidators([
          Validators.required,
          this.exactLengthValidator(1)
        ]);
      } else if (freq === 'HALF_YEARLY') {
        control.setValidators([
          Validators.required,
          this.exactLengthValidator(2)
        ]);
      }
      // MONTHLY → no validators required

      control.updateValueAndValidity();
    });
  });
  }

  exactLengthValidator(requiredLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    if (Array.isArray(value) && value.length !== requiredLength) {
      return { exactLength: { required: requiredLength, actual: value.length } };
    }

    // For yearly (single selection as string), ensure exactly 1
    if (!Array.isArray(value) && requiredLength !== 1) {
      return { exactLength: { required: requiredLength, actual: 1 } };
    }

    return null;
  };
}
  buildContributionGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      value: [null, [Validators.required]],
      frequency: ['', Validators.required],
      deductionMonths: [null],
      isCapped: [false],
      capAmount: [null],
    });
  }

  onDropdownOpened(opened: boolean) {
    if (!opened && this.stateFilter?.searchForm) {
      // clear search input when dropdown closes
      this.stateFilter.searchForm.reset();
      // restore full list
      this.filteredStates = [...this.LWF_STATES];
    }
  }

  onFilterReset(filtered: any[]) {
    // if no match found → reset to full list
    this.filteredStates =
      filtered.length === 0 ? [...this.LWF_STATES] : filtered;
  }

  onStateChange(selectedState: string) {
    this.selectedState = this.LWF_STATES.find(
      (st) => st.name === selectedState
    );
  }

  toggleCapping(section: 'employee' | 'employer' | 'government') {
    const group = this.lwfForm.get(section) as FormGroup;
    if (group.get('isCapped')?.value) {
      group
        .get('capAmount')
        ?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      group.get('capAmount')?.clearValidators();
      group.get('capAmount')?.setValue(null);
    }
    group.get('capAmount')?.updateValueAndValidity();
  }

  hasError(section: string, control: string): boolean {
    const ctrl = (this.lwfForm.get(section) as FormGroup).get(control);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  submitForm() {
    ['employee', 'employer', 'government'].forEach((section) => {
      const group = this.lwfForm.get(section) as FormGroup;
      if (
        group.get('type')?.value === 'PERCENT' &&
        group.get('value')?.value > 100
      ) {
        group.get('value')?.setErrors({ percentExceed: true });
      }
    });

    if (this.lwfForm.invalid) {
      this.lwfForm.markAllAsTouched();
      return;
    }
    const payload = {
      stateName: this.lwfForm.value.state,
      employee: this.lwfForm.value.employee,
      employer: this.lwfForm.value.employer,
      government: this.lwfForm.value.government,
    };

    console.log('Final Payload:', payload);
    if (this.lwfId) {
      this.payrollService.updateLwfById(this.lwfId, payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toaster.success(res.message);
            this.route.navigateByUrl('master/payroll/statutory-components/lwf');
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.toaster.warning(err.error?.message);
          } else if (err.status === 500) {
            this.toaster.error(err.error?.message);
          } else {
            this.toaster.error('Unexpected error occurred!');
          }
        },
      });
    } else {
      this.payrollService.createLwf(payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toaster.success(res.message);
            this.route.navigateByUrl('master/payroll/statutory-components/lwf');
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.toaster.warning(err.error?.message);
          } else if (err.status === 500) {
            this.toaster.error(err.error?.message);
          } else {
            this.toaster.error('Unexpected error occurred!');
          }
        },
      });
    }
  }

  back() {
    window.history.back();
  }

  getLwfById(id: any) {
    this.payrollService.getLwfById(id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.lwfData = res.data;

          // find state from LWF_STATES to check applicability
          this.selectedState = this.LWF_STATES.find(
            (s) =>
              s.name.toLowerCase() === this.lwfData.state_name.toLowerCase()
          );

          // patch form
          this.lwfForm.patchValue({
            state: this.lwfData.state_name,
          });

          // patch contributions if LWF is applicable
          if (this.selectedState?.lwfApplicable) {
            // Employee
            if (this.lwfData.employee) {
              this.lwfForm.get('employee')?.patchValue(this.lwfData.employee);
            }

            // Employer
            if (this.lwfData.employer) {
              this.lwfForm.get('employer')?.patchValue(this.lwfData.employer);
            }

            // Government
            if (this.lwfData.government) {
              this.lwfForm
                .get('government')
                ?.patchValue(this.lwfData.government);
            }
          } else {
            this.toaster.warning(
              `${this.lwfData.state_name} does not have Labour Welfare Fund applicable.`
            );

            // reset contributions
            ['employee', 'employer', 'government'].forEach((section) => {
              const group = this.lwfForm.get(section) as FormGroup;
              group.reset();
            });
          }
        }
      },
      (err) => {
        this.toaster.error(err.error?.message || 'Failed to fetch data!');
      }
    );
  }
}
