import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
 
import * as moment from 'moment';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { environment } from 'src/app/environments/environment';
import { AddChartAccountComponent } from '../../add-chart-account/add-chart-account.component';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/main';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent {
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
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData:any=[]
  imageToUpload: any;
  imageUrl: any;
  rowClass: any;
  handleViewImg: boolean = true;
  constructor(private fb: FormBuilder, public $common: CommonService, private $crm: CrmService, public dialog: MatDialog, private toast: ToastrService, private router: Router, private _finaceService: FinaceService, private activeroute: ActivatedRoute, private salesManagementService: SalesManagementService,private _configurationalMasterService:ConfigurationalmasterService) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');
  
    this.createJournalEntryForm = this.fb.group({
      posting_date: [null, Validators.required],
      entity_id: [null],
      voucher_id: [null],
      document_number: [null, Validators.required],
      transaction_date: [null],
      branch_id: [null],
      notes: [null],
      manage_advance: [null],
      party_type: [null],
      vendor_id: [null],
      employee_id:[null],
      document_type: [null],
      others: [null],
      po_id: [null],
      grn_id: [null],
      invoice_id: [null],
      sales_order_id: [null],
      delivery_order_id: [null],
      sales_invoice_id: [null],
      document_value: [null],
      amount_paid_now: [null],
      amount_due: [null],
      journalDocument: this.fb.array([this.addDoc])
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });


    this.createJournalreferanceForm = this.fb.group({
      reference: [null],
      cheque_ref_date: [null,Validators.required],
    });
  }

  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;
  payment_id: any;
  ngOnInit() {
      
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this.getChartAccountList();
    this.getAllVouchers();
    this.getAllBranch();
    this.getAllProfitCenter()
    this.getAllCostCenter()
    this.getCurrency()
    this.paymentAdviceVoucher()
    this.activeroute.queryParams.subscribe((params: any) => {
      this.payment_id = params.id;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";
   

      if (this.payment_id) {
        this._finaceService.getAddvisePaymentById(this.payment_id).subscribe((res: any) => {
          if (res.code == 200) {
            this.singleGeneral = res.data;
            if(this.singleGeneral.manage_advance==1){
              this.isChecked=true
            }else{
              this.isChecked=false
            }    
            this.getAllProfitCenter()
          
            this.documentType = this.singleGeneral.document_type
            if(this.singleGeneral.document_type=='OTHERS'){
              this.documentType='OTHERS'
            }
            if(this.singleGeneral.party_type=='CUSTOMER'){
              this.customer_id=this.singleGeneral.customer_id
              this._finaceService.getGParty(this.singleGeneral.party_type).subscribe((res: any) => {
                let customerPartyData = res.data;
                this.customerPartyData = customerPartyData
                if(this.singleGeneral.document_type!='OTHERS'){

                  let payload={
                    customer_id:this.singleGeneral.customer_id,
                    entity_id:this.entity_id,
                    document_type:this.singleGeneral.document_type
                  }
                  this._finaceService.getAllPoGrnSoByVendorId(payload).subscribe((res:any)=>{
                    console.log(res);
                    this.getAllAdvanceData= res.data
                  },(err:any)=>{
                    this.documentType=''
                    this.toast.warning(err.error.message)
                  })
                }
              });
            }else if(this.singleGeneral.party_type=='VENDOR')
            {
              this._finaceService.getGParty(this.singleGeneral.party_type).subscribe((res: any) => {
                this.vendorPartyData = res.data;
                this.vendorPartyData= this.vendorPartyData;
                this.vendor_id=this.singleGeneral.vendor_id
              });
              if(this.singleGeneral.document_type!='OTHERS'){
                let payload={
                  vendor_id:this.singleGeneral.vendor_id,
                  entity_id:this.entity_id,
                  document_type:this.singleGeneral.document_type
                }
                this._finaceService.getAllPoGrnSoByVendorId(payload).subscribe((res:any)=>{
                  console.log(res);
                  this.getAllAdvanceData= res.data
                },(err:any)=>{
                  this.documentType=''
                  this.toast.warning(err.error.message)
                })
              }
              
            }

            this.documentType=this.singleGeneral.document_type
           
            this.partyTypeCheck=this.singleGeneral.party_type
            this.journalDocs = res.data.journalDocument;
            this.accountDetailList = res.data.Account_details;
            this.parent_journal_no = this.singleGeneral.parent_journal_no;
            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              document_number: this.singleGeneral.document_number,
              transaction_date: this.singleGeneral.transaction_date,
              entity_id: this.entity_id,
              branch_id: this.singleGeneral.branch_id,
              notes: this.singleGeneral.notes,
              voucher_id: this.singleGeneral.voucher_list_id,
              party_type: this.singleGeneral.party_type,
              customer_id: this.singleGeneral.customer_id,
              vendor_id: this.singleGeneral.vendor_id,
              document_type: this.singleGeneral.document_type,
              others: this.singleGeneral.others,
              po_id: this.singleGeneral.po_id,
              grn_id: this.singleGeneral.grn_id,
              invoice_id: this.singleGeneral.invoice_id,
              sales_order_id: this.singleGeneral.sales_order_id,
              delivery_order_id: this.singleGeneral.delivery_order_id,
              sales_invoice_id: this.singleGeneral.sales_invoice_id,
              manage_advance: this.singleGeneral.manage_advance==1?true:false
            });

            this.createJournalreferanceForm.patchValue({
              reference: this.singleGeneral.cheque_ref_no,
              reference_date: this.singleGeneral.cheque_ref_date
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
                  this.Account_details.controls[index]?.get('profit_center_id')?.setValue(element.profit_center_id);
                  this.Account_details.controls[index]?.get('cost_center_id')?.setValue(element.cost_center_id);
                  this.Account_details.controls[index]?.get('narration')?.setValue(element.narration);
                  this.Account_details.controls[index]?.get('currency_id')?.setValue(element.currency_id);
                  this.Account_details.controls[index]?.get('tds')?.setValue(element.tds);
                  this.Account_details.controls[index]?.get('current_rate')?.setValue(element.current_rate);
                  this.Account_details.controls[index]?.get('tds_rate_amount')?.setValue(element.tds_rate_amount);
                  
                });
              }
           
              else if (element.party_type == 'VENDOR') {
                this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                  this.journalParty = res.data;
                  this.vendorParty[index] = this.journalParty;
                  this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
                  this.vendor3[index] = this.vendorParty[index];

                
             this._finaceService.getVendorDataByTds(element.vendor_id).subscribe((res:any)=>{
              console.log(res.data)
              
              if(!res.data?.length){
                return this.toast.warning('TDS Not Mapped On This Vendor')
              }else{
                this.getAllTdsSection[index]=res.data
              }
              //  this.Account_details.controls[i].get('current_rate')?.setValue(res.data[0]?.current_rate)
            })
            let vendor_id= this.Account_details.controls[index].get('vendor_id')?.value

            this._finaceService.getTdsNatureOfTransaction(element.nature_id,vendor_id).subscribe((res:any)=>{
              console.log(res.data);
              this.getAllNatureOfTrsanction[index]=res.data
             })
                  // console.log("journalPartyjournalParty",this.vendorParty);
                  this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                  this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                  this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                  this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                  this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                  this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                  this.Account_details.controls[index]?.get('id')?.setValue(element.id);
                  this.Account_details.controls[index]?.get('profit_center_id')?.setValue(element.profit_center_id);
                  this.Account_details.controls[index]?.get('cost_center_id')?.setValue(element.cost_center_id);
                  this.Account_details.controls[index]?.get('currency_id')?.setValue(element.currency_id);
                  this.Account_details.controls[index]?.get('nature_id')?.setValue(element.nature_id);
                  this.Account_details.controls[index]?.get('nature')?.setValue(element.nature);
                  this.Account_details.controls[index]?.get('narration')?.setValue(element.narration);
                  this.Account_details.controls[index]?.get('tds_id')?.setValue(element.tds_id);
                  this.Account_details.controls[index]?.get('current_rate')?.setValue(element.current_rate);
                  this.Account_details.controls[index]?.get('tds_rate_amount')?.setValue(element.tds_rate_amount);
                   
                });
              }
              else if (element.party_type == 'CUSTOMER') {
                this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                  this.customerParty[index] = res.data;
 


                  this.customerParty1[index] = res.data.map((x: any) => x.business_name);  
                  this.customerParty2[index] = res.data;

                  this.Account_details.controls[index]?.get('chart_account_id')?.setValue(element.chart_account_id);
                  this.Account_details.controls[index]?.get('party_type')?.setValue(element.party_type);
                  this.Account_details.controls[index]?.get('employee_id')?.setValue(element.employee_id);
                  this.Account_details.controls[index]?.get('customer_id')?.setValue(element?.customer_id);
                  
                  this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.debit_amount);
                  this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.credit_amount);
                  this.Account_details.controls[index]?.get('journal_id')?.setValue(this.journal_id);
                  this.Account_details.controls[index]?.get('id')?.setValue(element.id);
                  this.Account_details.controls[index]?.get('profit_center_id')?.setValue(element.profit_center_id);
                  this.Account_details.controls[index]?.get('cost_center_id')?.setValue(element.cost_center_id);
                  this.Account_details.controls[index]?.get('currency_id')?.setValue(element.currency_id);
                  this.Account_details.controls[index]?.get('narration')?.setValue(element.narration);
                  this.Account_details.controls[index]?.get('tds')?.setValue(element.tds);
                  this.Account_details.controls[index]?.get('current_rate')?.setValue(element.current_rate);
                  this.Account_details.controls[index]?.get('tds_rate_amount')?.setValue(element.tds_rate_amount);
                   
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
                this.Account_details.controls[index]?.get('profit_center_id')?.setValue(element.profit_center_id);
                  this.Account_details.controls[index]?.get('cost_center_id')?.setValue(element.cost_center_id);
                  this.Account_details.controls[index]?.get('currency_id')?.setValue(element.currency_id);
                  this.Account_details.controls[index]?.get('narration')?.setValue(element.narration);
                  this.Account_details.controls[index]?.get('tds')?.setValue(element.tds);
                  this.Account_details.controls[index]?.get('current_rate')?.setValue(element.current_rate);
                  this.Account_details.controls[index]?.get('tds_rate_amount')?.setValue(element.tds_rate_amount);
                   
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
              
              this.journalDocuments?.at(index)?.patchValue({ file: doc.upload_doc });
            }
            if(this.paramsType==='edit' && this.journalDocuments.length===0){
              this.addDoc();
              
            }
        
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
        // this.AddRow();
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
           
          entity_id: this.entity_id,
          posting_date: posting_date
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
branch_id:any;
  getBranchData(event:any){
   this.branch_id = event.value
  }
  getVoucherId(event:any){
    let payload={
      branch_id:this.branch_id,
      voucher_id:event.value
    }
    this._finaceService.generateNumber(payload).subscribe((res: any) => {
      this.randomJournalNumber = res.data;
      this.parent_journal_no = res.data;
      this.createJournalEntryForm.patchValue({
        document_number: this.randomJournalNumber,
      });
    });
  }


  voucherData:any=[]
  getAllVouchers(){
    this._configurationalMasterService.getVouchersByID(6,this.entity_id).subscribe((res:any)=>{
      this.voucherData = res.data;
    })
  }

  paymentVoucherData:any=[]
  paymentAdviceVoucher = () => {
    this._configurationalMasterService.paymentAdviceVoucher(this.entity_id).subscribe((res: any) => {  
      this.paymentVoucherData = res.data;
    },(err: any) => {
      this.paymentVoucherData = []
    });
  }


  back(){
    this.router.navigate(['master/finance/transactions/payment-advice'])
  }

 

  getAllBranchData:any=[]
