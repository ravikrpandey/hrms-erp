import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { Location } from '@angular/common';
// import { AmountPipe } from 'src/app/@shared/pipe/amount.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { L } from '@fullcalendar/list/internal-common';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-vat-clearance',
  templateUrl: './vat-clearance.component.html',
  styleUrls: ['./vat-clearance.component.scss']
})
export class VatClearanceComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  vatOutputForm: FormGroup;
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  company_id:any;
  VATSalesInvoiceData:any[]=[];
  searchText:string = '';
  searchText1:string = '';
  VatAccountTransactions:any[]=[];
  is_reversal:boolean = false;

entity_id:any
//  amountPipe =  new AmountPipe();

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private commonService: CommonService,
    private location: Location
  ) {
    this.rowClass = 'rowClass';
        this.vatOutputForm = this.fb.group({

       month_val: new FormControl(null),
       month_val_from:new FormControl(null),
     month_val_to:new FormControl(null),
      financial_year_id: new FormControl(null),
     from_date: new FormControl(null),
     to_date: new FormControl(null),
        })
    this.filteredVatSalesInvoiceData();
    this.filteredVatPurchaseInvoiceData();
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id')
    this.entity_id = localStorage.getItem('selectedEntityId')
     this.financialYearName = new Date().getFullYear();
     this.getAllFinancialYear();
    //  this.getVATClearanceEntries();
    //  this.getVATAccountBalances();
    // this.getSalesInvoiceVATReportData();
    // this.getPurchaseInvoiceVATReportData();
    // this.getTrialBalanceReport()
  }



  reversal(){
  this.is_reversal = true;
  this.showVatTransactions = true;
  // this.getSalesInvoiceVATReportData();
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
    this.vatOutputForm.patchValue({ to_date: '' });
    // this.getSalesInvoiceVATReportData();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    // this.getSalesInvoiceVATReportData();
  }

  clearDate(control:any) {
    this.vatOutputForm.get(control)?.reset();
    // this.getSalesInvoiceVATReportData();
    if(control == 'from_date'){
      const from_date = this.vatOutputForm.get(control)?.value;
      this.FromDate = moment(from_date).format('YYYY-MM-DD');
      // this.JournalForm.patchValue({ to_date: '' });
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }



months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  filteredMonths:any = [...this.months];


    monthValue: any[]=[];
    fYearsFiltered:any[]=[];
  isDisabled: boolean = false;
  arrayData: any;
fYears:any[]=[];
    getAllFinancialYear() {
    this._finaceservice.getFinancialYearActive().subscribe((res: any) => {
      this.fYears = res.data;
      this.fYearsFiltered = res.data;
      let currentYear: any = new Date().getFullYear();
      // this.fYearsFiltered = this.fYearsFiltered.filter((yr: any) => {
      //   if (yr.financial_year <= currentYear) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })

      let financialYear = (res?.data.filter((x:any) => x.financial_year == currentYear));
      let financialYearId =financialYear[0]?.id;
      if(financialYearId){
        this.vatOutputForm.get('financial_year_id')?.patchValue(financialYearId);
      }
      // if (this.fid) {
      //   this.fid = Number(this.fid)
      //   this.generateForm.patchValue({ financial_year_id: this.fid })
      //   this.generateForm.patchValue({ income_type: this.type })
      //   if (!(this.mode || this.id)) {
      //     this.getIncomeStatement()
      //   }
      // }
    })
  }

 onFinancialYearChange = (e: any) => {

 }




 monthChange(e: any) {

    const selectedMonth = e.value;

    const selectedIndex = this.months.indexOf(selectedMonth);
    this.filteredMonths = this.months.slice(selectedIndex);

    this.isDisabled = false;
  }


getDateRange(financialYear: number, fromMonth: string, toMonth: string): { fromDate: string, toDate: string } {
  const monthMap: { [key: string]: number } = {
    January: 0, February: 1, March: 2,
    April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8,
    October: 9, November: 10, December: 11
  };

  const fromMonthIndex = monthMap[fromMonth];
  const toMonthIndex = monthMap[toMonth];

  // fromDate: 1st day of fromMonth
  const fromDate = new Date(financialYear, fromMonthIndex, 1);

  // toDate: last day of toMonth
  const toDate = new Date(financialYear, toMonthIndex + 1, 0); // 0th day of next month = last day of current

  // Format to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate)
  };
}


