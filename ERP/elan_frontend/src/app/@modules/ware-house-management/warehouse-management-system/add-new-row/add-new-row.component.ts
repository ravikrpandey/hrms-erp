import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryManagementService } from '../../inventory-management.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-new-row',
  templateUrl: './add-new-row.component.html',
  styleUrls: ['./add-new-row.component.scss']
})
export class AddNewRowComponent {
  AddRowForm: FormGroup;
  entity_id: any;
  actionType: any;
  row_id: any;
  warehouse_id: any;
  financial_year_id: string | null;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private inventory_services: InventoryManagementService,
    public dialog: MatDialogRef<AddNewRowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddRowForm = this.fb.group({
      row_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      capacity: new FormControl(null, [Validators.required]),
      warehouse_id: new FormControl(null),
    });
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.actionType = this.data.type;
    this.row_id = this.data.id;
    this.warehouse_id = this.data.warehouseId;
    this.AddRowForm.get('warehouse_id')?.setValue(this.warehouse_id);
    if(this.row_id){
      this.AddRowForm.get('row_name')?.setValue(this.data.row_name);
    }
  }

  onSubmitForm() {
    if (this.AddRowForm.invalid) {
      Object.keys(this.AddRowForm.controls).forEach(key => {
        this.AddRowForm.controls[key].markAsTouched();
      });
      return;
    }
    if(this.row_id && this.row_id!=null){
      this.inventory_services.UpdateRow(this.AddRowForm.value,this.row_id).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.confirmDialog();
        },
        (err) => {
           {
            this.toast.error(err.error.message,'Error Message');
          } 
        }
      );
    }
    else{
      this.inventory_services.addNewRow(this.AddRowForm.value,this.entity_id,this.financial_year_id).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.confirmDialog();
        },
        (err) => {
          
          this.toast.error(err.error.message,'Error Message');
     
        }
      );
    }
  }

  confirmDialog() {
    this.dialog.close(this.AddRowForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}