getAllBranch(){
  this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
    this.getAllBranchData = res.data
   
  })
}
getAllProfitCenterData:any=[]
  getAllProfitCenter(){
    let entity_id = localStorage.getItem('selectedEntityId');
    this._finaceService.getAllProfitCenter(entity_id).subscribe((res:any)=>{
       this.getAllProfitCenterData=res.data;
    })
  }
  costCenter:any=[]
  getAllCostCenter() {
    this._finaceService.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.costCenter = res.data;
    },
      ((err: any) => {
       
        this.costCenter = []
      })
    )
  }
  getCurrencyData:any=[]
  getCurrency() {
     
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.getCurrencyData = res.data;
 
    },(err:any) => {
      this.getCurrencyData=[]
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
    const journal = this.createJournalEntryForm.get('document_number')?.value;
    return this.fb.group({
      chart_account_id: [null],
      party_type: [null],
       
      
      product_id: [null],
      vendor_id: [null],
      debit_amount: [null],
      credit_amount: [null],
      profit_center_id: [null],
      cost_center_id: [null],
      currency_id: [null],
      narration: [null],
       
      nature: [null],
      nature_id: [null],
      threshold_limit: [null],
      tds_id: [null],
      current_rate: [null],
      tds_rate_new: [null],
      tds_rate_amount: [null],
      
      gross_amount: [null],
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

  clearData(control: any) {
    this.createJournalEntryForm.get(control)?.setValue(null)
    if(control=='vendor_id' && control=='po_id'){
      this.vendor_id = null
      this.isChecked=false;
      this.documentType = null
    }
    else if(control=='party_type'){    
      this.partyTypeCheck=''
      this.vendor_id = null
      this.isChecked=false;
      this.documentType = null
    }else{
      this.customer_id =''
      this.documentType = null
      this.vendor_id = null
      this.isChecked=false;
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
  partyCustomers: boolean = false
  customerTypess: any = []
  partyTypeCheck:any=''
  vendorPartyData:any=[]
  customerPartyData:any=[]
  onPartyTypeChangeAdvance(event: any): any {
    this.partyTypeCheck =event.value
    this.documentType=''
    let party: any = "";
    party = event.value;
    if (party == 'CUSTOMER') {
      if (!Array.isArray(this.customerPartyData)) {
        this.customerPartyData = [];
      }
      if (!Array.isArray(this.customerPartyData)) {
        this.customerPartyData= [];
      }
      this.customerPartyData = [];

      this._finaceService.getGParty(party).subscribe((res: any) => {
        let customerPartyData = res.data;
        this.customerPartyData = customerPartyData

      });
      this.partyCustomer = true

    }
    else {
      if (!Array.isArray(this.vendorPartyData)) {
        this.vendorPartyData = [];
      }
      if (!Array.isArray(this.vendorPartyData)) {
        this.vendorPartyData = [];
      }
      this.vendorPartyData = [];

      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.vendorPartyData = res.data;
        this.vendorPartyData= this.vendorPartyData;

      });
    }
    this.partyCustomer = false
    
  }

  vendor_id:any
 getVendorData(data: any, index: any) {
   
  this.vendor_id = data.id;
  this.vendor_account_id = data.chart_of_account_id;

  this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {

    if (!res.data?.length) {
      return this.toast.warning('TDS Not Mapped On This Vendor');
    }

    this.getAllTdsSection = res.data;

    const row = this.Account_details.at(0) as FormGroup;

    row.patchValue({
      current_rate: res.data[0]?.tds_rate,
      tds_id: res.data[0]?.tds_id,
      nature:res.data[0]?.nature,
     
    });

    this._finaceService.getTdsNatureOfTransaction(res.data[0].nature_id,this.vendor_id).subscribe((res:any)=>{
            console.log(res.data);
            this.getAllNatureOfTrsanction[0]=res.data
             this.maximum_credit = +res.data[0].maximum_amount
             this.threshold_limits = +res.data[0]?.threshold_limit
            row.patchValue({
               nature_id:res.data[0]?.id
            })
           })
  });
}

   documentType:any=''
   getAllAdvanceData:any;
   payload:any
  getAllDocumentType(event:any){
      
    this.documentType = event.value
    if(this.documentType!=='OTHERS'){
      if(this.partyTypeCheck=='VENDOR'){
        this.payload={
          vendor_id:this.createJournalEntryForm.value.vendor_id,
          document_type:this.createJournalEntryForm.value.document_type,
           entity_id:this.entity_id
        }
      }else{
        this.payload={
          customer_id:this.createJournalEntryForm.value.customer_id,
          document_type:this.createJournalEntryForm.value.document_type,
           entity_id:this.entity_id
        }
      }
        this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res:any)=>{
          console.log(res);
          this.getAllAdvanceData= res.data
        },(err:any)=>{
          this.documentType=''
          this.createJournalEntryForm.get('document_type')?.reset()
          this.toast.warning(err.error.message)
        })
   
    }
  }

  dataPass(data:any,i:any){
   console.log(data,'data')
        this.maximum_credit = +data.maximum_amount
     this.threshold_limits = +data.threshold_limit
    if(data.status_type=="cost_center") {
      let controls = this.Account_details.at(i) as FormArray
      controls.get('cost_center_id')?.setValidators([Validators.required])
      controls.get('cost_center_id')?.updateValueAndValidity();
       controls.markAllAsTouched()
       controls.get('profit_center_id')?.reset();
       controls.get('profit_center_id')?.clearValidators();
    }
    if(data.status_type=="profit_center") {
      let controls = this.Account_details.at(i) as FormArray
      controls.get('profit_center_id')?.setValidators([Validators.required])
      controls.get('profit_center_id')?.updateValueAndValidity();
       controls.markAllAsTouched()
       controls.get('cost_center_id')?.reset();
       controls.get('cost_center_id')?.clearValidators();
    }
    if(data.status_type==null) {
      let controls = this.Account_details as FormArray
       controls.get('cost_center_id')?.reset();
       controls.get('cost_center_id')?.clearValidators();
       controls.get('profit_center_id')?.reset();
       controls.get('profit_center_id')?.clearValidators();
    }

             


    }



