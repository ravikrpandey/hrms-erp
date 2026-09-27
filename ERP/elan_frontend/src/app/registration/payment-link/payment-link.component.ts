import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-payment-link',
  templateUrl: './payment-link.component.html',
  styleUrls: ['./payment-link.component.scss']
})
export class PaymentLinkComponent {
  paymentForm:FormGroup;

  constructor(
     private fb: FormBuilder,
     private leadService:LeadService,
     private toaster:ToastrService

     ){
    this.paymentForm = this.fb.group({
      title: new FormControl(null,[Validators.required]),
      first_name: new FormControl(null,[Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      designation: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      br_number: new FormControl(null,[Validators.required]),
      invoice_ref: new FormControl(null),
      sameBillingAddress:new FormControl(null),
      address: new FormControl(null, [Validators.required]),
      billing_address: new FormControl(null,[Validators.required]),
      tds_ammount: new FormControl(null),
      tan_number: new FormControl(null,[Validators.required]),
      ammount: new FormControl(null,[Validators.required]),
      currency: new FormControl(null,[Validators.required]),
      mobile_number: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),

    });
  
  }

  submitForm(){
    this.paymentForm.get('address')?.markAsTouched();
    this.paymentForm.get('billing_address')?.markAsTouched();

    if (this.paymentForm.valid) {
      this.leadService.createTraningPayment(this.paymentForm.value).subscribe((res:any)=>{
        if(res){
          this.toaster.success('Payer details submitted sucessfully.')
          this.paymentForm.reset();
        }
      }, err => {
        if(err){
          this.toaster.error('Something went wrong.')
          this.paymentForm.reset();
        }
      })
      console.log(this.paymentForm.value);
      
    }
  }

  updateAddress() {
    const billingAddressControl = this.paymentForm.get('billing_address');
    const addressControl = this.paymentForm.get('address');

    if (this.paymentForm.get('sameBillingAddress')?.value) {
      billingAddressControl?.setValue(addressControl?.value);
    } else {
      billingAddressControl?.setValue('');
    }
  }
}
