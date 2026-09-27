import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-transport-charge',
  templateUrl: './create-transport-charge.component.html',
  styleUrls: ['./create-transport-charge.component.scss']
})
export class CreateTransportChargeComponent {
  chargeMasterForm!: FormGroup;
  isEditMode = false;

 

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTransportChargeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configMaster : ConfigurationalmasterService
  ) {}

  ngOnInit(): void {

    this.createForm();

    if (this.data) {
      this.isEditMode = true;
     this.getTransportChargeById(this.data.id)
    }
  }

  createForm(): void {

    this.chargeMasterForm = this.fb.group({

      charge_name: ['', Validators.required],

    });

  }

  save(): void {

    if (this.chargeMasterForm.invalid) {
      this.chargeMasterForm.markAllAsTouched();
      return;
    }

    this.configMaster.createChargeMst(this.chargeMasterForm.value).subscribe({
      next:(res:any)=> {
        console.log(res)
        this.dialogRef.close({
          action: 'save',
          data: this.chargeMasterForm.value
        });
      },error:(err:any)=>{
        console.log(err);
      }
    })


  }

  update(): void {

    if (this.chargeMasterForm.invalid) {
      this.chargeMasterForm.markAllAsTouched();
      return;
    }

    this.configMaster.updateTransportCharge(this.data?.id,this.chargeMasterForm.value).subscribe({
      next:(res:any)=> {
        console.log(res)
        this.dialogRef.close({
          action: 'update',
          data: this.chargeMasterForm.value
        });
      },error:(err:any)=>{
        console.log(err);
      }
    })

  }

  close(): void {
    this.dialogRef.close();
  }

  getTransportChargeById(id:any){
    this.configMaster.getTransportChargeById(id).subscribe({
      next:(res:any)=> {
        console.log(res);
      this.chargeMasterForm.patchValue(res.data);
      },error:(err)=> {
        console.log(err);
      },
    })
  }
}
