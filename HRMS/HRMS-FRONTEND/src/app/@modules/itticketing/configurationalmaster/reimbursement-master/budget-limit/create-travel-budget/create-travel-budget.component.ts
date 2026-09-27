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
  cityLists: any[][] = [];
  presentCityList: any;
  gradeData: any[] = [];
  presentStateData: any;
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
  entity_id: string | null;
  stateVar2: any;

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
          this.domesticBudgetLimits.push(fb);
          this.cityLists.push([]);
          this.setValueChanges(fb, this.domesticBudgetLimits.length - 1);

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
    this.getAllState();
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getGradeData();
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.mode === 'view') {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
      if (this.id) {
        this.loadData();
      }
    });
  }

  setValueChanges(formGroup: FormGroup, index: number): void {
    formGroup.get('state_id')?.valueChanges.subscribe((stateId) => {
      if (stateId) {
        this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
          if (res && res.data) {
            this.cityLists[index] = res.data; // only update cities for this row
          }
        });
      } else {
        this.cityLists[index] = [];
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
    this.cityLists.push([]); // initialize empty city list for this row
    this.setValueChanges(fb, this.domesticBudgetLimits.length - 1);
    if (this.mode === 'view') {
      fb.disable({ emitEvent: false });
    }
  }


  removeDomesticBudgetLimit(index: number): void {
    this.domesticBudgetLimits.removeAt(index);
    this.cityLists.splice(index, 1);
  }


  getTravelData() {
    this.service.getAllTravelType('travel').subscribe((data: any) => {
      this.travelData = data.data;
    });
  }

  getGradeData() {
    console.log("entityIDDDDDD", this.entity_id);

    this._empRegistration.get_all_active_grade(this.entity_id).subscribe((data: any) => {
      this.gradeData = data.data;
      console.log("garde Data---->", this.gradeData);

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

        let gradeIds: any = [];
        let conveyanceIds: any = [];

        // Handle localBudgetLimits
        if (data.localBudgetLimits && data.localBudgetLimits.length > 0) {
          const localLimits = this.fb.array(
            data.localBudgetLimits.map((limit: any) => {
              gradeIds = limit.gradeIds || [];
              conveyanceIds.push(limit.travel_conveyance_id);
              return this.fb.group({
                id: [limit.id],
                travel_conveyance_id: [limit.travel_conveyance_id],
                conveyanceName: [limit.conveyanceType?.name || ''],
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

        // Handle domesticBudgetLimits
        if (data.domesticBudgetLimits && data.domesticBudgetLimits.length > 0) {
          const domesticLimits = this.fb.array(
            data.domesticBudgetLimits.map((limit: any, index: number) => {
              const row = this.fb.group({
                id: [limit.id],
                budgetLimit: [limit.budgetLimit],
                state_id: [limit.state_id],
                city_id: [null], // set later after cities load
              });

              // Load city list for this state before setting city_id
              if (limit.state_id) {
                this._empRegistration.getCityByState(limit.state_id).subscribe((res: any) => {
                  if (res && res.data) {
                    this.cityLists[index] = res.data;
                    // Patch city_id only after cities are available
                    row.get('city_id')?.setValue(limit.city_id);
                  }
                });
              } else {
                this.cityLists[index] = [];
              }

              // Keep listening for state changes
              this.setValueChanges(row, index);
              return row;
            })
          );

          if (this.mode === 'view') {
            domesticLimits.disable({ emitEvent: false });
          }

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

  getAllState() {
    this._empRegistration.getAllstate().subscribe((res: any) => {
      if (res && res?.data) {
        this.presentStateData = res?.data;
      }
    });
  }

  getAllCity(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
      if (res && res?.data) {
        this.cityList = res?.data;
      }
    });
  }
  onStateSelected(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
      if (res && res.data) {
        this.presentCityList = res.data;
      }
    });
  }
  stateFilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.presentStateData = [...this.stateVar2];
    } else {
      this.presentStateData = this.stateVar2.filter((item: any) =>
        item?.states_name?.toLowerCase().includes(searchValue)
      );
    }
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
            'master/configurational-master/reimbursement-master/budget-limit',
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
  back(): void {
    this.router.navigate(
      [
        'master/configurational-master/reimbursement-master/budget-limit',
      ]
    );
  }


}
