import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';


@Component({
  selector: 'app-customer-advance-form',
  templateUrl: './customer-advance-form.component.html',
  styleUrls: ['./customer-advance-form.component.scss']
})


export class CustomerAdvanceFormComponent implements OnInit {
  // @Input() formGroup!: FormGroup; // Receive the form group
  list:any[]=[];
  selectedDate:any;
  customerList:any[]=[];
  entity_id:any;
  interestIncomeAccList:any[]=[];
  equityAccountList:any[]=[];
  vendorList:any[]=[];
  toAccList :any[]=[];
  accountList1:any[]=[];
  fromAccList:any[]=[];
  otherIncomeAccList:any[]=[];
  currencySymbol: any = '₹';
  currencyRate: any = 1;

  @Input() formType!: string; // Receive the form type
  formGroup: FormGroup;
  interestIncomeForm: FormGroup;
  otherIncomeForm: FormGroup;
  expenseRefundForm: FormGroup;
  ownersContributionForm:FormGroup;
  financial_id: any;
  // vendorCreditRefundForm:FormGroup;
  // vendorPaymentRefundForm:FormGroup;


  constructor(private fb: FormBuilder, private route: Router, private _finaceservice: FinaceService,
    private toaster: ToastrService,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.formGroup = this.fb.group({});
    this.interestIncomeForm = this.fb.group({});
    this.otherIncomeForm = this.fb.group({});
    this.expenseRefundForm = this.fb.group({});
    this.ownersContributionForm = this.fb.group({});
    // this.vendorCreditRefundForm = this.fb.group({});
    // this.vendorPaymentRefundForm = this.fb.group({});
  }


  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  noOfDay: any;
  todate: any;
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');

  Date(e: any) {
    this.selectedDate = moment(e.value).format('YYYY-MM-DD');
    // this.getJournalList();
  }


  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    // this.getCustomerList();
    this.getFromAccountList();
    this.getInterestIncomeAccountList();
    this.getOtherIncomeAccountList();
    this.getAllEquityAccountList();
    this.getVendorList();
    this.interestIncomeForm.get('received_via')?.setValue(6);
    this.interestIncomeForm.get('account')?.setValue('52');
    this.otherIncomeForm.get('received_via')?.setValue(6);
    this.ownersContributionForm.get('received_via')?.setValue(6);
    this.getChartAccountList()
    this.formGroup.get('to_account')?.valueChanges.subscribe((toId) => {
      this.applyFilters(toId, this.formGroup.get('from_account')?.value);
    });
  
    this.formGroup.get('from_account')?.valueChanges.subscribe((fromId) => {
      this.applyFilters(this.formGroup.get('to_account')?.value, fromId);
    });
    this._configurationalMasterService.currency$
.subscribe((currency: any) => {
  this.currencyRate = Number(currency?.rate) || 1;
  this.currencySymbol = currency?.symbols || '₹';
});
    
  }

  convertAmount(amount: any): number {

    const value = Number(amount);
  
    if (!value) {
      return 0;
    }
  
    return value * this.currencyRate;
  }
  
  formatCurrency(amount: any): string {
  
    return `${this.currencySymbol} ${this.convertAmount(amount).toFixed(2)}`;
  
  }
  clearDate(control:any) {
    this.formGroup.get(control)?.reset();
    // this.getJournalList();
    if(control == 'from_date'){
      const from_date = this.formGroup.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
      // this.bankClearanceForm.patchValue({ to_date: '' });
    }
  }

  createForm(): void {
    this.formGroup.reset();
    this.interestIncomeForm.reset();
    this.otherIncomeForm.reset();
    this.expenseRefundForm.reset();
    this.ownersContributionForm.reset();

     switch (this.formType) {

            case 'transfer_from_another_account':
              this.formGroup = this.fb.group({});
              this.formGroup = this.fb.group({
                to_account: ['', Validators.required],
                from_account: ['', Validators.required],
                date: [''],
                form_type: ['Transfer From Another Account'],
                amount: ['', Validators.required],
                description: [''],
                reference: ['']
              });
              
              break;

              case 'interest_income':
                this.interestIncomeForm = this.fb.group({});
                this.interestIncomeForm = this.fb.group({
                  to_account: ['', Validators.required],
                  from_account: ['', Validators.required],
                  date: [''],
                  form_type: ['Interest Income'],
                  amount: ['', Validators.required],
                  description: [''],
                  reference: ['']
                });
                break;

                case 'other_income':
                  this.otherIncomeForm = this.fb.group({});
                  this.otherIncomeForm = this.fb.group({
                    to_account: ['', Validators.required],
                    from_account: ['', Validators.required],
                    date: [''],
                    form_type: ['Other Income'],
                    amount: ['', Validators.required],
                    description: [''],
                    reference: ['']
                  });
                

                  break;

                    case 'owner_contribution':
                    this.ownersContributionForm = this.fb.group({});
                    this.ownersContributionForm = this.fb.group({
                      to_account: ['', Validators.required],
                      from_account: ['', Validators.required],
                      date: [''],
                      form_type: ['Owner Contribution'],
                      amount: ['', Validators.required],
                      description: [''],
                      reference: ['']
                    });
                  
                    break;

              default:
                break;
              }
            }


