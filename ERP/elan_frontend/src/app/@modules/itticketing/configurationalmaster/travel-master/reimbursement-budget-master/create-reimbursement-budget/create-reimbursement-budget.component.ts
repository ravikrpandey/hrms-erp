import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-create-reimbursement-budget',
  templateUrl: './create-reimbursement-budget.component.html',
  styleUrls: ['./create-reimbursement-budget.component.scss']
})
export class CreateReimbursementBudgetComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  travelData: any[] = [];
  gradeData: any[] = [];

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
      remark: [null],
      reimbursementBudgets: this.fb.array([]),
    });

    this.form.get('travel_type_id')?.valueChanges.subscribe((value) => {
      if (value) {
      }
    });
    this.form.get('travel_grade_ids')?.valueChanges.subscribe((value) => {
      if (value) {
        const travelTypeId = this.form.get('travel_type_id')?.value;
        const travel = this.travelData.find((item) => item.id === travelTypeId);
      }
    });
    this.getTravelData();
    this.getGradeData();
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
      } else {
        this.addDomesticBudgetLimit();
      }
    });
  }

  get reimbursementBudgets(): FormArray {
    return this.form.get('reimbursementBudgets') as FormArray;
  }

  addDomesticBudgetLimit(): void {
    const fb = this.fb.group({
      travel_grade_ids: [null],
      budget_limit: [null],
    });
    this.reimbursementBudgets.push(fb);
  }

  removeDomesticBudgetLimit(index: number): void {
    this.reimbursementBudgets.removeAt(index);
  }

  getTravelData() {
    this.service.getAllTravelType('reimbursement').subscribe((data: any) => {
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
          });
          data.reimbursementsBudgets.forEach((element: any) => {
            const fb = this.fb.group({
              travel_grade_ids: [element.gradeIds],
              budget_limit: [element.budget_limit],
            });
            this.reimbursementBudgets.push(fb);
          });
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
      this.service.addReimbursementBudget(this.form.value).subscribe(
        (response) => {
          this.router.navigate([
            'master/configurational-master/travel-master/reimbursement-budget',
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
}
