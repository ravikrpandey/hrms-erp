import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-sanction-credit-limit',
  templateUrl: './sanction-credit-limit.component.html',
  styleUrls: ['./sanction-credit-limit.component.scss']
})
export class SanctionCreditLimitComponent {
  SanctionForm!: FormGroup;
  submitted = false;
  selectedLevels: string[] = [];
  mode: string = 'create';
  id: any;
  rowData: any;
  customerCategory: any[] = [];
  selectedCategories: number[] = [];

  constructor(
    private toaster: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ConfigurationalmasterService,
  ) { }

  ngOnInit(): void {

    this.SanctionForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });

    this.getAllSanctionCreditLimits();
    this.getAllCategory();
  }

  getAllCategory() {
    this.service.allCustomerCategory().subscribe((res: any) => {
      this.customerCategory = res.data;
    })
  }

  getAllSanctionCreditLimits() {
    this.service.getAllSanctionCreditLimits().subscribe((res: any) => {
      this.rowData = res.data;
      if (this.rowData && this.rowData.length > 0) {
        this.rows.clear();
        this.selectedCategories = [];
        this.rowData.forEach((row: any) => {
          this.rows.push(this.fb.group({
            id: [row.id],
            customer_category_id: [row.customer_category_id, Validators.required],
            amount: [row.amount, Validators.required],
            credit_period: [row.credit_period, Validators.required],
            isSaved: [true],
            isEditing: [false]
          }));
          this.selectedCategories.push(row.customer_category_id);
        });

        this.mode = 'edit';
      }
    });
  }

  get rows(): FormArray {
    return this.SanctionForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      customer_category_id: ['', Validators.required],
      amount: ['', Validators.required],
      credit_period: ['', Validators.required],
      isSaved: [false],
      isEditing: [true]
    });
  }

  allowNumbersOnly(event: KeyboardEvent) {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  addRow(index: number) {
    const currentRow = this.rows.at(index);

    if (currentRow.valid) {
      const selectedCategory = currentRow.value.customer_category_id;

      if (!this.selectedCategories.includes(selectedCategory)) {
        this.selectedCategories.push(selectedCategory);
      }

      currentRow.patchValue({ isSaved: true, isEditing: false });
      if (index === this.rows.length - 1) {
        this.rows.push(this.createRow());
      }
    } else {
      this.toaster.error('Please fill the current row before adding a new one');
    }
  }


removeRow(index: number) {
  if (this.rows.length === 1) {
    this.toaster.warning('At least one row is required');
    return;
  }

  const removedRow = this.rows.at(index).value;


  if (removedRow.level) {
    const levelIndex = this.selectedLevels.indexOf(removedRow.level);
    if (levelIndex > -1) {
      this.selectedLevels.splice(levelIndex, 1);
    }
  }


  if (removedRow.customer_category_id) {
    const catIndex = this.selectedCategories.indexOf(removedRow.customer_category_id);
    if (catIndex > -1) {
      this.selectedCategories.splice(catIndex, 1);
    }
  }

  this.rows.removeAt(index);
  this.toaster.info('Row removed');
}


  onSubmit() {
    this.submitted = true;
    if (this.SanctionForm.valid) {
      const payload = this.SanctionForm.value.rows.map((r: any) => {
        const { isSaved, isEditing, ...rest } = r;
        return rest;
      });
      if (this.mode === 'edit') {
        this.service.updateSanctionCreditLimit(payload).subscribe({
          next: () => this.toaster.success('Updated successfully'),
          error: () => this.toaster.error('Update failed')
        });
      } else {
        this.service.createSanctionCreditLimit(payload).subscribe({
          next: () => {
            this.toaster.success('Saved successfully');
            this.mode = 'edit';
          },
          error: () => this.toaster.error('Save failed')
        });
      }
    } else {
      this.toaster.error('Please fill all required fields');
    }
  }


  goBack() {
    this.location.back();
  }

  getCategoryName(catId: number): string {
    const cat = this.customerCategory.find(c => c.customer_category_id === catId);
    return cat ? cat.customer_category_name : '';
  }
}
