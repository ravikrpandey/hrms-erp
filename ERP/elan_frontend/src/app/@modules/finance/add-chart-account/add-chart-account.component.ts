import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value?.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-add-chart-account',
  templateUrl: './add-chart-account.component.html',
  styleUrls: ['./add-chart-account.component.scss']
})
export class AddChartAccountComponent implements OnInit {
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
  currencyList: any[] = [];
  parentAccountList: any[] = [];
  entity_id: any;
  financial_id: any;
  parentList1: any[] = [];
  parentList2: any[] = [];

  // selectedEntityId


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
    @Optional() public dialog: MatDialogRef<AddChartAccountComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      // account_type_id: new FormControl('', [Validators.required]),
      account_no: new FormControl('', [Validators.required]),
      // opening_balance: new FormControl(''),
      debit_balance: new FormControl('0'),
      credit_balance: new FormControl('0'),
      balance: new FormControl('0'),
      bank_id: new FormControl(''),
      // currency_id: new FormControl('', [Validators.required]),
      root_name: new FormControl(''),
      parent_account_id: new FormControl(''),
      is_group: new FormControl('no'),
      account_subtype_id: new FormControl(''),
      report_type: new FormControl(''),
      balance_must_be: new FormControl(''),
      status: new FormControl('ACTIVE'),
      status_type: new FormControl('ACTIVE'),
      account_name: new FormControl('', [Validators.required, noLeadingSpaces()]),
      account_remarks: new FormControl(''),
      account_code: new FormControl(''),
      account_description: new FormControl(''),
      marks_cash_account:new FormControl(''),
      // tdsList: this.fb.array([this.createItemsField()])
    });
  }
  ngOnInit(): void {

    this.financial_id = localStorage.getItem("financial_id");

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getParentAccountList();
    this.getBankList();
    // this.getDefaultCurrencyId();
    // this.getAllAccountTypeList();
    // this.getQuotationcurrency();

    this.activeRoute.queryParams.subscribe((res: any) => {
      this.chartId = res.id;
      console.warn(res,'vvv');
    })

    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.chartId) {
      this.getChartAccountById();
    }
    this.calculateCurrentBalance();
    this.getCurrencyList();
    this.getAllTdsData();
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

  // createItemsField(): FormGroup {
  //   return this.fb.group({
  //     tds_id: [''],
  //     nature: [''],
  //     nature_id: [''],
  //     threshold_limit: [''],
  //     tds_rate: [''],

  //   });
  // }


  addItem() {
    for (let control of this.tdsList.controls) {
      if (control.invalid) {
        control.markAllAsTouched();
        this.toast.warning('Please fill all required fields before adding a new item.')
        return;
      }
    }
    // this.tdsList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.tdsList.removeAt(index);
  }


  get tdsList(): FormArray {
    return this.form.get('tdsList') as FormArray;
  }

  getNatureData(data:any,i:any){
    this.form.patchValue({
      threshold_limit:data.threshold_limit,
      tds_rate:data.rate
    })
    this.tdsList.controls[i]?.get('threshold_limit')?.setValue(data.threshold_limit)
    this.tdsList.controls[i]?.get('tds_rate')?.setValue(data.rate)
  }

  natureData:any=[]
  getTdsById(data:any,i:any){
    this._configurationalMasterService.getTdsDataByIdVendor(data.id).subscribe((res:any)=>{
    this.natureData[i] = res.data;
    })

     this.tdsList.controls[i]?.get('nature')?.setValue(data.nature)

  }
  tdsData:any=[]
  getAllTdsData = () => {

    this._configurationalMasterService.getAllTdsData(this.entity_id).subscribe((res: any) => {
      this.tdsData = res.data;
    },(err: any) => {
      this.tdsData = []
    });
  }

  get CF_3(): any {
    return this.form.controls;
  }
  goBack() {

    if (this.data?.isOpenDialog) {
      this.dialog.close('');
    } else {


      this.router.navigate(['//master/finance/account-charts'])
    }
    // this.location.back();
  }
  clearType(){
    this.form.get('parent_account_id')?.patchValue(null)
  }
  clearGroup(){
    this.form.get('is_group')?.patchValue(null)
  }
  clearBalanceType(){
    this.form.get('balance_must_be')?.patchValue(null)
  }
  clearStatus(){
    this.form.get('status')?.patchValue(null)
  }


  list: any[] = [];
  // currency_id:any;
  // company_id:any;


  onSubmit(data: any) {

    // this._finaceservice.createChartOfAccount(data).subscribe((data:any)=>{
    //
    //   this.list = data
    // })

    // this.currency_id = localStorage.getItem('quotation_currency_id');
    // this.company_id = localStorage.getItem('company_id');

    // let account_name = this.form.get('account_name')?.value
    let parent_id = this.form.get('parent_account_id')?.value
    if (!parent_id) {
      data.root_name = data.account_name
      this.form.get('root_name')?.setValue(data.account_name)
    }


    this._finaceservice.getDefaultCurrencyId().subscribe((res: any) => {
      this.default_currency_id = res.data[0]["currency_id"];
      data.currency_id = this.default_currency_id;
      if (this.chartId) {
        if (this.form.invalid) {
          this.form.markAllAsTouched()
          return

        }



        this._finaceservice.createChartOfAccount(this.chartId, data).subscribe((response: any) => {
          if (response) {
            this.toaster.success(response.message);
            if (this.data?.isOpenDialog) {
              this.dialog.close(response);
            } else {

              this.router.navigate(['master/finance/account-charts'])
            }
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
        // data.currency_id = parseInt(this.currency_id);
        data.entity_id = parseInt(this.entity_id);





  this._finaceservice.getFinancialYearActiveMonthByEntityId1(this.entity_id).subscribe({
    next: (res: any) => {
      let newMonth = this._finaceservice.getCurrentMonth();
      let isExistData = res.data.some((x: any) => x.month === newMonth);

if(isExistData){
  this._finaceservice.createChartOfAccount(this.chartId, data).subscribe((response: any) => {
    if (response) {
      this.toaster.success(response.message);
      // this.form.reset();
      if (this.data?.isOpenDialog) {
        this.dialog.close(response);
      } else {

        this.router.navigate(['master/finance/account-charts'])
      }
      // this.router.navigate(['master/finance/account-charts'])
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
    })
  }
  getAllAccountTypeList() {
    this._finaceservice.getAllAccountTypeList().subscribe((res: any) => {
      this.getAccount_data = res.data.filter((res: any) => res.status == "ACTIVE");
    })
  }
  getAllAccountTypeBySubtypeList(id: any) {
    this._finaceservice.getAllAccountTypeBySubtypeList(id).subscribe((res: any) => {
      this.getSubtypeAccount_data = res.data.filter((res: any) => res.status == "ACTIVE");
    }, (err: any) => {
      if (err) {
        this.toast.error(err.error.message)
        this.getSubtypeAccount_data = []
      }
    })
  }






  getChartAccountById() {
    this._finaceservice.getChartAccountById(this.chartId).subscribe((response: any) => {
      const accountId = response.data[0]?.id;
      // this._finaceservice.getAllAccountTypeBySubtypeList(response.data[0]?.account_subtype_id).subscribe((res: any) => {
      //   this.getSubtypeAccount_data = res.data.filter((res: any) => res.status == "ACTIVE");
      // })
      this._finaceservice.getParentAccountList().subscribe((res: any) => {
        this.parentAccountList = res.data.filter((x: any) => x.id !== accountId);

        this._finaceservice.getCurrencyList().subscribe((resp: any) => {
          this.currencyList = resp.data;

          this.form.patchValue({
            account_name: response.data[0]?.account_name,
            marks_cash_account: response.data[0]?.marks_cash_account,
            account_no: response.data[0]?.account_code,
            balance_must_be: response.data[0]?.balance_must_be,
            is_group: response.data[0]?.is_group,
            // currency_id: response.data[0]?.currency_id,
            status: response.data[0]?.status,
            account_remarks: response.data[0]?.remarks,
            parent_account_id: response.data[0]?.parent_account,
            bank_id: response.data[0]?.bank_id,
            report_type: response.data[0]?.report_type,
            balance: response.data[0]?.balance,
            status_type: response.data[0]?.status_type,
            root_name: response.data[0]?.root_name,
            debit_balance: response.data[0]?.debit_balance,
            credit_balance: response.data[0]?.credit_balance,
            // current_balance: response.data[0]?.current_balance,
            // })
          })

          response.data?.tdsList.forEach((res:any,i:any)=>{
           this.tdsList.removeAt(response.data?.tdsList?.length-1)
            // this.tdsList.push(this.createItemsField())
            this._configurationalMasterService.getTdsDataByIdVendor(res.tds_id).subscribe((res:any)=>{
              this.natureData[i] = res.data;
              })
            this.tdsList.controls[i]?.get('tds_id')?.setValue(res.tds_id)
            this.tdsList.controls[i]?.get('nature')?.setValue(res.nature_of_transaction)
            this.tdsList.controls[i]?.get('nature_id')?.setValue(res.nature_id)
            this.tdsList.controls[i]?.get('threshold_limit')?.setValue(res.threshold_limit)
            this.tdsList.controls[i]?.get('tds_rate')?.setValue(res.rate)
           })

          //  this.tdsList.removeAt(response.data?.tdsList?.length-1)




          if (response.data[0]?.is_group == 'yes') {
            this.form.get('debit_balance')?.setValue('0');
            this.form.get('credit_balance')?.setValue('0');
            this.form.get('balance')?.setValue('0');
          }
        })




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



  // getQuotationcurrency() {
  //   this._configurationalMasterService.getQuotationcurrency().subscribe((res: any) => {
  //     this.currencyList = res.data;
  //   })
  // }

  // Method to generate a random 6-digit number
  generateAccountNumber() {
    const accountNo = Math.floor(100000 + Math.random() * 900000).toString();
    this.form.get('account_no')?.setValue(accountNo);
  }

  // onAccountTypeClick(data:any){
  //
  //   if(data.id == 1 || data.id == 2 || data.id == 3){
  //     this.form.get('report_type')?.setValue("Balance Sheet (Report)")
  //   }

  //   else{
  //     this.form.get('report_type')?.setValue("Profit & Loss (Report)")

  //   }

  // }

  accountGroupList: any[] = [];

  onAccountTypeClick(data: any) {

    if (this.form.get('parent_account_id')?.value == null || this.form.get('parent_account_id')?.value == '' || this.form.get('parent_account_id')?.value == undefined) {

      if (data.id == 1 || data.id == 2 || data.id == 3) {
        this.form.patchValue({
          report_type: "Balance Sheet (Report)"
        })
      }
      else {
        this.form.patchValue({
          report_type: "Profit & Loss (Report)"
        })
      }
    }
  }




  isDisabled(): boolean {
    const parentAccountId = this.form.get('parent_account_id')?.value;
    return parentAccountId != null && parentAccountId != undefined && parentAccountId != '';
  }



  getParentAccountList() {

    this._finaceservice.getParentAccountList().subscribe((res: any) => {
      this.parentAccountList = res.data;
      this.parentList1 = this.parentAccountList.map((res: any) => res.account_name);
      this.parentList2 = this.parentAccountList;
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
      ((err: any) => {

        // this.toast.error(`${err.error.message}`)
      })
    )
  }


  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.parentList2.filter((item: any) => aa.includes(item.account_name));
    this.parentAccountList = filteredVariable
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


  onGroupSelect(event: any) {
    if (event.value == 'yes') {
      this.form.get('debit_balance')?.setValue('0');
      this.form.get('credit_balance')?.setValue('0');
      this.form.get('balance')?.setValue('0');
    }
    else {

      this.form.get('parent_account_id')?.setValue(null)
    }
  }


  backToChartAccountList() {
    this.router.navigate(['master/finance/account-charts'])
  }

  restrictToAmount(event: any) {
    const input = event.target.value;
    const amountPattern = /^\d*\.?\d{0,2}$/;

    if (!amountPattern.test(input)) {
      event.target.value = input.substring(0, input.length - 1);
    }
  }

  calculateCurrentBalance() {

    this.form.valueChanges.subscribe(values => {
      const debit = parseFloat(values.debit_balance) || 0;
      const credit = parseFloat(values.credit_balance) || 0;

      const currentBalance = debit - credit;

      this.form.get('balance')?.setValue(currentBalance, { emitEvent: false });
    });
  }

  getCurrencyList() {
    this._finaceservice.getCurrencyList().subscribe((res: any) => {
      this.currencyList = res.data;
    })
  }

  onParentAccountSelect(data: any) {
    let parent_id = data?.id;
    this._finaceservice.getRootTypeByChartId(parent_id).subscribe((res: any) => {

      let root_name = res.data[0]?.root_name
      this.form.get('root_name')?.setValue(root_name)
      this.form.get('account_no')?.setValue(res.data[0]?.account_code);
      if (root_name == 'Asset' || root_name == "Liability" || root_name == 'Equity') {
        this.form.patchValue({ report_type: "Balance Sheet (Report)" })
      }

      else if (root_name == 'Revenue' || root_name == 'Expenses'  || root_name== 'P & L Expenses' || root_name == 'Trading Expenses') {
        this.form.patchValue({
          report_type: "Profit & Loss (Report)"
        })
      }
      else {
        this.form.get('root_name')?.setValue('');
      }

    })
  }

  default_currency_id: any;

bankList:any[]=[];
bankList1:any[]=[];
bankList2:any[]=[];

  getBankList(){
    this._finaceservice.getBank(this.entity_id).subscribe((res:any)=>{
      this.bankList = res.data;
  this.bankList1= res.data?.map((x:any)=>x.bank_name);
  this.bankList2 = this.bankList
    })
  }

  bankFilter(e:any){

    const tempVal = e;

      let filteredVariable = this.bankList2.filter((item: any) =>
        tempVal.includes(item.bank_name)
      );
      this.bankList = filteredVariable;

}

  //   if(data.id == 1 || data.id == 2 || data.id == 3){
  //     this.form.patchValue({
  //       report_type:"Balance Sheet (Report)"
  //     })
  //   }
  //   else{
  //     this.form.patchValue({
  //       report_type:"Profit & Loss (Report)"
  //     })
  //   }
  //   this.accountGroupList = [];
  // this._finaceservice.getAccountGroupByAccountTypeId(data.id).subscribe((response:any)=>{
  //   this.accountGroupList = response.data;
  // })

}


