import { IfStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-previous-employment-details',
  templateUrl: './previous-employment-details.component.html',
  styleUrls: ['./previous-employment-details.component.scss']
})
export class PreviousEmploymentDetailsComponent {
  previousEmpForm:FormGroup;
  id: any;
  
  constructor( private fb: FormBuilder,
    private toastr: ToastrService,
    private employService: EmpRegistrationService,
    private _empRegistration: EmpRegistrationService,
    private activetedRoute: ActivatedRoute,
    private recruitService: RecruitService,
    private route: Router){
    this.previousEmpForm = this.fb.group({
      previous_employement_details: new FormArray([
        new FormGroup({
          company_name: new FormControl(null, [Validators.required]),
          position: new FormControl(null, [Validators.required]),
          from_date: new FormControl(null, [Validators.required]),
          to_date: new FormControl(null, [Validators.required]),
          last_drawn_salary: new FormControl(null, [Validators.required,Validators.min(0)]),
          reson_of_leaving: new FormControl(null, [Validators.required]),
          location: new FormControl(null, [Validators.required]),
        }),
      ]),
    });
  }
  FromDate: any;
  toDate: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  dates = this.now.getDate();
  employee_ids:any

  maxDate = moment({ year: this.year + 100, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  fromDate(e:any){
    this.FromDate= moment(e.value).format('YYYY-MM-DD');
  }
  ToDate(e:any){
    this.toDate= moment(e.value).format('YYYY/MM/DD');
    
  }
  ngOnInit(){
      this.id = localStorage.getItem('employee_id');
      if (this.id) {
        this.employee_ids = this.id
        this.getOuterCondidateData(this.id)
      }

    // this.activetedRoute.queryParams.subscribe((params: any) => {
    //   this.id = params.employee_id;
    // });
  }

  get CF_1(): any {
    return this.previousEmpForm.controls;
  };

  addRowEmploy() {
      <FormArray>this.CF_1.previous_employement_details.push(
        new FormGroup({
          company_name: new FormControl(null, [Validators.required]),
          position: new FormControl(null, [Validators.required]),
          from_date: new FormControl(null, [Validators.required]),
          to_date: new FormControl(null, [Validators.required]),
          last_drawn_salary: new FormControl(null, [Validators.required,Validators.min(0)]),
          reson_of_leaving: new FormControl(null, [Validators.required]),
          location: new FormControl(null, [Validators.required]),
        })
      );
  }

  
  deleteEmployerRows(i: number) {
    if (this.CF_1.previous_employement_details.length > 1) {
      <FormArray>this.CF_1.previous_employement_details.removeAt(i);
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }
  singleData: any;
  getOuterCondidateData(employee_id:any){

    this._empRegistration.getOuterEmployeeData(employee_id).subscribe((res:any)=>{
      console.log(res);
      
      this.singleData =res.data;
      console.log(this.singleData);
      
setTimeout(() => {
  this.basicFormPatch(res?.data)
}, 100);

  

    })
  

  }
  basicFormPatch(apiResponse:any){
    const previousEmployeeDetails = apiResponse.previous_employee_details;

    // Access the 'previous_employement_details' FormArray
    
    // Clear any existing form groups in the FormArray (if needed)
    if (previousEmployeeDetails && previousEmployeeDetails.length > 0) {
      const previousEmploymentDetailsArray = this.previousEmpForm.get('previous_employement_details') as FormArray;
      previousEmploymentDetailsArray.clear();
      previousEmployeeDetails.forEach((detail: any) => {
        previousEmploymentDetailsArray.push(this.fb.group({
          company_name: new FormControl(detail.company_name, [Validators.required]),
          position: new FormControl(detail.position, [Validators.required]),
          from_date: new FormControl(moment(detail.from_date).format('YYYY-MM-DD'), [Validators.required]),
          to_date: new FormControl(moment(detail.to_date).format('YYYY-MM-DD'), [Validators.required]),
          last_drawn_salary: new FormControl(detail.last_drawn_salary, [Validators.required, Validators.min(0)]),
          reson_of_leaving: new FormControl(detail.reson_of_leaving, [Validators.required]),
          location: new FormControl(detail.location, [Validators.required]),
        }));
      });
    }
  }
  submit(){
    if(!this.previousEmpForm.valid){
      this.toastr.error('Please Fill All Reqiuerd Field','Getting Is Empty')
      return 
    }
    console.log(this.previousEmpForm.value);
    

    let val = this.previousEmpForm.value;
    this.recruitService.addPrevious(this.id,val).subscribe((res:any)=>{
      this.toastr.success(res.message)
      this.route.navigate(['new-employee-form/payment-details-form'], { queryParams: { employee_id : this.id}})
    },(err:any)=>{
      this.toastr.success(err.error.message)
    })
  }
}
