import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RemarkDilogueComponent } from './remark-dilogue/remark-dilogue.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subject, takeUntil, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-other-expense',
  templateUrl: './add-other-expense.component.html',
  styleUrls: ['./add-other-expense.component.scss'],
})
export class AddOtherExpenseComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  fileUrl = environment.servralUrl;
  private destroy$ = new Subject<void>();
  isReadonlyType() {
    return (
      this.travelexptype === 'view' || this.travelexptype === 'approvalprocess'
    );
  }

  otherExpenseForm: FormGroup;
  currentDate: any = new Date().toISOString().substring(0, 10);
  loginUser: any;
  entity_Id: any;
  financial_id: any;
  conveyanceData: any[] = [];
  fileArray: any[] = [{ imagePath: null, url: null }];
  otherExpenseId: any;
  selectedOption = 'create';
  categoryData: any[] = [];
  travelexptype: any;
  otherExpenses: any;
  typeCheck: any;
  showAllDetails = false;
  isButtonShow: boolean = false;
  isValidToApprove: boolean = true;
  expenseMinDate!: Date;
  expenseMaxDate!: Date;

  today: Date = new Date();
  monthsAgo: Date;
  defaultSelectedDate: Date;
  isdraftValid: boolean = true;
  otherExpenseData: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private travelRequestService: TravelRequestService,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private route: Router,
    private _commonService: CommonService
  ) {
    const today = new Date();
    const currentDay = today.getDate();

    this.today = new Date(today.getFullYear(), today.getMonth(), 1); // current month start

    // Safely go back one month and set day to 1
    this.monthsAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Now set default selected date
    if (currentDay < 5) {
      this.defaultSelectedDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
    } else {
      this.defaultSelectedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      this.monthsAgo = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.formInitialization();
    this.setExpenseDateRange(this.otherExpenseForm.get('current_date')?.value);

    // Watch for changes in current_date
    this.otherExpenseForm
      .get('current_date')
      ?.valueChanges.subscribe((selectedDate: Date) => {
        this.setExpenseDateRange(selectedDate);
      });
  }

  openDatePicker(picker: MatDatepicker<Date>) {
    picker.open();
  }

  closeDatePicker(event: Date, picker: MatDatepicker<Date>) {
    this.otherExpenseForm.get('current_date')?.setValue(event);
    picker.close();
  }

  selectMonth(event: Date, datepicker: MatDatepicker<any>) {
    this.otherExpenseForm.get('current_date')?.setValue(event);
    datepicker.close();
  }

  ngOnInit(): void {
    // Now assign to your reactive form

    this.getFromLocalStorage();

    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.otherExpenseId = res.id;
        this.typeCheck = res.Type;
        if (this.typeCheck === 'view') {
          this.otherExpenseForm.disable();
        }
        this.getOtherExpenseById(this.otherExpenseId);
      } else {
        this.getLocalConveyanceDataOfGrade(this.loginUser?.employee_id);
      }
    });
  }

  setExpenseDateRange(selectedMonth: Date) {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    this.expenseMinDate = new Date(year, month, 1);
    this.expenseMaxDate = new Date(year, month + 1, 0); // Last day of the month
  }

  formInitialization() {
    const monthNames = [
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
    this.otherExpenseForm = this.fb.group({
      current_date: [this.defaultSelectedDate, Validators.required],
      expense_name: [
        monthNames[this.defaultSelectedDate.getMonth()],
        Validators.required,
      ],
      expense_data: this.fb.array([]),
    });
    this.otherExpenseForm
      .get('current_date')
      ?.valueChanges.subscribe((value: any) => {
        const selectedDate = new Date(value);
        const monthName = monthNames[selectedDate.getMonth()];
        this.otherExpenseForm.get('expense_name')?.setValue(monthName);
      });
    this.expenseData.push(this.createExpenseDataForm());
  }

  get expenseData(): FormArray {
    return this.otherExpenseForm.get('expense_data') as FormArray;
  }

  createExpenseDataForm(expense?: any) {
    const fb = this.fb.group({
      conveyance_type_id: [
        expense ? expense.conveyance_type_id : null,
        Validators.required,
      ],
      travel_range: [
        expense ? expense.travel_range : null,
        Validators.required,
      ],
      expense_amount: [
        expense ? expense.exp_amount : null,
        Validators.required,
      ],
      expense_date: [
        expense ? new Date(expense.expense_date) : null,
        Validators.required,
      ],
      remark: [expense ? expense.expense_remarks : null],
      documents: [expense ? expense.documents : null],
    });

    fb.get('travel_range')?.valueChanges.subscribe((value) => {
      if (!expense) {
      }
      const conveyanceTypeId = parseInt(fb.get('conveyance_type_id')?.value);
      const conveyanceType = this.conveyanceData[0].localBudgetLimits.find(
        (ct: any) => ct.travel_conveyance_id === conveyanceTypeId
      );
      if (conveyanceType) {
        fb.get('expense_amount')?.setValue(
          parseInt(value) * parseInt(conveyanceType.budgetLimit)
        );
      } else {
        console.warn('Conveyance type not found for ID:', conveyanceTypeId);
      }
    });
    if (this.typeCheck === 'view') {
      fb.disable();
    }

    // Optionally clear previous expense_date if it's out of range
    const expenseDate = fb.get('expense_date')?.value;
    if (
      expenseDate &&
      (expenseDate < this.expenseMinDate || expenseDate > this.expenseMaxDate)
    ) {
      fb.get('expense_date')?.setValue(null);
    }
    return fb;
  }

  addExpense() {
    this.expenseData.push(this.createExpenseDataForm());
  }

  deleteExpense(index: number) {
    if (this.expenseData.length > 1) {
      this.expenseData.removeAt(index);
    }
  }

  getFromLocalStorage() {
    this.loginUser = JSON.parse(localStorage.getItem('signInUser') || '{}');
    this.entity_Id = JSON.parse(
      localStorage.getItem('selectedEntityId') || 'null'
    );
    this.financial_id = JSON.parse(
      localStorage.getItem('financial_id') || 'null'
    );
  }

  getLocalConveyanceDataOfGrade(employee_id: any) {
    this.travelRequestService
      .getLocalConveyanceDataOfGrade(employee_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.conveyanceData = res.data;
          } else {
            this.toaster.error('No data found for the selected grade');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toaster.error(
            err?.error.message || 'Error fetching local conveyance data'
          );
        },
      });
  }

  // When a month is selected
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    const selected = new Date(
      normalizedMonth.getFullYear(),
      normalizedMonth.getMonth(),
      1
    );
    this.otherExpenseForm.get('expense_month')?.setValue(selected);
    datepicker.close();
  }

  getOtherExpenseById(expenseId: number) {
    this._commonService.showLoader();

    this.travelRequestService
      .get_by_otherExpense(expenseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this._commonService.hideLoader();
          if (res?.data) {
            this.otherExpenseData = res.data;
            this.getLocalConveyanceDataOfGrade(res.data.employee_id);

            this.otherExpenseForm.patchValue({
              current_date: res.data.current_date
                ? new Date(res.data.current_date)
                : '',
              expense_name:
                res.data.EXPENSE_REQUEST_DATA[0]?.expense_name || '',
            });
            const existingMonth = new Date(res.data.current_date);
            const currentDate = new Date();

            const existingMonthMonth = existingMonth.getMonth(); // 0-11
            const existingMonthDate = existingMonth.getDate(); // 1-31

            const currentMonth = currentDate.getMonth(); // 0-11

            if (existingMonthMonth !== currentMonth && existingMonthDate < 5) {
              this.isdraftValid = false;
            }

            if (Array.isArray(res.data.EXPENSE_REQUEST_DATA)) {
              this.expenseData.clear();
              res.data.EXPENSE_REQUEST_DATA.forEach((expense: any) => {
                const group = this.createExpenseDataForm(expense);
                this.expenseData.push(group);
              });
            }

            // Handling expense document
            if (
              res.data.expense_document &&
              res.data.expense_document.length != 0
            ) {
              try {
                const docs = res.data.expense_document;
                this.fileArray = docs.map((doc: any) => ({
                  imagePath: doc.url,
                  url: doc.url,
                }));
              } catch (error) {
                console.error('Error parsing expense document:', error);
                this.fileArray = [];
              }
            } else {
              this.fileArray = [];
            }

            timer(3000)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.validateCapping();
                const currentDate = new Date(); // today's date
                const responseDate = new Date(res.data.current_date); // date from response

                // Check if responseDate's year is less than current year,
                // OR if same year but earlier month
                const isEarlierMonth =
                  responseDate.getFullYear() < currentDate.getFullYear() ||
                  (responseDate.getFullYear() === currentDate.getFullYear() &&
                    responseDate.getMonth() < currentDate.getMonth());

                if (
                  this.typeCheck === 'edit' &&
                  res.data.current_date &&
                  isEarlierMonth
                ) {
                  this.isButtonShow = true;
                  this.toaster.success(
                    'You can now submit this request for approval.'
                  );
                }
              });
          }
        },
        error: (err: any) => {
          this._commonService.hideLoader();
          this.toaster.error(err?.message || 'Error fetching expense details');
        },
      });
  }

  validateCapping() {
    const data = this.expenseData.getRawValue();
    const total = data.reduce(
      (acc, curr) => acc + parseFloat(curr.expense_amount),
      0
    );

    if (total > this.conveyanceData[0]?.budget_limit) {
      this.toaster.error('Total monthly amount exceeds the capping limit.');
      this.isValidToApprove = false;
    }
  }

  onChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.travelRequestService.documents(formData).subscribe({
        next: (res: any) => {
          this.toaster.success('File uploaded successfully!');
          this.fileArray[index].url = res?.url;
        },
        error: (err: any) => {
          this.toaster.error(err?.error?.message || 'File upload failed');
        },
      });
    }
  }

  addFileInput() {
    this.fileArray.push({ imagePath: null, url: null });
  }

  removeFileInput(index: number) {
    if (this.fileArray.length > 1) {
      this.fileArray.splice(index, 1);
    }
  }

  submitForm() {
    if (this.otherExpenseForm.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }

    const formData = this.otherExpenseForm.value;
    const payload = {
      entity_id: this.entity_Id,
      employee_id: this.loginUser?.employee_id,
      financial_id: this.financial_id,
      expense_request_type: 'Other_Expense',
      ...formData,
    };

    console.log(payload);
    // return

    this._commonService.showLoader();
    const apiCall = this.otherExpenseId
      ? this.travelRequestService.update_expense_request({
          ...payload,
          expense_request_id: this.otherExpenseId,
        })
      : this.travelRequestService.create_expense_request(payload);

    apiCall.subscribe({
      next: () => {
        this._commonService.hideLoader();
        this.toaster.success(
          `Expense ${this.otherExpenseId ? 'updated' : 'created'} successfully`
        );
        this.route.navigate([
          '/master/expense-management/other-expense/other-expense-list',
        ]);
      },
      error: (err: any) => {
        this._commonService.hideLoader();
        this.toaster.error(err?.message || 'Submission failed');
      },
    });
  }

  update(isValid: boolean = false) {
    const otherFormGroup = this.otherExpenseForm;
    const currentDateControl = this.otherExpenseForm.get('current_date');

    if (isValid) {
      // Remove min validator
      currentDateControl?.clearValidators();
      currentDateControl?.updateValueAndValidity({ onlySelf: true });
      this.validateCapping();
    }
    if (otherFormGroup.invalid) {
      Object.values(otherFormGroup.controls).forEach((control) =>
        control.markAsTouched()
      );
      this.toaster.error('Please fill in all required fields');
      return;
    }

    const otherFormData = otherFormGroup.value;
    const formData = this.otherExpenseForm.value;

    const payload = {
      expense_request_id: this.otherExpenseId,
      entity_id: this.entity_Id,
      employee_id: this.loginUser.employee_id,
      financial_id: this.financial_id,
      current_date: otherFormData.expense_date,
      expense_request_type: 'Other_Expense',
      isValidToSubmit: isValid,
      isValidToApprove: this.isValidToApprove,
      ...formData,
    };

    this.isSubmitting = true; // Set the flag to true while submitting
    this.travelRequestService
      .update_expense_request(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toaster.success('Other Expense updated successfully');
          this.route.navigate([
            '/master/expense-management/other-expense/other-expense-list',
          ]);
          this.isSubmitting = false;
        },
        error: (err: any) => {
          this.toaster.error('Update Failed. Please try again.');
          this.isSubmitting = false;
        },
      });
  }

  proceed() {
    const dialogRef = this.dialog.open(RemarkDilogueComponent, {
      width: '400px',
      data: this.otherExpenseId,
    });
  }

  close() {
    this.route.navigate([
      '/master/expense-management/other-expense/other-expense-list',
    ]);
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emits signal to unsubscribe
    this.destroy$.complete(); // Completes the subject
  }
}
