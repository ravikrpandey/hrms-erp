import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { YearlyAssessmentService } from '../../../../@shared/services/performance-management/yearly-assessment.service';
import { ListAssessmentComponent } from '../list-assessment/list-assessment.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})

export class CreateAssessmentComponent {
  action :any;
  yearlyAssessment:any =[];
  yearlyAssessmentForm: FormGroup;
  assessId: any;
  entity_id: any="";
  financialYear: any =[];
  startDate:any;
  endDate:any;
  singlefinancialYear: any;
  assessmentName: any;
  employee_id: any;
  minEndDate:any;
  minStartDate:any;

  private subscription: Subscription = new Subscription();
  financialYearMap: any = {};
  financial_id: string | null;
  financial_year_local_storage: string | null;
  financialYear2: any;
  fYears: any;

  constructor(private fb :FormBuilder, 
    private assessmentService: YearlyAssessmentService,
    private $miscellaneous: MiscellaneousService,
    private _commonService : CommonService,
    private dialog: MatDialogRef<ListAssessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public assessmentYearData: any,
    private toaster: ToastrService,
    private route: Router
  ){
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.employee_id = Number(localStorage.getItem('EmpMainId'));
    this.financial_id = localStorage.getItem('financial_id');
    this.yearlyAssessmentForm = this.fb.group({
      financial_year_id:[null,Validators.required],
      assessment_name: ['',[Validators.required,this.noSpacesAlphanumericValidator]],
      start_date: [null,[Validators.required]],
      end_date: [null,[Validators.required]],
      entity_id: [this.entity_id],
      employee_id: [this.employee_id],
      staus: ['Pending For Self Assessment'],
      assessment_degree: [null,Validators.required]
    });
  }

  ngOnInit(){
    this.action = this.assessmentYearData?.action;
    // this.minStartDate = new Date();
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.financial_year_local_storage = localStorage.getItem('financial_id');
    // this.yearlyAssessmentForm.get('start_date')?.disable();
    // this.yearlyAssessmentForm.get('end_date')?.disable();
    this.yearlyAssessmentForm.patchValue({
      start_date:null,
      end_date:null,
    });
    if(this.action == "edit"){
      this.assessId = this.assessmentYearData.data.id;
      this.yearlyAssessmentForm.patchValue({
        // financial_year_id: this.assessmentYearData.data.financial_year_id,
        assessment_name: this.assessmentYearData.data.assessment_name,
        start_date:this.assessmentYearData.data.start_date,
        end_date: this.assessmentYearData.data.end_date,
        assessment_degree: this.assessmentYearData.data.assessment_degree
      });
      
      this.startDate = this.assessmentYearData.data.start_date;
      this.endDate = this.assessmentYearData.data.end_date;
      this.assessmentName = this.assessmentYearData.data.assessment_name
      const currentDate = new Date();
      const startDate = new Date(this.assessmentYearData.data.start_date); // Convert start_date to a Date object
      if (currentDate < startDate) {
          this.minStartDate = currentDate; // Set minStartDate to currentDate if it's before startDate
      } else {
          this.minStartDate = startDate; // Otherwise, set minStartDate to startDate
      }
    }

    this.$miscellaneous.getAllActivefinancial_year().subscribe((res:any)=>{
      if(res.code == 200){
        this.yearlyAssessment = res.data;
        const currentYear = new Date().getFullYear();
        this.financialYear = this.yearlyAssessment.filter((assessment:any) => {
          const year = parseInt(assessment.financial_year);
          if ( this.financial_year_local_storage == assessment.id ) {
            return true;
          }
        });
        this.financialYear.forEach((item:any) => {
          this.financialYearMap[item.id] = item.financial_year;
        });
        this.financialYear2 = this.financialYear;
        this.fYears = this.financialYear.map((value:any) => value.financial_year)
        this.subscription.add(
          this.yearlyAssessmentForm.get('financial_year_id')?.valueChanges.subscribe(value => {
            const financialYear = this.financialYearMap[value];
            this.enableStartdate2(financialYear);
          })
        );
    
        if(this.action == "edit"){
          this.yearlyAssessmentForm.patchValue({
            financial_year_id: this.assessmentYearData.data.financial_year_id,
          });
        }
       
        if(this.action == 'view'){
          this.singlefinancialYear = this.yearlyAssessment.find((assessment:any) => {
            if(assessment.id === this.assessmentYearData.data.financial_year_id){
              return assessment;
            }
          });
        }
      }
      
    });
  }

