import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from './api.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface Confirmation {
  isConfirmed:boolean,
  isDenied: boolean,
  isDismissed:boolean,
  value : boolean
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private apiServ: ApiService, private toast: ToastrService) { };

  get loginUser(){
    const user = localStorage.getItem('loginUserDetails');
    if(user)
      var userDetails = JSON.parse(user);
    return userDetails;
  }
  
  confirmation(message:string, text="You won't be able to revert this!"):Promise<any>{
    return new Promise(resolve =>{
      Swal.fire({
        title: message,
        text: text,
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result:any) => {
        resolve(result)
      })
    })
  }
   handleControlErrors(control: AbstractControl<any, any>): string {
      if (control?.touched || control?.dirty) {
        if (control?.hasError('required')) {
          return `This field is required`;
        }
        if (control?.hasError('minlength')) {
          debugger
          return `Must be at least ${control.errors?.['minlength']?.requiredLength} characters long`;
        }
        if (control?.hasError('maxlength')) {
          debugger
          return `Cannot exceed ${control.errors?.['maxlength']?.requiredLength} characters`;
        }
        if (control?.hasError('email')) {
          return `Please enter a valid email address, e.g., xyz@gmail.com`;
        }
        if (control?.hasError('requiredTrue')) {
          return `You must accept the terms and conditions`;
        }
        if (control?.hasError('pattern')) {
          debugger
          return `Please check your input for valid characters eg. numeric/text `;
        }
      }
      return '';
    }
     
    checkFormValidity(formGroup: FormGroup): boolean {
      for (const key in formGroup.controls) {
        const control = formGroup.controls[key];
        if (control instanceof FormGroup) {
          if (!this.checkFormValidity(control)) {
            return false;
          }
        }
        if (control.invalid) {
          this.toast.error(`${key} is not filled/invalid`);
          console.log(key);
          return false; 
        }
      }
      return true; 
    }

  
  getAllcountry(){
    return this.apiServ.get('getAllcountry')
  } 
  getAllActivecountry(){
    return this.apiServ.get('getAllActivecountry')
  }
  getAllstate(){
    return this.apiServ.get('getallstatescontroller')
  }
  getStateByCountry(id:string){
    return this.apiServ.get(`getstatesbycountryid/${id}`)
  }
  getCityByState(id:string){
    return this.apiServ.get(`getcitybystateid/${id}`)
  }
  getPincodeByCity(id:string){
    return this.apiServ.get(`getpincodebycityid/${id}`)
  }
  getAllDesignation(){
    return this.apiServ.get('getAllRoleMaster/Super admin')
  }
  getAllEmployeesOfRole(role_id:string){
    return this.apiServ.post(`get_all_employeeBy_User_role/${role_id}?entity_id=1`, {})
  }
}
