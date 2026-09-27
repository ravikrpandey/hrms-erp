import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-registration-link',
  templateUrl: './registration-link.component.html',
  styleUrls: ['./registration-link.component.scss']
})
export class RegistrationLinkComponent {
  registrationForm:FormGroup;
  constructor(
     private fb: FormBuilder,
     private leadService:LeadService,
     private toaster:ToastrService
     ){
    this.registrationForm = this.fb.group({
      title: new FormControl(null,[Validators.required]),
      name: new FormControl(null,[Validators.required]),
      designation: new FormControl(null,[Validators.required]),
      org_name: new FormControl(null,[Validators.required]),
      org_address: new FormControl(null,[Validators.required]),
      business_activity: new FormControl(null,[Validators.required]),
      location: new FormControl(null,[Validators.required]),
      date: new FormControl(null,[Validators.required]),
      email: new FormControl(null, [Validators.required]),
      br_number: new FormControl(null),
      mobile_number: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      landline_number: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      persons: this.fb.array([this.createPerson()]),
    });
  
  }
  get persons(): FormArray {
    return this.registrationForm.get('persons') as FormArray;
  }

  createPerson(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      designation: [''],
      contactNumber: ['', [Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addPerson() {
    this.persons.push(this.createPerson());
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }
  submitForm(){
    
    if (this.registrationForm.valid) {
      this.leadService.createRegistration(this.registrationForm.value).subscribe((res:any)=>{
        if(res){
          this.toaster.success('Registration form submitted sucessfully.');
          this.registrationForm.reset();
        }
      }, err => {
        if(err){
          this.toaster.error('Something went wrong.');
          this.registrationForm.reset();
        }
      })
      
    }
      console.log(this.registrationForm.value);
  }
}
