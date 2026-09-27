import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectFilterComponent } from 'mat-select-filter';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { PT_STATES } from 'src/app/constants/pt-states';

@Component({
  selector: 'app-pt-create',
  templateUrl: './pt-create.component.html',
  styleUrls: ['./pt-create.component.scss'],
})
export class PtCreateComponent {
  @ViewChild('stateFilter') stateFilter!: MatSelectFilterComponent;
  states = PT_STATES;
  ptForm!: FormGroup;
  selectedState: any = null;
  entityData: any;
  entity_id: string | null;
  filteredStates: { name: string; ptApplicable: boolean }[];
  ptId: any;
  ptData: any;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private toaster: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    // this.getEntityStateDataById();

    this.ptForm = this.fb.group({
      stateName: ['', Validators.required],
      slabs: this.fb.array([]),
    });

    this.addSlab(); // show one row by default
    this.filteredStates = [...this.states];

    this.activeroute.queryParams.subscribe((params: any) => {
      this.ptId = params.pt_id;
    });
    if (this.ptId != undefined || null) {
      this.getPtById(this.ptId);
    }
  }

  get slabs(): FormArray {
    return this.ptForm.get('slabs') as FormArray;
  }

  removeSlab(index: number): void {
    if (this.slabs.length > 1) {
      this.slabs.removeAt(index);
    }
  }

  createSlab(): FormGroup {
    return this.fb.group({
      fromAmount: ['', Validators.required],
      toAmount: ['', Validators.required], // required by default
      noUpperLimit: [false],
      ptAmount: ['', Validators.required],
      gender: ['ALL'],
      month: ['ALL'],
    });
  }

  toggleNoLimit(index: number) {
    const slab = this.slabs.at(index);

    if (slab.get('noUpperLimit')?.value) {
      slab.get('toAmount')?.clearValidators();
      slab.get('toAmount')?.setValue(null);
      slab.get('toAmount')?.disable();
    } else {
      slab.get('toAmount')?.enable();
      slab.get('toAmount')?.setValidators([Validators.required]);
    }

    slab.get('toAmount')?.updateValueAndValidity();
  }

  addSlab() {
    if (this.slabs.invalid) {
      this.slabs.markAllAsTouched();
      return;
    }
    this.slabs.push(this.createSlab());
  }

  //////////////////////
  // getEntityStateDataById() {
  //   this.payrollService.getEntityStateDataById().subscribe((res: any) => {
  //     if (res && res.data) {
  //       this.entityData = res.data;
  //       console.log(this.entityData, 'kkkkkkkkkkkkk');
  //     }
  //   });
  // }

  onStateChange(stateName: string) {
    this.selectedState = this.states.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );
    this.ptForm.patchValue({ stateName });
    this.slabs.clear();
    this.addSlab();
  }

  onFilterReset(filtered: any[]) {
    if (filtered.length === 0) {
      this.filteredStates = [...this.states];
    } else {
      this.filteredStates = filtered;
    }
  }
  onDropdownOpened(opened: boolean) {
    if (!opened && this.stateFilter?.searchForm) {
      // Clear search input
      this.stateFilter.searchForm.reset();

      // Reset list to original
      this.filteredStates = [...this.states];
    }
  }
  back() {
    window.history.back();
  }
 submitForm() {
  if (this.ptForm.invalid) {
    this.ptForm.markAllAsTouched();
    return;
  }

  const payload = {
    ...this.ptForm.value,
    slabs: this.ptForm.value.slabs.map((slab: any) => ({
      ...slab,
      toAmount: slab.noUpperLimit ? null : slab.toAmount,
    })),
  };

  console.log('Final Payload:', payload);

  // ✅ If ptId exists → Update, else → Create
  if (this.ptId) {
    this.payrollService.updatePtById(this.ptId, payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toaster.success(res.message);
          this.route.navigateByUrl('master/payroll/statutory-components/pt');
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
    this.payrollService.createPt(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toaster.success(res.message);
          this.route.navigateByUrl('master/payroll/statutory-components/pt');
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

  getPtById(id: any) {
    this.payrollService.getPtById(id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.ptData = res.data;

          // find state from PT_STATES to check applicability
          this.selectedState = this.states.find(
            (s) => s.name.toLowerCase() === this.ptData.state_name.toLowerCase()
          );

          // patch form
          this.ptForm.patchValue({
            stateName: this.ptData.state_name,
          });

          // clear slabs form array
          this.slabs.clear();

          // only patch slabs if PT is applicable in that state
          if (this.selectedState?.ptApplicable) {
            if (this.ptData.pt_slabs && Array.isArray(this.ptData.pt_slabs)) {
              this.ptData.pt_slabs.forEach((slab: any) => {
                const slabGroup = this.fb.group({
                  fromAmount: [slab.fromAmount, Validators.required],
                  toAmount: [slab.toAmount],
                  noUpperLimit: [slab.noUpperLimit],
                  ptAmount: [slab.ptAmount, Validators.required],
                  gender: [slab.gender || 'ALL'],
                  month: [slab.month || 'ALL'],
                });

                // handle noUpperLimit toggle
                if (slab.noUpperLimit) {
                  slabGroup.get('toAmount')?.clearValidators();
                  slabGroup.get('toAmount')?.disable();
                } else {
                  slabGroup.get('toAmount')?.enable();
                  slabGroup
                    .get('toAmount')
                    ?.setValidators([Validators.required]);
                }

                slabGroup.get('toAmount')?.updateValueAndValidity();

                this.slabs.push(slabGroup);
              });
            } else {
              // if no slabs in db, show one blank row
              this.addSlab();
            }
          } else {
            // If PT not applicable, show warning and reset slabs
            this.toaster.warning(
              `${this.ptData.state_name} does not have Professional Tax applicable.`
            );
            this.slabs.clear();
          }
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }
}
