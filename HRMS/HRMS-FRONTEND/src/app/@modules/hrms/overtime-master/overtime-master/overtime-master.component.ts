import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { OvertimeMasterService } from 'src/app/@shared/services/overtime-master.service';

@Component({
  selector: 'app-overtime-master',
  templateUrl: './overtime-master.component.html',
  styleUrls: ['./overtime-master.component.scss'],
})
export class OvertimeMasterComponent implements OnInit, OnDestroy {
  overTime!: FormGroup;
  entity_id!: number;
  overTimedata: any;

  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private overtimeSvc: OvertimeMasterService
  ) {}


  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.overTime = this.fb.group({
      entity_id: [this.entity_id],
      overtimeData: this.fb.array([]),
    });
    this.getOverTimeMaster();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  get overtimeData(): FormArray {
    return this.overTime.get('overtimeData') as FormArray;
  }

  // private minCtrl(i: number): AbstractControl {
  //   return (this.overtimeData.at(i) as FormGroup).get('from_range')!;
  // }

  addRange(): void {
    const last = this.overtimeData.at(this.overtimeData.length - 1);

    
    if (last) {
      const empty = Object.values(last.value).every(
        (v) => v === null || v === '' || v === 0
      );
      if (empty) {
        this.toast.warning(
          'Please fill the current row before adding a new one.'
        );
        return;
      }
    }

    const group = this.fb.group({
      from_range: [null, [Validators.required, Validators.min(0)]],
      to_range: [null, [Validators.required, Validators.min(0)]],
      rate: [null, [Validators.required, Validators.min(1)]],
    });

    this.overtimeData.push(group);
    // this.attachMinTimeListener(this.overtimeData.length - 1);
    // this.revalidateAllMinTimes();
  }

  removeRange(index: number): void {
    if (this.overtimeData.length === 1) return; 

    this.overtimeData.removeAt(index);
    // this.revalidateAllMinTimes(); 
  }

  // private attachMinTimeListener(i: number): void {
  //   this.minCtrl(i)
  //     .valueChanges.pipe(debounceTime(250), takeUntil(this.destroy$))
  //     .subscribe(() => this.validateSequentialMinTimes(i));
  // }

  // private revalidateAllMinTimes(): void {
  //   for (let i = 0; i < this.overtimeData.length; i++) {
  //     this.validateSequentialMinTimes(i);
  //   }
  // }
  // private validateSequentialMinTimes(i: number): void {
  //   const curCtrl = this.minCtrl(i);
  //   const curVal = this.numOrNull(curCtrl.value);

  //   if (curVal === null) {
  //     this.setCustomError(curCtrl, false);
  //     return;
  //   }

    
  //   if (i > 0) {
  //     const prevVal = this.numOrNull(this.minCtrl(i - 1).value);
  //     if (prevVal !== null && curVal <= prevVal) {
  //       this.setCustomError(curCtrl, true);
  //       return;
  //     }
  //   }

    
  //   if (i < this.overtimeData.length - 1) {
  //     const nextCtrl = this.minCtrl(i + 1);
  //     const nextVal = this.numOrNull(nextCtrl.value);
  //     if (nextVal !== null && nextVal <= curVal) {
  //       this.setCustomError(nextCtrl, true);
  //     } else {
  //       this.setCustomError(nextCtrl, false);
  //     }
  //   }

   
  //   this.setCustomError(curCtrl, false);
  // }

  
  // private numOrNull(val: any): number | null {
  //   const num = +val;
  //   return val === null || val === '' || isNaN(num) ? null : num;
  // }

  // private setCustomError(ctrl: AbstractControl, has: boolean): void {
  //   const errors = { ...(ctrl.errors || {}) };

  //   if (has) {
  //     if (!errors['smallerThanPrevious']) {
  //       errors['smallerThanPrevious'] = true;
  //       ctrl.setErrors(errors);
  //       this.toast.error(
  //         '“Min Time” must be greater than the previous row’s value'
  //       );
  //     }
  //   } else if (errors['smallerThanPrevious']) {
  //     delete errors['smallerThanPrevious'];
  //     ctrl.setErrors(Object.keys(errors).length ? errors : null);
  //   }
  // }

  // /** called from `(blur)` ⇒ finally blank the invalid field */
  // onMinTimeBlur(i: number): void {
  //   const ctrl = this.minCtrl(i);
  //   if (ctrl.errors?.['smallerThanPrevious']) {
  //     ctrl.setValue(null, { emitEvent: false });
  //   }
  // }

  onSubmit(): void {
  if (this.overTime.invalid) {
    this.toast.warning('Please fill all the details!');
    return;
  }

  const payload = this.overTime.value;
  const isUpdate = !!this.overTimedata?.length;

  const req$ = isUpdate
    ? this.overtimeSvc.updateOverTimeMaster(payload, this.entity_id)
    : this.overtimeSvc.saveOverTimeMaster(payload);

  req$.subscribe({
    next: () => {
      this.toast.success(
        isUpdate
          ? 'Overtime data updated successfully!'
          : 'Overtime data saved successfully!'
      );
      this.getOverTimeMaster();
      this.router.navigate(['/master/hrms/hrms-dashboard/dashboard']);
    },
    error: (err) => {
      console.error(err);
      this.toast.warning('An error occurred while saving overtime data.');
    },
  });
}

  private getOverTimeMaster(): void {
    this.overtimeSvc
      .getOverTimeMaster(this.entity_id)
      .subscribe((res: any) => {
        this.overTimedata = res.data;
        this.overtimeData.clear();

        if (this.overTimedata?.length) {
          this.overTimedata.forEach((row: any, idx: number) => {
            this.overtimeData.push(
              this.fb.group({
                from_range: [
                  row.from_range,
                  [Validators.required, Validators.min(0)],
                ],
                to_range: [
                  row.to_range,
                  [Validators.required, Validators.min(0)],
                ],
                rate: [row.rate, [Validators.required, Validators.min(1)]],
              })
            );
            // this.attachMinTimeListener(idx);
          });
        } else {
          this.addRange();
        }

        // this.revalidateAllMinTimes();
      });
  }

  back(): void {
    this.router.navigate(['/master/hrms/hrms-dashboard/dashboard']);
  }
}
