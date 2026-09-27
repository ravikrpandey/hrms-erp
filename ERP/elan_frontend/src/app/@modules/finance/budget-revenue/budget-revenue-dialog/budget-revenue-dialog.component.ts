import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-budget-revenue-dialog',
  templateUrl: './budget-revenue-dialog.component.html',
  styleUrls: ['./budget-revenue-dialog.component.scss']
})
export class BudgetRevenueDialogComponent {

  financialDateForm:FormGroup;
  id:any;
  getData: any;
  financalYearList: any;
  financialYears: any;
  minDate: any;
  maxDate: any;
  minDate2: any;
  endDateDisable = true;
  entity_id : any;
  filter_fy: any;
  constructor(
    private dialog: MatDialogRef<BudgetRevenueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService:FinaceService,
    private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data?.id;
    this.mode = data?.mode;
    this.financialDateForm=this._fb.group({
      financial_year_id:new FormControl('',[Validators.required]),
      start_date:new FormControl('',[Validators.required]),
      end_date:new FormControl('',[Validators.required]),
    })
  }
  
  mode:any;
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.filter_fy = localStorage.getItem('financial_id')
    this.getFinancialYears();
    if(this.id){
      this.getBudgetPlan();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getFirstJanuaryMoment = (year:any) =>  {
    const firstJanuary = new Date(year, 0, 1);
    return firstJanuary;
  }
  getLastDecemberMoment = (year: any) => {
    const lastDecember = new Date(year, 11, 31); // December is month index 11
    return lastDecember;
  }

  findYearValue = (yrIndex: any) => {
    let yr = 0;
    this.financialYears.map((val:any) => {
      if (val.id == yrIndex) yr = val.financial_year
    })
    return yr;
  }

  onSelectedYear = (e:any) => {
    let yr = Number(this.findYearValue(this.financialDateForm?.get('financial_year_id')?.value))
    this.minDate =  this.getFirstJanuaryMoment(yr - 1);
    this.maxDate = this.getLastDecemberMoment(yr - 1);
    const currentDate = new Date();
    if (this.minDate < currentDate) {
      this.minDate = currentDate;
    }
    this.financialDateForm?.get('start_date')?.setValue(null);
    this.financialDateForm?.get('end_date')?.setValue(null);
  }

  onSelectedStartDate = (e:any) => {
    let x = new Date(new Date(e.value).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
    this.financialDateForm.get('start_date')?.setValue(x);
    this.endDateDisable = false;
    this.minDate2 = this.financialDateForm?.get('start_date')?.value;
    this.financialDateForm?.get('end_date')?.setValue(null);
  }

  getVal(event:any){
  }
  getFinancialYears() {
    this.financeService.getFinancialYearActive().subscribe((res: any) => {
      this.financialYears = res.data;
      this.financialYears = this.financialYears.filter((fy:any) => {
        if ( fy.financial_year <= '2024' ) {
           return false;
        }
        else {
          return true;
        }
      })
    });
  }

  onDateChange2(event: any): void {
    let y = new Date(new Date(event.value).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
    this.financialDateForm.get('end_date')?.setValue(y);
  }
  
  submitData(data:any){
    if(this.financialDateForm.invalid){
      return
    }
    if(this.id){ 

    this.financeService.updateBudgetPlan(this.id, data).subscribe(
      (res: any) => {

        this.toaster.success('Budget Plan updated Successfully');
        this.reloadCurrentRoute();
        this.dialog.close();
        this.financialDateForm.reset();
      }, (err: any) => {
        if (err.error.code == 400) {
          this.toaster.error(err.error.message);
        } else if (err.status == 409) {
          this.toaster.error('Budget Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      });
    }
    else{
      this.financeService.createBudgetPlan(data,this.filter_fy,this.entity_id).subscribe(
        (res: any) => {
          if (res.message == "Budget Plan Year Already Exits!") {
            this.toaster.warning('Budget Plan already Exists!');
          }
          else {
            this.toaster.success('Budget plan Added Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.financialDateForm.reset();
          }
        },
        (err: any) => {
          if (err.error.code == 400) {
            this.toaster.error(err.error.message);
          } else if (err.status == 201) {
            this.toaster.error('Region Already Exits!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }
  }
  getBudgetPlan() {
    this.financeService.getBudgetPlanById(this.id).subscribe((res: any) => {
      this.getData = res.data;
      this.financialDateForm.patchValue({
        financial_year_id:this.getData.financial_year_id,
        start_date:this.getData.start_date,
        end_date:this.getData.end_date,
      })
      this.minDate2 = this.financialDateForm?.get('start_date')?.value;
    });
  }
}