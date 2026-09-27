import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';
import { AddChartAccountComponent } from '../../../add-chart-account/add-chart-account.component';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

@Component({
  selector: 'app-add-service-voucher',
  templateUrl: './add-service-voucher.component.html',
  styleUrls: ['./add-service-voucher.component.scss']
})
export class AddServiceVoucherComponent {
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
  customer_id: any;
  customersData: any;
  constructor(private fb: FormBuilder, public $common: CommonService, private $crm: CrmService, public dialog: MatDialog, private toast: ToastrService, private router: Router, private _finaceService: FinaceService, private activeroute: ActivatedRoute, private salesManagementService: SalesManagementService, private _configurationalMasterService: ConfigurationalmasterService, private _empService: EmpRegistrationService, private salesService: SalesService, private entityService: EntityMasterService) {
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
      reference_number: [null],
      customer_id: [null],
      document_type: [null],
      sales_quotation_id: [null],
      proforma_invoice_id: [null],
      sales_booking_id: [null],
      sales_order_id: [null],
      sales_invoice_id: [null],
      total_amount: ['00'],
      notes: [null],


    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });


    this.createJournalreferanceForm = this.fb.group({
      sales_value: ['00'],
      gst_total: ['00'],
      grand_total: ['00'],
      bill_amount: ['00'],
    });
  }

  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;
  getUserRole: any;
  getEmployeeList: any = []
  ngOnInit() {
    this.Account_details.removeAt(0)
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject;

    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    let entity_id = localStorage.getItem("selectedEntityId");

    this._empService.grtEmployeeList(entity_id, this.getUserRole).subscribe((res: any) => {
      this.getEmployeeList = res.data;



    });
    this.getAllCustomersData()
    this.getAllServices()
    this.getChartAccountList();
    this.getAllCustomersData();
    this.getAllItem();
    this.getAllBranch();
    this.getAllProfitCenter()
    this.getAllCostCenter()
    this.getCurrency()
    this.getAllBank()
    this.getAllVouchers()
    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.journalid;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      this.getServiceVoucherById(params.id);
      if (this.journal_id) {
        this._finaceService.getgeneralById(this.journal_id).subscribe((res: any) => {
          if (res.code == 200) {
            this.singleGeneral = res.data;


            this.accountDetailList = res.list;
            this.parent_journal_no = this.singleGeneral.parent_journal_no;

            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              // company: this.singleGeneral.MASTER_COMPANY.company_name,
              document_number: this.singleGeneral.journal_no,
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
                  // this.Account_details.controls[index]?.get('vendor_id')?.setValue(element.vendor_id);
                  // this.Account_details.controls[index]?.get('product_id')?.setValue(element?.VENDOR_BASIC_DETAIL.id);
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
            if (this.paramsType === 'edit' && this.journalDocuments.length === 0) {
              this.addDoc();

            }
            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              // company: this.singleGeneral.MASTER_COMPANY.company_name,
              document_number: this.singleGeneral.journal_no,
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


  getAllService: any = []
  getAllServices() {
    this._configurationalMasterService.getServiceMasterList(this.entity_id).subscribe((res: any) => {
      this.getAllService = res.data
    })
  }

  customersData2: any = []
  getAllCustomerDataList: any = []
  customersData1: any = []
  getAllCustomersData() {
    let entity_ids = localStorage.getItem('selectedEntityId')
    this._finaceService.getGPartyByEntityId('CUSTOMER', entity_ids).subscribe((res: any) => {
      this.getAllCustomerDataList = res.data;
      this.customersData2 = res?.data?.map((x:any)=>x.company_name);
      this.customersData1 =this.getAllCustomerDataList

    })
  }

    searchByParty(e:any){
      const aa = e
      let filteredVariable = this.customersData1.filter((item: any) => aa.includes(item.company_name));
      this.getAllCustomerDataList = filteredVariable
  }
  customer_details: any;
  getCustomerData(data: any) {

    let entity_id = localStorage.getItem('selectedEntityId')
    this.entityService.getEntity(entity_id).subscribe((response: any) => {
      console.log(response.data, 'entity data')
      this.checkAndApplyGST(data, response.data)
    })

  }


  getAllCustomerData(event: any) {
    this.customer_id = event.value;
  }
  customerFilter(e: any) {
    let aa = e;
    let filteredVariable = this.customersData2.filter((item: any) => aa.includes(item.business_name));
    this.customersData = filteredVariable
  }

  documentType: any = ''
  getAllAdvanceData: any;
  payload: any
  getAllDocumentType(event: any) {

    this.documentType = event.value
    if (this.documentType !== 'OTHERS') {

      this.payload = {
        customer_id: this.customer_id,
        document_type: this.documentType,
        entity_id: this.entity_id
      }

    }
    this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res: any) => {
      console.log(res);
      this.getAllAdvanceData = res.data
      if (this.getAllAdvanceData.length == 0) {
        this.createJournalEntryForm.get('document_type')?.reset()
      }
    }, (err: any) => {
      this.documentType = ''

      this.toast.warning(err.error.message)
    })

  }




  dataPass(data: any, i: any) {
    if (data.status_type == "cost_center") {
      let controls = this.Account_details.at(i) as FormArray
      controls.get('cost_center_id')?.setValidators([Validators.required])
      controls.get('cost_center_id')?.updateValueAndValidity();
      controls.markAllAsTouched()
      controls.get('profit_center_id')?.reset();
      controls.get('profit_center_id')?.clearValidators();
    }
    if (data.status_type == "profit_center") {
      let controls = this.Account_details.at(i) as FormArray
      controls.get('profit_center_id')?.setValidators([Validators.required])
      controls.get('profit_center_id')?.updateValueAndValidity();
      controls.markAllAsTouched()
      controls.get('cost_center_id')?.reset();
      controls.get('cost_center_id')?.clearValidators();
    }
  }



  geAllItem: any = [];
  getAllItem() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.geAllItem = res.data.reverse();

    })
  }


  // getAllCustomerDataList:any=[]
  // getAllCustomersData(){
  //   let entity_ids = localStorage.getItem('selectedEntityId')
  //   this._finaceService.getGPartyByEntityId('CUSTOMER',entity_ids).subscribe((res:any)=>{
  //     this.getAllCustomerDataList = res.data;
  //     // this.vendorData1 = res?.data?.map((x:any)=>x.vendor_name);
  //     // this.vendorData2=this.vendorData

  //   })
  // // }
  // documentType:any=''
  // getAllAdvanceData:any;
  // payload:any
  // getAllDocumentType(event:any){

  //  this.documentType = event.value
  //  if(this.documentType!=='OTHERS'){

  //      this.payload={  
  //       customer_id:this.customer_id,
  //        document_type:this.documentType,
  //         entity_id:this.entity_id
  //      }

  //    }
  //      this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res:any)=>{
  //        console.log(res);
  //        this.getAllAdvanceData= res.data
  //        if(this.getAllAdvanceData.length == 0){
  //         // this.createCustomerPayment.get('document_type')?.reset()
  //        }
  //      },(err:any)=>{
  //        this.documentType=''

  //        this.toast.warning(err.error.message)
  //      })

  //  }
  //  customer_id:any;
  //  getAllCustomerData(event:any){
  //    this.customer_id = event.value;


  //  }


  recordData: any = []
  getDataBYId(event: any) {
    console.warn(event.value);

    if (event.value) {
      let payload = {
        proforma_id: event.value,
        customer_id: this.customer_id,
        documentType: this.documentType,
        entity_id: this.entity_id
      }

      this._finaceService.customerRecordPayment(payload).subscribe((res: any) => {
        this.recordData = res.data
        if (this.recordData) {
          this.createJournalEntryForm.get('total_amount')?.setValue(this.recordData?.grant_total)
        }
      }, (err) => {
        return this.toast.error(err.error.message)
      })



    }
  }




  getBank: any = []
  getAllBank() {
    this._finaceService.getBankList(this.entity_id).subscribe((res: any) => {
      if (res) {
        this.getBank = res.data;
      }
    })
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

  getAllBranchData: any = []
  getAllBranch() {
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.getAllBranchData = res.data

    })
  }
  getAllProfitCenterData: any = []
  getAllProfitCenter() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._finaceService.getAllProfitCenter(entity_id).subscribe((res: any) => {
      this.getAllProfitCenterData = res.data;
    })
  }
  costCenter: any = []
  getAllCostCenter() {
    this._finaceService.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.costCenter = res.data;
    },
      ((err: any) => {

        this.costCenter = []
      })
    )
  }
  getCurrencyData: any = []
  getCurrency() {

    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.getCurrencyData = res.data;

    }, (err: any) => {
      this.getCurrencyData = []
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
  voucherData: any = []
  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(10, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
    })
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
      service_id: [],
      service_code: [''],
      qty: [0],
      rate: [0],
      discount_type: ['FIXED'],
      discount_value: [0],
      total_value: [{ value: 0, }],
      cost_center_id: [],
      profit_center_id: [],
      narration: [''],
      discount_amount: [0],
      gst_rate: [0],
      gst_amount: [0],
      journal_id: journal
    });
  }


  summary = {
    taxable: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    gstTotal: 0,
    gross: 0,
    net: 0,
    totalDiscount: 0,
  };

  getItemCode(data: any, i: any) {
    const row = (this.Account_details as FormArray).at(i);
    row.patchValue({
      service_code: data.service_code,
      gst_rate: data.igst
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
      this.calculateSummary()
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
  calculateRow(index: number) {
    const rows = this.Account_details as FormArray;
    const row = rows.at(index) as FormGroup;

    const qty = +row.get('qty')?.value || 0;
    const rate = +row.get('rate')?.value || 0;
    const discountType = row.get('discount_type')?.value;
    const discountValue = +row.get('discount_value')?.value || 0;
    const gstRate = +row.get('gst_rate')?.value || 0;

    const grossAmount = qty * rate;

    let discountAmount = 0;

    if (discountType === 'FIXED') {
      discountAmount = discountValue;
    } else if (discountType === 'PERCENTAGE') {
      discountAmount = (grossAmount * discountValue) / 100;
    }

    const taxableAmount = grossAmount - discountAmount;


    const gstAmount = (taxableAmount * gstRate) / 100;


    const totalAmount = taxableAmount + gstAmount;

    row.patchValue(
      {
        total_value: +totalAmount.toFixed(2),
        discount_amount: +discountAmount.toFixed(2),
        gst_amount: +gstAmount.toFixed(2)
      },
      { emitEvent: false }
    );

    this.calculateSummary();
  }

  calculateSummary() {
    const rows = this.Account_details as FormArray;

    let taxable = 0;
    let totalDiscount = 0;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let gstTotal = 0;

    rows.controls.forEach((row: any) => {

      const qty = +row.get('qty')?.value || 0;
      const rate = +row.get('rate')?.value || 0;

      const discount = +row.get('discount_amount')?.value || 0;
      const gstAmount = +row.get('gst_amount')?.value || 0;

      // Taxable amount before GST
      const grossAmount = qty * rate;
      const taxableAmount = grossAmount - discount;

      taxable += taxableAmount;
      totalDiscount += discount;
      gstTotal += gstAmount;

      if (this.isInterState) {
        igst += gstAmount;
      } else {
        cgst += gstAmount / 2;
        sgst += gstAmount / 2;
      }
    });

    const netAmount = taxable + gstTotal;

    this.summary = {
      taxable: +taxable.toFixed(2),
      cgst: +cgst.toFixed(2),
      sgst: +sgst.toFixed(2),
      igst: +igst.toFixed(2),
      gstTotal: +gstTotal.toFixed(2),
      gross: +taxable.toFixed(2),
      net: +netAmount.toFixed(2),
      totalDiscount: +totalDiscount.toFixed(2)
    };
  }
  isInterState: any
  checkAndApplyGST(customer: any, company: any) {

    const customerState = (customer.states_name || '').toLowerCase().trim();

    let companyState = '';
    if (company?.registered_office) {
      const parts = company.registered_office.split(',');
      companyState = parts[parts.length - 1].toLowerCase().trim();
    }

    this.isInterState = customerState !== companyState;

    console.log('Customer State:', customerState);
    console.log('Company State:', companyState);
    console.log('Is Inter State:', this.isInterState);

    this.calculateSummary();
  }

  getData(event: any, control: string) {
    let sales_value = +this.createJournalreferanceForm.get('sales_value')?.value || 0;
    let freight_charge = +this.createJournalreferanceForm.get('freigth_packging_charges')?.value || 0;
    let insurance_charge = +this.createJournalreferanceForm.get('insurance_charges')?.value || 0;
    if (control === 'freight') {
      freight_charge = +event.target.value || 0;
      this.createJournalreferanceForm.get('bill_amount')?.setValue(sales_value + freight_charge);
    } else if (control === 'insurance') {

      insurance_charge = +event.target.value || 0;
      this.createJournalreferanceForm.get('bill_amount')?.setValue(sales_value + freight_charge + insurance_charge);


    }

    const bill_amount = sales_value + freight_charge + insurance_charge;
    this.createJournalreferanceForm.get('bill_amount')?.setValue(bill_amount);
  }











  getTds(event: any, i: any) {

    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('tds_rate')?.enable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.enable()
    } else {
      this.Account_details.controls[i]?.get('tds_rate')?.disable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.disable()
      this.Account_details.controls[i]?.get('tds_rate_amount')?.reset()
      this.Account_details.controls[i]?.get('tds_rate')?.reset()

    }
  }

  surcharge(event: any, i: any) {

    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.enable()
      this.Account_details.controls[i]?.get('surcharge_rate')?.enable()

    } else {
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.disable()
      this.Account_details.controls[i]?.get('surcharge_rate')?.disable()
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.reset()
      this.Account_details.controls[i]?.get('surcharge_rate')?.reset()


    }
  }
  cessAmount(event: any, i: any) {

    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('cess_rate_amount')?.enable()
      this.Account_details.controls[i]?.get('cess_rate')?.enable()

    } else {
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

          let paylod = {
            ...this.createJournalreferanceForm.value,
            ...this.createJournalEntryForm.value,
            ...this.createJournalEntryItemForm.value,
            financial_id: this.financial_id
          }
          paylod.reference_date = moment(this.createJournalreferanceForm.value.reference_date).format('YYYY-MM-DD')
          paylod.transaction_date = moment(this.createJournalreferanceForm.value.transaction_date).format('YYYY-MM-DD')
          paylod.posting_date = moment(this.createJournalreferanceForm.value.posting_date).format('YYYY-MM-DD')
          let finalPayload = {
            ...paylod,
            calculatedAmt: this.summary
          }


          this.bankAccountIds = [];
          this._finaceService.createServiceVoucher(finalPayload).subscribe({
            next: (response: any) => {
              if (response && response.code === 200) { // adjust condition as per your API
                this.toast.success('Service Voucher Created Successfully');
                this.router.navigate(['master/finance/transactions/service-voucher']);
              } else {

                this.toast.error(response?.message || 'Something went wrong');
              }
            },
            error: (err) => {

              console.error('Error creating service voucher:', err);
              const errorMsg = err?.error?.message || 'Failed to create Service Voucher';
              this.toast.error(errorMsg);
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
    this.calculateSummary();
  }

  back() {
    this.router.navigate(['/master/finance/transactions/service-voucher'])
  }
  branch_id: any
  getBranchId(event: any) {
    this.branch_id = event.value
    this.createJournalEntryForm.get('voucher_id')?.reset()
    this.createJournalEntryForm.get('document_number')?.reset()
  }
  getVoucherId(event: any) {
    let payload = {
      branch_id: this.branch_id,
      voucher_id: event.value
    }
    this._finaceService.generateServiceVoucherNumber(payload).subscribe((res: any) => {
      if (res) {
        this.createJournalEntryForm.patchValue({
          document_number: res.data
        })
      }
    })
  }

  getServiceVoucherById(id: any) {
    this._finaceService.getServiceVoucherById(id).subscribe({
      next: (res: any) => {
        console.log(res);
        const response = res?.data; // api response

        // Main Form Patch
        this.createJournalEntryForm.patchValue({
          posting_date: response?.posting_date,
          entity_id: response?.entity_id,
          voucher_id: response?.voucher_list_id,
          document_number: response?.document_number,
          transaction_date: response?.transaction_date,
          branch_id: response?.branch_id,
          reference_number: response?.reference_number,
          customer_id: response?.customer_id,
          document_type: response?.document_type,
          sales_quotation_id: response?.quotation_id,
          proforma_invoice_id: response?.proforma_invoice_id,
          sales_booking_id: response?.sales_booking_id,
          sales_order_id: response?.sales_order_id,
          sales_invoice_id: response?.sales_invoice_id,
          total_amount: response?.netAmt,
          notes: response?.notes,
        });


        // FormArray Patch
        const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

        accountDetailsArray.clear();

        response?.SERVICE_VOUCHER_ACCOUNT_LISTs?.forEach((item: any) => {
          accountDetailsArray.push(
            this.fb.group({
              service_id: [item?.service_id],
              service_code: [''],
              qty: [item?.qty],
              rate: [item?.rate],
              discount_type: [item?.discount_type || 'FIXED'],
              discount_value: [item?.discount_value],
              total_value: [item?.total_value],
              cost_center_id: [item?.cost_center_id],
              profit_center_id: [item?.profit_center_id],
              narration: [item?.narration],
              discount_amount: [item?.discount_amount],
              gst_rate: [0],
              gst_amount: [0],
              journal_id: [response?.document_number]
            })
          );
        });
        this.summary = {
          taxable: Number(response?.taxableAmt || 0),
          cgst: Number(response?.cgstAmt || 0),
          sgst: Number(response?.sgstAmt || 0),
          igst: Number(response?.igstAmt || 0),
          gstTotal: Number(response?.gstTotalAmt || 0),
          gross: Number(response?.grossAmt || 0),
          net: Number(response?.netAmt || 0),
          totalDiscount: Number(response?.totalDiscount || 0),
        };
        this.isView=true;
      }, error(err) {
        console.log(err)
      },
    })
  }
}
