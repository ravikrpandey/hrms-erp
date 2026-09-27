
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-bank-recancelation',
  templateUrl: './bank-recancelation.component.html',
  styleUrls: ['./bank-recancelation.component.scss']
})

export class BankRecancelationComponent implements OnInit {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedLeadList: any = [];
  userLoginId: any;
  chartedAccount: any;
  bankClearanceForm: FormGroup;
  rowData: any;
  Account_list: any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalBalance: number = 0;
  selectedDates:any[]=[];


  bankCoaList:any[]=[];
  entity_id:any;


  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private commonService: CommonService

  ) {
    this.rowClass = 'rowClass';
    this.bankClearanceForm = this.fb.group({
      chart_of_account : new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      isReconciledEntries: new FormControl(false)
    })
  }

  company_id:any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getchartedAccount();
    this.getCashInBankCOAList();
    this.getAllBankAccList();
    this.getBankEntriesForBankReconciliationStatm();
  }



  calculateTotals() {
    this.totalDebit = this.Account_list.reduce((sum:any, account:any) => sum + account.debit_amount, 0);
    this.totalCredit = this.Account_list.reduce((sum:any, account:any) => sum + account.credit_amount, 0);
    this.totalBalance = this.totalDebit - this.totalCredit;
  }

  getchartedAccount(){
    this._finaceservice.getchartedAccount(this.company_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
    });
  }
  account_id:any;

  onAccountChange(event:any){
    // this.getJournalList();
   this.rowData = [];
   this.account_id = event.value;
   if(this.bankClearanceForm.get('isReconciledEntries')?.value){
    this.total_gl_debit = 0;
    this.total_gl_credit = 0;
    this.outstanding_debit_total  = 0;
    this.outstanding_credit_total  = 0;
    this.cleared_debit_total  = 0;
    this.cleared_credit_total  = 0;
    let from_date = this.bankClearanceForm.get('from_date')?.value;
    let to_date = this.bankClearanceForm.get('to_date')?.value;
      let account_id = this.bankClearanceForm.get('chart_of_account')?.value;
      let payload = {from_date: from_date, to_date: to_date, account_id: account_id ,entity_id:this.entity_id}
      this.rowData = [];
      this.selectedDates = [];
      this._finaceservice.getBankEntriesForBankReconciliationStatm(payload).subscribe((res:any)=>{
        this.total_gl_debit = res?.total_gl_debit;
        this.total_gl_credit = res?.total_gl_credit;
        this.outstanding_debit_total = res?.outstanding_debit_total;
        this.outstanding_credit_total = res?.outstanding_credit_total;
        this.cleared_debit_total = res?.cleared_debit_total;
        this.cleared_credit_total = res?.cleared_credit_total;
        this.rowData = res.data;
        this.rowData.forEach((element:any) => {
          if(element.typeen === 'debit_amount'){
           element.credit = element.amount
           element.debit = 0
          }
          else{
           element.debit = element.amount
           element.credit = 0
          }
       });


      })
  }else{

    this.getBankEntriesForBankReconciliationStatm();
  }
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup?.get('from_date')?.value;
    const toDate = formGroup?.get('to_date')?.value;
    if (fromDate && toDate && fromDate > toDate || !fromDate && toDate) {
      formGroup?.get('to_date')?.setErrors({ invalidDateRange: true });
      this.bankClearanceForm.patchValue({
        to_date: '',
      });
    } else {
      formGroup?.get('to_date')?.setErrors(null);
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

    public columnDefs = [
      {
        headerName: 'S No.',
        maxWidth: 70,
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered ',
        flex: 1,
      },
      {
        headerName: 'Posting Date',
        field: 'posting_date',
        minWidth: 160,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params:any) => {
          const date = new Date(params.value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      },
      {
        headerName: 'Payment Document Type',
        field: 'entry_status',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },


      {
        headerName: 'Payment Document',
        field: 'journal_no',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Debit',
        field: 'debit',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Credit',
        field: 'credit',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Against Account',
        field: 'chart_accounts',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      // {
      //   headerName: 'Amount',
      //   minWidth: 160,
      //   field: 'amount',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      // },
      {
        headerName: 'Reference',
        minWidth: 160,
        field: 'reference',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Reference Date',
        minWidth: 160,
        field: 'reference_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },

      {
        headerName: 'Clearance Date',
        field: 'bank_clearance_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        minWidth: 200,
        flex: 1,
        cellEditorFramework: CustomDatePickerComponent, // Use custom date picker
        editable: true,
      },
    // {
    //   headerName: 'Cheque Number',
    //   minWidth: 150,
    //   field: 'reference',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   valueGetter: (params:any) => {
    //     return params.data && params.data.debit_amount ? params.data.debit_amount : 0;
    //   }
    // },
    // {
    //   headerName: 'Clearance Date',
    //   minWidth: 150,
    //   field: 'posting_date',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   valueGetter: (params:any) => {
    //     return params.data && params.data.credit_amount ? params.data.credit_amount : 0;
    //   }
    // }
  ];


  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   //
  // }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
    // this.gridApi.forEachNode((node) => {
    //   if (node.data.clearance_date === null) {
    //     params.api.startEditingCell({
    //       rowIndex: node.rowIndex,
    //       colKey: 'clearance_date'
    //     });
    //   }
    // });
  }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


  goBack() {
    this.location.back()
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

  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.bankClearanceForm.patchValue({ to_date: '' });
    this.getBankEntriesForBankReconciliationStatm();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getBankEntriesForBankReconciliationStatm();
  }

  clearDate(control:any) {
    this.bankClearanceForm.get(control)?.reset();
    if(this.bankClearanceForm.get('isReconciledEntries')?.value){
      let from_date = this.bankClearanceForm.get('from_date')?.value;
      let to_date = this.bankClearanceForm.get('to_date')?.value;
        let account_id = this.bankClearanceForm.get('chart_of_account')?.value;
        let payload = {from_date: from_date, to_date: to_date, account_id: account_id,entity_id:this.entity_id }
        this.rowData = [];
        this.selectedDates = [];
        this._finaceservice.getBankEntriesForBankReconciliationStatm(payload).subscribe((res:any)=>{
          this.total_gl_debit = res?.total_gl_debit;
          this.total_gl_credit = res?.total_gl_credit;
          this.outstanding_debit_total = res?.outstanding_debit_total;
          this.outstanding_credit_total = res?.outstanding_credit_total;
          this.cleared_debit_total = res?.cleared_debit_total;
          this.cleared_credit_total = res?.cleared_credit_total;
          this.rowData = res.data;
          this.rowData.forEach((element:any) => {
            if(element.typeen === 'debit_amount'){
             element.credit = element.amount
             element.debit = 0
            }
            else{
             element.debit = element.amount
             element.credit = 0
            }
         });


        })
    }else{

      this.getBankEntriesForBankReconciliationStatm();
    }
    if(control == 'from_date'){
      const from_date = this.bankClearanceForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
      // this.bankClearanceForm.patchValue({ to_date: '' });
    }


  }



  getCashInBankCOAList(){
   this._finaceservice.getCashInBankCOA(this.entity_id).subscribe((res:any)=>{

    this.bankCoaList = res.data;
   })
  }

  allBankAccList:any[]=[];
  bankAccList1:any[]=[];
  bankAccList2:any[]=[];

  getAllBankAccList(){
    this._finaceservice.BankClearenceAccountList(this.entity_id).subscribe((res:any)=>{
      this.allBankAccList =  res?.data;

      this.bankAccList1 = this.allBankAccList.map((res:any)=>res.account_name);
      this.bankAccList2 = this.allBankAccList;
    })
  }



  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.bankAccList2.filter((item: any) => aa.includes(item.account_names));
    this.allBankAccList = filteredVariable
  }

  total_gl_debit:number = 0;
  total_gl_credit:number = 0;
  outstanding_debit_total:number = 0;
  outstanding_credit_total:number = 0;
  cleared_debit_total:number = 0;
  cleared_credit_total:number = 0;
  getBankEntriesForBankReconciliationStatm(){
    // if(!this.account_id){
    //   this.toast.warning('Please select any account!')
    //   return
    // }
    this.total_gl_debit = 0;
    this.total_gl_credit = 0;
    this.outstanding_debit_total  = 0;
    this.outstanding_credit_total  = 0;
    this.cleared_debit_total  = 0;
    this.cleared_credit_total  = 0;
    let from_date = this.bankClearanceForm.get('from_date')?.value;
    let to_date = this.bankClearanceForm.get('to_date')?.value;
      let account_id = this.bankClearanceForm.get('chart_of_account')?.value;
      let payload = {from_date: from_date, to_date: to_date, account_id: account_id,entity_id: this.entity_id}
      this.rowData = [];
      if(account_id && from_date && to_date){


      if(this.bankClearanceForm.get('isReconciledEntries')?.value){

          this.selectedDates = [];
          this._finaceservice.getBankEntriesForBankReconciliationStatm(payload).subscribe((res:any)=>{
            this.total_gl_debit = res?.total_gl_debit;
            this.total_gl_credit = res?.total_gl_credit;
            this.outstanding_debit_total = res?.outstanding_debit_total;
            this.outstanding_credit_total = res?.outstanding_credit_total;
            this.cleared_debit_total = res?.cleared_debit_total;
            this.cleared_credit_total = res?.cleared_credit_total;
            this.rowData = res.data;
            this.rowData.forEach((element:any) => {
              if(element.typeen === 'debit_amount'){
               element.credit = element.amount
               element.debit = 0
              }
              else{
               element.debit = element.amount
               element.credit = 0
              }
           });


          })
      }else{







      this._finaceservice.getBankEntriesForBankReconciliationStatm(payload).subscribe((res:any)=>{
        this.rowData = res.data?.filter((x:any)=> x.bank_clearance_date == null || x.bank_clearance_date === '');
        this.total_gl_debit = res?.total_gl_debit;
        this.total_gl_credit = res?.total_gl_credit;
        this.outstanding_debit_total = res?.outstanding_debit_total;
        this.outstanding_credit_total = res?.outstanding_credit_total;
        this.cleared_debit_total = res?.cleared_debit_total;
        this.cleared_credit_total = res?.cleared_credit_total;
        this.rowData.forEach((element:any) => {
           if(element.typeen === 'debit_amount'){
            element.credit = element.amount
            element.debit = 0
           }
           else{
            element.debit = element.amount
            element.credit = 0
           }

        });


      })

      }
    }

  }

  // this._finaceservice.getBankEntriesForBankReconciliationStatm(payload, this.entity_id).subscribe((res: any) => {

  //   // Filter entries without a bank clearance date
  //   this.rowData = res.data.filter((x: any) => x.bank_clearance_date == null || x.bank_clearance_date === '');

  //   // Loop through filtered data and assign debit/credit
  //   this.rowData.forEach((element: any) => {
  //     if (element.typeen === 'debit_amount') {
  //       element.credit = element.amount;
  //     } else {
  //       element.debit = element.amount;
  //     }
  //   });

  //   console.log(this.rowData, 'Filtered Bank Entries');
  // });



  onCellValueChanged(params: any) {

    if (params.colDef.field === 'bank_clearance_date') {
        const clearanceDate = new Date(params.newValue);
        const referenceDate = new Date(params.data.reference_date);
        const journalId = params.data.journal_id;

        if (clearanceDate < referenceDate) {
            this.toast.error('Clearance date cannot be less than the reference date!');
            // Remove the selected clearance date
            params.data.bank_clearance_date = null; // Reset the clearance_date in the params
            const existingIndex = this.selectedDates.findIndex(item => item.journal_id === journalId);
            if (existingIndex !== -1) {
                // Update the selectedDates array to remove the date
                this.selectedDates[existingIndex].bank_clearance_date = null; // Reset clearance date
            }
            return; // Exit the function
        }

        // Update the selectedDates array
        if (clearanceDate) {
            const existingIndex = this.selectedDates.findIndex(item => item.journal_id === journalId);
            if (existingIndex !== -1) {
                this.selectedDates[existingIndex].bank_clearance_date = clearanceDate; // Update existing
            } else {
                this.selectedDates.push({ journal_id: journalId, bank_clearance_date: clearanceDate }); // Add new
            }
        }
    }
}


  // onCellValueChangeds(params:any) {
  //
  //   if (params.colDef.field === 'clearance_date') {
  //     const clearanceDate = params.newValue; // Get the newly selected date
  //     const journalId = params.data.journal_id;

  //     if (clearanceDate) {
  //       const existingIndex = this.selectedDates.findIndex(item => item.journal_id === journalId);
  //       if (existingIndex !== -1) {
  //         this.selectedDates[existingIndex].clearance_date = clearanceDate; // Update existing
  //       } else {
  //         this.selectedDates.push({ journal_id: journalId, clearance_date: clearanceDate }); // Add new
  //       }
  //     }
  //   }
  // }



  // updateClearanceDates() {

  //   if(this.selectedDates.length == 0)
  //   {
  //     this.toast.warning('Please Select the Clearance Date (should be bigger than the cheque reference date)!')
  //   }
  //   else{
  //   this._finaceservice.updateClearanceDates(this.selectedDates).subscribe((res:any)=>{

  //     if(res.code == 200){
  //      this.toast.success(res.message)
  //      this.rowData = [];
  //      this.getJournalEntriesForBankClearance();
  //     }
  //     else{
  //       this.toast.warning(res.message)
  //     }
  //   })
  // }
  // }

  onSelectCheckbox(event:any){

    this.total_gl_debit = 0;
    this.total_gl_credit = 0;
    this.outstanding_debit_total  = 0;
    this.outstanding_credit_total  = 0;
    this.cleared_debit_total  = 0;
    this.cleared_credit_total  = 0;
    if(event.checked == true){
      let from_date = this.bankClearanceForm.get('from_date')?.value;
      let to_date = this.bankClearanceForm.get('to_date')?.value;
        let account_id = this.bankClearanceForm.get('chart_of_account')?.value;
        let payload = {from_date: from_date, to_date: to_date, account_id: account_id,entity_id:this.entity_id }
        this.rowData = [];
        this.selectedDates = [];
        this._finaceservice.getBankEntriesForBankReconciliationStatm(payload).subscribe((res:any)=>{
          this.total_gl_debit = res?.total_gl_debit;
          this.total_gl_credit = res?.total_gl_credit;
          this.outstanding_debit_total = res?.outstanding_debit_total;
          this.outstanding_credit_total = res?.outstanding_credit_total;
          this.cleared_debit_total = res?.cleared_debit_total;
          this.cleared_credit_total = res?.cleared_credit_total;
          this.rowData = res.data;
          this.rowData.forEach((element:any) => {
            if(element.typeen === 'debit_amount'){
             element.credit = element.amount
             element.debit = 0
            }
            else{
             element.debit = element.amount
             element.credit = 0
            }
         });


        })

    }
    else{
      this.getBankEntriesForBankReconciliationStatm();
    }

  }


  // onBtnExportDataAsExcel(){
  //   let data = this.rowData.map((x:any,i:number)=>({
  //     Date: moment(x.createdAt).format("YYYY-MM-DD"),
  //     DebitAmount: x.debit,
  //     DebitAccount:x.credit,
  //     AccountName:x.parent_account_name,
  //     CreditAccount: x.account_name,
  //     CreditAmount:x.credit_amount,
  //   }))
  //   const titleRow = [ '', '', 'Bank Reconciliation Statement', '', '', ''];
  //   const titleRow1 = [ '', '', '', '', '', ''];

  //   const headerRow = ['Date', 'DebitAmount', 'DebitAccount', 'AccountName', 'CreditAccount', 'CreditAmount'];

  //   const finalData = [titleRow,titleRow1, headerRow, ...data.map((item:any) => Object.values(item))];
  // console.log(finalData);
  //       this.commonService.exportExcelFile(finalData, 'bank-reconciliation-statement','MECTS S.A');
  //   }


  onBtnExportDataAsExcel(){
      // this.showDownloadMenu = false;
      let data = this.rowData.map((x:any,i:number)=>({
      postingDate:moment(x.posting_date).format("YYYY-MM-DD"),
      PaymentDocumentType:x.entry_status,
  PaymentDocument: x.journal_no,
  Debit: (x.debit || 0),
  Credit: (x.credit || 0),
  AgainstAccount: x.chart_accounts,
  Reference: x.reference,
  ReferenceDate: x.reference_date,
  ClearanceDate: x.bank_clearance_date
      }))

      const totalRow1 = {
        postingDate: '',
        PaymentDocumentType: '',
    PaymentDocument: '',
    Debit: '',
    Credit: '',
    AgainstAccount: '',
    Reference: '',
    ReferenceDate: '',
    ClearanceDate:''
    };

const totalRow = {
  postingDate: '',
  PaymentDocumentType: 'Bank Statement balance as per General ledger',
PaymentDocument: '',
Debit: (this.total_gl_debit || 0).toFixed(2),
Credit: (this.total_gl_credit || 0).toFixed(2),
AgainstAccount: '',
Reference: '',
ReferenceDate: '',
ClearanceDate:''
};



const totalRow3 = {
  postingDate: '',
  PaymentDocumentType: '',
PaymentDocument: '',
Debit: '',
Credit: '',
AgainstAccount: '',
Reference: '',
ReferenceDate: '',
ClearanceDate:''
};

const totalRow4 = {
postingDate: '',
PaymentDocumentType: 'Outstanding Cheques and Deposits to clear',
PaymentDocument: '',
Debit: (this.outstanding_debit_total || 0).toFixed(2),
Credit: (this.outstanding_credit_total || 0).toFixed(2),
AgainstAccount: '',
Reference: '',
ReferenceDate: '',
ClearanceDate:''
};

const totalRow5 = {
  postingDate: '',
  PaymentDocumentType: '',
PaymentDocument: '',
Debit: '',
Credit: '',
AgainstAccount: '',
Reference: '',
ReferenceDate: '',
ClearanceDate:''
};

const totalRow6 = {
postingDate: '',
PaymentDocumentType: 'Calculated Bank Statement balance',
PaymentDocument: '',
Debit: (this.cleared_debit_total || 0).toFixed(2) ,
Credit: (this.cleared_credit_total || 0).toFixed(2),
AgainstAccount: '',
Reference: '',
ReferenceDate: '',
ClearanceDate:''
};

      // Push the total row to the data array
      data.push(totalRow1);
      data.push(totalRow);
      data.push(totalRow3);
      data.push(totalRow4);
      data.push(totalRow5);
      data.push(totalRow6);


      let fromDate = this.bankClearanceForm.get('from_date')?.value;
      let toDate = this.bankClearanceForm.get('to_date')?.value;
      if(!fromDate && !toDate){
        fromDate = moment().startOf('year').format("YYYY-MM-DD");
        toDate = moment().endOf('year').format("YYYY-MM-DD");
      }
      else{
        fromDate = moment(fromDate).format("YYYY-MM-DD");
        toDate = moment(toDate).format("YYYY-MM-DD");
      }
      // const companyRow = [ 'MECTS S.A', '', '', '', '', '', '', '', '', '',''];
      const titleRow = [ '', '', `Bank Reconciliation Statement for`, '', '', '', '', '', ''];
      const titleRow1 = [ '', '', `${fromDate} To ${toDate}`, '', '', '', '','', '', ''];

      const headerRow = [    'postingDate',
        'PaymentDocumentType',
    'PaymentDocument',
    'Debit',
    'Credit',
    'AgainstAccount',
    'Reference',
    'ReferenceDate',
    'ClearanceDate'];

      const finalData = [titleRow, titleRow1, headerRow, ...data.map((item:any) => Object.values(item))];

          this.commonService.exportExcelFile(finalData, 'Bank Reconciliation Statement', 'MECTS S.A -');
      }


}