  enableStartdate(value:any){
    if(this.yearlyAssessmentForm.controls['financial_year_id'].valid){
      this.yearlyAssessmentForm.get('start_date')?.enable();
    }
    // this.minStartDate
  }

  enableStartdate2(value:any){
    const year = parseInt(value, 10);
    // this.minStartDate = new Date(year, 0, 1); 
    this.minStartDate = new Date();
    if ( this.action == 'edit'){
      const currentDate = new Date();
      const startDate = new Date(this.assessmentYearData.data.start_date); // Convert start_date to a Date object
      if (currentDate < startDate) {
          this.minStartDate = currentDate; // Set minStartDate to currentDate if it's before startDate
      } else {
          this.minStartDate = startDate; // Otherwise, set minStartDate to startDate
      }
    }
  }

  enableEnddate(){
    if(this.yearlyAssessmentForm.controls['start_date'].valid){
      this.yearlyAssessmentForm.get('end_date')?.enable();
      this.yearlyAssessmentForm.get('end_date')?.markAllAsTouched();
    }
  }
  

  startDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const dateValue = new Date(control.value);
      const startDate = dateValue.getFullYear();
      const financial_year_id = control.root.get('financial_year_id')?.value;
      if(financial_year_id){
        const selectedFinancialYear = this.financialYear.find((data:any) =>
          data.id == financial_year_id
        );
        const selectedFinYear = selectedFinancialYear.financial_year;
        if (startDate < selectedFinYear) {
          return { 'startDateInvalid': true };
        }
        this.enableEnddate()
      }
      return null;
    };
  }
  
  endDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.root.get('start_date')?.value;
    const endDate = control.value;
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { 'endDateInvalid': true };
    }
    return null;
  }

   noSpacesAlphanumericValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  }

  parseDDMMYYYY(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  onSubmitAssessmentYear(){
    this.yearlyAssessmentForm.value['filter_fy'] = Number(this.financial_id)
    Object.values(this.yearlyAssessmentForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if ( this.yearlyAssessmentForm.invalid ){
      this.toaster.error("Please fill all the fields valid")
      return;
    }
    
    this.yearlyAssessmentForm.get('start_date')?.enable();
    this.yearlyAssessmentForm.get('end_date')?.enable();
    let x =  this.yearlyAssessmentForm.get('start_date')?.value;
    x = new Date(new Date(x).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
    let y =  this.yearlyAssessmentForm.get('end_date')?.value;
    y = new Date(new Date(y).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
    this.yearlyAssessmentForm.get('start_date')?.setValue(x);
    this.yearlyAssessmentForm.get('end_date')?.setValue(y);
    let obj = this.yearlyAssessmentForm.value;
    obj.filter_fy =  Number(this.financial_id)
    if(this.yearlyAssessmentForm.invalid){
      return
    }
    else{
      if(this.assessId){
        this._commonService?.showLoader()
        this.assessmentService.updateYearlyAssessment(this.assessId,obj).subscribe((res)=>{
          this.toaster.success(res.message);
          this._commonService?.hideLoader()
          this.confirmDialog();
          this.reloadCurrentRoute();
        }, err => {
          this._commonService?.hideLoader()
          this.toaster.error(err.error.message)
        });
      }
      else{
        this._commonService?.showLoader()
        this.assessmentService.createYearlyAssessment(obj).subscribe((res)=>{
          this.toaster.success(res.message);
          this._commonService?.hideLoader()
          this.confirmDialog();
          this.reloadCurrentRoute();
        }, err => {
          this._commonService?.hideLoader()
          this.toaster.error(err.error.message)
        });
      }
    }
  }

  fYearFilter(e: any) {
    const aa = e
    let filteredVariable = this.financialYear2.filter((item: any) => aa.includes(item.financial_year));
    this.financialYear = filteredVariable
  }

  confirmDialog() {
    this.dialog.close(this.yearlyAssessmentForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value ? new Date(event.value) : null;
    const nextDay = startDate ? new Date(startDate) : null;
    nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
    this.minEndDate = nextDay;
    this.yearlyAssessmentForm.controls['end_date'].setValue(null);
  }

}
