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
  selector: 'app-add-new-self',
  templateUrl: './add-new-self.component.html',
  styleUrls: ['./add-new-self.component.scss']
})
export class AddNewSelfComponent {
  AddSelfForm: FormGroup;
  entity_id: any;
  row_id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private inventory_services: InventoryManagementService,
    private route: Router,
    public dialog: MatDialogRef<AddNewSelfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddSelfForm = this.fb.group({
      self_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      capacity: new FormControl(null, [Validators.required]),
      row_id: new FormControl(null)
    });
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.row_id = this.data.row_id;
    this.AddSelfForm.get('row_id')?.setValue(this.row_id);
  }

  onSubmitForm() {
    if (this.AddSelfForm.invalid) {
      Object.keys(this.AddSelfForm.controls).forEach(key => {
        this.AddSelfForm.controls[key].markAsTouched();
      });
      return;
    }

    this.inventory_services.addNewSelf(this.AddSelfForm.value,this.entity_id).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.confirmDialog();
      },
      (err) => {
        this.toast.error(err.error.message,'Error Message'); 
      }
    );
  
  }

  confirmDialog() {
    this.dialog.close(this.AddSelfForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}


