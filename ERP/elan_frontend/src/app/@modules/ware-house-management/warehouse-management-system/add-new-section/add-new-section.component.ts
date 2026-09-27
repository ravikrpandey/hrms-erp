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
  selector: 'app-add-new-section',
  templateUrl: './add-new-section.component.html',
  styleUrls: ['./add-new-section.component.scss']
})
export class AddNewSectionComponent {
  AddSectionForm: FormGroup;
  entity_id: any;
  row_id: any;
  self_id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private inventory_services: InventoryManagementService,
    public dialog: MatDialogRef<AddNewSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddSectionForm = this.fb.group({
      section_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      capacity: new FormControl(null, [Validators.required]),
      row_id: new FormControl(null),
      self_id: new FormControl(null),
    });
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.row_id = this.data.row_id;
    this.self_id = this.data.self_id;
    this.AddSectionForm.get('row_id')?.setValue(this.row_id);
    this.AddSectionForm.get('self_id')?.setValue(this.self_id);
  }

  onSubmitForm() {
    if (this.AddSectionForm.invalid) {
      Object.keys(this.AddSectionForm.controls).forEach(key => {
        this.AddSectionForm.controls[key].markAsTouched();
      });
      return;
    }

    this.inventory_services.addNewSection(this.AddSectionForm.value,this.entity_id).subscribe(
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
    this.dialog.close(this.AddSectionForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}



