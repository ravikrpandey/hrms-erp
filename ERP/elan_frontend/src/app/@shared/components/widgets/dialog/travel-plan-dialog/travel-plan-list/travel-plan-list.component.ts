import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-travel-plan-list',
  templateUrl: './travel-plan-list.component.html',
  styleUrls: ['./travel-plan-list.component.scss'],
})
export class TravelPlanListComponent implements OnInit, OnChanges {
  entity_id: string;
  financialId: string;
  mainId: string;
  form: FormGroup;
  states: any[] = [];
  cities: any[] = [];
  tmPlanCities: any[] = []; // index-based storage of city lists for TM
  lmPlanCities: any[] = []; // index-based storage of city lists for LM
  employees: any[] = [];
  itemFilterCtrl = new FormControl();
  filteredItems: ReplaySubject<any[]> = new ReplaySubject(1);
  planLM: any;
  planTM: any;
  isLoading = false;
  selectedTravelId: any = null;
  @Input() isRM: boolean = false;
  @Input() type: boolean = false;
  @Input() employee_id: number;

  currentMonthType: 'current' | 'next' | 'last' = 'current';

  thisMonth = new Date(); // current month
  isPatching = false;

  // lastMonth = one month before
  lastMonth = new Date();
  noOfLMDeviation = 0;
  noOfTMDeviation = 0;

  get lmPlans(): FormArray<FormGroup> {
    return this.form.get('lmPlans') as FormArray<FormGroup>;
  }

  get tmPlans(): FormArray<FormGroup> {
    return this.form.get('tmPlans') as FormArray<FormGroup>;
  }

  @Output() dialogClose = new EventEmitter<boolean>();

  constructor(
    public travelService: TravelRequestService,
    private config: ConfigurationalmasterService,
    private empService: EmpRegistrationService,
    private toast: ToastrService,
    private _commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.lastMonth.setMonth(this.thisMonth.getMonth() - 1);
    this.mainId = localStorage.getItem('EmpMainId')!;
    this.entity_id = localStorage.getItem('selectedEntityId')!;
    this.financialId = localStorage.getItem('financial_id')!;
    this.getChildEmployee();

    this.form = this.fb.group({
      lmPlans: this.fb.array([]),
      tmPlans: this.fb.array([]),
      employee_id: parseInt(this.mainId),
      type: ['self'],
    });

    this.form.get('employee_id')?.valueChanges.subscribe((value) => {
      if (value !== -1) {
        this.lmPlans.clear();
        this.tmPlans.clear();
        this.getTravelMonthPlan(value);
        this.isRM = true;
      }
    });
    this.form.get('type')?.valueChanges.subscribe((value) => {
      if (value === 'self') {
        this.lmPlans.clear();
        this.tmPlans.clear();
        this.form.get('employee_id')?.setValue(this.mainId);
        this.isRM = false;
      }
    });
  }

