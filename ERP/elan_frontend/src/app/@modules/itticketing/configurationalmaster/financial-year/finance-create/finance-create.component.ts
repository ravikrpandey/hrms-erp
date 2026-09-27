import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { FinancialListComponent } from '../financial-list/financial-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-finance-create',
  templateUrl: './finance-create.component.html',
  styleUrls: ['./finance-create.component.scss']
})
export class FinanceCreateComponent {
  btnValue:any = "";
  FinancialYear : FormGroup;
  financeYear : any= [];
  action: any= "";
  financeId: any = "";
  financeYear2: any;
  financeYearList: any;
  id: any;
   minEndDate: Date | null = null;
  minAddStartDate: Date | null = null;
  minAddEndDate: Date | null = null;
  financial_year_id: string | null;
  entity_id:any;
  constructor(
    private dialog: MatDialogRef<FinancialListComponent>,
    @Inject(MAT_DIALOG_DATA) public financeYearData: any,
    private _fb: FormBuilder,
    private finance: FinaceService,
    private toaster: ToastrService,
    private _commonService : CommonService,
    private activeroute: ActivatedRoute,
    private route: Router){
    this.FinancialYear = this._fb.group({
      financial_year: new FormControl(null, [Validators.required]),
      year_start_date:new FormControl(null,[Validators.required]),
      year_end_date:new FormControl(null,[Validators.required]),
      add_start_date:new FormControl(null),
      add_end_date:new FormControl(null),
      is_add_date:new FormControl(null),
    });
    console.log("this.financeYearDatann",this.financeYearData);

    this.FinancialYear.get('is_add_date')?.valueChanges.subscribe(value => {
      if (value) {
        this.FinancialYear.get('add_start_date')?.setValidators([Validators.required]);
        this.FinancialYear.get('add_end_date')?.setValidators([Validators.required]);
      } else {
        this.FinancialYear.get('add_start_date')?.clearValidators();
        this.FinancialYear.get('add_end_date')?.clearValidators();
      }

      this.FinancialYear.get('add_start_date')?.updateValueAndValidity();
      this.FinancialYear.get('add_end_date')?.updateValueAndValidity();
    });
  
  }

  ngOnInit(){
    this.action = this.financeYearData?.action
    console.log("+++++++++",this.financeYearData);
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.entity_id = localStorage.getItem('selectedEntityId');
      // this.collegeids = this.id.id;
    });
    console.log("__________",this.financeYearData)
    if(this.action == "edit" || this.action == "view"){
      this.financeId = this.financeYearData.id;
      this.btnValue ="Update Financial Year";
      this.FinancialYear.addControl('fin_year_id', new FormControl('', Validators.required));
      this.FinancialYear.patchValue({
        financial_year: this.financeYearData.data.financial_year,
        year_start_date: this.financeYearData.data.year_start_date,
        year_end_date: this.financeYearData.data.year_end_date,
        add_start_date: this.financeYearData.data.add_start_date,
        add_end_date: this.financeYearData.data.add_end_date,
      });
      this.showAdditionMonths = this.financeYearData.data?.is_add_date
      // console.log("FinancialYearForm",this.FinancialYear.value);
       this.FinancialYear.get('is_add_date')?.setValue(this.financeYearData.data?.is_add_date)
    }
    else{
      this.btnValue ="Add Financial Year";
    }

    let year =3+ new Date().getFullYear();
    for (let i = 1; i <= 7; i++) {
      year--;
     this.financeYear.push(year);
    }
    this.financeYear2 = this.financeYear
    this.financeYearList = this.financeYear.map((value:any) => Number(value))
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

 onStartDateChange(event: any) {
    this.minEndDate = event.value;

  
    this.FinancialYear.patchValue({
      year_end_date: null,
      add_start_date: null,
      add_end_date: null
    });

    this.minAddStartDate = null;
    this.minAddEndDate = null;
  }

 
  onEndDateChange(event: any) {
    this.minAddStartDate = event.value;

    this.FinancialYear.patchValue({
      add_start_date: null,
      add_end_date: null
    });

    this.minAddEndDate = null;
  }

 
  onAddStartDateChange(event: any) {
    this.minAddEndDate = event.value;

    this.FinancialYear.patchValue({
      add_end_date: null
    });
  }

