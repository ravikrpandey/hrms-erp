import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-create-travel-budget',
  templateUrl: './create-travel-budget.component.html',
  styleUrls: ['./create-travel-budget.component.scss'],
})
export class CreateTravelBudgetComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  travelData: any[] = [];
  gradeData: any[] = [];

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  conveyanceData: any = {
    id: null,
    name: '',
    type: '',
    parentId: null,
    children: [],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConfigurationalmasterService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      travel_type_id: [null],
      travel_conveyance_ids: [null],
      travel_grade_ids: [null],
      budget_limit: [null],
      remark: [null],
      local_max_limit: [null],
      other_towns: [null],
      daily_allowance: [null],
      domesticBudgetLimits: this.fb.array([]),
      localBudgetLimits: this.fb.array([]),
    });

    this.form.get('travel_type_id')?.valueChanges.subscribe((value) => {
      if (value) {
        const travel = this.travelData.find((item) => item.id === value);
        this.conveyanceData = travel ? travel : [];
        // If travel type is 'local', reset localBudgetLimits as FormArray
        if (travel && travel.name === 'Local') {
          const conveyanceIds =
            this.form.get('travel_conveyance_ids')?.value || [];
          const gradeIds = this.form.get('travel_grade_ids')?.value || [];
          const limitsArray = this.fb.array(
            conveyanceIds.map((id: number) => {
              const conveyance = this.conveyanceData.children.find(
                (item: any) => item.id === id
              );
              return this.fb.group({
                travel_conveyance_id: [id],
                conveyanceName: [conveyance ? conveyance.name : ''],
                gradeIds: [Array.isArray(gradeIds) ? gradeIds.map(Number) : []],
                budgetLimit: [null],
                remarks: [''],
              });
            })
          );
          this.form.setControl('localBudgetLimits', limitsArray);
          this.form.setControl('domesticBudgetLimits', this.fb.array([]));
        } else if (travel && travel.name === 'Domestic') {
          this.form.setControl('localBudgetLimits', this.fb.array([]));
          const fb = this.fb.group({
            budgetLimit: [null],
            state_id: [null],
            city_id: [null],
          });
          this.setValueChanges(fb);
          this.domesticBudgetLimits.push(fb);
        }
      }
    });
    this.form.get('travel_conveyance_ids')?.valueChanges.subscribe((value) => {
      if (value) {
        if (this.conveyanceData && this.conveyanceData.name === 'Local') {
          const gradeIds = this.form.get('travel_grade_ids')?.value || [];
          const limitsArray = this.fb.array(
            value.map((id: number) => {
              const conveyance = this.conveyanceData.children.find(
                (item: any) => item.id === id
              );
              return this.fb.group({
                travel_conveyance_id: [id],
                conveyanceName: [conveyance ? conveyance.name : ''],
                gradeIds: [Array.isArray(gradeIds) ? gradeIds.map(Number) : []],
                budgetLimit: [null],
                remarks: [''],
              });
            })
          );
          this.form.setControl('localBudgetLimits', limitsArray);
        } else {
          this.form.setControl('localBudgetLimits', this.fb.array([]));
        }
      }
    });
    this.form.get('travel_grade_ids')?.valueChanges.subscribe((value) => {
      if (value) {
        // If travel type is 'local', update gradeIds in localBudgetLimits as FormArray
        const travelTypeId = this.form.get('travel_type_id')?.value;
        const travel = this.travelData.find((item) => item.id === travelTypeId);
        if (travel && travel.name === 'Local') {
          const conveyanceIds =
            this.form.get('travel_conveyance_ids')?.value || [];
          const limitsArray = this.fb.array(
            conveyanceIds.map((id: number) => {
              const conveyance = this.conveyanceData.children.find(
                (item: any) => item.id === id
              );
              return this.fb.group({
                travel_conveyance_id: [id],
                conveyanceName: [conveyance ? conveyance.name : ''],
                gradeIds: [Array.isArray(value) ? value.map(Number) : []],
                budgetLimit: [null],
                remarks: [''],
              });
            })
          );
          this.form.setControl('localBudgetLimits', limitsArray);
        } else {
          this.form.setControl('localBudgetLimits', this.fb.array([]));
        }
      }
    });
    this.getTravelData();
    this.getGradeData();
    this.getAllCountry();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
      }
      if (this.id) {
        this.loadData();
      }
    });
  }

  setValueChanges(formGroup: FormGroup): void {
    formGroup.get('state_id')?.valueChanges.subscribe((stateId) => {
      if (stateId) {
        this.getAllCity(stateId);
      } else {
        this.cityList = [];
      }
    });
  }

  get localBudgetLimits(): FormArray {
    return this.form.get('localBudgetLimits') as FormArray;
  }

  get domesticBudgetLimits(): FormArray {
    return this.form.get('domesticBudgetLimits') as FormArray;
  }

  addDomesticBudgetLimit(): void {
    const fb = this.fb.group({
      budgetLimit: [null],
      state_id: [null],
      city_id: [null],
    });
    this.domesticBudgetLimits.push(fb);
    this.setValueChanges(fb);
  }

  removeDomesticBudgetLimit(index: number): void {
    this.domesticBudgetLimits.removeAt(index);
  }

  getTravelData() {
    this.service.getAllTravelType('travel').subscribe((data: any) => {
      this.travelData = data.data;
    });
  }

  getGradeData() {
    this.service.getAllTravelType('grade').subscribe((data: any) => {
      this.gradeData = data.data;
    });
  }

  loadData(): void {
    this.service.getTravelBudgetById(this.id).subscribe(
      (data: any) => {
        if (data) {
          this.form.patchValue({
            travel_type_id: data.travel_type_id,
            budget_limit: data.budget_limit,
            remark: data.remark,
            local_max_limit: data.local_max_limit,
            other_towns: data.other_towns,
            daily_allowance: data.daily_allowance,
          });
          // travel_conveyance_ids: data.travel_conveyance_ids,
          // travel_grade_ids: data.travel_grade_ids,
          let gradeIds: any = [];
          let conveyanceIds: any = [];
          if (data.localBudgetLimits && data.localBudgetLimits.length > 0) {
            const localLimits = this.fb.array(
              data.localBudgetLimits.map((limit: any) => {
                gradeIds = limit.gradeIds || [];
                conveyanceIds.push(limit.travel_conveyance_id);
                return this.fb.group({
                  id: [limit.id],
                  travel_conveyance_id: [limit.travel_conveyance_id],
                  conveyanceName: [limit.conveyanceType.name || ''],
                  budgetLimit: [limit.budgetLimit],
                  remarks: [limit.remarks],
                });
              })
            );

            this.form.patchValue({
              travel_conveyance_ids: conveyanceIds,
              travel_grade_ids: gradeIds,
            });
            this.form.setControl('localBudgetLimits', localLimits);
          }

          if (
            data.domesticBudgetLimits &&
            data.domesticBudgetLimits.length > 0
          ) {
            const domesticLimits = this.fb.array(
              data.domesticBudgetLimits.map((limit: any) => {
                if (
                  limit.city &&
                  !this.cityList.some((c) => c.city_id === limit.city.city_id)
                ) {
                  this.cityList.push(limit.city);
                }
                gradeIds = limit.travel_grade_ids || [];
                conveyanceIds = limit.travel_conveyance_ids || [];
                return this.fb.group({
                  id: [limit.id],
                  budgetLimit: [limit.budgetLimit],
                  state_id: [limit.state_id],
                  city_id: [limit.city_id],
                });
              })
            );
            this.form.patchValue({
              travel_conveyance_ids: conveyanceIds,
              travel_grade_ids: gradeIds,
            });
            this.form.setControl('domesticBudgetLimits', domesticLimits);
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching Travel Type:', error);
        this.toast.error('Failed to load Travel Type details');
      }
    );
  }

  onSubmit(): void {
    console.log('Form Value:', this.form.value);

    if (this.form.valid) {
      if (this.mode === 'edit') {
        this.form.value.id = this.id;
      }
      this.service.addTravelBudget(this.form.value).subscribe(
        (response) => {
          this.router.navigate([
            'master/configurational-master/travel-master/budget-limit',
          ]);
          this.toast.success('Travel Budget added successfully');

          this.form.reset();
        },
        (error) => {
          this.form.reset();
          console.error('Error adding Travel Budget:', error);
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      if (res) {
        this.countryList = res.data;
        const india = this.countryList.find(
          (country) => country.countryss_name === 'India'
        );
        if (india) {
          this.getAllState(india.countryss_id);
        }
      }
    });
  }

  getAllState(countryId: any) {
    this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
      if (res && res?.data) {
        this.stateList = res?.data;
      }
    });
  }

  getAllCity(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const existingCities = this.cityList || [];
          const newCities = res.data;

          // ✅ Combine and ensure unique by city_id
          const combined = [...existingCities, ...newCities];
          this.cityList = combined.filter(
            (city, index, self) =>
              city.city_id &&
              index === self.findIndex((c) => c.city_id === city.city_id)
          );
        }
      },
      error: (err) => {
        console.error('❌ Error fetching cities:', err);
      },
    });
  }
}