  ngOnInit(): void {
    this.getStateByCountry();
    this.getAllCities();
    this.itemFilterCtrl.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      const search = this.itemFilterCtrl.value?.toLowerCase();
      this.searchCities(search);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']?.currentValue) {
    }
  }

  getChildEmployee() {
    this.empService.getChildEmployee(this.mainId).subscribe((res: any) => {
      if (res && res.data) {
        this.employees = res.data;
      }
    });
  }

  getStateByCountry() {
    this.empService.getStateByCountry(101).subscribe((res: any) => {
      this.states = res.data;
    });
  }

  getCityByState(stateId: any) {
    this.empService.getCityByState(stateId).subscribe((res: any) => {
      this.cities = res.data;
    });
  }
  searchCities(searchText: string) {
    this.empService.searchCities(searchText, 10).subscribe((res) => {
      if (res && res.data) {
        // Combine existing cities with new data
        const combinedCities = [...this.cities, ...res.data];
        // Remove duplicates based on city_name
        const uniqueCities = Array.from(
          new Map(combinedCities.map((city) => [city.city_name, city])).values()
        );

        // Sort cities based on searchText
        const sortedCities = uniqueCities.sort((a, b) => {
          const searchLower = searchText ? searchText.toLowerCase().trim() : '';
          const aName = a.city_name.toLowerCase();
          const bName = b.city_name.toLowerCase();

          if (searchLower) {
            // Prioritize cities starting with searchText
            const aStarts = aName.startsWith(searchLower);
            const bStarts = bName.startsWith(searchLower);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // If both start with searchText or neither does, sort alphabetically
            return aName.localeCompare(bName);
          } else {
            // If no searchText, sort alphabetically
            return aName.localeCompare(bName);
          }
        });

        this.filteredItems.next(sortedCities);
        this.cities = sortedCities;
      }
    });
  }

  getMonthYear(date: Date): string {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${monthName} ${year}`;
  }

  getAllCities() {
    this.empService.searchCities('', 5).subscribe((res: any) => {
      this.cities = res.data || [];
      // Combine existing cities with new data and remove duplicates
      const combinedCities = [...this.cities, ...res.data];
      // Remove duplicates based on city_name
      const uniqueCities = Array.from(
        new Map(combinedCities.map((city) => [city.city_name, city])).values()
      );
      this.filteredItems.next(uniqueCities);
      this.getTravelMonthPlan(
        this.employee_id ? this.employee_id : parseInt(this.mainId)
      );
    });
  }

  onDialogClose(event: boolean): void {
    this.dialogClose.emit(event);
  }

  private getTodayDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // yyyy-mm-dd (local)
  }

  private getTodayDay(date: string) {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  }

  createPlanGroup(date: string, day: string): FormGroup {
    const fb = this.fb.group({
      date: [date],
      day: [day],
      plan_state_id: [''],
      plan_city_id: [''],
      actual_state_id: [''],
      actual_city_id: [''],
      status: ['PENDING'],
    });

    return fb;
  }

  patchPlanGroup(plan: any, index: number, type: 'TM' | 'LM'): FormGroup {
    const fb = this.fb.group({
      date: [plan.date],
      day: [this.getTodayDay(plan.date)],
      plan_state_id: [parseInt(plan?.plan_state_id)],
      plan_city_id: [parseInt(plan.plan_city_id)],
      plan_city: [plan?.planCity?.city_name],
      plan_state: [plan?.planCity?.MASTER_STATE?.states_name],
      actual_state_id: [plan?.actual_state_id],
      actual_city_id: [plan.actual_city_id],
      actual_city: [plan?.actualCity?.city_name],
      travel_name: [
        plan?.travelDataPlan?.ESS_TRAVEL_REQUEST?.travel_request_number,
      ],
      travel_id: [plan?.travelDataPlan?.ESS_TRAVEL_REQUEST?.id],
      holiday: [plan?.holiday],
    });
    if (plan.plan_state_id) {
      this.empService
        .getCityByState(plan.plan_state_id)
        .subscribe((res: any) => {
          if (type === 'TM') {
            this.tmPlanCities[index] = res.data;
          } else {
            this.lmPlanCities[index] = res.data;
          }
        });
    }
    this.setValueChanges(fb, index, type);

    return fb;
  }

  setValueChanges(fb: FormGroup, index: number, type: 'TM' | 'LM') {
    fb.get('plan_state_id')?.valueChanges.subscribe((stateId) => {
      // Only fetch cities if user is actively editing (not during patching or month changes)
      if (this.isPatching || this.isLoading) return;

      if (stateId) {
        this.empService.getCityByState(stateId).subscribe((res: any) => {
          if (type === 'TM') {
            this.tmPlanCities[index] = res.data;
          } else {
            this.lmPlanCities[index] = res.data;
          }
        });
      } else {
        if (type === 'TM') {
          this.tmPlanCities[index] = [];
        } else {
          this.lmPlanCities[index] = [];
        }
      }
    });
  }

  createMonthlyPlans(type: 'LM' | 'TM') {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based (Sep = 8)

    // ✅ Days in this month
    const totalDays = new Date(year, month + 1, 0).getDate();

    const plansArray = this.fb.array<FormGroup>([]);

    for (let day = 1; day <= totalDays; day++) {
      // 👇 This always gives 1 Sep → 30 Sep (no Aug leakage)
      const currentDate = new Date(year, month, day);

      plansArray.push(
        this.createPlanGroup(
          this.getTodayDate(currentDate.toISOString()),
          this.getTodayDay(currentDate.toISOString())
        )
      );
    }

    if (type === 'LM') {
      this.form.setControl('lmPlans', plansArray);
    } else {
      this.form.setControl('tmPlans', plansArray);
    }
  }

  getTravelMonthPlan(employee_id: number) {
    this.isLoading = true;
    this.isPatching = true;
    
    this.travelService
      .getMonthTravelPlan(employee_id, this.currentMonthType)
      .subscribe(
        (res: any) => {
          
          const tmData = res.data.TM?.plans || [];
          const lmData = res.data.LM?.plans || [];
          this.planTM = res.data.TM;
          this.planLM = res.data.LM;

          // Patch TM Plans
          if (tmData.length > 0) {
            this.tmPlans.clear();
            this.noOfTMDeviation = 0;
            const tmFormArray = this.fb.array<FormGroup>(
              tmData.map((plan: any, index: number) => {
                const combinedCities = [...this.cities];
                // Remove duplicates based on city_name
                const uniqueCities = Array.from(
                  new Map(
                    combinedCities.map((city) => [city.city_name, city])
                  ).values()
                );
                this.filteredItems.next(uniqueCities);
                if (
                  plan.plan_city_id &&
                  plan.actual_city_id &&
                  plan.plan_city_id !== plan.actual_city_id
                ) {
                  this.noOfTMDeviation++;
                }

                return this.patchPlanGroup(plan, index, 'TM');
              })
            );
            this.form.setControl('tmPlans', tmFormArray);
          } else {
            // fallback: create empty month if API returns nothing
            if (!this.isRM) {
              this.createMonthlyPlans('TM');
            }
          }

          // Patch LM Plans
          if (lmData?.length > 0) {
            // ✅ Always reset counter first
            this.noOfLMDeviation = 0;

            const lmFormArray = this.fb.array<FormGroup>(
              lmData.map((plan: any, index: number) => {
                // 🧩 Make sure the correct keys exist
                const planCityId = plan.plan_city_id;
                const actualCityId = plan.actual_city_id; // check if this key name is correct!

                if (planCityId && actualCityId && planCityId !== actualCityId) {
                  this.noOfLMDeviation++;
                }

                // Return form group
                return this.patchPlanGroup(plan, index, 'LM');
              })
            );

            this.form.setControl('lmPlans', lmFormArray);
          }
          
          // Reset flags after patching is complete
          setTimeout(() => {
            this.isPatching = false;
            this.isLoading = false;
          }, 100);
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching travel plans', error);
          this.toast.error(error.error.message);
          // Optionally create blank month on error
          this.createMonthlyPlans('TM');
          this.isPatching = false;
          this.isLoading = false;
        }
      );
  }

  approvePlan() {
    if (!this.planTM && !this.planTM.id) {
      this.toast.error(
        'Invalid travel plan ID. Please select a valid travel plan.'
      );
      return;
    }

    this.travelService.approveTravelPlan(this.planTM.id, 'APPROVED').subscribe({
      next: (res: any) => {
        this.toast.success(
          res.message ||
            `Travel plan ${this.planTM.id} has been approved successfully.`
        );
        this.planTM.status = res.data.status;
        this.ngOnInit();
      },
      error: (error: HttpErrorResponse) => {
        this.toast.error(
          error.error.message ||
            'Failed to approve the travel plan. Please try again.'
        );
      },
    });
  }

  saveChanges() {
    let data = this.form.value;
    if (this.planTM && this.planTM.id) {
      data.plan_id = this.planTM.id;
    }
    this.travelService.createTravelPlan(data).subscribe(
      (res: any) => {
        if (res) {
          this.onDialogClose(true);
          this.toast.success(res.message);
        }
      },
      (error: HttpErrorResponse) => {
        this.toast.error(error.error.message);
      }
    );
  }

  hasVisibleLmPlans(): boolean {
    return this.lmPlans.controls.some(
      (plan) => plan.get('plan_city')?.value || plan.get('actual_city')?.value
    );
  }

  hasVisibleTmPlans(): boolean {
    return this.tmPlans.controls.some(
      (plan) =>
        !this.isRM ||
        plan.get('plan_city')?.value ||
        plan.get('actual_city')?.value
    );
  }

  showTheTravelRequest(travelId: string) {
    this.selectedTravelId = travelId;
  }

  onDownloadCSV() {
    const data = this.tmPlans.value.map((res: any) => ({
      date: res.date,
      day: res.day,
      holiday: res.holiday,
      plan_state: res.plan_state,
      plan_city: res.plan_city,
      actual_city: res.actual_city,
      travel_name: res.travel_name,
    }));

    this._commonService?.downloadCSV(data, 'Current_Month_Plan');
  }
  onChangeMonth() {
    this.isPatching = true;
    this.isLoading = true;

    if (this.currentMonthType === 'current') {
      this.currentMonthType = 'next';
      this.thisMonth = new Date(
        this.thisMonth.getFullYear(),
        this.thisMonth.getMonth() + 1,
        1
      );
    } else {
      this.currentMonthType = 'current';
      this.thisMonth = new Date();
    }

    this.tmPlans.clear();
    this.lmPlans.clear();

    this.cities = [];
    this.tmPlanCities = [];
    this.lmPlanCities = [];
    this.filteredItems.next([]);

    this.noOfTMDeviation = 0;
    this.noOfLMDeviation = 0;

    // Fetch cities first, then travel plans
    this.empService.searchCities('', 5).subscribe((res: any) => {
      this.cities = res.data || [];
      const uniqueCities = Array.from(
        new Map(this.cities.map((city) => [city.city_name, city])).values()
      );
      this.filteredItems.next(uniqueCities);
      
      // Now fetch travel plans after cities are loaded
      this.getTravelMonthPlan(this.employee_id ?? parseInt(this.mainId));
    });
  }
}
