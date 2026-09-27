import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss']
})
export class OfferFormComponent implements OnInit{
  form:FormGroup;
  fff:any;
  imageToUpload:any;
  imageToUpload1:any;
  imagePath: any;
  imagePath1: any;
  data1:any;
  getData:any;
  // data:any;
  dddd:any ='';
  productDataId:any;
constructor(private fb: FormBuilder,
  private config_service:ConfigurationalmasterService,
  private toast: ToastrService,
  private dialogRef: MatDialogRef<any>,
  @Inject(MAT_DIALOG_DATA) public data: any){
  this.form = this.fb.group({
    offerCTC: new FormControl('',Validators.required), 
    joiningDate: new FormControl('',Validators.required), 
    reportingTime: new FormControl(''), 
    offerValidTill: new FormControl('',Validators.required), 
  });
  if(data){
    this.productDataId = data.id;
    
  }

}

ngOnInit(): void {
  
}









productSave(){

  
  
 
  if (this.form.invalid) {
    this.toast.error('Enter Required Field', 'Something Went Wrong')
    return;
  }





  let val = this.form.value;
  
 
}

}
