import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advanced-booking-dialogue',
  templateUrl: './advanced-booking-dialogue.component.html',
  styleUrls: ['./advanced-booking-dialogue.component.scss']
})
export class AdvancedBookingDialogueComponent {
  travereqid: any;
  getData: any = [];
  bookingform: FormGroup;
  loginUser: any;
  banks :any;
  entity_Id: any;
  financial_id: any;

  constructor(
    public dialog: MatDialogRef<AdvancedBookingDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private route: Router,
    public travelService: TravelRequestService,
    private fb: FormBuilder
  ) {
    this.travereqid = this.data;
    this.bookingform = this.fb.group({
      totalAmount: new FormControl(null, [Validators.required]),
      paymentMethod: new FormControl(null, [Validators.required]),
      bankName: new FormControl(null, [])
    });
  }

  ngOnInit(): void {
    this.localStorage();
    this.getAll_Active_BANK()
  }

  getAll_Active_BANK(){
    this.travelService.getAll_Active_BANK(this.entity_Id).subscribe((res:any)=>{
      this.banks=res.data
    })
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let financialid: any = localStorage.getItem('financial_id');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
  }

  onPaymentMethodChange(value: string) {
    if (value !== 'Bank') {
      this.bookingform.get('bankName')?.reset();
    }
  }

  submit() {
  
    let val = this.bookingform.value
    if (this.bookingform.invalid) {
      this.toaster.error('Please fill out the form correctly.');
      return
    } 
    const data ={
      "travel_id":  this.travereqid,
      "total_amount": val.totalAmount,
      "payment_type": val.paymentMethod, 
      "bank_detail_id": val.bankName,
      "entity_id": this.entity_Id,
      "financial_year_id": this.financial_id,
      "user_id": this.loginUser.employee_id
    }
    this.travelService.create_advance_booking(data).subscribe((res:any)=>{
      if(res){
        this.toaster.success('Created Successfully')
        this.dialog.close()
        this.route.navigate(['/master/finance/advance-booking/advance-booking-list'])
      }
    },
  (err:any)=>{
    this.toaster.error(err.error.message)
  })
  }

  close() {
    this.dialog.close();
  }
}
