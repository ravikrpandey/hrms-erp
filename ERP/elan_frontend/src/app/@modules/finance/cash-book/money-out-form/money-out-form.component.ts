
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-money-out-form',
  templateUrl: './money-out-form.component.html',
  styleUrls: ['./money-out-form.component.scss']
})


export class MoneyOutFormComponent implements OnInit {
  // @Input() formGroup!: FormGroup; // Receive the form group
  list:any[]=[];
  selectedDate:any;
  fromAccList = [{
    id: 6 ,
    account_name: 'Petty Cash'
  }]

  toAccList:any[]=[];
  equityAccountList:any[]=[];
  moneyOutToAccList:any[]=[];
  expenseAccountList:any[]=[];
  accountList1:any[]=[];
  currencySymbol: any = '₹';
  currencyRate: any = 1;
  @Input() formType!: string; // Receive the form type
  formGroup: FormGroup;
  ownerDrawingForm: FormGroup;
  expenseForm:FormGroup;
  transferToAnotherAccForm: FormGroup;
  entity_id:any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _rbackService: RbacMasterService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    
    private _finaceservice: FinaceService) {
    this.formGroup = this.fb.group({});
    this.ownerDrawingForm = this.fb.group({});
    this.expenseForm = this.fb.group({});
    this.transferToAnotherAccForm = this.fb.group({});
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

  financial_id:any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this.getAllEquityAccountList();
    this.getMoneyOutToAccountList();
    this.getExpenseAccountList();
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
              this.expenseForm.reset();
              this.ownerDrawingForm.reset();
              this.transferToAnotherAccForm.reset();
          
               switch (this.formType) {
          
                      case 'transfer_to_another_account':
                        this.transferToAnotherAccForm = this.fb.group({});
                        this.transferToAnotherAccForm = this.fb.group({
                          to_account: ['', Validators.required],
                          from_account: ['', Validators.required],
                          date: [''],
                          form_type: ['Transfer To Another Account'],
                          amount: ['', Validators.required],
                          description: [''],
                          reference: ['']
                        });
                      
                        break;
          
                        case 'expense':
                          this.expenseForm = this.fb.group({});
                          this.expenseForm = this.fb.group({
                            to_account: ['', Validators.required],
                            from_account: ['', Validators.required],
                            date: [''],
                            form_type: ['Expense'],
                            amount: ['', Validators.required],
                            description: [''],
                            reference: ['']
                          });
                        
                          break;
          
                          case 'owner_drawings':
                            this.ownerDrawingForm = this.fb.group({});
                            this.ownerDrawingForm = this.fb.group({
                              to_account: ['', Validators.required],
                              from_account: ['', Validators.required],
                              date: [''],
                              form_type: ['Owner Drawings'],
                              amount: ['', Validators.required],
                              description: [''],
                              reference: ['']
                            });
                           
          
                            break;
          
                        default:
                          break;
                        }
                      }



                      reloadCurrentRoute() {
                        let currentUrl = this.route.url;
                        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                          this.route.navigate([currentUrl]);
                        });
                      }

                      onSubmit(data:any){
                        data.entity_id = this.entity_id;
                        data.financial_id = this.financial_id

                        this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
                          next: (res: any) => {
                  
                  
                            let newMonth = this._finaceservice.getCurrentMonth();
                            let isExistData = res.data.some((x: any) => x.month === newMonth);
                
                  if(isExistData){
                    this._finaceservice.addCashBookMoneyOut(data).subscribe((response:any)=>{
                      if (response) {
                        this.toast.success(response.message);
                        // this.route.navigate(['master/finance/cash-books/cash-book'])
                        this.reloadCurrentRoute();
                      this.expenseForm.reset();
                      this.transferToAnotherAccForm.reset();
                      this.ownerDrawingForm.reset();
                      // this.vendorCreditRefundForm.reset();
                      // this.vendorPaymentRefundForm.reset(); 
                      }
                    }, (err: any) => {
                      this.toast.error(err.error.message)
                    })
                  }else{
                    if (!isExistData && res.code===200) {
                      this.toast.warning(res.message);
                      return
                    }
                    if (!isExistData && res.code===201) {
                      this.toast.warning(res.message);
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

goBack(){
  this.formGroup.reset();

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

  getAllEquityAccountList(){
    this._finaceservice.getAllEquityAccountList().subscribe((res:any)=>{
      this.equityAccountList = res?.data;
    })
  }


  AccountNameGroup: { name: string, accounts: { id: any, account_name: any }[], disabled?: boolean }[] = [
    { name: 'Equity', accounts: [] },
    { name: 'Cash In Bank', accounts: [] }
  ];
  
  AccountToGroup:any = {
    41: 'Equity',
    5: 'Cash In Bank'
  }; 
  
  getMoneyOutToAccountList()
  {
  this._finaceservice.getMoneyOutToAccountList(this.entity_id).subscribe((res:any)=>{
    this.moneyOutToAccList = res?.data;
  
  res.data.forEach((item:any) => {
    const groupName = this.AccountToGroup[item.parent_account];
    if (groupName) {
      const group = this.AccountNameGroup.find(group => group.name === groupName);
      if (group) {
  
        const id = item.id
        const account_name = item.account_name;
  
        group.accounts.push({ id, account_name });
      }
    }
  });
  })
  }



  getExpenseAccountList(){
    this._finaceservice.getExpenseAccountList(this.entity_id).subscribe((res:any)=>{
      this.expenseAccountList = res?.data;  
    })
  }

  

            ngOnChanges(): void {
              this.createForm();
            }






          }
