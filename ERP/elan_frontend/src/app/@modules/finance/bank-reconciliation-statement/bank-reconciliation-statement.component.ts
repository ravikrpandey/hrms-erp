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


@Component({
  selector: 'app-bank-reconciliation-statement',
  templateUrl: './bank-reconciliation-statement.component.html',
  styleUrls: ['./bank-reconciliation-statement.component.scss']
})
export class BankReconciliationStatementComponent {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,  
    enableClipboard: true,  };
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

  ) {
    this.rowClass = 'rowClass';
    this.bankClearanceForm = this.fb.group({
      chart_of_account : new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    })
  }

  company_id:any;
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId")
    this.getchartedAccount();
    this.getCashInBankCOAList();

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
        headerName: 'Posting Date',
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
        headerName: 'Payment Document Type',
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
        headerName: 'Payment Document',
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
        headerName: 'Debit',
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
        headerName: 'Credit',
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
        headerName: 'Cheque Reference Number',
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
        headerName: 'Cheque Reference Date',
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

  getJournalEntriesForBankClearance(){
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
      let payload = {from_date:this.FromDate, to_date:this.toDate}
      this.rowData = [];
      this.selectedDates = [];
      this._finaceservice.getJournalEntriesForBankClearance(this.account_id, this.entity_id, payload).subscribe((res:any)=>{

        this.rowData = res.data;
      })

    }
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
      this.getJournalEntriesForBankClearance();
    }

  }
}
