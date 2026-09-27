import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryManagementService } from '../../inventory-management.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
})
export class AddDriverComponent {
  form: FormGroup;
  hasButtonData:boolean = false; // true = data present, false = null
  buttonAction: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDriverComponent>,
    private inventoryService: InventoryManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
    this.form.patchValue(data);
    this.hasButtonData = !!(data.driver_name || data.vehicle_number);
  }

  private initForm(): void {
    this.form = this.fb.group({
      driver_name: ['', [Validators.required]],
      driver_contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10,12}$')],
      ],
      vehicle_number: [
        '',
        [
          Validators.required,
          // Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$'),
        ],
      ],
    });
    this.form.get('vehicle_number')?.valueChanges.subscribe((value: string) => {
      if (value && value !== value.toUpperCase()) {
        this.form
          .get('vehicle_number')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
  }

  setButtonAction(action: 'ADD_VERIFY' | 'VERIFY' | 'UPDATE_VERIFY') {
    this.buttonAction = action;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      formValue.buttonAction = this.buttonAction;
      formValue.vehicle_planing_id = this.data.vehicle_planing_id;
      this.inventoryService.updateDriverDetail(this.data.id, formValue).subscribe(
        (response) =>
          this.dialogRef.close({
            message: response || 'Driver details updated successfully',
            status: true,
          }),
        (error) =>
          this.dialogRef.close({
            message: 'Failed to update driver details',
            status: false,
          })
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