ngSubmitFinancialYear(){
  if(this.FinancialYear.invalid){
    return
  }
  else{
    this._commonService?.showLoader()
    
    
    this.FinancialYear.value.year_start_date  =moment(this.FinancialYear.value.year_start_date).format('YYYY-MM-DD');
    this.FinancialYear.value.year_end_date  = moment(this.FinancialYear.value.year_end_date).format('YYYY-MM-DD');
    this.FinancialYear.value.add_start_date  = moment(this.FinancialYear.value.add_start_date).format('YYYY-MM-DD');
    this.FinancialYear.value.add_end_date  = moment(this.FinancialYear.value.add_end_date).format('YYYY-MM-DD');
    this.FinancialYear.value.entity_id = this.entity_id;
    // ;
    // return

    this.finance.createFinancialYear(this.FinancialYear.value).subscribe((res: any) => {
      this._commonService?.hideLoader()
      if(res.code == 200){
        this.toaster.success(res.message);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      else{
        this.toaster.error(res.message)
      }
    }, err => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message)
    });
  }
}

// fetchFincanicalYear = () => {
//   this._commonService?.showLoader()
//   this.finance.getFinancialYear(this.id).subscribe((res: any) => {
//     this._commonService?.hideLoader()
//     console.log("responcesssssss",res);
//     if(res.code == 200){
//       this.toaster.success(res.message);
//       this.confirmDialog();
//       this.reloadCurrentRoute();
//     }
//     else{
//       this.toaster.error(res.message)
//     }
//   }, err => {
//     this._commonService?.hideLoader()
//     this.toaster.error(err.error.message)
//   });
// }

onUpdateFinanceYear(){
  
  this._commonService?.showLoader()
  this.FinancialYear.value.year_start_date  =moment(this.FinancialYear.value.year_start_date).format('YYYY-MM-DD');
  this.FinancialYear.value.year_end_date  = moment(this.FinancialYear.value.year_end_date).format('YYYY-MM-DD');
   this.FinancialYear.value.add_start_date  = moment(this.FinancialYear.value.add_start_date).format('YYYY-MM-DD');
    this.FinancialYear.value.add_end_date  = moment(this.FinancialYear.value.add_end_date).format('YYYY-MM-DD');
  this.finance.updateFinancialYear(this.financeId,this.FinancialYear.value).subscribe((res: any) => {
    this._commonService?.hideLoader()
    console.log("update finance year",res);
    if(res.code == 200){
      this.toaster.success(res.message);
      this.confirmDialog();
    }
    else{
      this.toaster.error(res.message)
    }
  }, err => {
    this._commonService?.hideLoader()
    this.toaster.error(err.error.message)
  });
}

confirmDialog() {
  this.dialog.close(this.FinancialYear.value);
}
  financeFilter(e: any) {
    let aa = e
    aa = aa.toLowerCase();
    let filteredVariable = this.financeYear2.filter((item: any) => aa.includes(item.toString().toLowerCase()));
    this.financeYear = filteredVariable
  }

  onAdditionToMonthClick(data:any){
    let from_month_id = this.FinancialYear.get('additional_from_month')?.value
    
    if(from_month_id){
      if(data?.id < from_month_id){
      this.toaster.warning('You cannot select this month!');
      this.FinancialYear.get('additional_to_month')?.setValue(null);
    }
    from_month_id += 3;
    if(data?.id > from_month_id){
    this.toaster.warning('You can only add additional 4 months!!');
    this.FinancialYear.get('additional_to_month')?.setValue(null);
    return
    
    }
    
    }
    
    else{
      this.toaster.warning('Please select the from month!')
      this.FinancialYear.get('additional_to_month')?.setValue(null);
    }
    }

    showAdditionMonths:boolean = false;

onSelectCheckbox(event:any){
  if(event.checked == true){     
   this.showAdditionMonths = true;
  }
  else{
this.showAdditionMonths = false;
  }
}
}

