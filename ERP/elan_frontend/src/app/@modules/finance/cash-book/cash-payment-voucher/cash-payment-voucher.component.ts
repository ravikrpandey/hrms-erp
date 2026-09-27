import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { environment } from 'src/app/environments/environment';
import { AddChartAccountComponent } from '../../add-chart-account/add-chart-account.component';

@Component({
  selector: 'app-cash-payment-voucher',
  templateUrl: './cash-payment-voucher.component.html',
  styleUrls: ['./cash-payment-voucher.component.scss']
})
export class CashPaymentVoucherComponent {
  createJournalEntryForm: FormGroup;
  loading: boolean = false;
  maxDate: string;
  minDate: string;
  createJournalEntryItemForm: FormGroup;
  createJournalreferanceForm: FormGroup;
  totalDebit: any;
  totalCredit: any;
  Different: any;
  journalParty: any;
  JournalAccount: any;
  redColor: boolean = false;
  employeee: boolean = false;
  journalEmployeeParty: any;
  employeeParty: any = [];
  customerParty: any = [];
  vendorParty: any = [];
  chartedAccount: any = [];
  journal_id: any;
  singleGeneral: any = [];
  accountDetailList: any;
  randomJournalNumber: any;
  paramsType: any;
  tabType: any;
  reversal: boolean = false;
  entity_id: any;
  parent_journal_no: any;
  imagePath: any;
  singleItem: any;
  isView: boolean = false;
  imageToUpload: any;
  imageUrl: any;
  handleViewImg: boolean = true;
  constructor(private fb: FormBuilder, public $common: CommonService, private $crm: CrmService, public dialog: MatDialog, private toast: ToastrService, private router: Router, private _finaceService: FinaceService, private activeroute: ActivatedRoute, private salesManagementService: SalesManagementService) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');

    this.createJournalEntryForm = this.fb.group({
      posting_date: [null, Validators.required],
      // company: [null, Validators.required],
      // company_id: [null],
      entity_id: [null],
      // currency_id: [null],
      general_number: [null, Validators.required],
      transaction_date: [null],
      // currency: [null, Validators.required],
      notes: [null],
      journalDocument: this.fb.array([this.addDoc])
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });


