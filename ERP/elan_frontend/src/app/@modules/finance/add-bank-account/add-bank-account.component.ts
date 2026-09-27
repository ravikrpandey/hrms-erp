import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CountryComponent } from '../../dialog-popup-components/country-dialog-popup/country/country.component';
import { MatDialog } from '@angular/material/dialog';
import { BankDailogComponent } from '../../vendor/vendor-management/create-vendor/bank-details/bank-dailog/bank-dailog.component';
import { BankMasterComponent } from '../bank-master/bank-master.component';
import { BankComponent } from '../../itticketing/configurationalmaster/bank-master/bank.component';
import { BankDialogComponent } from '../../itticketing/configurationalmaster/bank-master/bank-dialog/bank-dialog.component';
import { AddBankComponent } from '../add-bank/add-bank.component';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value?.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.scss']
})
export class AddBankAccountComponent {
  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  chartId: any;
  employeeDetails: any = [];
  loginUser: any;
  item_masterData: any;
  entity_id:any;
  chartAccountList: any[] = [];
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  getSubtypeAccount_data: any;
  companyNameList:any[]=[];
  partyNameList:any[]=[];
  countryList:any[]=[];
  countryList1:any[]=[];
  countryList2:any[]=[];
  list:any[]=[];
  default_currency_id:any;
  
  financial_id: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog:MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.form = this.fb.group({

      party_type: new FormControl(''),
      employee_id: new FormControl(''),
      vendor_id:new FormControl(''),
      iban: new FormControl('',[noLeadingSpaces()]),
      bank_account_no: new FormControl('',[Validators.required, noLeadingSpaces()]),
      branch: new FormControl('',[noLeadingSpaces()]),
      is_default_account: new FormControl(''),
      is_company_account: new FormControl(''),
      status: new FormControl('ACTIVE'),
      account_name: new FormControl('', [Validators.required, noLeadingSpaces()]),
      bank_id: new FormControl('',[Validators.required]),
      mapped_company_gl_account: new FormControl(''),
      // company_account_id: new FormControl(''),
      country: new FormControl(''),
      parent_account_id: new FormControl(''),
      account_type: new FormControl(''),
      chart_account_id: new FormControl('')

    });
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this.activeRoute.queryParams.subscribe((res: any) => {
      this.chartId = res.id;
      if(this.chartId){
        this.form.get('is_company_account')?.disable();
        this.form.get('mapped_company_gl_account')?.disable();
      }
    })

    this.getDefaultCurrency();
    this.getBankList();
    // this.getAccountListForBank();
    this.chartAccountListData()
    this.getCountriesList();
    this.getCompanyNameList();
    // this.activeRoute.queryParams.subscribe((res: any) => {
    //   this.chartId = res.id;
    // })

    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.chartId) {
      this.getBankAccountById();
    }
  }
  // createItemFormGroup() {
  //   return this.fb.group({
  //     roleId:new FormControl('',[Validators.required]),
  //     employeeId:new FormControl('',[Validators.required]),
  //   });
  // }
  // get itemsFormArray(): any {
  //   return this.form.get('roleFiled') as FormArray;
  // }
  get CF_3(): any {
    return this.form.controls;
  }
  goBack() {
    this.router.navigate(['master/finance/bank-accounting/bank-account'])
    // this.location.back();
  }



  getDefaultCurrency(){
    this._finaceservice.getDefaultCurrencyId().subscribe((res:any)=>{

        this.default_currency_id = res.data[0]["currency_id"];
    })
  }
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
  openBankDialog(){

    const dialogRef = this.dialog.open(AddBankComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getBankList();
      }
    });
  }
  bankList1:any[]=[];
  bankList2:any[]=[];
bankFilter(e:any){

    const tempVal = e;

      let filteredVariable = this.bankList2.filter((item: any) =>
        tempVal.includes(item.bank_name)
      );
      this.bankList = filteredVariable;

}
closeIcon:boolean =false;
clearDropdown(e:any){
  this.closeIcon=false
  this.form.get('bank_id')?.patchValue(null);
}
closeIcon2:boolean =false;
clearDropdown2(e:any){
  this.closeIcon2=false
  this.form.get('account_type')?.patchValue(null);
}
selectedBank(e:any){
this.closeIcon=true;
}
closeIcon3:boolean =false;
clearDropdown3(e:any){
  this.closeIcon3=false
  this.form.get('party_type')?.patchValue(null);
}
closeIcon4:boolean =false;
clearDropdown4(e:any){
  this.closeIcon4=false
  this.form.get('vendor_id')?.patchValue(null);
  this.form.get('employee_id')?.patchValue(null);
}

partyList1:any[]=[];
partyList2:any[]=[];

partyFilter(e:any){
  const aa = e
if(this.party==='EMPLOYEE'){

  let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.first_name+' '+item.last_name));
  this.partyNameList = filteredVariable
}else{
  let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.vendor_name));
  this.partyNameList = filteredVariable
}
  // vendor_name
}