financialYearName:any;
onFinancialYearClick(data:any){
  this.financialYearName = data?.financial_year;

}


  generate = () => {
    // this.generateForm.patchValue( {financial_year_id: this.fid} )

         if(this.vat_clearance_amount && this.vat_clearance_amount != 0 ){
        this.toast.warning('Please transfer the Vat Clearance!');
        return
      }

let from_month = this.vatOutputForm.get('month_val_from')?.value;
let to_month = this.vatOutputForm.get('month_val_to')?.value;

  // if (!from_month && !to_month) {
  //     this.toast.error("Please select From Month and To Month!");
  //     return
  //   }

    if (!from_month) {
      this.toast.error("Please select From Month!");
      return
    }

    // if (!to_month) {
    //   this.toast.error("Please select To Month!");
    //   return
    // }

    if(from_month){
      // this.getSalesInvoiceVATReportData();
      // this.prepareData();
    }
  }









  filteredVatSalesInvoiceData() {

    const searchTextLower = this.searchText ? this.searchText.toLowerCase() : '';

    return this.VATSalesInvoiceData.filter(item => {
      // Check each field for null or undefined before applying toLowerCase()
      const customerName = item.party_name ? item.party_name.toLowerCase() : '';
      const salesInvoiceNo = item.sales_invoice_no ? item.sales_invoice_no.toLowerCase() : '';
      const irnNo = item.irn_no ? item.irn_no.toLowerCase() : '';

      return (
        customerName.includes(searchTextLower) ||
        salesInvoiceNo.includes(searchTextLower) ||
        irnNo.includes(searchTextLower)
      );
    });
  }

  filteredVatPurchaseInvoiceData() {

    const searchTextLower = this.searchText1 ? this.searchText1.toLowerCase() : '';

    return this.VatPurchaseInvoiceData.filter(item => {
      // Check each field for null or undefined before applying toLowerCase()
      const vendorName = item.party_name ? item.party_name.toLowerCase() : '';
      const salesInvoiceNo = item.invoiceNo ? item.invoiceNo.toLowerCase() : '';

      return (
        vendorName.includes(searchTextLower) ||
        salesInvoiceNo.includes(searchTextLower)
      );
    });
  }


  // filteredGstPurchaseInvoiceData() {
  //   return this.GstPurchaseInvoiceData.filter(item => {
  //     const searchTextLower = this.searchText1.toLowerCase();
  //     return (
  //       item.party_name.toLowerCase().includes(searchTextLower) ||
  //       item.invoiceNo.toLowerCase().includes(searchTextLower)
  //     );
  //   });
  // }


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // getTrialBalanceReport() {
  //   let entity_id = localStorage.getItem("selectedEntityId");
  //   this._finaceservice.getTrialBalanceReportList(entity_id).subscribe((response: any) => {
  //     if (response) {
  //       this.rowData = response.data;
  //       this.calculateTotals();
  //     }
  //   }, (err: any) => {
  //     // Handle error
  //   });
  // }

  total_base_amount:number = 0;
  total_vat:number = 0;
  total_amount:number = 0;
  purchase_total_base_amount:number = 0;
  purchase_total_vat:number = 0;
  purchase_total_amount:number = 0;
  total_vat_payable:number = 0;

   vatCards = [
  { label: 'OUTPUT VAT', value: this.total_vat },
  { label: 'INPUT VAT', value: this.purchase_total_vat },
  { label: 'VAT to be Paid', value: this.total_vat_payable },
  { label: 'VAT to be Recovered', value: this.total_vat_payable }
];

  calculateTotals() {
    this.total_base_amount = this.VATSalesInvoiceData.reduce((sum, row) => sum + parseFloat(row.base_amount || 0), 0);
    this.total_vat = this.VATSalesInvoiceData.reduce((sum, row) => sum + parseFloat(row.vat_amount || 0), 0);
    this.total_amount = this.VATSalesInvoiceData.reduce((sum, row) => sum + parseFloat(row.total_balance || 0), 0);
  }

  calculateVATTotals(){
    this.purchase_total_base_amount = this.VatPurchaseInvoiceData.reduce((sum, row) => sum + parseFloat(row.base_amount || 0), 0);
    this.purchase_total_vat = this.VatPurchaseInvoiceData.reduce((sum, row) => sum + parseFloat(row.vat_amount || 0), 0);
    this.purchase_total_amount = this.VatPurchaseInvoiceData.reduce((sum, row) => sum + parseFloat(row.total_balance || 0), 0);
    this.total_vat_payable = this.total_vat - this.purchase_total_vat;



console.log('vatAccTransaction', this.VatAccountTransactions)

    if (this.total_vat_payable > 0) {
  this.VatAccountTransactions.push({
    vat_account_id: 2517,
    vat_account: "4435 - IVA apuramento",
    credit_amount: this.total_vat_payable,
    debit_amount: 0,
    entry_status: 'VAT Clearance'
  });
} else if (this.total_vat_payable < 0) {
  // Add entry for negative VAT payable (e.g., as a debit)
  this.VatAccountTransactions.push({
    vat_account_id: 2517, // your static ID
    vat_account: "4435 - IVA apuramento",
    credit_amount: 0,
    debit_amount: Math.abs(this.total_vat_payable),
    entry_status: 'VAT Clearance'
  });
}

if(this.is_reversal == true){
this.VatAccountTransactions.forEach(entry => {
  const temp = entry.debit_amount;
  entry.debit_amount = entry.credit_amount;
  entry.credit_amount = temp;
});
}

console.log('vatAccTransactionAfteradd', this.VatAccountTransactions)

  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }






