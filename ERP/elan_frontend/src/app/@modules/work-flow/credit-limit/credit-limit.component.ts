import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.component.html',
  styleUrls: ['./credit-limit.component.scss'],
})
export class CreditLimitComponent {
  levelForm!: FormGroup;
  submitted = false;

  levels: any[] = [];
  selectedLevels: any[] = [];
  mode: string = 'create';
  id: any;
  rowData: any;

  constructor(
    private toaster: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ConfigurationalmasterService
  ) {}

  ngOnInit(): void {
    this.getLevels();

    this.levelForm = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });

    this.getAllCreditLimits();
  }

  getLevels() {
    const entityId = localStorage.getItem('selectedEntityId');
    this.service.getLevelType(entityId).subscribe((res: any) => {
      this.levels = res.data;
    });
  }

  getAllCreditLimits() {
    this.service.getAllCreditLimits().subscribe((res: any) => {
      this.rowData = res.data;

      if (this.rowData && this.rowData.length > 0) {
        this.rows.clear();
        this.selectedLevels = []; // reset

        this.rowData.forEach((row: any) => {
          this.rows.push(
            this.fb.group({
              id: [row.id],
              level_id: [row.level_id, Validators.required],
              over_due_days: [row.over_due_days, Validators.required],
              credit_limit: [row.credit_limit, Validators.required],
              isSaved: [true],
              isEditing: [false],
            })
          );
          this.selectedLevels.push(row.level_id);
        });

        this.mode = 'edit';
      }
    });
  }

  get rows(): FormArray {
    return this.levelForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      level_id: ['', Validators.required],
      over_due_days: ['', Validators.required],
      credit_limit: ['', Validators.required],
      isSaved: [false],
      isEditing: [true],
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
      const selectedLevel = currentRow.value.level;

      if (!this.selectedLevels.includes(selectedLevel)) {
        this.selectedLevels.push(selectedLevel); // track used level
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

  const removedRow = this.rows.at(index);
  const removedLevel = removedRow.value.level;
  if (removedLevel) {
    const levelIndex = this.selectedLevels.indexOf(removedLevel);
    if (levelIndex > -1) {
      this.selectedLevels.splice(levelIndex, 1);
    }
  }

    this.rows.removeAt(index);
    this.toaster.info('Row removed');
  }

  onSubmit() {
    this.submitted = true;

    if (this.levelForm.valid) {
      const payload = this.levelForm.value.rows.map((r: any) => {
        const { isSaved, isEditing, ...rest } = r;
        return rest;
      });

      if (this.mode === 'edit') {
        this.service.updateCreditLimit(payload).subscribe({
          next: () => this.toaster.success('Updated successfully'),
          error: () => this.toaster.error('Update failed'),
        });
      } else {
        this.service.createCreditLimit(payload).subscribe({
          next: () => {
            this.toaster.success('Saved successfully');
            this.mode = 'edit';
          },
          error: () => this.toaster.error('Save failed'),
        });
      }
    } else {
      this.toaster.error('Please fill all required fields');
    }
  }

  goBack() {
    this.location.back();
  }
}
