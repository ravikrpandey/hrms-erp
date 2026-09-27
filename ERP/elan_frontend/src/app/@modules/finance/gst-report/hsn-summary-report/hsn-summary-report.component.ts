import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-hsn-summary-report',
  templateUrl: './hsn-summary-report.component.html',
  styleUrls: ['./hsn-summary-report.component.scss']
})
export class HsnSummaryReportComponent {
private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowClass: any;
  matBtnColor: boolean = true;
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,
    enableClipboard: true,  };
  selectedLeadList: any = [];
  userLoginId: any;
  chartedAccount: any;
  JournalForm: FormGroup;
  rowData: any;
  financial_id:any
  Account_list: any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalBalance: number = 0;
  filterControl = new FormControl();
  filteredAccountsList: any;
  entity_id:any;
  partyNameList:any[]=[];
  partyList1:any[]=[];
  partyList2:any[]=[];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      company: new FormControl(null),
      currency: new FormControl(null),
      chart_of_account : new FormControl(null),
      currency_id : new FormControl(null),
      // company_id: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      party_type: new FormControl(null),
      party_type_id: new FormControl(null)
    })
  }

  ngOnInit(): void {

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    this.filterControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.chartedAccount = this.filteredAccountsList.filter((account:any) =>
        account.account_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.getchartedAccount();
    // this.userLoginId = localStorage.getItem('EmpMainId')
    // const company_id = localStorage.getItem("company_id");
    const company_name = localStorage.getItem("company");
    const currency_id = localStorage.getItem("quotation_currency_id");
    const currency_name = localStorage.getItem("base_currency");
    this.JournalForm.patchValue({
      company: company_name,
      currency: currency_name,
      // company_id : company_id,
      currency_id : currency_id,
    });

    this.getJournalList();
  }

  getJournalList(){
    this.rowData = [];
    this.totalDebit = 0.00;
    this.totalCredit  = 0.00;
    this.totalBalance  = 0.00;
    let payload = {
      ...this.JournalForm.value,
      financial_id:this.financial_id
    }
    this._finaceservice.getJournalList(payload , this.entity_id).subscribe((response: any) => {
      if (response) {
        this.Account_list = []
       
      }
      else{
        this.rowData = [];
        this.totalDebit = 0.00;
        this.totalCredit  = 0.00;
        this.totalBalance  = 0.00;
      }
    },
    (err: any) => {
      console.error("Error while fetching journal list:", err);
    }
  );
  }

  calculateTotals() {
    this.totalDebit = this.Account_list.reduce((sum: any, account: any) => {
        const debit = parseFloat(account.debit_amount);
        return sum + (isNaN(debit) ? 0 : debit);
    }, 0);

    this.totalCredit = this.Account_list.reduce((sum: any, account: any) => {
        const credit = parseFloat(account.credit_amount);
        return sum + (isNaN(credit) ? 0 : credit);
    }, 0);

    this.totalBalance = this.totalDebit - this.totalCredit;
}

//   calculateTotals() {
//
//     this.totalDebit = this.Account_list.reduce((sum: any, account: any) => sum + parseFloat(account.debit_amount), 0);
//     this.totalCredit = this.Account_list.reduce((sum: any, account: any) => sum + parseFloat(account.credit_amount), 0);
//     this.totalBalance = this.totalDebit - this.totalCredit;
// }

  getchartedAccount(){
    // const company_id = localStorage.getItem("company_id");
    this._finaceservice.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data;
      // this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.filteredAccountsList = this.chartedAccount;
    });
  }

  onAccountChange(){
    this.getJournalList();
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup?.get('from_date')?.value;
    const toDate = formGroup?.get('to_date')?.value;
    if (fromDate && toDate && fromDate > toDate || !fromDate && toDate) {
      formGroup?.get('to_date')?.setErrors({ invalidDateRange: true });
      this.JournalForm.patchValue({
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
      minWidth: 60,
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
   
    {
      headerName: 'Vendor Name',
      field: 'date',
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
      headerName: 'Vendor GSTIN',
      field: 'account_name',
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Invoice No',
      minWidth: 150,
      field: 'entry_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Invoice Date',
      minWidth: 150,
      field: 'debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
      // valueGetter: (params:any) => {
      //   return params.data && params.data.debit_amount ? params.data.debit_amount : 0;
      // }
    },
    {
      headerName: 'Posting Date',
      minWidth: 150,
      field: 'credit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
      headerName: 'Taxable Value',
      minWidth: 170,
      field: 'journal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Input CGST',
      minWidth: 160,
      field: 'party_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Input SGST',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'Input IGST',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'TDS Amount',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'Reverse Charge',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'ITC Eligibility',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'Expense Type',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'HSN/SAC',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
    {
      headerName: 'GRN No',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
      {
      headerName: 'PO No',
      minWidth:160,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueGetter: (params:any) => {
      //   return params.data && params.data.employee_name
      //     ? params.data.employee_name
      //     : params.data.vendor_name
      // }
    },
   
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //
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
    this.JournalForm.patchValue({ to_date: '' });
    this.getJournalList();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getJournalList();
  }

  clearDate(control:any) {
    this.JournalForm.get(control)?.reset();
    this.getJournalList();
    if(control == 'from_date'){
      const from_date = this.JournalForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
      // this.JournalForm.patchValue({ to_date: '' });
    }
  }



  onPartyTypeChange(e:any){
    this.getJournalList();
    let party = e.value;
    this.partyNameList =[];
    this._finaceservice.get_Party_Name_List(party,this.entity_id).subscribe((res: any) => {
      this.partyNameList = res.data;
      this.partyList1 = res?.data?.map((x:any)=>x.party_name);
      this.partyList2 = this.partyNameList;
    });

  }

  partyFilter(e:any){
    let aa= e;
    let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.party_name));
    this.partyNameList = filteredVariable
  }
  onPartyTypeNameSelect(){
    this.getJournalList();
  }
}