// isVatClearanceUpdated(): Observable<boolean> {

// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;
// let from_date;
// let to_date;
//     // const entity_id = localStorage.getItem("selectedEntityId");
// let data = {}
// if(from_month && to_month){

// const result = this.getDateRange(this.financialYearName, from_month, to_month);

// from_date = result?.fromDate;
// to_date = result?.toDate;


// }



//   // let from_date = this.vatOutputForm.get('from_date')?.value;
//   // let to_date = this.vatOutputForm.get('to_date')?.value;

//   // If dates are not provided, use current month's range
//   if (!from_month && !to_month) {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();

//     const fromDate = new Date(currentYear, currentMonth, 1);
//     const toDate = new Date(currentYear, currentMonth + 1, 0);

//     const formatDate = (date: Date): string => {
//       const year = date.getFullYear();
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const day = date.getDate().toString().padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     };

//     from_date = formatDate(fromDate);
//     to_date = formatDate(toDate);
//   }

//   const payload = { from_date, to_date };

//   // return this._finaceservice.isVatClearanceUpdated(payload).pipe(
//   //   map((res: any) => {
//   //     const isCleared = res?.is_cleared === true;

//   //     if (isCleared) {
//   //       // Clear existing VAT data if it's already marked cleared
//   //       this.VATSalesInvoiceData = [];
//   //       this.VatPurchaseInvoiceData = [];
//   //       this.VatAccountTransactions = [];
//   //     }

//   //     return isCleared;
//   //   }),
//   //   catchError((err) => {
//   //     console.error('VAT clearance check failed:', err);
//   //     return of(false); // Default to not cleared on error
//   //   })
//   // );
// }




//       getSalesInvoiceVATReportData(){
//         let financial_year_id = localStorage.getItem('financial_id');
//       if(this.vat_clearance_amount && this.vat_clearance_amount != 0 && !this.is_reversal ){
//         // this.toast.warning('Please transfer the Vat Clearance!');
//         return
//       }

//       let newPayload = {};

//     // if(this.is_reversal == true){

//     //   this._finaceservice.getVatClearanceDates().subscribe((res:any)=>{
//     //     let date_from = res.data[0]["from_date"];
//     //     let date_to = res?.data[0]["to_date"];

//     //     newPayload = {
//     //       from_date: date_from,
//     //       to_date: date_to
//     //     }
//     //   })

//     // }

//     this.total_base_amount = 0;
//     this.total_vat = 0;
//     this.total_amount  = 0;
//     this.purchase_total_base_amount = 0;
//     this.purchase_total_vat  = 0;
//     this.purchase_total_amount  = 0;
//     this.total_vat_payable  = 0;
//     this.VATSalesInvoiceData = [];
//     this.VatPurchaseInvoiceData = [];
//     this.VatAccountTransactions = [];

//   let currentDate = new Date();
// let currentYear = currentDate.getFullYear();
// let currentMonth = currentDate.getMonth();

