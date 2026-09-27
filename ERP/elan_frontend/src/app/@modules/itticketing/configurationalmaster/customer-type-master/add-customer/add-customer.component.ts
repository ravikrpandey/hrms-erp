import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent {
  id: any;
  addCustomerForm: FormGroup;
  mode: any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<''>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService: FinaceService,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode;
    
    this.addCustomerForm = this._fb.group({
      lavel: new FormControl('', [Validators.required, noLeadingSpaces()]),
      customer_type_name: new FormControl('', [
        Validators.required,
        noLeadingSpaces(),
      ]),
    });
  }

  ngOnInit() {
    if (this.id) {
      this.getSealTypeById();
    }
    if (this.mode=='view') {
      this.addCustomerForm.disable();
    } else {
      this.addCustomerForm.enable();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getVal(event: any) {}
  submitData(data: any) {
    if (this.addCustomerForm.invalid) {
      Object.keys(this.addCustomerForm.controls).forEach((controlName) => {
        const control = this.addCustomerForm.get(controlName);
        if (control && control.invalid) {
        }
      });
      return this.toaster.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    if (this.id) {
      this._configurationalmasterService
        .updateCustomerByid(this.id, data)
        .subscribe(
          (res: any) => {
            this.toaster.success('Customer Type Updated Successfully.');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.addCustomerForm.reset();
          },
          (err: any) => {
            this.toaster.error(err.error.message);
            // if (err.status == 400) {
            //   this.toaster.error('Something went Wrong!');
            // } else if (err.status == 409) {
            //   this.toaster.error('Leave Type is Already Exits!');
            // } else {
            //   this.toaster.error('Error in submission!');
            // }
          }
        );
    } else {
      this._configurationalmasterService.customerType(data).subscribe(
        (res: any) => {
          this.toaster.success('Customer Type Added SuccessFully.');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.addCustomerForm.reset();
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 201) {
          //   this.toaster.error('Budget Category already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
  }
  getSealTypeById() {
    this._configurationalmasterService
      .getCustomertByIdDD(this.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.addCustomerForm.patchValue({
          lavel: this.getData.lavel,
          customer_type_name: this.getData.customer_type_name,
        });
      });
  }
}