onSubmit(data:any){
  data.entity_id = this.entity_id;
 data.financial_id = this.financial_id

  this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
    next: (res: any) => {

      let newMonth = this._finaceservice.getCurrentMonth();
      let isExistData = res.data.some((x: any) => x.month === newMonth);

if(isExistData){
  this._finaceservice.addCashBookMoneyIn(data).subscribe((response:any)=>{
    if (response) {
      this.toaster.success(response.message);
      // this.route.navigate(['master/finance/cash-books/cash-book'])
      this.reloadCurrentRoute();
      this.formGroup.reset();
    this.interestIncomeForm.reset();
    this.otherIncomeForm.reset();
    this.expenseRefundForm.reset();
    this.ownersContributionForm.reset();
    // this.vendorCreditRefundForm.reset();
    // this.vendorPaymentRefundForm.reset();
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

reloadCurrentRoute() {
  let currentUrl = this.route.url;
  this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.route.navigate([currentUrl]);
  });
}

goBack(){
  this.formGroup.reset();

}

uploadedFiles: File[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      if (this.uploadedFiles.length + filesArray.length <= 5) {
        this.uploadedFiles.push(...filesArray);
      } else {
        alert('You can upload a maximum of 5 files.');
      }
    }
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  getCustomerList(){
    this._finaceservice.getCustomerList(this.entity_id).subscribe((res:any)=>{
      this.customerList = res?.data;
    })
  }


// Define the structure of the result
accountNameGroup: { name: string, accounts: { id: any, account_name: any }[], disabled?: boolean }[] = [
  { name: 'Prepaid Expenses', accounts: [] },
  { name: 'Equity', accounts: [] },
  { name: 'Cash In Hand', accounts: [] },
  { name: 'Cash In Bank', accounts: [] }
];

accountToGroup:any = {
  14: 'Prepaid Expenses',
  41: 'Equity',
  4: 'Cash In Hand',
  5: 'Cash In Bank'
};


otherIncomeAccountNameGroup: { name: string, accounts: { id: any, account_name: any }[], disabled?: boolean }[] = [
  { name: 'Dividend Income', accounts: [] },
  { name: 'Miscellaneous Income', accounts: [] },
  { name: 'Discount Received', accounts: [] }
];

otherIncomeAccountToGroup:any = {
  53: 'Dividend Income',
  54: 'Miscellaneous Income',
  100: 'Discount Received'
};

  getFromAccountList()
{
this._finaceservice.getAccountListForCashBook().subscribe((res:any)=>{
this.fromAccList =  res?.data;

res.data.forEach((item:any) => {
  const groupName = this.accountToGroup[item.parent_account];
  if (groupName) {
    const group = this.accountNameGroup.find(group => group.name === groupName);
    if (group) {

      const id = item.id
      const account_name = item.account_name;

      group.accounts.push({ id, account_name });
    }
  }
});
})
}



getInterestIncomeAccountList()
{
  this._finaceservice.getInterestIncomeAccountList().subscribe((res:any)=>{
    this.interestIncomeAccList = res?.data;
  })
}
allAccounts: any[] = [];
applyFilters(toId: any, fromId: any) {


  this.accountList1 = this.allAccounts.filter(
    (acc: any) => acc.id !== toId
  );


  this.toAccList = this.allAccounts
    .filter((i: any) => i.marks_cash_account === 'Cash')
    .filter((acc: any) => acc.id !== fromId);
}


getChartAccountList() {
  this._finaceservice.getChartOfAccountList(this.entity_id).subscribe((res: any) => {

    this.allAccounts = res.data;

    this.applyFilters(null, null);
  });
}
getOtherIncomeAccountList(){
  this._finaceservice.getOtherIncomeAccountList().subscribe((res:any)=>{
    this.otherIncomeAccList = res?.data;
    res.data.forEach((item:any) => {
      const groupName = this.otherIncomeAccountToGroup[item.parent_account];
      if (groupName) {
        const group = this.otherIncomeAccountNameGroup.find(group => group.name === groupName);
        if (group) {

          const id = item.id
          const account_name = item.account_name;

          group.accounts.push({ id, account_name });
        }
      }
    });
  })
}


getAllEquityAccountList(){
  this._finaceservice.getAllEquityAccountList().subscribe((res:any)=>{
    this.equityAccountList = res?.data;
  })
}




getVendorList(){
  this._finaceservice.getVendorList().subscribe((res:any)=>{
    this.vendorList = res.data;
  })
}

            ngOnChanges(): void {
              this.createForm();
            }

          }