    this.createJournalreferanceForm = this.fb.group({
      reference: [null],
      reference_date: [null],
    });
  }

  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;
  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this.getChartAccountList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.journalid;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";


      if (this.journal_id) {
        this._finaceService.getgeneralById(this.journal_id).subscribe((res: any) => {
          if (res.code == 200) {
            this.singleGeneral = res.data;

            this.journalDocs = res.journalDocument;
            this.accountDetailList = res.list;
            this.parent_journal_no = this.singleGeneral.parent_journal_no;

            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              // company: this.singleGeneral.MASTER_COMPANY.company_name,
              general_number: this.singleGeneral.journal_no,
              transaction_date: this.singleGeneral.transaction_date,
              entity_id: this.entity_id,
              // currency: this.singleGeneral.quotation_currency.quotation_currency_name,
              // company_id : this.singleGeneral.company_id,
              // currency_id : this.singleGeneral.currency_id,
              notes: this.singleGeneral.notes
            });

            this.createJournalreferanceForm.patchValue({
              reference: this.singleGeneral.reference,
              reference_date: this.singleGeneral.reference_date
            });

            this.totalDebit = this.singleGeneral.total_of_debit;
            this.totalCredit = this.singleGeneral.total_of_credit;
            this.Different = this.singleGeneral.different;
            if (this.Different < 0 || this.Different > 0) {
              this.redColor = true;
            }
            else {
              this.redColor = false;
            }
            this.vendorParty = [];
            this.employeeParty = [];


            this.accountDetailList.forEach((element: any, index: any) => {
              if (index < this.accountDetailList.length - 1) {
                this.AddRow();
              }
              if (element.party_type == 'EMPLOYEE') {
                this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                  this.journalEmployeeParty = res.data;
                  this.employeeParty[index] = this.journalEmployeeParty;

                  this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                  this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                  this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                  this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                  this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                  this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                  this.Account_details.controls[index]?.get('id')?.setValue(element.id);
                });
              }
              else if (element.party_type == 'VENDOR') {
                this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                  this.journalParty = res.data;
                  this.vendorParty[index] = this.journalParty;
                  this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
                  this.vendor3[index] = this.vendorParty[index];

                  this._finaceService.getVendorDetails(element?.VENDOR_BASIC_DETAIL.id).subscribe((res: any) => {
                    if (res.data.length) {
                      this.getCategoryData[index] = res.data
                    } else {
                      this.toast.error('Category not fount on this vendor')
                    }
                  })
                  // console.log("journalPartyjournalParty",this.vendorParty);
                  this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                  this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                  this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                  this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  this.Account_details.controls[index]?.get('product_id')?.setValue(element?.VENDOR_BASIC_DETAIL.id);
                  this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                  this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                  this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                  this.Account_details.controls[index]?.get('id')?.setValue(element.id);
                });
              }
              else if (element.party_type == 'CUSTOMER') {
                this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                  this.customerParty[index] = res.data;

                  this._finaceService.getCustomerCategory(element?.SALES_SUPER_USER_MST?.customer_id).subscribe((res: any) => {
                    if (res.data.length) {
                      this.getCategoryData = res.data;
                    } else {
                      this.toast.error('Category Not Found On This Customer');
                    }
                  }, (err: any) => { });


                  this.customerParty1[index] = res.data.map((x: any) => x.business_name);  // Array of business names
                  this.customerParty2[index] = res.data;

                  this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                  this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                  this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                  this.Account_details.controls[index]?.get('customer_id')?.setValue(element?.SALES_SUPER_USER_MST?.customer_id);
                  this.Account_details.controls[index]?.get('product_id')?.setValue(element?.SYS_PRODUCT_MASTER_MST?.product_id);
                  this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                  this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                  this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                  this.Account_details.controls[index]?.get('id')?.setValue(element.id);
                });
              } else {
                this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                this.Account_details.controls[index]?.get('id')?.setValue(element.id);
              }

              this.chartedAccount.forEach((element1: any) => {
                if (element1.id == element.chart_account_id) {
                  element1['hidden'] = true;
                }
              });
            });
            this.journalDocuments.clear();
            for (let doc of this.journalDocs) {
              this.addDoc();
              let index = this.journalDocuments.length - 1;
              
              this.journalDocuments.at(index)?.patchValue({ file: doc.image });
            }
            if(this.paramsType==='edit' && this.journalDocuments.length===0){
              this.addDoc();
              
            }
            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              // company: this.singleGeneral.MASTER_COMPANY.company_name,
              general_number: this.singleGeneral.journal_no,
              transaction_date: this.singleGeneral.transaction_date,
              entity_id: this.entity_id,
              // currency: this.singleGeneral.quotation_currency.quotation_currency_name,
              // company_id : this.singleGeneral.company_id,
              // currency_id : this.singleGeneral.currency_id,
              notes: this.singleGeneral.notes
            });
          }
          else {
            this.toast.error("Something went wrong!")
          }
        },
          (err) => {
            this.toast.error("something went wrong in db!")
          })
      }
      else {
        this.AddRow();
        // const company_id = localStorage.getItem("company_id");
        // const company_name = localStorage.getItem("company");
        // const currency_id = localStorage.getItem("quotation_currency_id");
        // const currency_name = localStorage.getItem("base_currency");

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const posting_date = date + '/' + month + '/' + year;
        this.createJournalEntryForm.patchValue({
          // company: company_name,
          // currency: currency_name,
          // company_id : company_id,
          // currency_id : currency_id,
          entity_id: this.entity_id,
          posting_date: posting_date
        });

        this._finaceService.getgeneralNumber().subscribe((res: any) => {
          this.randomJournalNumber = res.data;
          this.parent_journal_no = res.data;
          this.createJournalEntryForm.patchValue({
            general_number: this.randomJournalNumber,
          });
        });

        // this._finaceService.getgeneralAccount().subscribe((res: any) => {
        //   this.JournalAccount = res.data[0];
        //   this.createJournalEntryForm.patchValue({
        //     posting_date: this.JournalAccount.posting_Date,
        //     transaction_date: this.JournalAccount.transaction_date,
        //   });
        // })
      }
    });


  }

  vendorDetails(data: any, index: any) {
    this._finaceService.getVendorDetails(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data
      } else {
        this.toast.error('Category not fount on this vendor')
      }
    })
  }



  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

    });
  }

  openChartAccDialog() {
    const dialogRef = this.dialog.open(AddChartAccountComponent, {
      width: '700px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getChartAccountList();
      }
    });
  }
  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }
  vendor2: any[] = [];
  vendor3: any[] = [];
  vendorFilter(e: any, i: number) {
    const aa = e
    let filteredVariable = this.vendor3[i].filter((item: any) => aa.includes(item.vendor_name));
    this.vendorParty[i] = filteredVariable
  }
  employee2: any[] = [];
  employee3: any[] = [];
  employeeFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }


  // getParentAccountList() {

  //   this._finaceservice.getParentAccountList().subscribe((res: any) => {
  //     this.parentAccountList = res.data;
  //     this.parentList1 = this.parentAccountList.map((res:any)=> res.account_name);
  //     this.parentList2 = this.parentAccountList;

  //   },
  //     ((err: any) => {

  //     })
  //   )
  // }






  get Account_details(): FormArray {
    return this.createJournalEntryItemForm.get('Account_details') as FormArray;
  }

  createAccountDetailGroup(): any {
    const journal = this.createJournalEntryForm.get('general_number')?.value;
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      party_type: [null],
      employee_id: [null],
      customer_id: [null],
      product_id: [null],
      vendor_id: [null],
      debit_amount: [null],
      credit_amount: [null],
      journal_id: journal,
      id: null
    });
  }

  onAccountChange(): void {

    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;


      this.chartedAccount.forEach((element1: any) => {
        element1['hidden'] = false;
      });
      this.chartedAccount.forEach((element1: any) => {
        this.Account_details.controls.forEach((element: any, index: any) => {
          const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
          if (value == element1.id) {
            element1['hidden'] = true;
          }
        });
      });
    });
  }

  AddRow(): void {
    this.Account_details.push(this.createAccountDetailGroup());
  }

  removeRow(index: number): void {
    if (this.Account_details.length > 1) {
      // manage functionalit of account list dropdown
      this.chartedAccount.forEach((element1: any) => {
        const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
        if (value == element1.id) {
          element1['hidden'] = false;
          // this.Account_details.removeAt(index);
        }
      });

      // delete row
      this.Account_details.removeAt(index);

      // manage debit credit amount functionality
      this.totalDebit = "";
      this.totalCredit = "";
      this.Different = "";
      this.Account_details.controls.forEach((element: any) => {
        this.totalDebit = Number(this.totalDebit) + Number(element.controls.debit_amount.value);
        this.totalCredit = Number(this.totalCredit) + Number(element.controls.credit_amount.value);
        this.Different = Number(this.totalDebit) - Number(this.totalCredit);
      });
      if (this.Different < 0 || this.Different > 0) {
        this.redColor = true;
      }
      else {
        this.redColor = false;
      }
    }
  }
  getCategoryData: any = []
  getCustomerDetail(data: any, index: number) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data
      } else {
        this.toast.error('Category Not Found On This Customer')
      }
    }, (err: any) => {

    })
  }




  clearDate(control: any) {
    this.createJournalEntryForm.get(control)?.reset(null);
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null)
    if (control == 'chart_account_id') {
      this.onAccountChange();
    }
  }

  clearPartyDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null)
    this.Account_details.controls[index].get('employee_id')?.setValue(null)
    this.Account_details.controls[index].get('vendor_id')?.setValue(null)
  }
  clearreferenceDate(control: any) {
    this.createJournalreferanceForm.get(control)?.reset();
  }

  redirect2() {
    if (this.journal_id) {
      this.router.navigate(["/master/finance/journal-ledger/quick-entry"], { queryParams: { journalid: this.journal_id, actionType: this.paramsType } })
    }
    else {
      this.router.navigate(["/master/finance/journal-ledger/quick-entry"]);
    }
  }

  redirect1() {
    if (this.journal_id) {
      this.router.navigate(["/master/finance/journal-ledger/journal-entry"], { queryParams: { journalid: this.journal_id, actionType: this.paramsType } })
    }
    else {
      this.router.navigate(["/master/finance/journal-ledger/journal-entry"]);
    }
  }
  partyCustomer: boolean = false
  customerType: any = []
  onPartyTypeChange(event: any, index: any): any {

    let party: any = "";
    party = event.value;
    if (party == 'EMPLOYEE') {
      if (!Array.isArray(this.employeeParty)) {
        this.employeeParty = [];
      }
      if (!Array.isArray(this.employeeParty[index])) {
        this.employeeParty[index] = [];
      }
      this.employeeParty[index] = [];

      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalEmployeeParty = res.data;
        this.employeeParty[index] = this.journalEmployeeParty;

      });
      this.partyCustomer = false
    } else if (party == 'CUSTOMER') {
      if (!Array.isArray(this.customerParty)) {
        this.customerParty = [];
      }
      if (!Array.isArray(this.customerParty[index])) {
        this.customerParty[index] = [];
      }
      this.customerParty[index] = [];

      this._finaceService.getGParty(party).subscribe((res: any) => {
        let partyTypeCustomer = res.data;
        this.customerParty[index] = partyTypeCustomer

      });
      this.partyCustomer = true

    }
    else {
      if (!Array.isArray(this.vendorParty)) {
        this.vendorParty = [];
      }
      if (!Array.isArray(this.vendorParty[index])) {
        this.vendorParty[index] = [];
      }
      this.vendorParty[index] = [];

      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalParty = res.data;
        this.vendorParty[index] = this.journalParty;

      });
    }
    this.partyCustomer = false

  }

  get hasCustomerPartyType(): boolean {
    return this.Account_details.controls.some(control => control.get('party_type')?.value === 'CUSTOMER' || control.get('party_type')?.value === 'VENDOR');
  }

  customer2: any = []
  employeeFilter1(e: any) {
    const aa = e
    let filteredVariable = this.customerType.filter((item: any) => aa.includes(item.business_name));
    this.customerParty = filteredVariable
  }

  calculation(event: any, control: any, index: any) {
    const key = event.key;
    if (key == 'Tab') {
      return
    }
    const value = parseFloat('00:0');
    if (control == 'debit_amount') {
      this.Account_details.controls[index]?.get('credit_amount')?.setValue(value)
    }
    if (control == 'credit_amount') {
      this.Account_details.controls[index]?.get('debit_amount')?.setValue(value)
    }
    this.totalDebit = "";
    this.totalCredit = "";
    this.Different = "";
    this.Account_details.controls.forEach((element: any) => {
      this.totalDebit = Number(this.totalDebit) + Number(element.controls.debit_amount.value);
      this.totalCredit = Number(this.totalCredit) + Number(element.controls.credit_amount.value);
      this.Different = Number(this.totalDebit) - Number(this.totalCredit);
    });
    if (this.Different < 0 || this.Different > 0) {
      this.redColor = true;
    }
    else {
      this.redColor = false;
    }
  }

  openEditMode() {
    this.reversal = true;
    this.paramsType = "edit";
    this.parent_journal_no = this.singleGeneral.journal_no;


    this.accountDetailList.forEach((element: any, index: any) => {
      if (element.debit_amount > 0) {
        element.credit_amount = element.debit_amount;
        this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.debit_amount);
        this.Account_details.controls[index]?.get('debit_amount')?.setValue(0);
      }
      else {
        element.debit_amount = element.credit_amount;
        this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.credit_amount);
        this.Account_details.controls[index]?.get('credit_amount')?.setValue(0);
      }
      // if(this.accountDetailList.length-1 == index){
      //   // console.log("mmmm",this.Account_details.controls);
      //   // console.log("formmmm",this.createJournalEntryItemForm.value);

      //   // Get the controls
      //   const control1 = this.Account_details.at(0);
      //   const control2 = this.Account_details.at(1);

      //   // Swap controls
      //   this.Account_details.setControl(0, control2);
      //   this.Account_details.setControl(1, control1);
      // }
      let date = new Date();
      let outDate = moment(date).format("YYYY-MM-DD");
      this._finaceService.getgeneralNumber().subscribe((res: any) => {
        this.randomJournalNumber = res.data;
        this.createJournalEntryForm.patchValue({
          general_number: this.randomJournalNumber,
          posting_date: outDate
        });
      });
    });
  }

  default_currency_id: any;
  bankAccountIds: any[] = [];


  // this.createJournalreferanceForm = this.fb.group({
  //   reference:  [null],
  //   reference_date: [null],
  // });


  submitPublic(key: any): void {
    if (this.redColor) {
      this.toast.error('Debit and credit different should be 0');
      return
    }


    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {

      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {


          this.bankAccountIds = [];
          this._finaceService.checkBankAccountForJournal(this.createJournalEntryItemForm.value).subscribe((response: any) => {


            this.bankAccountIds = response?.data || [];
            let postingDate = this.createJournalEntryForm.get('posting_date')?.value;
            let newMonth = this._finaceService.getCurrentMonth();
            let isExistData = res.data.some((x: any) => x.month === newMonth);
            this.createJournalEntryForm.get('posting_date')?.patchValue(new Date());

            if (this.bankAccountIds?.length > 0 && (!this.createJournalreferanceForm.get('reference_date')?.value || !this.createJournalreferanceForm.get('reference')?.value)) {

              this.toast.warning('Please fill the Cheque Reference detail if you are selecting bank Account!');
              return
            }


            else if (!isExistData && res.code===200) {
              this.toast.warning(res.message);
              return
            }
           else if (!isExistData && res.code===201) {
              this.toast.warning(res.message);
              return
            }



            else {

              // let reference = this.createJournalreferanceForm.value?.reference;
              let ref_date = this.createJournalreferanceForm.value?.reference_date;
              let transactn_date = moment(this.createJournalEntryForm.value?.transaction_date).format('YYYY-MM-DD');

              let reference_date = new Date(ref_date);
              reference_date.setDate(reference_date.getDate() + 1);



              this._finaceService.getDefaultCurrencyId().subscribe((res: any) => {

                this.default_currency_id = res.data[0]["currency_id"];
                let payload = {
                  general_entry: this.createJournalEntryForm.value,
                  reference: this.createJournalreferanceForm.value?.reference,
                  transaction_date: transactn_date !== 'Invalid date' ? transactn_date : null,
                  reference_date: reference_date,
                  account_detail: this.createJournalEntryItemForm.value,

                  key: key,
                  currency_id: this.default_currency_id,
                  totalDebit: this.totalDebit,
                  totalCredit: this.totalCredit,
                  different: this.Different,
                  entity_id: this.entity_id,
                  parent_journal_no: this.parent_journal_no,
                  isReversal: this.reversal
                }
                if (this.journal_id && this.reversal === false) {
                  this._finaceService.UpdateGeneralBook(payload, this.journal_id).subscribe((res: any) => {
                    this.toast.success('Journal Entry updated Successfully');
                    this.router.navigate(['/master/finance/journal/journal-ledger']);
                  })
                }
                else {

                  this._finaceService.createGeneralBook(payload).subscribe((res: any) => {
                    this.toast.success('Journal Entry Submitted Successfully');
                    this.router.navigate(['/master/finance/journal/journal-ledger']);
                  })
                }

              })
            }

          })

        }, error: (err) => {

          if (err.error.code === 404) {
            this.toast.warning(
              'This month is not active'
            );
          }

        },
      })


    } else {
      this.Account_details.controls.forEach(control => {
        control.markAllAsTouched();
      });
      this.toast.error('Please fill in the required fields');
      return
    }
  }




  // submitDrop(key:any): void {
  //   if(this.redColor){
  //     this.toast.error('Please fill correct debit credit fields');
  //     return
  //   }
  //   if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
  //     this.Account_details.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });
  //     let payload ={
  //       general_entry : this.createJournalEntryForm.value,
  //       reference: this.createJournalreferanceForm.value,
  //       account_detail: this.createJournalEntryItemForm.value,
  //       key : key,
  //       totalDebit : this.totalDebit,
  //       totalCredit : this.totalCredit,
  //       different : this.Different
  //     }
  //     if(this.journal_id){
  //       this._finaceService.UpdateGeneralBook(payload,this.journal_id).subscribe((res: any) => {
  //         this.toast.success('Journal Entry Submitted Successfully');
  //         this.router.navigate(['/master/finance/journal-ledger']);
  //       })
  //     }
  //     else{
  //       this._finaceService.createGeneralBook(payload).subscribe((res: any) => {
  //         this.toast.success('Journal Entry Submitted Successfully');
  //         this.router.navigate(['/master/finance/journal-ledger/quick-entry']);
  //       })
  //     }
  //   } else {
  //     this.toast.error('Please fill in the required fields');
  //     return
  //   }
  // }



  //////////////////
  //////here code for doc upload 
  //////////
  viewImg(imageUrl: any) {
    console.log(this.journalDocuments)
    window.open(environment.servralUrl + '/uploaded_files/' + imageUrl, '_blank');
  }
  uploadDoc(event: any, index: number) {
    let isValidExtension = this.$common.checkForValidFile(event);
    if (!isValidExtension) {
      return;
    }

    let data = '';
    if (event.target.files && event.target.files[0]) {
      data = event.target.files[0];
    }

    // FormData to append the file
    const formData = new FormData();
    formData.append('file', data);

    this.$crm.uploadDoc(formData).subscribe(
      (res: any) => {
        if (res?.url) {
          
          // Update the form with the file URL and title
          this.journalDocuments.at(index).patchValue({
            file: res.url,      // Set the file URL
            title: event.target.files[0].name, // Optionally set the file name
          });

          this.handleViewImg = true; // Enable view image functionality
        }
      },
      (err) => {
        if (err) {
          this.toast.error('Something went wrong');
        }
      }
    );
  }

  get journalDocuments() {
    return this.createJournalEntryForm.controls['journalDocument'] as FormArray;
  }

  addDoc() {
    const docForm = this.fb.group({
      title: [''],
      file: [''],
    });

    
    let index = this.journalDocuments.length - 1;
    let file = this.journalDocuments.at(index)?.value;
    if (file && !file.file) {   
      this.toast.warning('Please upload file ');
      return;
    }
    this.journalDocuments.push(docForm);

  }

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }
}
