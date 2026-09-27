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
  entity_Id: any;
  entity_id: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConfigurationalmasterService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private route: ActivatedRoute,
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
     if (this.entity_Id) {
      this.get_all_active_grade(this.entity_Id);
    }
  }

  ngOnInit(): void {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity);
    this.entity_id = entity;  // keeping string if needed separately
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
    if (this.entity_Id) {
      this.get_all_active_grade(this.entity_Id);
    }
  }

  get reimbursementBudgets(): FormArray {
    return this.form.get('reimbursementBudgets') as FormArray;
  }

  addDomesticBudgetLimit(): void {
    const fb = this.fb.group({
      travel_grade_ids: [],
      budget_limit: [],
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

  get_all_active_grade(entity_Id: any) {
    if (!this.entity_Id) {
      console.error("Entity ID not found in localStorage");
      return;
    }

    this._empRegistration.get_all_active_grade(entity_Id).subscribe(
      (res) => {
        if (res && res.data) {
          // map API response to {id, name} so your HTML works as is
          this.gradeData = res.data.map((item: any) => ({
            id: item.grade_id,
            name: item.grade_name
          }));
        }
      },
      (err) => {
        console.error("Error fetching grade data:", err);
        this.toast.error("Failed to load grade data");
      }
    );
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode === 'edit') { 
      this.form.value.id = this.id;
    }
    this.service.addReimbursementBudget(this.form.value).subscribe(
      (response) => {
        this.router.navigate([
          '/master/configurational-master/reimbursement-master/reimbursement-budget',
        ]);
        if (this.mode === 'edit') {
          this.toast.success('Travel Budget updated successfully');
        } else {
          this.toast.success('Travel Budget added successfully');
        }
        this.form.reset();
      },
      (error) => {
        console.error('Error saving Travel Budget:', error);

        // ✅ Duplicate name validation (from backend)
        if (error.status === 400 && error.error?.message === 'Travel budget name already exists') {
          this.toast.warning('Travel Budget name already exists. Please choose a different name.');
        }
        // ✅ Name required validation (from backend)
        else if (error.status === 400 && error.error?.message === 'Name is required') {
          this.toast.error('Name is required.');
        }
        // ✅ Generic error
        else {
          this.toast.error('Travel Budget name already exists');
        }
      }
    );
  }
  close() {
    this.router.navigate(['/master/configurational-master/reimbursement-master/reimbursement-budget'])
  }
}