// history of the transactions vouchere

public columnDefs = [
  {
    headerName: 'S.No.',
    valueGetter: "node.rowIndex + 1",
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    maxWidth: 85,
  },

  {
    headerName: 'Posting Date',
    field:'createdAt', 
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: 'Document Type',
    field: 'document_type',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: 'Document Number',
    field: 'documentNo',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: 'Document Value',
    field: 'document_value',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return ' 0.00';
    }
  },
  {
    headerName: 'TDS Rate',
    field: 'rate',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return ' 0.00';
    }
  },
  {
    headerName: 'TDS Value',
    field: 'tds_rate_amount',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return ' 0.00';
    }
  },

  {
    headerName: 'Amount Due',
    field: 'amount_due',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return ' 0.00';
    }
  },

  {
    headerName: 'Amount Paid',
    field: 'record_amount',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return ' 0.00';
    }
  },

  {
    headerName: 'Party Type',
    field: 'party_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    
  },

  {
    headerName: 'Party Name',
    field: 'vendor_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    
  }

];
gridApi:any    
onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
}










  customer_id:any;
  getCustomerData(data:any){
    this.customer_id = data.id
  }

  getCategoryDatas: any = []
  getCustomerDetails(data: any) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryDatas = res.data
      } else {
        this.toast.error('Category Not Found On This Customer')
      }
    }, (err: any) => {

    })
  }

  data:any;
  historyData:any=[]