closeIcon5:boolean=false;
clearDropdown5(e:any){
  this.closeIcon5=false;
  this.form.get('country')?.patchValue(null);
}
selectedCountry(e:any){
this.closeIcon5=true
}
selectedParty(e:any){
this.closeIcon4=true;
}
selectedAccType(e:any){
this.closeIcon2=true;
}
  onSubmit(data: any) {

data.entity_id = this.entity_id;
data.currency_id = this.default_currency_id;
    if (this.chartId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }

      this._finaceservice.saveBankAccount(this.chartId,data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['master/finance/bank-accounting/bank-account'])
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
      this._finaceservice.saveBankAccount(this.chartId,data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['master/finance/bank-accounting/bank-account'])
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



  // account_type_id: new FormControl('', [Validators.required]),
  // account_group: new FormControl('', [Validators.required]),
  // account_no: new FormControl('', [Validators.required, noLeadingSpaces()]),
  // company_name: new FormControl('', [Validators.required, noLeadingSpaces()]),
  // currency_id: new FormControl('', [Validators.required, noLeadingSpaces()]),
  // parent_account_id: new FormControl(''),
  // is_group: new FormControl(''),
  // account_subtype_id: new FormControl(''),
  // report_type: new FormControl(''),
  // balance_must_be: new FormControl(''),
  // status: new FormControl(''),
  // account_name: new FormControl('', [Validators.required, noLeadingSpaces()]),
  // account_remarks: new FormControl('', [noLeadingSpaces()]),
  // account_code: new FormControl(''),
  // account_description: new FormControl(''),

  getBankAccountById() {

    this._finaceservice.getBankAccountById(this.chartId).subscribe((response: any) => {
    this._finaceservice.getBank(this.entity_id).subscribe((res:any)=>{
    this.bankList = res.data;
    // this._finaceservice.getAccountListForBank().subscribe((resp:any)=>{
    //   this.accountListForBank = resp.data;

      if(response.data[0]?.party_type){
        this._finaceservice.getGParty(response.data[0]?.party_type).subscribe((res1:any)=>{

          this.partyNameList = res1.data;
          this.form.patchValue({
            party_type: response.data[0]?.party_type,
            vendor_id: response.data[0]?.vendor_id,
            employee_id: response.data[0]?.employee_id

          })
        })
      }

        this._finaceservice.getCountriesList().subscribe((res2:any) =>{
          this.countryList = res2.data;


      this.form.patchValue({
        account_name: response.data[0]?.account_name,
        bank_id: response.data[0]?.bank_id,
        account_type: response.data[0]?.account_type,
        bank_account_no: response.data[0]?.bank_account_no,
        mapped_company_gl_account: response.data[0].mapped_company_gl_account,
        // party_type: response.data[0]?.party_type,

        is_default_account: response.data[0]?.is_default_account,
        is_company_account: response.data[0]?.is_company_account,
        // company_account_id: response.data[0]?.company_account_id,
        iban: response.data[0]?.iban,
        branch: response.data[0]?.branch,
        country: response.data[0]?.country,
        chart_account_id : response.data[0]?.chart_account_id
      })
      })

    // })
  })
      // }, 100);
      // console.log(this.employeeDetails, 'this.employeeDetails');
      // this.employeeDetails.forEach((item: any, index: number) => {
      //   console.log(item, 'itemmm');

      //   const formGroup = this.itemsFormArray.at(index) as FormGroup;
      //   console.log(formGroup, 'formgroup');
      //   this._rbacMasterService.employeGetByroleId(item.role_master_id).subscribe((res: any) => {
      //     console.log(res, 'resdata');
      //     this.roleGetByemployee[index] = res.data;



      //   });
      //   if (formGroup) {
      //     setTimeout(() => {
      //       // this.roleIdData(item.role_master_id, index)
      //       formGroup.patchValue({
      //         roleId: item.role_master_id,
      //         employeeId: item.employee_id,

      //       });

      //     }, 200)
      //     this.cdr.detectChanges();
      //   }
      //   else {
      //     this.itemsFormArray.push(
      //       this.fb.group({
      //         roleId: item.role_master_id,
      //         employeeId: item.employee_id,
      //       })
      //     );
      //   }
      // });

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }





    accountGroupList:any[]=[];


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

getCompanyNameList(){
  // this._finaceservice.getCompanyNameList().subscribe((res:any)=>{
  //   this.companyNameList = res.data[0];
  // })
}

back(){
  this.router.navigate(['master/finance/bank-account'])
}
party:string;
onPartyTypeSelect(event:any){

  this.party = event.value;
 this.closeIcon3=true
  this._finaceservice.getGParty(this.party).subscribe((res:any)=>{

    this.partyNameList = []
    this.partyNameList = res.data;
    this.party =='EMPLOYEE'?this.partyList1 = res.data?.map((x:any)=>x.first_name +' '+ x.last_name):
    this.partyList1 = res.data?.map((x:any)=>x.vendor_name);
    this.partyList2=this.partyNameList;
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


countryFilter(e: any) {
const aa = e
let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
this.countryList = filteredVariable
}

onSelectIsCompanyAccount(event:any){

  if(event.checked == true){
    this.form.get('party_type')?.setValue(null)
    this.form.get('employee_id')?.setValue(null)
    this.form.get('vendor_id')?.setValue(null)
    let account_name = this.form.get('account_name')?.value
    this.form.get('mapped_company_gl_account')?.setValue(account_name);
  }
  else {
    this.form.get('mapped_company_gl_account')?.setValue('')
  }
}

bankList:any[]=[];
accountListForBank:any[]=[];


getBankList(){
  this._finaceservice.getBank(this.entity_id).subscribe((res:any)=>{
    this.bankList = res.data;
this.bankList1= res.data?.map((x:any)=>x.bank_name);
this.bankList2 = this.bankList
  })
}

// getAccountListForBank(){
//   this._finaceservice.getAccountListForBank().subscribe((res:any)=>{
//     this.accountListForBank = res.data;
//   })
// }


chartAccountListData(){
  this._finaceservice.getChartOfAccountList(this.entity_id).subscribe((res:any)=>{
    this.chartAccountList = res.data.filter((i:any)=> i.marks_cash_account == 'Bank');
  

  })
}

}
