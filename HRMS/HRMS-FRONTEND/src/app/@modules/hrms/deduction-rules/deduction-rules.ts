import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';

@Component({
  selector: 'app-deduction-rules',
  templateUrl: './deduction-rules.html',
  styleUrls: ['./deduction-rules.scss'],
})

export class DeductionRules {
  loading = false;
  deductionForm!: FormGroup;
  selectedEntityId: number;
  shiftMaster: any;
  Deduction_type:any = ["IN", "OUT"]
  completed_shift_hr:any = ["YES", "NO"]
    mode: 'create' | 'edit' | 'view' = 'create';
  timeReadonly = false;
    id?: number | string;
  private sub?: Subscription;
  constructor(private fb: FormBuilder,
    private hrmsService: HrServiceService,
     private route: ActivatedRoute,
     private toster: ToastrService,
    private shiftAllocatedservices: ShiftAllocationService,
    private router: Router, private toaser: ToastrService,) { }
  ngOnInit(): void {
   this.deductionForm = this.fb.group({
     shift_id: ['', Validators.required],
     deduction_type: ['', Validators.required],
     from_time: ['', Validators.required],   
     to_time: [''],     
     days_rebate: [0, [Validators.required, Validators.min(0)]],
     deduction_rule_name: [''],
     remarks: [''],
     completed_shift_hr  :[''],
     deduction_action: ['', Validators.required],
});
      this.route.queryParams.subscribe(params => {
      this.mode = (params['mode'] as any) || 'create';
      this.id = params['id'];
      if (this.mode === 'edit' || this.mode === 'view') {
        if (!this.id) {
          this.toster.error('ID missing for edit/view mode');
          this.router.navigate(['/master/hrms/deduction-rule-list']);
          return;
        }
        this.loadDeductionRule(this.id);
      }

      if (this.mode === 'view') {
        this.deductionForm.disable(); // make form read-only
      }
    });
    this.getAllShift()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
    loadDeductionRule(id: number | string) {
    this.loading = true;
    this.hrmsService.getDeductionRuleById(id).pipe(finalize(() => (this.loading = false))).subscribe({next: (res: any) => {
          const data = res.data || res; 
          this.deductionForm.patchValue({
            shift_id: data.shift_id ?? data.shift?.id ?? '',
            deduction_type: data.deduction_type ?? '',
            from_time:data.from_time ?? '',
            to_time:data.to_time ?? '',
            days_rebate: data.days_rebate ?? 0,
            deduction_rule_name: data.deduction_rule_name ?? '',
            remarks: data.remarks ?? '',
            deduction_action: data.deduction_action ?? ''
          });
        },
        error: (err) => {
          console.error('Error loading deduction rule:', err);
          this.toster.error('Unable to load record');
          this.router.navigate(['/master/hrms/deduction-rule-list']);
        }
      });
  }


submit() {
  if (this.deductionForm.invalid) {
    this.deductionForm.markAllAsTouched();
    return;
  }

  const raw = this.deductionForm.value;
   let entity = localStorage.getItem('selectedEntityId');

  const payload = { ...raw, entity_id:entity };

  this.loading = true;

   console.log(payload)
  if (this.mode === 'edit' && this.id) {
    this.hrmsService.updateDeductionRule(this.id, payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.toaser.success(res?.message || 'Deduction rule updated successfully');
          this.router.navigate(['/master/hrms/deduction-rule-list']);
        },
        error: (err: any) => {
          const msg = err?.error?.message || 'Server error: Unable to update';
          this.toaser.error(msg);
        }
      });
    return;
  }


  this.hrmsService.deduction_rule_create(payload)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res: any) => {
        this.toaser.success(res?.message || 'Deduction rule created successfully');
        this.router.navigate(['/master/hrms/deduction-rule-list']);
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Server error: Unable to create';
        this.toaser.error(msg);
      }
    });
}

  getAllShift() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');

    }
    this.shiftAllocatedservices.getAllShiftMasterdata(this.selectedEntityId).subscribe((res: any) => {
      this.shiftMaster = res.data;
    });
  }
  reset() {
    this.deductionForm.reset({
      deduction_type: '',
      days_rebate: 0,
      deduction_rules_name: '',
      remark: '',
      deduction_action: ''
    });
  }

}