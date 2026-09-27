import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  DateFilterFn,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cl } from '@fullcalendar/core/internal-common';
import { tr } from 'date-fns/locale';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subject, takeUntil, timer } from 'rxjs';
import { RemarkDilogComponent } from 'src/app/@modules/expense-management/travel-expense/add-travel-expense/remark-dilog/remark-dilog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { environment } from 'src/app/environments/environment';

/**
 * ================================================================
 * Component Name : DashCreateTravelRequestComponent
 * File Name      : dash-create-travel-request.component.ts
 * Module         : Travel & Reimbursement
 * Description    :
 *   - Component for creating a travel request dialog.
 *   - Provides a form for users to input travel details.
 *   - Handles state/city selections, dates, and journey bifurcations.
 *   - Supports both creating new requests and viewing existing ones.
 *
 * Developed By   : Gyan Prakash
 * Created On     : 05-Sep-2025
 * Last Modified  : 05-Sep-2025
 * Version        : 1.0.0
 * Notes          : Extendable for future enhancements like
 *                  multi-city travel and approval workflows.
 * ================================================================
 */
@Component({
  selector: 'app-dash-create-travel-request',
  templateUrl: './dash-create-travel-request.component.html',
  styleUrls: ['./dash-create-travel-request.component.scss'],
})
export class DashCreateTravelRequestComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  fromStateData: any;
  toStateData: any;
  fromCityList: any[] = [];
  toCityList: any[] = [];
  showExpenseForm: { [key: number]: boolean } = {};
  expenseType: Array<{ id: number; expense_type: string }> = [];
  expenses: string[] = [];
  expenseForms: { [key: number]: { [key: string]: FormControl } } = {};
  fullFromCityList: any = [];
  fullToCityList: any = [];
  journeyToCityList: any = [...this.fullFromCityList, ...this.fullToCityList];
  view: boolean = false;
  formModel: FormGroup;
  stateList: any[] = [];
  toCityList2: any[] = [];
  fromCityList2: any[] = [];
  states: any;
  cities: any[] = [];
  toCities: any;

  fromCityLists: { [index: number]: any[] } = {};
  toCityLists: { [index: number]: any[] } = {};
  entity: string = '';
  financialid: string = '';
  loginUser: any = '';
  workflowcheck: boolean = false;
  expense_request_id: number = -1;
  isButtonShow: boolean = false;
  isValidToApprove: boolean = true;
  isCitySpecific: boolean = false;
  showAllDetails = false;
  budgetData: any;
  fileUrl = environment.serverUrl;
  private destroy$ = new Subject<void>();
  grade: any;
  isJourneyLoading = false;

  @Input() travelRequests: any;
  @Input() data: any;
  @Input() travelexpid: any;
  @Input() travelReqid: any;
  @Input() typeCheck: any;
  @Output() dialogClose = new EventEmitter<boolean>();
  employee_id: any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private travelRequest: TravelRequestService,
    private config: ConfigurationalmasterService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private routerActive: ActivatedRoute
  ) {
    this.entity = parseInt(
      localStorage.getItem('selectedEntityId')!
    ).toString();
    this.financialid = parseInt(
      localStorage.getItem('financial_id')!
    ).toString();
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    const employee_id = this.loginUser.employee_id;


    this.formModel = this.fb.group({
      journeyBifurcation: this.fb.array([]),
    });

    this.get_travel_details_by_id();
  }

  get journeyBifurcation(): FormArray {
    return this.formModel.get('journeyBifurcation') as FormArray;
  }
  grade_id: any
  ngOnInit() {
    // this.getAllstates();
    this.getAll_active_expenseType();

    this.routerActive.queryParams.subscribe((res: any) => {
      this.grade_id = res.grade_id
    })

  }

  getAll_active_expenseType() {
    this.travelRequest.getAll_active_expenseType().subscribe((res: any) => {
      this.expenseType = res.data;
      this.expenses = this.expenseType.map((value: any) => value.expense_type);
    });
  }

  toggleExpenseForm(index: number): void {
    this.showExpenseForm[index] = !this.showExpenseForm[index];
    if (this.showExpenseForm[index]) {
      const expensesArray = this.getExpensesFormArray(index);
      if (expensesArray.length === 0) {
        this.addNewExpense(index);
      }
    }
  }

  ngAfterViewInit() {
    if (this.view) {
      this.disableInteraction();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes['data']?.currentValue?.date) {
      this.getAllCities('date', changes['data'].currentValue.date);
    } else if (
      changes['travelexpid']?.currentValue !== undefined &&
      changes['travelexpid']?.currentValue !== null
    ) {
      this.getAllCities('expense', changes['travelexpid'].currentValue);
    } else if (
      changes['travelReqid']?.currentValue !== undefined &&
      changes['travelReqid']?.currentValue !== null
    ) {
      this.getAllCities('ess', changes['travelReqid'].currentValue);
    } else {
      // ✅ jab sab undefined hai, fallback
      this.getAllCities('ess', '-1');
    }

    if (changes['typeCheck']?.currentValue) {
      const current = changes['typeCheck'].currentValue;
      this.view = current === 'process-approval' || current === 'view';
    }
  }

  getAllCities(type: 'ess' | 'expense' | 'date', dataId: string) {
    this.config.getCity().subscribe((res: any) => {
      this.cities = res.data || [];
      if (this.cities.length > 0 && dataId !== '-1') {
        this.getData(type, dataId);
      } else {
        this.addJourney(); // fallback if no cities found
      }
    });
  }

  getData(type: 'ess' | 'expense' | 'date', dataId: string) {
    this.isJourneyLoading = true;
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    const employee_id = this.loginUser.employee_id;

    this.travelRequest
      .getTravelJourneyByDate(this.entity, this.financialid, type, dataId, employee_id)
      .subscribe({
        next: async (res: any) => {
          this.travelRequests = res.data;
          const current = this.travelRequests;

          this.journeyBifurcation.clear();

          if (current?.ESS_TRAVEL_REQUEST_DATA?.length > 0) {
            this.grade = current.grade;

            current.ESS_TRAVEL_REQUEST_DATA.forEach(
              (journey: any, index: number) => {
                const journeyGroup = this.createJourneyBifurcation(journey);
                this.journeyBifurcation.push(journeyGroup);

                // Patch city & dates after form + dropdown ready
                Promise.resolve().then(() => {
                  this.journeyBifurcation.at(index).patchValue({
                    domestic_from_city_id: journey.travel_from_city_id || null,
                    domestic_to_city_id: journey.travel_to_city_id || null,
                    domestic_from_date: journey.travel_from_date
                      ? new Date(journey.travel_from_date)
                      : null,
                    domestic_to_date: journey.travel_to_date
                      ? new Date(journey.travel_to_date)
                      : null,
                  });
                });
              }
            );

            // ✅ fetch budget for first city
            await this.getBudgetDataOfGrade(
              current.ESS_TRAVEL_REQUEST_DATA[0]?.travel_to_city_id
            );

            // ✅ check last journey for approval
            const lastJourney =
              current.ESS_TRAVEL_REQUEST_DATA[
              current.ESS_TRAVEL_REQUEST_DATA.length - 1
              ];
            const travelToDate = lastJourney?.travel_to_date || null;

            Promise.resolve().then(() => {
              this.validateCapping();
              if (travelToDate && new Date(travelToDate) < new Date()) {
                this.isButtonShow = true;
                this.toaster.success(
                  'You can now submit this request for approval.'
                );
              } else {
                this.isButtonShow = false;
              }
            });
          } else {
            // ✅ no journeys from API → fallback
            this.addJourney();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);

          this.addJourney(); // fallback on error
          this.isJourneyLoading = false; // always stop loader
        },
        complete: () => {
          this.isJourneyLoading = false; // always stop loader
        },
      });
  }

  setValueChanges(fb: FormGroup) {
    this.journeyBifurcation.controls.forEach((control, index) => {
      const group = control as FormGroup;
      // From State → From City
      group.get('domestic_from_state_id')?.valueChanges.subscribe((stateId) => {
        console.log(stateId, index);
        if (stateId) {
          this.loadCitiesByState(stateId, index, 'from');
        } else {
          group.get('domestic_from_city_id')?.reset();
        }
      });

      // To State → To City
      group.get('domestic_to_state_id')?.valueChanges.subscribe((stateId) => {
        if (stateId) {
          this.loadCitiesByState(stateId, index, 'to');
        } else {
          group.get('domestic_to_city_id')?.reset();
        }
      });
    });
    fb.get('domestic_from_date')?.valueChanges.subscribe(() => {
      this.calculateDays();
    });
    fb.get('domestic_to_date')?.valueChanges.subscribe(() => {
      this.calculateDays();
    });
  }

  isInvalid(index: number, controlName: string): boolean {
    const control = (this.journeyBifurcation.at(index) as FormGroup).get(
      controlName
    );
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  disableInteraction() {
    const formElements =
      this.elRef.nativeElement.querySelectorAll('.form_set .row *');

    formElements.forEach((element: HTMLElement) => {
      this.renderer.addClass(element, 'disable-interaction');
      this.renderer.setAttribute(element, 'tabindex', '-1');
      element.addEventListener('focus', (event) => {
        (event.target as HTMLElement).blur();
      });
    });
  }

  calculateDays(): void {
    const fromDate = this.formModel.get('domestic_from_date')?.value;
    const toDate = this.formModel.get('domestic_to_date')?.value;

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (toDateObj < fromDateObj) {
        this.formModel
          .get('domestic_to_date')
          ?.setErrors({ invalidDateRange: true });
        this.toaster.error(
          'To Date must be greater than or equal to From Date'
        );
      } else {
        let isValidToDate = true;
        // if (
        //   this.data.domesticdatedata &&
        //   this.data.domesticdatedata.length > 0
        // ) {
        //   for (let entry of this.data.domesticdatedata) {
        //     const fromRange = new Date(entry.domestic_from_date).setHours(
        //       0,
        //       0,
        //       0,
        //       0
        //     );
        //     const toRange = new Date(entry.domestic_to_date).setHours(
        //       0,
        //       0,
        //       0,
        //       0
        //     );

        //     if (
        //       fromDateObj.getTime() >= fromRange &&
        //       fromDateObj.getTime() <= toRange
        //     ) {
        //       isValidToDate =
        //         toDateObj.getTime() >= fromDateObj.getTime() &&
        //         toDateObj.getTime() <= toRange;
        //       break;
        //     }
        //   }
        // }

        if (!isValidToDate) {
          this.formModel
            .get('domestic_to_date')
            ?.setErrors({ invalidToDateRange: true });
          this.toaster.error(
            'To Date must be within the allowed range of the selected From Date'
          );
        } else {
          fromDateObj.setHours(0, 0, 0, 0);
          toDateObj.setHours(0, 0, 0, 0);

          const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

          this.formModel
            .get('number_of_days')
            ?.setValue(daysDiff >= 0 ? daysDiff : 0);
          this.formModel.get('domestic_to_date')?.setErrors(null);
        }
      }
    } else {
      this.formModel.get('number_of_days')?.setValue(0);
    }
  }

  getAllstates() {
    this.travelRequest.getAllstates().subscribe((res: any) => {
      this.stateList = res.data;
    });
  }

  addJourney(): void {
    const fb = this.createJourneyBifurcation();
    this.journeyBifurcation.push(fb);
    this.setValueChanges(fb);
    this.validateJourneySequence();
  }

  removeJourney(index: number): void {
    this.journeyBifurcation.removeAt(index);
  }

  private createExpenseFormGroup(expense?: any): FormGroup {
    const group = this.fb.group({
      exp_category_id: [expense?.exp_category_id || null],
      exp_category_id_name: [expense?.exp_category_id_name || null],
      exp_name: [expense?.expense_name || null],
      exp_amount: [expense?.exp_amount || null],
      documents: this.fb.array(
        expense?.expense_document?.map((d: any) =>
          this.fb.group({ url: d.url })
        ) || []
      ),
      remarks: [expense?.expense_remarks || null],
    });

    // ✅ conditional validation
    if (this.travelRequests && this.travelRequests.id) {
      group.get('exp_category_id')?.setValidators([Validators.required]);
      group.get('exp_name')?.setValidators([Validators.required]);
      group
        .get('exp_amount')
        ?.setValidators([Validators.required, Validators.min(0)]);
      group.get('documents')?.setValidators([Validators.required]);
      group.get('remarks')?.setValidators([Validators.required]);
    } else {
      // remove validators if condition false
      group.get('exp_category_id')?.clearValidators();
      group.get('exp_name')?.clearValidators();
      group.get('exp_amount')?.clearValidators();
      group.get('documents')?.clearValidators();
      group.get('remarks')?.clearValidators();
    }

    // update validation status
    Object.keys(group.controls).forEach((key) => {
      group.get(key)?.updateValueAndValidity();
    });

    return group;
  }

  getExpensesFormArray(journeyIndex: number): FormArray {
    const journey = this.journeyBifurcation.at(journeyIndex) as FormGroup;
    return journey.get('expenses') as FormArray;
  }

  addNewExpense(journeyIndex: number): void {
    const newExpenseGroup = this.createExpenseFormGroup();
    this.getExpensesFormArray(journeyIndex).push(newExpenseGroup);
  }

  removeExpenseAt(journeyIndex: number, expenseIndex: number): void {
    const expensesArray = this.getExpensesFormArray(journeyIndex);
    expensesArray.removeAt(expenseIndex);
    this.toaster.success('Expense removed successfully');
  }

  validateExpenseForm(journeyIndex: number): boolean {
    const expensesArray = this.getExpensesFormArray(journeyIndex);
    if (expensesArray.length === 0) {
      return true;
    }

    const lastExpense = expensesArray.at(expensesArray.length - 1) as FormGroup;
    if (lastExpense && lastExpense.invalid) {
      // if (lastExpense.get('exp_amount')?.errors?.min) {
      //   this.toaster.error('Amount must be greater than 0');
      // } else {
      //   this.toaster.error('Please fill all required fields correctly');
      // }
      return false;
    }
    return true;
  }

  createJourneyBifurcation(data?: any): FormGroup {
    const expensesArray = this.fb.array([] as FormGroup[]);

    // If there are existing expenses, add them to the form array
    if (data?.EXPENSE_REQUEST_DATA?.length) {
      data.EXPENSE_REQUEST_DATA.forEach((expense: any) => {
        const expenseGroup = this.createExpenseFormGroup(expense);
        this.expense_request_id = expense.expense_request_id;
        expensesArray.push(expenseGroup);
      });
    }

    return this.fb.group(
      {
        id: [{ value: data?.id || null, disabled: data?.id ? true : false }],
        domestic_from_state_id: [data?.travel_from_state_id || null],
        fromStateName: [data?.fromStateName || ''],
        domestic_to_state_id: [data?.travel_to_state_id || null],
        toStateName: [data?.toStateName || ''],
        domestic_from_city_id: [
          data?.travel_from_city_id || null,
          Validators.required,
        ],
        fromCityName: [data?.fromCityName || ''],
        domestic_to_city_id: [
          data?.travel_to_city_id || null,
          Validators.required,
        ],
        toCityName: [data?.toCityName || ''],
        domestic_from_date: [
          data?.travel_from_date ? new Date(data.travel_from_date) : null,
          Validators.required,
        ],
        domestic_to_date: [
          data?.travel_to_date ? new Date(data.travel_to_date) : null,
          Validators.required,
        ],

        include_hotel: [data?.include_hotel || false],
        domestic_hotel_name: [data?.domestic_hotel_name || null],
        number_of_days: [data?.number_of_days || 0],
        expenses: expensesArray,
      },
      { validators: this.dateRangeValidator }
    );
  }

  onDateChange(
    event: MatDatepickerInputEvent<Date>,
    index: number,
    type: string
  ) {
    console.log('Selected', type, 'date:', event.value);
    this.journeyBifurcation.at(index).patchValue({
      [type === 'from' ? 'domestic_from_date' : 'domestic_to_date']:
        event.value,
    });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('domestic_from_date')?.value;
    const to = group.get('domestic_to_date')?.value;

    if (from && to && new Date(to) < new Date(from)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  validateJourneySequence() {
    const journeys = this.journeyBifurcation.controls;

    for (let i = 1; i < journeys.length; i++) {
      const prevTo = journeys[i - 1].get('domestic_to_date')?.value;
      const currentFrom = journeys[i].get('domestic_from_date')?.value;

      if (prevTo && currentFrom && new Date(currentFrom) < new Date(prevTo)) {
        journeys[i]
          .get('domestic_from_date')
          ?.setErrors({ sequenceInvalid: true });
      } else {
        // reset agar sahi hai
        if (
          journeys[i].get('domestic_from_date')?.hasError('sequenceInvalid')
        ) {
          journeys[i]
            .get('domestic_from_date')
            ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
      }
    }
  }

  loadCitiesByState(
    stateId: number,
    rowIndex: number,
    type: 'from' | 'to',
    value?: number
  ) {
    this.travelRequest.getcitybystateid(stateId).subscribe((res) => {
      const cityList = res.data || [];
      if (type === 'from') {
        this.journeyBifurcation
          .at(rowIndex)
          .patchValue({ domestic_from_city_id: value || null });
        this.fromCityLists[rowIndex] = cityList;
      } else {
        this.journeyBifurcation
          .at(rowIndex)
          .patchValue({ domestic_to_city_id: value || null });
        this.toCityLists[rowIndex] = cityList;
      }
    });
  }

  get expensesData(): any[] {
    const allExpenses: any[] = [];
    const currentDate = new Date();

    for (let i = 0; i < this.journeyBifurcation.length; i++) {
      const journey = this.journeyBifurcation.at(i) as FormGroup;
      const journeyExpenses = journey.get('expenses')?.value || [];
      const fromDate = journey.get('domestic_from_date')?.value;
      const toDate = journey.get('domestic_to_date')?.value;

      if (journeyExpenses.length > 0) {
        // Add journey reference and validation to each expense
        const expensesWithJourney = journeyExpenses.map((expense: any) => {
          // Validate amount is a positive number
          const amount = parseFloat(expense.exp_amount);
          if (isNaN(amount) || amount <= 0) {
            throw new Error(
              `Invalid expense amount for ${expense.exp_name || 'unnamed expense'
              }`
            );
          }

          return {
            ...expense,
            journey_id: journey.get('id')?.value,
            domestic_from_date: fromDate,
            domestic_to_date: toDate,
            expense_date: currentDate,
            amount: amount, // Store the parsed amount
          };
        });
        allExpenses.push(...expensesWithJourney);
      }
    }

    return allExpenses;
  }

  onSubmit(isValid: boolean = false): void {
    let department_id = localStorage.getItem('department_id')
    this._commonService?.showLoader();
    const payload = {
      currency_id: null,
      book_advance_status: null,
      Name: null,
      Department: null,
      department_id: department_id,
      current_date: null,
      passport_number: null,
      domesticAmount: null,
      internationalAmount: null,
      totalAmount: null,
      unforeseenEvent: null,
      remarks: null,
      travel_document: null,
      domesticLocations: this.formModel.get('journeyBifurcation')?.value,
      internationalLocations: null,
      domesticAllowances: null,
      internationalAllowances: null,
      entity_id: this.entity,
      financial_year_id: this.financialid,
      expense_request_id: this.expense_request_id,
      expense_request_type: 'Indirect_Expense',
      isValidToSubmit: isValid,
      isValidToApprove: this.isValidToApprove,
    };
    console.log('Submit Payload:', payload);

    // return;
    if (this.workflowcheck == true) {
      this.toaster.error('Workflow is not created for required department!');
      this._commonService?.hideLoader();
      return;
    }

    if (this.travelRequests?.id) {
      this.validateCapping();
      this.travelRequest
        .update_travel_request(this.travelRequests.id, this.loginUser.employee_id, payload)
        .subscribe(
          (res: any) => {
            if (res) {
              this._commonService?.hideLoader();
              this.toaster.success('Updated Successfully!');
              this.dialogClose.emit(true);
            }
          },
          (err: any) => {
            this.toaster.error(err.error.message);
            this._commonService?.hideLoader();
          }
        );
      return;
    } else {
      Object.values(this.formModel.controls).forEach((control) => {
        control.markAsTouched();
      });
      if (this.formModel.invalid) {
        this.toaster.error('Please fill in all required fields');
        this._commonService?.hideLoader();
        return;
      }

      this.travelRequest
        .create_travel_request(this.loginUser.employee_id, payload)
        .subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            if (res) {
              this.toaster.success('Submitted Successfully!');
              this.dialogClose.emit(true);
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.toaster.error(err.error.message);
            this._commonService?.hideLoader();
          }
        );
    }
  }

  update(isValid: boolean = false) {
    // if (this.travelRequestForm.invalid) {
    //   this.toaster.error('Please fill in all required fields');
    //   return;
    // }

    const payload: any = {
      expense_request_id: this.expense_request_id,
      entity_id: this.entity,
      employee_id: this.loginUser?.employee_id,
      financial_id: this.financialid,
      expense_request_type: 'Indirect_Expense',
      // current_date: indirectformData?.current_date,
      // travel_id: indirectformData?.travelrequest,
      // travel_from_city_id: this.travel_details?.travel_from_city_id,
      // travel_to_city_id: this.travel_details?.travel_to_city_id,
      // advance_amt: this.travel_details?.advance_amt,
      expenses: this.expensesData,
      isValidToSubmit: isValid,
      // isValidToApprove: this.isValidToApprove,
    };

    this._commonService?.showLoader();
    this.travelRequest.update_expense_request(payload).subscribe(
      (res: any) => {
        if (res) {
          this._commonService?.hideLoader();
          this.toaster.success('Updated successfully');
        }
      },
      (err: any) => {
        this._commonService?.hideLoader();
        this.toaster.error(err.error.message);
      }
    );
  }
    cappingErrors: { category: string; message: string }[] = [];

  // validateCapping() {
  //   try {
  //     this.cappingErrors = []; // reset old errors

  //     if (!this.budgetData || !this.expensesData?.length) return;

  //     const budget: any = this.budgetData;
  //     const categoryTotals: { [key: string]: number } = {};
  //     const dayWiseCategoryTotals: {
  //       [date: string]: { [catId: string]: number };
  //     } = {};

  //     console.log('this.expensesData:', this.expensesData);

  //     this.expensesData.forEach((expense) => {
  //       const matchedType = this.expenseType.find(
  //         (et) => et.id === expense.exp_category_id
  //       );

  //       let catId = '';
  //       if (matchedType) {
  //         expense.exp_category_id_name = matchedType.expense_type;

  //         const type = matchedType.expense_type.toLowerCase();
  //         if (type.includes('night')) catId = 'night_stay';
  //         else if (type.includes('daily')) catId = 'daily_allowance';
  //         else if (type.includes('local')) catId = 'local_max_limit';
  //       }

  //       if (!catId) return;

  //       // ✅ Add to overall category total
  //       categoryTotals[catId] =
  //         (categoryTotals[catId] || 0) + (Number(expense.exp_amount) || 0);

  //       // ✅ Treat each expense as one entry (NOT split by date)
  //       // Use expense.expense_date (not from/to)
  //       const dayKey = new Date(expense.expense_date)
  //         .toISOString()
  //         .split('T')[0]; // YYYY-MM-DD

  //       if (!dayWiseCategoryTotals[dayKey]) dayWiseCategoryTotals[dayKey] = {};
  //       if (!dayWiseCategoryTotals[dayKey][catId])
  //         dayWiseCategoryTotals[dayKey][catId] = 0;

  //       dayWiseCategoryTotals[dayKey][catId] += Number(expense.exp_amount) || 0;
  //     });

  //     // ✅ Default assumption — valid unless found otherwise
  //     this.isValidToApprove = true;

  //     // 🔹 Validate per-day per-category limits
  //     try {
  //       const domesticData = budget.domesticBudgetLimits || [];
  //       const travelCityId =
  //         this.travelRequests.ESS_TRAVEL_REQUEST_DATA?.[0]?.travel_to_city_id;

  //       let defaultDailyCap = budget.other_towns;
  //       const matchingData = domesticData.find(
  //         (i: any) => i.city_id === travelCityId
  //       );
  //       if (matchingData) defaultDailyCap = matchingData.budgetLimit;

  //       for (const [day, cats] of Object.entries(dayWiseCategoryTotals)) {
  //         for (const [catId, amount] of Object.entries(cats)) {
  //           let cap = 0;

  //           if (catId === 'daily_allowance') cap = defaultDailyCap;
  //           else if (catId === 'night_stay') cap = budget.daily_allowance;
  //           else if (catId === 'local_max_limit') cap = budget.local_max_limit;

  //           if (amount > cap) {
  //             this.addCappingError(
  //               `${catId}_${day}`,
  //               `${this.toTitle(catId)} exceeded on ${day}: ${amount.toFixed(
  //                 2
  //               )} > ${cap}`
  //             );
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error('❌ Error in per-day-category capping check:', err);
  //     }

  //     if (this.cappingErrors.length) this.isValidToApprove = false;

  //     console.log('✅ Capping validation result:', {
  //       categoryTotals,
  //       dayWiseCategoryTotals,
  //       errors: this.cappingErrors,
  //     });
  //   } catch (error) {
  //     console.error('❌ Error in validateCapping():', error);
  //   }
  // }

validateCapping() {
  debugger;
  try {
    console.log('🔄 Running validateCapping()...');
    this.cappingErrors = []; // Reset old errors

    if (!this.budgetData || !this.expensesData?.length) {
      console.warn('⚠️ No budgetData or expensesData found.');
      return;
    }

    const budget: any = this.budgetData;
    const categoryTotals: { [key: string]: number } = {};
    const dayWiseCategoryTotals: { [date: string]: { [catId: string]: number } } = {};

    console.log('📦 Budget Data:', budget);
    console.log('🧾 Expenses Data:', this.expensesData);

    // 🔹 Step 1: Group by category and date
    this.expensesData.forEach((expense) => {
      const matchedType = this.expenseType.find(
        (et) => et.id === expense.exp_category_id
      );

      let catId = '';
      if (matchedType) {
        expense.exp_category_id_name = matchedType.expense_type;
        const type = matchedType.expense_type.toLowerCase();

        if (type.includes('night')) catId = 'night_stay';
        else if (type.includes('daily')) catId = 'daily_allowance';
        else if (type.includes('local')) catId = 'local_max_limit';
      }

      if (!catId) {
        console.warn('⚠️ No category matched for expense:', expense);
        return;
      }

      // ✅ Add to overall category total
      const expAmt = Number(expense.exp_amount) || 0;
      categoryTotals[catId] = (categoryTotals[catId] || 0) + expAmt;

      // ✅ Group by expense date
      const dayKey = new Date(expense.expense_date).toISOString().split('T')[0];

      if (!dayWiseCategoryTotals[dayKey]) dayWiseCategoryTotals[dayKey] = {};
      if (!dayWiseCategoryTotals[dayKey][catId]) dayWiseCategoryTotals[dayKey][catId] = 0;

      dayWiseCategoryTotals[dayKey][catId] += expAmt;
    });

    console.log('📊 Category Totals:', categoryTotals);
    console.log('📅 Day-wise Category Totals:', dayWiseCategoryTotals);

    // ✅ Default assumption — valid unless found otherwise
    this.isValidToApprove = true;

    // 🔹 Step 2: Validate per-day per-category limits
    try {
      const domesticData = budget.domesticBudgetLimits || [];
      const travelCityId =
        this.travelRequests.ESS_TRAVEL_REQUEST_DATA?.[0]?.travel_to_city_id;

      let defaultDailyCap = budget.other_towns;
      const matchingData = domesticData.find(
        (i: any) => i.city_id === travelCityId
      );

      if (matchingData) defaultDailyCap = matchingData.budgetLimit;

      console.log('🏙️ Travel City ID:', travelCityId);
      console.log('💰 Default Daily Cap:', defaultDailyCap);

      for (const [day, cats] of Object.entries(dayWiseCategoryTotals)) {
        for (const [catId, amount] of Object.entries(cats)) {
          let cap = 0;

          // ✅ FIXED FIELD MAPPING
          if (catId === 'daily_allowance') cap = Number(budget.daily_allowance) || 0;
          else if (catId === 'night_stay') cap = Number(budget.night_stay) || 0;
          else if (catId === 'local_max_limit') cap = Number(budget.local_max_limit) || 0;

          console.log(
            `🧮 Checking ${catId} on ${day}: amount=${amount}, cap=${cap}`
          );

          if (Number(amount) > Number(cap)) {
            this.addCappingError(
              `${catId}_${day}`,
              `${this.toTitle(catId)} exceeded on ${day}: ${amount.toFixed(
                2
              )} > ${cap}`
            );
            console.warn(
              `🚨 Capping exceeded for ${catId} on ${day}: ${amount} > ${cap}`
            );
          }
        }
      }
    } catch (err) {
      console.error('❌ Error in per-day-category capping check:', err);
    }

    if (this.cappingErrors.length) {
      this.isValidToApprove = false;
      console.error('❌ Capping Errors Found:', this.cappingErrors);
    } else {
      console.log('✅ No capping errors. Approval allowed.');
    }

    console.log('✅ Final Capping Validation Result:', {
      categoryTotals,
      dayWiseCategoryTotals,
      errors: this.cappingErrors,
    });
  } catch (error) {
    console.error('❌ Error in validateCapping():', error);
  }
}




  // Helper
  toTitle(catId: string) {
    return catId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  private addCappingError(category: string, message: string) {
    this.isValidToApprove = false;
    this.cappingErrors.push({ category, message });
    // this.toaster.error(message); // optional: still show popup
  }


  get_travel_details_by_id() {
    let entity = localStorage.getItem('selectedEntityId')
    this._commonService?.showLoader()
    this.travelRequest.get_travel_details_by_id(this.loginUser.employee_id, entity).subscribe((res: any) => {
      if (res) {
        this.grade_id = res.data?.grade_id
        console.log(this.grade_id, 'grade_id')
        this.workflowcheck = false
        this._commonService?.hideLoader()
      }
    },
      (err: any) => {
        this._commonService?.hideLoader()
        if (err.error.message == "Workflow is not created for required department!") {
          this.workflowcheck = true
        }
      });
  }

  getBudgetDataOfGrade(gradeId: any) {
    this.travelRequest.getBudgetDataOfGrade(gradeId, this.grade_id).subscribe((res: any) => {
      this.budgetData = res.data;
      console.log(this.budgetData,"rtk");
      this.isCitySpecific = res.isCitySpecific;
      this.validateCapping();
    })
  }

  proceed(e: any) {
    const dialogRef = this.dialog.open(RemarkDilogComponent, {
      width: '400px',
      data: this.travelexpid,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emits signal to unsubscribe
    this.destroy$.complete(); // Completes the subject
  }

  getCityName(list: any[], id: number) {
    return list?.find((c) => c.city_id === id)?.city_name || '—';
  }

  getExpenseDocumentData(
    journeyIndex: number,
    expenseIndex: number
  ): FormArray {
    const expenses = this.getExpensesFormArray(journeyIndex) as FormArray;
    return expenses.at(expenseIndex).get('documents') as FormArray;
  }

  onFileSelected(event: any, journeyIndex: number, expenseIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.travelRequest.documents(formData).subscribe({
        next: (res: any) => {
          this.toaster.success('File uploaded successfully!');
          const docs = this.getExpenseDocumentData(journeyIndex, expenseIndex);
          const doc = this.fb.group({ url: res?.url });
          docs.push(doc);
        },
        error: (err: any) => {
          this.toaster.error(err?.error?.message || 'File upload failed');
        },
      });
    }
  }

  getExpenseImages(journeyIndex: number, expenseIndex: number): FormArray {
    const docs = this.getExpenseDocumentData(
      journeyIndex,
      expenseIndex
    ) as FormArray;
    return docs || [];
  }

  removeImage(journeyIndex: number, expenseIndex: number, imageIndex: number) {
    const docs = this.getExpenseDocumentData(journeyIndex, expenseIndex); // documents FormArray
    if (docs.length > 0) {
      docs.removeAt(imageIndex); // removes from reactive form
    }
  }
}
