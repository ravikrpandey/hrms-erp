import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryManagementService } from '../../inventory-management.service';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-lorry-details',
  templateUrl: './lorry-details.component.html',
  styleUrls: ['./lorry-details.component.scss']
})
export class LorryDetailsComponent {
  form: FormGroup;
  hasButtonData:boolean = false; // true = data present, false = null
  buttonAction: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LorryDetailsComponent>,
    private inventoryService: InventoryManagementService,
    private warehouseService: warehouseListService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
    this.hasButtonData = !!(data.driver_name || data.vehicle_number);
  }

  private initForm(): void {
    this.form = this.fb.group({
      driver_name: ['', [Validators.required]],
      driver_contact: ['',[Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      vehicle_number: ['',[Validators.required]],
      generate_lr_no:['MANUAL',[Validators.required]],
      lr_no:['',[Validators.required]]
    });

    this.form.get('vehicle_number')?.valueChanges.subscribe((value: string) => {
      if (value && value !== value.toUpperCase()) {
        this.form.get('vehicle_number')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

    this.form.get('generate_lr_no')?.valueChanges.subscribe(value => {
      const lrControl = this.form.get('lr_no');

      if (value === 'MANUAL') {
        lrControl?.setValidators([Validators.required]);
      } else {
        lrControl?.clearValidators();
        lrControl?.setValue('');
      }

      lrControl?.updateValueAndValidity();
    });

    this.form.patchValue(this.data);
    //console.log(this.data,'==============data=========')
  }

  setButtonAction(action: 'ADD_VERIFY' | 'VERIFY' | 'UPDATE_VERIFY') {
    this.buttonAction = action;
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      formValue.buttonAction = this.buttonAction;
      formValue.vehicle_planing_id = this.data.vehicle_planing_id;
      formValue.warehouse_id = this.data.warehouse_id;
      this.warehouseService.updateLRData(this.data.id, formValue).subscribe(
        (response) =>
          this.dialogRef.close({
            message: response || 'Lorry details updated successfully',
            status: true,
          }),
        (error) =>
          this.dialogRef.close({
            message: 'Failed to update lorry details',
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