
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import {  Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { BankStatementUploadComponent } from '../bank-statement-upload/bank-statement-upload.component';

@Component({
  selector: 'app-bank-clearence',
  templateUrl: './bank-clearence.component.html',
  styleUrls: ['./bank-clearence.component.scss']
})

export class BankClearenceComponent implements OnInit {
  private gridApi1!: GridApi<any>;
  private gridApi2!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedLeadList: any = [];
  userLoginId: any;
  chartedAccount: any;
  bankClearanceForm: FormGroup;
  rowData: any;
  rowDataDynamic:any;
  Account_list: any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalBalance: number = 0;
  selectedDates:any[]=[];


  bankCoaList:any[]=[];
  entity_id:any;

  dialogRef: MatDialog | any;
  includeReconciled:boolean = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    public dialog: MatDialog,
   
    private _commonService : CommonService,



  ) {
    this.rowClass = 'rowClass';
    this.bankClearanceForm = this.fb.group({
      chart_of_account_id : new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      
    })
  }

  company_id:any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId")
    this.getchartedAccount();
    this.getCashInBankCOAList();
    this.getAllBankAccList();
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
    // this.getJournalEntriesForBankClearance();
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
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    const pageSize = Number(value);

    if (this.gridApi1) {
      this.gridApi1.paginationSetPageSize(pageSize);
    }

    if (this.gridApi2) {
      this.gridApi2.paginationSetPageSize(pageSize);
    }
  }
  public columnDefsDynamic :any= [
    {
      headerName: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      wrapHeaderText: true,
      flex: 1,

    },
    {
      headerName: 'Referenace Number',
      field: 'refrence_no',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      wrapHeaderText: true,
      flex: 1,

    },
    {
      headerName: 'Reference Date',
      field: 'clearence_date',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      wrapHeaderText: true,
      flex: 1,

    },
    {
      headerName: 'balance',
      field: 'amount',
      sortable: true,
      resizable: true,
      cellClass: 'grid-cell-centered',
      wrapHeaderText: true,
      flex: 1,

    },
  ]

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
      // {
      //   headerName: 'Payment Entry',
      //   field: 'journal_no',
      //   minWidth: 160,
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   valueFormatter: (params:any) => {
      //     const date = new Date(params.value);
      //     const day = String(date.getDate()).padStart(2, '0');
      //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      //     const year = date.getFullYear();
      //     return `${day}/${month}/${year}`;
      //   }
      // },

      {
        headerName: 'Payment Entry',
        field: 'journal_no',
        minWidth: 200,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      // {
      //   headerName: 'Payment Reference',
      //   field: 'payment_reference',
      //   minWidth: 200,
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      // },
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
      {
        headerName: 'Amount',
        minWidth: 160,
        field: 'amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Cheque Number',
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

  // onGridReady(params:any) {
  //   this.gridApi = params.api;
  //   this.gridApi.setRowData(this.rowData);
  //   // this.gridApi.forEachNode((node) => {
  //   //   if (node.data.clearance_date === null) {
  //   //     params.api.startEditingCell({
  //   //       rowIndex: node.rowIndex,
  //   //       colKey: 'clearance_date'
  //   //     });
  //   //   }
  //   // });
  // }
  onGridReady(params: any, gridNumber: number) {
    if (gridNumber === 1) {
      this.gridApi1 = params.api;
      this.gridApi1.setRowData(this.rowData);
    } else if (gridNumber === 2) {
      this.gridApi2 = params.api;
      this.gridApi2.setRowData(this.rowDataDynamic);
    }
  }


  onFilterTextBoxChanged(gridNumber: number) {
    const filterInputId = `filter-text-box-${gridNumber}`;
    const filterValue = (document.getElementById(filterInputId) as HTMLInputElement).value;

    if (gridNumber === 1 && this.gridApi1) {
      this.gridApi1.setQuickFilter(filterValue);
    } else if (gridNumber === 2 && this.gridApi2) {
      this.gridApi2.setQuickFilter(filterValue);
    }
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
    // this.getJournalList();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    // this.getJournalList();
  }

  clearDate(control:any) {
    this.bankClearanceForm.get(control)?.reset();
    // this.getJournalList();
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
    let filteredVariable = this.bankAccList2.filter((item: any) => aa.includes(item.account_name));
    this.allBankAccList = filteredVariable
  }




  getJournalEntriesForBankClearance() {

    if (!this.account_id) {
      this.toast.warning('Please select any account!');
      return;
    }
  
    let payload: any = {};
  
    if (this.bankClearanceForm.value.from_date && this.bankClearanceForm.value.to_date) {
      payload.from_date = this.FromDate;
      payload.to_date = this.toDate;
    }
  
 
    this.rowData = [];
    this.selectedDates = [];
  
    this._finaceservice
      .getJournalEntriesForBankClearance(this.account_id, this.entity_id, payload)
      .subscribe((res: any) => {
        this.rowData = res.data;
        this.rowDataDynamic= res.bankClearenceData
      });
  }





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



  updateClearanceDates() {

    if(this.selectedDates.length == 0)
    {
      this.toast.warning('Please Select the Clearance Date (should be bigger than the cheque reference date)!')
    }
    else{
    this._finaceservice.updateClearanceDates(this.selectedDates).subscribe((res:any)=>{

      if(res.code == 200){
       this.toast.success(res.message)
       this.rowData = [];
       this.getJournalEntriesForBankClearance();
      }
      else{
        this.toast.warning(res.message)
      }
    })
  }
  }

  onSelectCheckbox(event:any){

    if(event.checked == true){
      this.includeReconciled = true;
      if(!this.account_id){
        this.toast.warning('Please select any account!')
        return
      }
      else if(!this.bankClearanceForm.value.from_date){
        this.toast.warning('Please select From Date!')
        return
      }
      else if(!this.bankClearanceForm.value.to_date){
        this.toast.warning('Please select To Date!')
        return
      }

      else{
        this.rowData = [];
        this.selectedDates = [];
        this._finaceservice.getAllJournalEntriesForBankClearance(this.account_id, this.entity_id, this.bankClearanceForm.value).subscribe((res:any)=>{

          this.rowData = res.data;
        })

      }
    }
    else{
      this.includeReconciled = false;
      this.getJournalEntriesForBankClearance();
    }

  }


  openDialog() {
    const val = this.bankClearanceForm.get('chart_of_account_id')?.value;
    if(!val){
      this.toast.warning('Please select any account first!')
      return
    }
  
    const name = this.allBankAccList.filter(e=>e.is_company_account==true).find(e=>e.chart_account_id==val)?.account_name
    this.dialogRef = this.dialog.open(BankStatementUploadComponent, {
      width: '600px',
      disableClose: true,
      data:{bankAccount:name,chart_account_id:val}
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return; 
        this._finaceservice.getBankClearenceList(this.entity_id).subscribe((res:any)=>{
          if(res.code == 200){
            this.rowDataDynamic = res.data;
          }
          else{
            this.toast.warning(res.message)
          }
        },(err:any)=>{
          this.toast.error(err.error.message)
        })
        
     
    });
  }

  reconcile(){
    const val = this.bankClearanceForm.get('chart_of_account_id')?.value;
    if(!this.rowDataDynamic || !val){
      this.toast.warning('Please select account & Upload bank Statement first!')
      return
    }
    if(this.rowData.length===0 ){
      this.toast.warning('No Payment Entries for Reconciliation')
      return
    }
    const data = this.bankClearanceForm.value;
    data.entity_id = this.entity_id
    this._finaceservice.reconcileBankStatement(data).subscribe((res:any)=>{
      if(res.code == 200){
        this.toast.success(res.message)
        this._finaceservice
        .getJournalEntriesForBankClearance(this.account_id, this.entity_id, '')
        .subscribe((res: any) => {
          this.rowData = res.data;
          this.rowDataDynamic= res.bankClearenceData
        });
       
           
    
      }

      // if(res.success===true){
      //   if(res.reconciledCount===0){
      //     this.toast.warning('No Match Found for Reconciliation')
      //   }
      //   this.rowData = [];
      //   this.getJournalEntriesForBankClearance();
      //   if(res.unreconciled.length>0){

      //     this.rowDataDynamic = res.unreconciled;
      //   }
      //   this._commonService?.hideLoader();

      // }
    },(err:any)=>{
      this.toast.error(err.error.message)

    })
  }



}


