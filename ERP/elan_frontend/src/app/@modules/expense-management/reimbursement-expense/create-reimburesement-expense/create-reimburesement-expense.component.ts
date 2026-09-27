import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { environment } from 'src/app/environments/environment';
import { ReimbursementApprovalDialogComponent } from '../reimbursement-approval-dialog/reimbursement-approval-dialog.component';

@Component({
  selector: 'app-create-reimburesement-expense',
  templateUrl: './create-reimburesement-expense.component.html',
  styleUrls: ['./create-reimburesement-expense.component.scss'],
})
export class CreateReimburesementExpenseComponent implements OnInit, OnDestroy {
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

  getExpenseDocumentData(index: number): FormArray {
    const expenses = this.otherExpenseForm.get('expense_data') as FormArray;
    return expenses.at(index).get('documents') as FormArray;
  }

  createExpenseDataForm(expense?: any) {
    const fb = this.fb.group({
      conveyance_type_id: [
        expense ? expense.conveyance_type_id : null,
        Validators.required,
      ],
      expense_name: [
        expense ? expense.expense_name : null,
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
      documents: this.fb.array(
        expense?.expense_document?.map((d: any) =>
          this.fb.group({ url: d.url })
        ) || [],
        [Validators.required]
      ),
    });

    fb.get('travel_range')?.valueChanges.subscribe((value) => {
      if (!expense) {
      }
      const conveyanceTypeId = parseInt(fb.get('conveyance_type_id')?.value);
      const conveyanceType = this.conveyanceData.find(
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
      .getReimbursementDataOfGrade(employee_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.conveyanceData = res.data;
          } else {
            this.toaster.error('No data found for the selected grade');
          }
        },
        error: (err: any) => {
          this.toaster.error(
            err?.error.message || 'Error fetching budget data'
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
      .get_by_otherExpense(expenseId, 'Reimbursement_Expense')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this._commonService.hideLoader();
          if (res?.data) {
            this.getLocalConveyanceDataOfGrade(res.data.employee_id);
            this.otherExpenseData = res.data;

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

    // 1️⃣ Sum by conveyance_type_id
    const totalsByType = new Map<number, number>();
    data.forEach((item: any) => {
      const typeId = item.conveyance_type_id;
      const amount = parseFloat(item.expense_amount) || 0;
      totalsByType.set(typeId, (totalsByType.get(typeId) || 0) + amount);
    });

    // 2️⃣ Assume valid initially
    let valid = true;

    // 3️⃣ Loop through all conveyance configs
    if (this.conveyanceData?.length) {
      for (const item of this.conveyanceData) {
        const budgets = item.reimbursementsBudgets || [];

        // iterate through each budget rule
        for (const budget of budgets) {
          const budgetLimit = parseFloat(budget.budget_limit);

          if (totalsByType.has(item.travel_type_id)) {
            const totalForType = totalsByType.get(item.travel_type_id) || 0;

            if (!isNaN(budgetLimit) && totalForType > budgetLimit) {
              this.toaster.error(
                `Total for ${
                  item.travelType?.name || 'Expense'
                } (${totalForType}) exceeds the capping limit (${budgetLimit}).`
              );
              valid = false;
            }
          }
        }
      }
    }

    this.isValidToApprove = valid;
  }

  onChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.travelRequestService.documents(formData).subscribe({
        next: (res: any) => {
          this.toaster.success('File uploaded successfully!');
          const docs = this.getExpenseDocumentData(index); // now always FormArray ✅
          const doc = this.fb.group({ url: res?.url });
          docs.push(doc);
        },
        error: (err: any) => {
          this.toaster.error(err?.error?.message || 'File upload failed');
        },
      });
    }
  }

  removeFileInput(expenseIndex: number, docIndex: number) {
    const docs = this.getExpenseDocumentData(expenseIndex); // documents FormArray
    if (docs.length > 0) {
      docs.removeAt(docIndex); // removes from reactive form
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
      expense_request_type: 'Reimbursement_Expense',
      ...formData,
    };

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
          '/master/expense-management/reimbursement-expense',
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
    console.log(otherFormGroup.value);

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
      expense_request_type: 'Reimbursement_Expense',
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
            '/master/expense-management/reimbursement-expense',
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
    const dialogRef = this.dialog.open(ReimbursementApprovalDialogComponent, {
      width: '400px',
      data: this.otherExpenseId,
    });
  }

  close() {
    this.route.navigate(['/master/expense-management/reimbursement-expense']);
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emits signal to unsubscribe
    this.destroy$.complete(); // Completes the subject
  }
}