// let fromDate = new Date(currentYear, currentMonth, 1);
// let toDate = new Date(currentYear, currentMonth + 1, 0);

// // Format as YYYY-MM-DD using padStart to keep leading zeros
// const formatDate = (date: Date) => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// let formattedFromDate = formatDate(fromDate); // "2025-05-01"
// let formattedToDate = formatDate(toDate);     // "2025-05-31"

// let payload = {
//   from_date: formattedFromDate,
//   to_date: formattedToDate,
//   financial_year_id
// };

//     // let from_date = this.vatOutputForm.get('from_date')?.value;
//     // let to_date = this.vatOutputForm.get('to_date')?.value;

//     let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;

//     if(!from_month && !to_month){
//       this.commonService.showLoader();
//       this._finaceservice.getSalesInvoiceVATReportData(payload, this.is_reversal).subscribe((res:any)=>{
//         this.VATSalesInvoiceData = res?.data;
// this.commonService.hideLoader();
//  this.isVatClearanceUpdated().subscribe((isCleared: boolean) => {
//     if (isCleared) {


//     this.total_base_amount = 0;
//     this.total_vat = 0;
//     this.total_amount  = 0;
//     this.purchase_total_base_amount = 0;
//     this.purchase_total_vat  = 0;
//     this.purchase_total_amount  = 0;
//     this.total_vat_payable  = 0;
//     this.VATSalesInvoiceData = [];
//     this.VatPurchaseInvoiceData = [];
//     this.VatAccountTransactions = [];
//     return;
//     }
//       // this.VATSalesInvoiceData.forEach(data => {
//         //   data.total_balance = data.base_amount + data.gst_amount
//         // })

//   this.getPurchaseInvoiceVATReportData();
//         this.calculateTotals();

//    })
//       })
//     }

//     else{
// //


// //
// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;

//     // const entity_id = localStorage.getItem("selectedEntityId");
// let data = { from_date: '',
//   to_date: '',
// financial_year_id}
// if(from_month && to_month){

// const result = this.getDateRange(this.financialYearName, from_month, to_month);

// let fromDate = result?.fromDate;
// let toDate = result?.toDate;

// if(fromDate && toDate){

//   data = {
//   from_date: fromDate,
//   to_date: toDate,
//   financial_year_id
//   }
// }

// }



//       //
//       this.commonService.showLoader();
//       this._finaceservice.getSalesInvoiceVATReportData(data, this.is_reversal).subscribe((res:any)=>{
//         this.VATSalesInvoiceData = res?.data;
// this.commonService.hideLoader();
// this.isVatClearanceUpdated().subscribe((isCleared: boolean) => {
//     if (isCleared) {
//       this.total_base_amount = 0;
//     this.total_vat = 0;
//     this.total_amount  = 0;
//     this.purchase_total_base_amount = 0;
//     this.purchase_total_vat  = 0;
//     this.purchase_total_amount  = 0;
//     this.total_vat_payable  = 0;
//     this.VATSalesInvoiceData = [];
//     this.VatPurchaseInvoiceData = [];
//     this.VatAccountTransactions = [];
//       return;
//     }

//   this.getPurchaseInvoiceVATReportData();
//         this.calculateTotals();

//   })
//       })

//     }

//   }

  VatPurchaseInvoiceData:any[]=[];

//   getPurchaseInvoiceVATReportData(){
//   let financial_year_id = localStorage.getItem('financial_id');
//     this.VatAccountTransactions = [];
// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;
//       let currentDate = new Date();
// let currentYear = currentDate.getFullYear();
// let currentMonth = currentDate.getMonth();

// let fromDate = new Date(currentYear, currentMonth, 1);
// let toDate = new Date(currentYear, currentMonth + 1, 0);

// // Format as YYYY-MM-DD using padStart to keep leading zeros
// const formatDate = (date: Date) => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// let formattedFromDate = formatDate(fromDate); // "2025-05-01"
// let formattedToDate = formatDate(toDate);     // "2025-05-31"

// let payload = {
//   from_date: formattedFromDate,
//   to_date: formattedToDate,
//   financial_year_id
// };

//     let from_date = this.vatOutputForm.get('from_date')?.value;
//     let to_date = this.vatOutputForm.get('to_date')?.value;