document_value:any;
amount_paid_now:any;
amount_due:any;
  isChecked:boolean=false;
  isCheckedData(data:any){
    
   
    let payload={
      po_id:data.po_id,
      invoice_id:data.invoice_id,
      grn_id:data.grn_id,
    }
 if(data){
  this.data=data
  this.isChecked=true
  this._finaceService.getPaymentAdviceHistory(payload).subscribe((res:any)=>{
    this.document_value= res.document_value
    this.amount_paid_now= res.amount_paid_now
    this.amount_due = res.amount_due
   this.historyData = res.data
this.createJournalEntryForm.patchValue({
  document_value:res.document_value,
  amount_paid_now:res.amount_paid_now,
  amount_due:res.amount_due
})
const items = this.createJournalEntryItemForm.get('Account_details') as FormArray;

const row = items.at(0) as FormGroup;

row.get('cost_center_id')?.setValue(data.cost_center_id) 
  },(err:any)=>{
    return this.toast.error(err.error.message)
  })
 }else{
  this.isChecked=false
 }
    
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
      
 calculations(event: any, field: string, index: number): void {

  const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
  const row = accountDetailsArray.at(index) as FormGroup;

  const debit = +row.get('debit_amount')?.value || 0;
  const tdsRate = +row.get('current_rate')?.value || 0;
  const amount_due = +this.createJournalEntryForm.get('amount_due')?.value || 0;

  const maximumThreshold = +this.maximum_credit || 0;
  const previousPaid = +this.amount_paid_now || 0;

  const totalAfterPayment = previousPaid + debit;

  let tdsAmount = 0;
let amount_remaining = parseInt(this.amount_due) - debit
 this.createJournalEntryForm.patchValue({
    amount_due: amount_remaining
  }, { emitEvent: false });

  if (totalAfterPayment > maximumThreshold) {

    const taxableAmount = totalAfterPayment - maximumThreshold;

    const applicableAmount = previousPaid >= maximumThreshold 
      ? debit 
      : taxableAmount;

    tdsAmount = (applicableAmount * tdsRate) / 100;

  } else {
    tdsAmount = 0;
  }

  row.patchValue({
    tds_rate_amount: tdsAmount.toFixed(2)
  }, { emitEvent: false });

}

  





  // calculation(event: any, control: any, index: any) {
  //   console.warn(event.target.value,'fff');
  //    let values = +event.target.value
  //   const key = event.key;
  //   if (key == 'Tab') {
  //     return
  //   }
  //   const value = parseFloat('00:0');
  //   if (control == 'debit_amount') {
  //     this.Account_details.controls[index]?.get('credit_amount')?.setValue(value)
      
  //   }
  //   if (control == 'credit_amount') {
  //     this.Account_details.controls[index]?.get('debit_amount')?.setValue(value)
      
  //   }
   
  //   this.totalDebit = "";
  //   this.totalCredit = "";
  //   this.Different = "";
  //   this.Account_details.controls.forEach((element: any) => {
       
      
  //     this.totalDebit = Number(this.totalDebit) + Number(element.controls.debit_amount.value);
  //     this.totalCredit = Number(this.totalCredit) + Number(element.controls.credit_amount.value);
  //     this.Different = Number(this.totalDebit) - Number(this.totalCredit);
  //     if(this.totalCredit){
  //       this.Account_details.controls[index]?.get('debit_amount')?.setValue(value)
  //     }
    
  //   });
   
  //   if (this.Different < 0 || this.Different > 0) {
  //     this.redColor = true;
  //   }
  //   else {
  //     this.redColor = false;
  //   }
  // }

 


  getTds(event:any,i:any){  
     
    if (event.value == 'yes') { 
      this.Account_details.controls[i]?.get('current_rate')?.enable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.enable()
    }else{
      this.Account_details.controls[i]?.get('current_rate')?.disable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.disable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.reset()
      this.Account_details.controls[i]?.get('current_rate')?.reset()

    }
  }
 
  surcharge(event:any,i:any){  
     
    if (event.value == 'yes') { 
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.enable()
      this.Account_details.controls[i]?.get('surcharge_rate')?.enable()
      
    }else{
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.disable()
      this.Account_details.controls[i]?.get('surcharge_rate')?.disable()
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.reset()
      this.Account_details.controls[i]?.get('surcharge_rate')?.reset()
      

    }
  }
  cessAmount(event:any,i:any){  
     
    if (event.value == 'yes') { 
      this.Account_details.controls[i]?.get('cess_rate_amount')?.enable()
      this.Account_details.controls[i]?.get('cess_rate')?.enable()
      
    }else{
      this.Account_details.controls[i]?.get('cess_rate_amount')?.disable()
      this.Account_details.controls[i]?.get('cess_rate')?.disable()
      this.Account_details.controls[i]?.get('cess_rate_amount')?.reset()
      this.Account_details.controls[i]?.get('cess_rate')?.reset()
      

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
          document_number: this.randomJournalNumber,
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
//     if (0) {
//       this.toast.error('Debit and credit different should be 0');
//       return
//     }
//     if(this.createJournalreferanceForm.invalid){
//       this.createJournalreferanceForm.markAllAsTouched()
//        this.toast.error('Required Field is not Empty')
// return
//     }
//    this.$common.showLoader()

    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {

      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
 
  let paylod={
    ...this.createJournalreferanceForm.value,
    ...this.createJournalEntryForm.value,
    ...this.createJournalEntryItemForm.value,
  }
   paylod.reference_date=moment(this.createJournalreferanceForm.value.reference_date).format('YYYY-MM-DD')
   paylod.transaction_date=moment(this.createJournalreferanceForm.value.transaction_date).format('YYYY-MM-DD')
   paylod.posting_date=moment(this.createJournalreferanceForm.value.posting_date).format('YYYY-MM-DD')
   if(paylod.journalDocument==null){
    paylod.journalDocument=[]
   }
   paylod.journalDocument=this.createJournalEntryForm.value.journalDocument
          this.bankAccountIds = [];
    if(this.vendor_id){
      paylod.Account_details.map((res:any)=>{
        return res.chart_account_id=this.vendor_account_id
    
      })
    }

          this._finaceService.createAdvicePayment(paylod).subscribe((response: any) => {
    if(res){
      this.toast.success('Payment Advice Created Successfully')
      this.router.navigate(['/master/finance/transactions/payment-advice'])
      this.$common.hideLoader()
    }
 

            

 
          })

        }, error: (err) => {
          this.$common.hideLoader()

          if (err.error.code === 404) {
      this.$common.hideLoader()

            this.toast.warning(
              'This month is not active'
            );
          }

        },
      })


    } 
    
  }




  
  viewImg(imageUrl: any) {
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
          this.journalDocuments?.at(index).patchValue({
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

    
    let index = this.journalDocuments?.length - 1;
    let file = this.journalDocuments?.at(index)?.value;
    if (file && !file.file) {   
      this.toast.warning('Please upload file ');
      return;
    }
    this.journalDocuments.push(docForm);

  }

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }
  vendor_account_id:any
  getAllTdsSection:any=[]
  getVendorTdsById(data:any,i:any){
     this.maximum_credit = +data.maximum_amount
     this.threshold_limits = +data.threshold_limit
    console.log(data,'data')
    this._finaceService.getVendorDataByTds(data.id).subscribe((res:any)=>{
      console.log(res.data)
      
      if(!res.data?.length){
        return this.toast.warning('TDS Not Mapped On This Vendor')
      }else{
        this.getAllTdsSection[i]=res.data
      }
       this.Account_details.controls[i].get('current_rate')?.setValue(res.data[0]?.tds_rate)
       this.Account_details.controls[i].get('tds_id')?.setValue(res.data[0]?.tds_id)
    })
  }

getAllNatureOfTrsanction:any=[]
  getAllNatureTransaction(data:any,i:any){
    console.warn(data);
    
       this.Account_details.controls[i].get('nature')?.setValue(data.nature)
      //  let vendor_id= this.Account_details.controls[i].get('vendor_id')?.value

         this._finaceService.getTdsNatureOfTransaction(data.nature_id,this.vendor_id).subscribe((res:any)=>{
          console.log(res.data);
          this.getAllNatureOfTrsanction[i]=res.data
         })
  }

threshold_limits:any;
maximum_credit:any;
current_rate:any;
  getTdsRateData(data:any,i:any){
   
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const row = accountDetailsArray.at(i) as FormGroup;
     console.log(data,'data')
    // row.get('current_rate')?.setValue(data.rate);
    row.get('threshold_limit')?.setValue(data.threshold_limit, { emitEvent: false });
     this.maximum_credit = data.maximum_amount
     this.threshold_limits = +data.threshold_limit
    //  this.current_rate = +data.current_rate
     row.get('current_rate')?.setValue(data.current_rate)
    const tdsRate = parseFloat(data.current_rate) || 0;
     
    let debitAmountRaw = row.get('debit_amount')?.value || '0';
    const debitAmount = parseFloat(debitAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, ''));
    if(debitAmount > 0){
      if (debitAmount <= this.threshold_limits) {
        row.get('current_rate')?.setValue(data.current_rate);
        const tdsAmount = (debitAmount * tdsRate) / 100;
        row.get('tds_rate_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
       
      }else{
        row.get('current_rate')?.setValue(data.current_rate);
        const tdsAmount = (debitAmount * tdsRate) / 100;
        row.get('tds_rate_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
      }
    }
     
    let creditAmountRaw = row.get('credit_amount')?.value || '0';
   if(creditAmountRaw > 0){
    const creditAmount = parseFloat(creditAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, ''));
    if (creditAmount <= this.threshold_limits) {
      row.get('current_rate')?.setValue(0);
      row.get('tds_rate_amount')?.setValue('00', { emitEvent: false });
      
    }else{
      row.get('current_rate')?.setValue(data.current_rate);
      const tdsAmountCredit = (creditAmount * tdsRate) / 100;
      row.get('tds_rate_amount')?.setValue(tdsAmountCredit.toFixed(2), { emitEvent: false });

    }
   }

  }  

  partyCustomer: boolean = false
  customerType: any = []
  // onPartyTypeChange(event: any, index: any): any {

  //   let party: any = "";
  //   party = event.value;
  //   if (party == 'EMPLOYEE') {
  //     if (!Array.isArray(this.employeeParty)) {
  //       this.employeeParty = [];
  //     }
  //     if (!Array.isArray(this.employeeParty[index])) {
  //       this.employeeParty[index] = [];
  //     }
  //     this.employeeParty[index] = [];

  //     this._finaceService.getGParty(party).subscribe((res: any) => {
  //       this.journalEmployeeParty = res.data;
  //       this.employeeParty[index] = this.journalEmployeeParty;

  //     });
  //     this.partyCustomer = false
  //   } else if (party == 'CUSTOMER') {
  //     if (!Array.isArray(this.customerParty)) {
  //       this.customerParty = [];
  //     }
  //     if (!Array.isArray(this.customerParty[index])) {
  //       this.customerParty[index] = [];
  //     }
  //     this.customerParty[index] = [];

  //     this._finaceService.getGParty(party).subscribe((res: any) => {
  //       let partyTypeCustomer = res.data;
  //       this.customerParty[index] = partyTypeCustomer

  //     });
  //     this.partyCustomer = true

  //   }
  //   else {
  //     if (!Array.isArray(this.vendorParty)) {
  //       this.vendorParty = [];
  //     }
  //     if (!Array.isArray(this.vendorParty[index])) {
  //       this.vendorParty[index] = [];
  //     }
  //     this.vendorParty[index] = [];

  //     this._finaceService.getGParty(party).subscribe((res: any) => {
  //       this.journalParty = res.data;
  //       this.vendorParty[index] = this.journalParty;

  //     });
  //   }
  //   this.partyCustomer = false

  // }


}
