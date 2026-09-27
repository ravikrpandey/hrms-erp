import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-expected-delivery-days-dialog',
  templateUrl: './expected-delivery-days-dialog.component.html',
  styleUrls: ['./expected-delivery-days-dialog.component.scss']
})
export class ExpectedDeliveryDaysDialogComponent {
  
  expectedDeliveryDaysForm: FormGroup
  constructor(
    private dialog: MatDialogRef<ExpectedDeliveryDaysDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,

    public _fb: FormBuilder, public toaster: ToastrService, public route: Router
  ) {    
    this.expectedDeliveryDaysForm = this._fb.group({
      days: [, Validators.required],
    })
  }
 
  visibility: any;
  ngOnInit() {    
    this.visibility = this.data.view;
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  ngSubmitDesignation(form:any) {
    
    if (this.expectedDeliveryDaysForm.invalid) {
      this.expectedDeliveryDaysForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');
      return
    }

    let frmData = this.expectedDeliveryDaysForm.value;
    
    this._configurationalmasterService.createExpectedDays(frmData).subscribe({
      next:(res:any) =>{
        this.toaster.success(res.message);
        this.dialog.close(res);
      },error:(err:any) =>{
        this.toaster.error(err.error.message);
      },
    })

  }

}