//     if(!from_month && !to_month){
//       this.commonService.showLoader();
//       this._finaceservice.getPurchaseInvoiceVATReportData(payload,this.entity_id, this.is_reversal).subscribe((res:any)=>{
//         this.VatPurchaseInvoiceData = res?.data;
//         this.commonService.hideLoader();
//         this.VatPurchaseInvoiceData.forEach(data => {
//           data.total_balance = parseFloat(data.base_amount) + parseFloat(data.vat_amount)

//         })

//         const groupedVat = Object.values(
//   this.VatPurchaseInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           credit_amount: 0,
//           debit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].credit_amount += vat;

//       return acc;
//     }, {})
// );



// const groupedSalesVat = Object.values(
//   this.VATSalesInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           debit_amount: 0,
//           credit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].debit_amount += vat;

//       return acc;
//     }, {})
// );

// this.VatAccountTransactions = [...groupedVat, ...groupedSalesVat]




//           this.calculateTotals();
//           this.calculateVATTotals();
//       this.getJournalEntryVatReport();




//       })
//     }

//     else{

// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;

//     // const entity_id = localStorage.getItem("selectedEntityId");
// let data = {  from_date: '',
//   to_date: '',
// financial_year_id}
// if(from_month && to_month){

// const result = this.getDateRange(this.financialYearName, from_month, to_month);

// let fromDate = result?.fromDate;
// let toDate = result?.toDate;

// if(fromDate && toDate){

//   data = {
//   from_date: fromDate,
//   to_date: toDate,
//   financial_year_id
//   }
// }

// }
//       this.commonService.showLoader();
//       this._finaceservice.getPurchaseInvoiceVATReportData( data,this.entity_id, this.is_reversal).subscribe((res:any)=>{
//         this.VatPurchaseInvoiceData = res?.data;
// this.commonService.hideLoader();
//         this.VatPurchaseInvoiceData.forEach(data => {
//           data.total_balance = parseFloat(data.base_amount) + parseFloat(data.vat_amount)

//         })
//          const groupedVat = Object.values(
//   this.VatPurchaseInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           credit_amount: 0,
//           debit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].credit_amount += vat;

//       return acc;
//     }, {})
// );

// const groupedSalesVat = Object.values(
//   this.VATSalesInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           debit_amount: 0,
//           credit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].debit_amount += vat;

//       return acc;
//     }, {})
// );


// this.VatAccountTransactions = [...groupedVat, ...groupedSalesVat]



//   this.calculateTotals();
//  this.calculateVATTotals();
//   this.getJournalEntryVatReport();




//       })
//     }

//   }



  back(){
    this.location.back();
  }

   // this.total_base_amount = 0;
      // this.total_vat = 0;
      // this.total_amount  = 0;
      // this.purchase_total_base_amount = 0;
      // this.purchase_total_vat  = 0;
      // this.purchase_total_amount  = 0;
      // this.total_vat_payable  = 0;



salesJournalVatData:any[]=[];
purchaseJournalVatData:any[]=[];






// getJournalEntryVatReport() {
//   let financial_year_id = localStorage.getItem('financial_id');
//   let currentDate = new Date();
// let currentYear = currentDate.getFullYear();
// let currentMonth = currentDate.getMonth();

// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;

// let fromDate = new Date(currentYear, currentMonth, 1);
// let toDate = new Date(currentYear, currentMonth + 1, 0);

// // Format as YYYY-MM-DD using padStart to keep leading zeros
// const formatDate = (date: Date) => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// let formattedFromDate = formatDate(fromDate); // "2025-05-01"
// let formattedToDate = formatDate(toDate);     // "2025-05-31"

// let payload = {
//   from_date: formattedFromDate,
//   to_date: formattedToDate,
//   financial_year_id
// };


//     let from_date = this.vatOutputForm.get('from_date')?.value;
//     let to_date = this.vatOutputForm.get('to_date')?.value;

//     if(!from_month && !to_month){
// this._finaceservice.getJournalEntryVatReport(payload, this.entity_id, this.is_reversal).subscribe((res: any) => {


//     let data = res?.data;

//     // Filter and clean debit entries
//     // this.salesJournalVatData = data
//     //   .filter((entry: any) => entry.typeen === 'debit_amount')
//     //   .map((entry: any) => {
//     //     const {
//     //       journal_id,
//     //       chart_account_id,
//     //       chart_accounts,
//     //       amount,
//     //       ...rest
//     //     } = entry;
//     //     return rest;
//     //   });

