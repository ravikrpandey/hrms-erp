import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountrymasterComponent } from '../../itticketing/configurationalmaster/countrymaster/countrymaster.component';
import { CountrymasterdialogComponent } from '../../itticketing/configurationalmaster/countrymaster/countrymasterdialog/countrymasterdialog.component';
import { CountryComponent } from '../../dialog-popup-components/country-dialog-popup/country/country.component';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value?.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss']
})
export class AddBankComponent {
  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  chartId: any;
  employeeDetails: any = [];
  loginUser: any;
  item_masterData: any;
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  getSubtypeAccount_data: any;
  countryList:any[]=[];
  countryList1:any[]=[]
  countryList2:any[]=[]
  entity_id: any;
  financial_id: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
   @Optional() public dialog2: MatDialogRef<AddBankComponent>,
   @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      bank_name: new FormControl('', [Validators.required]),
      swift_number: new FormControl(null),
      status: new FormControl('ACTIVE'),
      branch: new FormControl('',[Validators.required, noLeadingSpaces()]),
      state: new FormControl('', [Validators.required, noLeadingSpaces()]),
      country_id: new FormControl('', [Validators.required]),
      ifsc_code: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.dialog2
    this.financial_id = localStorage.getItem("financial_id");

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getCountriesList();
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.chartId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.chartId) {
      this.getBankById();
    }
  }


  get CF_3(): any {
    return this.form.controls;
  }
  goBack() {
    this.router.navigate(['master/finance/bank-accounting/bank'])
    // this.location.back();
  }



  list:any[]=[];
  onSubmit(data: any) {
data.entity_id=this.entity_id;
    if (this.chartId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }
      this._finaceservice.saveBank(this.chartId,data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);

          this.router.navigate(['master/finance/bank-accounting/bank'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.chartId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.toaster.error('Please fill the mandatory fields!', 'Error Message')
        return
      }



          
  this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
    next: (res: any) => {


    
      let newMonth = this._finaceservice.getCurrentMonth(); 
      let isExistData = res.data.some((x: any) => x.month === newMonth);

if(isExistData){
  this._finaceservice.saveBank(this.chartId,data).subscribe((response: any) => {
    if (response) {
      this.toaster.success(response.message);
      // this.form.reset();
      this.router.navigate(['master/finance/bank-accounting/bank'])
    }
  }, (err: any) => {
    this.toaster.error(err.error.message)
  })
}else{
  if (!isExistData && res.code===200) {
    this.toaster.warning(res.message);
    return
  }
  if (!isExistData && res.code===201) {
    this.toaster.warning(res.message);
    return
  }

}
    }, error: (err) => {

      if (err.error.code === 404) {
        this.toast.warning(
         err.error.message
        );
      }

    },
  })










      
    }

  }

  getBankById() {
    this._finaceservice.getBankById(this.chartId).subscribe((response: any) => {

      this.form.patchValue({
        bank_name: response.data[0]?.bank_name,
        swift_number: response.data[0]?.swift_number,
        branch: response.data[0]?.branch,
        state: response.data[0]?.state,
        country_id: response.data[0]?.country_id,
        status: response.data[0]?.status,
        ifsc_code: response.data[0]?.ifsc_code,
      })

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }



  getCountriesList()
{
  this._finaceservice.getCountriesList().subscribe((res:any) =>{
    this.countryList = res.data;
    this.countryList1 = this.countryList.map((res:any)=> res.countryss_name);
    this.countryList2 = this.countryList;
  })
}


// getParentAccountList() {

//   this._finaceservice.getParentAccountList().subscribe((res: any) => {
//     this.parentAccountList = res.data;
//     this.parentList1 = this.parentAccountList.map((res:any)=> res.account_name);
//     this.parentList2 = this.parentAccountList;
//     // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
//   },
//     ((err: any) => {

//       // this.toast.error(`${err.error.message}`)
//     })
//   )
// }


countryFilter(e: any) {
  const aa = e
  let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
  this.countryList = filteredVariable
}

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };

  openCountryDialog(){

    const dialogRef = this.dialog.open(CountryComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCountriesList();
      }
    });
  }
}
