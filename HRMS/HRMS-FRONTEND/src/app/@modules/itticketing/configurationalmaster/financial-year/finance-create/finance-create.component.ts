import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { FinancialListComponent } from '../financial-list/financial-list.component';
import { Router } from '@angular/router';

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
  constructor(
    private dialog: MatDialogRef<FinancialListComponent>,
    @Inject(MAT_DIALOG_DATA) public financeYearData: any,
    private _fb: FormBuilder,
    private finance: FinaceService,
    private toaster: ToastrService,
    private route: Router){
    this.FinancialYear = this._fb.group({
      financial_year: new FormControl(null, [Validators.required]),
    });
    console.log("this.financeYearDatann",this.financeYearData);
  }

 ngOnInit(){
  this.action = this.financeYearData?.action
  if(this.action == "edit"){
    this.financeId = this.financeYearData.id;
    this.btnValue ="Update Financial Year";
    this.FinancialYear.addControl('fin_year_id', new FormControl('', Validators.required));
    this.FinancialYear.patchValue({
      financial_year: this.financeYearData.data.financial_year,
      fin_year_id: this.financeYearData.data.id
    });
  }
  else{
    this.btnValue ="Add Financial Year";
  }

  // Generate financial years dynamically
  let currentYear = new Date().getFullYear();
  let endYear = currentYear + 3;   // start a bit ahead (like your logic)

  for (let i = 0; i < 7; i++) {
    let fy = `${endYear - i}-${endYear - i + 1}`;
    this.financeYear.push(fy);
  }
}


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

ngSubmitFinancialYear(){
  if(this.FinancialYear.invalid){
    return
  }
  else{
    this.finance.createFinancialYear(this.FinancialYear.value).subscribe((res: any) => {
      console.log("responcesssssss",res);
      if(res.code == 200){
        this.toaster.success(res.message);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      else{
        this.toaster.error(res.message)
      }
    }, err => {
      this.toaster.error(err.error.message)
    });
  }
}

onUpdateFinanceYear(){
  this.finance.updateFinancialYear(this.financeId,this.FinancialYear.value).subscribe((res: any) => {
    console.log("update finance year",res);
    if(res.code == 200){
      this.toaster.success(res.message);
      this.confirmDialog();
    }
    else{
      this.toaster.error(res.message)
    }
  }, err => {
    this.toaster.error(err.error.message)
  });
}

confirmDialog() {
  this.dialog.close(this.FinancialYear.value);
}
}