//     // Filter and clean credit entries
//     // this.purchaseJournalVatData = data
//     //   .filter((entry: any) => entry.typeen === 'credit_amount')
//     //   .map((entry: any) => {
//     //     const {
//     //       journal_id,
//     //       chart_account_id,chart_accounts,amount,
//     //       ...rest
//     //     } = entry;
//     //     return rest;
//     //   });




//     this.purchaseJournalVatData = data
//     .filter((entry: any) => entry.typeen === 'credit_amount' || entry.typeen === 'debit_amount')
//     .map((entry: any) => {
//       const {
//         journal_id,
//         chart_account_id,
//         chart_accounts,
//         amount,
//         ...rest
//       } = entry;

//       // If it's a debit_amount, make vat_amount negative
//       if (entry.typeen === 'debit_amount') {
//         return {
//           ...rest,
//           vat_amount: -Math.abs(Number(entry.vat_amount))
//         };
//       }

//       return rest;
//     });

//       // this.VATSalesInvoiceData.push(...this.salesJournalVatData);
//       this.VatPurchaseInvoiceData.push(...this.purchaseJournalVatData);

// this.VATSalesInvoiceData.sort((a, b) => {
//   return new Date(b.posting_date || 0).getTime() - new Date(a.posting_date || 0).getTime();
// });

// this.VatPurchaseInvoiceData.sort((a, b) => {
//   return new Date(b.posting_date || 0).getTime() - new Date(a.posting_date || 0).getTime();
// });

//  const groupedVat = Object.values(
//   this.VatPurchaseInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           credit_amount: 0,
//           debit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].credit_amount += vat;

//       return acc;
//     }, {})
// );

// const groupedSalesVat = Object.values(
//   this.VATSalesInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           debit_amount: 0,
//           credit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].debit_amount += vat;

//       return acc;
//     }, {})
// );

// this.VatAccountTransactions = [...groupedVat, ...groupedSalesVat]





// this.calculateTotals();
// this.calculateVATTotals();
//     // You can now use salesJournalVatData and purchaseJournalVatData
//   });
//     }
//     else{



// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;

//     // const entity_id = localStorage.getItem("selectedEntityId");
// let data = {  from_date: '',
//   to_date: '',
//   financial_year_id};
// if(from_month && to_month){

// const result = this.getDateRange(this.financialYearName, from_month, to_month);

// let fromDate = result?.fromDate;
// let toDate = result?.toDate;

// if(fromDate && toDate){

//   data = {
//   from_date: fromDate,
//   to_date: toDate,
//   financial_year_id
//   }
// }

// }

// data.financial_year_id = financial_year_id


// this._finaceservice.getJournalEntryVatReport(data, this.entity_id, this.is_reversal).subscribe((res: any) => {


//     let data = res?.data;

//     // Filter and clean debit entries
//     // this.salesJournalVatData = data
//     //   .filter((entry: any) => entry.typeen === 'debit_amount')
//     //   .map((entry: any) => {
//     //     const {
//     //       journal_id,
//     //       chart_account_id,
//     //       chart_accounts,
//     //       amount,
//     //       ...rest
//     //     } = entry;
//     //     return rest;
//     //   });

//     // Filter and clean credit entries
//     // this.purchaseJournalVatData = data
//     //   .filter((entry: any) => entry.typeen === 'credit_amount')
//     //   .map((entry: any) => {
//     //     const {
//     //       journal_id,
//     //       chart_account_id,chart_accounts,amount,
//     //       ...rest
//     //     } = entry;
//     //     return rest;
//     //   });


//     this.purchaseJournalVatData = data
//     .filter((entry: any) => entry.typeen === 'credit_amount' || entry.typeen === 'debit_amount')
//     .map((entry: any) => {
//       const {
//         journal_id,
//         chart_account_id,
//         chart_accounts,
//         amount,
//         ...rest
//       } = entry;

//       // If it's a debit_amount, make vat_amount negative
//       if (entry.typeen === 'debit_amount') {
//         return {
//           ...rest,
//           vat_amount: -Math.abs(Number(entry.vat_amount))
//         };
//       }

//       return rest;
//     });

//       // this.VATSalesInvoiceData.push(...this.salesJournalVatData);
//       this.VatPurchaseInvoiceData.push(...this.purchaseJournalVatData);

// this.VATSalesInvoiceData.sort((a, b) => {
//   return new Date(b.posting_date || 0).getTime() - new Date(a.posting_date || 0).getTime();
// });

// this.VatPurchaseInvoiceData.sort((a, b) => {
//   return new Date(b.posting_date || 0).getTime() - new Date(a.posting_date || 0).getTime();
// });

//  const groupedPurchaseVat = Object.values(
//   this.VatPurchaseInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           credit_amount: 0,
//           debit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].credit_amount += vat;

//       return acc;
//     }, {})
// );


//  const groupedSalesVat = Object.values(
//   this.VATSalesInvoiceData
//     .filter(item => item.vat_account_id) // Skip rows with null vat_account_id
//     .reduce((acc, curr) => {
//       const key = curr.vat_account_id;
//       const vat = parseFloat(curr.vat_amount);

//       if (!acc[key]) {
//         acc[key] = {
//           vat_account_id: curr.vat_account_id,
//           vat_account: curr.vat_account,
//           debit_amount: 0,
//           credit_amount: 0,
//           entry_status: 'VAT Clearance'
//         };
//       }

//       acc[key].debit_amount += vat;

//       return acc;
//     }, {})
// );

// this.VatAccountTransactions = [...groupedPurchaseVat, ...groupedSalesVat]

// console.log('vatdataaaa', this.VatAccountTransactions);


// this.calculateTotals();
// this.calculateVATTotals();


//     // You can now use salesJournalVatData and purchaseJournalVatData
//   });
//     }

// }

// submitData(){
// // let from_date = this.vatOutputForm.get('from_date')?.value;
// // let to_date = this.vatOutputForm.get('to_date')?.value;

// let from_month = this.vatOutputForm.get('month_val_from')?.value;
// let to_month = this.vatOutputForm.get('month_val_from')?.value;
// let from_date;
// let to_date;
//     // const entity_id = localStorage.getItem("selectedEntityId");
// let data = {}
// if(from_month && to_month){

// const result = this.getDateRange(this.financialYearName, from_month, to_month);

// from_date = result?.fromDate;
// to_date = result?.toDate;


// }

// if (!from_month && !to_month) {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth();

//   const fromDate = new Date(currentYear, currentMonth, 1);
//   const toDate = new Date(currentYear, currentMonth + 1, 0);

//   const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   from_date = formatDate(fromDate);
//   to_date = formatDate(toDate);
// }


// // if (this.total_vat_payable === 0 && !this.VatAccountTransactions.length > 0) {
// //   console.log('Total VAT payable is 0. Skipping API call.');
// //   return;
// // }

// let payload = {
//   entity_id: this.entity_id,
//   vatAccountTransactions: this.VatAccountTransactions,
//   from_date,
//   to_date,
//   buttonStatus: this.submitButtonStatus,
//   reversal: this.is_reversal,
//   vat_amount: Math.abs(this.total_vat_payable),
//   vat_status: this.total_vat_payable > 0
//     ? 'VAT to be Paid'
//     : 'VAT to be Recovered'
// };

// this._finaceservice.updateVATClearance(payload).subscribe((res: any) => {
//   if(this.submitButtonStatus == 'transfer'){
//   this.toast.success('Vat Transfer Successfully');
//   }
//   else if(this.is_reversal == true){
//   this.toast.success('Vat Reversal Successfully');
//   }
//   else{
//     this.toast.success(res?.message);
//   }
//   this.showVatTransactions = false;
//   this.is_reversal = false;
//     this.total_base_amount = 0;
//     this.total_vat = 0;
//     this.total_amount  = 0;
//     this.purchase_total_base_amount = 0;
//     this.purchase_total_vat  = 0;
//     this.purchase_total_amount  = 0;
//     this.total_vat_payable  = 0;
//     this.VATSalesInvoiceData = [];
//     this.VatPurchaseInvoiceData = [];
//     this.VatAccountTransactions = [];
//   this.getVATAccountBalances();
//   this.reloadCurrentRoute();
//   // this.getVATClearanceEntries();
//   // this.getSalesInvoiceVATReportData();
// });
// }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

goBack(){
  this.reloadCurrentRoute();
}

vatClearanceEntries:any[]=[];
// getVATClearanceEntries(){
//   this._finaceservice.getVATClearanceEntries(this.entity_id).subscribe((res:any)=>{
//     this.vatClearanceEntries = res?.data;
//   })
// }

showVatTransactions:boolean = false;
submitButtonStatus:any = '';

runVatClearance(x:any){

  this.submitButtonStatus = x;

  if(x == 'run'){
    if(this.total_vat != this.purchase_total_vat){
      this.showVatTransactions = true;
    }

  }
  else{
     this.showVatTransactions = true;
  }

}

vat_clearance_amount:number = 0;
vat_to_be_paid:number = 0;
vat_to_be_recovered:number = 0;

// getVATAccountBalances() {
//   this._finaceservice.getVATAccountBalances().subscribe((res: any) => {
//     let clearance_amount = (res?.data[0]["balance"]);
//     this.vat_clearance_amount = Math.abs(clearance_amount);
//     this.vat_to_be_paid = Math.abs(res?.data[1]["balance"]);
//     this.vat_to_be_recovered = Math.abs(res?.data[2]["balance"]);

//     console.log('vatData', res?.data);

//     if (clearance_amount && clearance_amount !== 0) {
//       this.VatAccountTransactions = [];

//       if (clearance_amount < 0) {
//         this.VatAccountTransactions.push(
//           {
//             vat_account_id: 2517,
//             vat_account: "4435 - IVA apuramento",
//             credit_amount: 0,
//             debit_amount: this.vat_clearance_amount,
//             entry_status: 'VAT Transfer'
//           },
//           {
//             vat_account_id: 2518,
//             vat_account: "4437 - IVA a pagar",
//             credit_amount: this.vat_clearance_amount,
//             debit_amount: 0,
//             entry_status: 'VAT Transfer'
//           }
//         );
//       } else {
//         this.VatAccountTransactions.push(
//           {
//             vat_account_id: 2517,
//             vat_account: "4435 - IVA apuramento",
//             credit_amount: this.vat_clearance_amount,
//             debit_amount: 0,
//             entry_status: 'VAT Transfer'
//           },
//           {
//             vat_account_id: 2519,
//             vat_account: "4438 - IVA a recuperar",
//             credit_amount: 0,
//             debit_amount: this.vat_clearance_amount,
//             entry_status: 'VAT Transfer'
//           }
//         );
//       }
//     }


//     this.getVATClearanceEntries();
//     this.getSalesInvoiceVATReportData();

//   });
// }

    // <td>{{ i + 1 }}</td>
    //                   <td>{{data.date}}</td>
    //                   <td>{{data.entry_status}}</td>
    //                   <td>{{data.account_name}}</td>
    //                   <td>{{data.debit_amount || 0.00 | amount}}</td>
    //                   <td>{{data.credit_amount || 0.00 | amount}}</td>

    onBtnExportDataAsExcel() {

      if (this.vatClearanceEntries.length > 0) {

            // Map data with numeric fields as numbers (2 decimals)
            let data = this.vatClearanceEntries.map((x: any) => ({
              Date: moment(x.date).format("YYYY-MM-DD"),
              Transaction_Scenario: x.entry_status,
              LedgerAccount: x.account_name,
              // AccountType: x.account_type,
              // Nature_of_Transaction: x.nature_of_transaction,
              Debit: Number(parseFloat(x.debit_amount).toFixed(2)),
              Credit: Number(parseFloat(x.credit_amount).toFixed(2))

            }));

            const titleRow = ['', '', 'VAT Clearance History', '', ''];
            const titleRow1 = ['', '', '', '', ''];

            const headerRow = [

              'Date',
              'Transaction_Scenario',
              'LedgerAccount',
              'Debit',
              'Credit'
            ];

            // Ensure numeric fields remain numbers for Excel
            const finalData = [
              titleRow,
              titleRow1,
              headerRow,
              ...data.map((item:any) => Object.values(item).map(val =>
                typeof val === 'number' ? Number(val.toFixed(2)) : val
              ))
            ];

            this.commonService.exportExcelFile(finalData, 'VAT CLearance History', 'MECTS S.A');

      } else {

        this.toast.warning('No Data Found!!')
      }

}

}
