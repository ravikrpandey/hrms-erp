import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-adjustment-tracking',
  templateUrl: './adjustment-tracking.component.html',
  styleUrls: ['./adjustment-tracking.component.scss']
})
export class AdjustmentTrackingComponent {
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
  productList:any[]=[];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      company: new FormControl(null),
      currency: new FormControl(null),
      chart_of_account : new FormControl(),
      currency_id : new FormControl(null),
      report_type: new FormControl('vendor-ledger'),
      // company_id: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      party_type: new FormControl('VENDOR'),
      chart_account_id: new FormControl(null),
      product_id: new FormControl(null)
    })
  }

  ngOnInit(): void {

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filterControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.chartedAccount = this.filteredAccountsList.filter((account:any) =>
        account.account_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.getchartedAccount();
    this.onPartyTypeChange();
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
  // this.getProductList();
    this.getVendorAccountList();
    this.getJournalList();
  }

 

getVendorAccountList(){
  this._finaceservice.getVendorCOA().subscribe((res:any)=>{
    this.partyNameList = res.data;
    this.partyList1 = res?.data?.map((x:any)=>x.account_name);
    this.partyList2 = this.partyNameList;
  })
}




// getProductList(){
//   this._finaceservice.getProductList().subscribe((res:any)=>{
//     this.productList = res?.data;

//   })
// }

rowData1:any[]=[];

  getJournalList(){
    this.rowData = [];
    this.rowData1 = [];
    this.totalDebit = 0.00;
    this.totalCredit  = 0.00;
    this.totalBalance  = 0.00;
    this._finaceservice.filterVendorLedgerReport(this.JournalForm.value , this.entity_id).subscribe((response: any) => {
      if (response) {
        this.Account_list = response.data;
        this.Account_list.forEach((element:any,index:any) => {
          if(index == 0){
            element['balance']= Number(element.debit_amount) - Number(element.credit_amount)
          }
          else{
            if(element.debit_amount >0){
              element['balance'] = Number(this.Account_list[index-1].balance) + Number(element.debit_amount);
            }
            else{
              element['balance'] = Number(this.Account_list[index-1].balance) - Number(element.credit_amount);
            }
          }
          if(this.Account_list.length - 1 == index){
            this.rowData = this.Account_list;

            let fromDate = this.JournalForm.get('from_date')?.value;
            let toDate = this.JournalForm.get('to_date')?.value;
            if(!fromDate && !toDate){
              this.rowData1 = this.rowData
          
              let currentDate = new Date();
              let currentYear = currentDate.getFullYear();
              let currentMonth = currentDate.getMonth(); 
              
              this.rowData1 = this.rowData.filter((row:any) => {
                let postingDate = new Date(row.date);
                return postingDate.getFullYear() === currentYear && postingDate.getMonth() === currentMonth;
              });
              
            
    
            }else{
    
              this.rowData1 = this.rowData
            }
            this.calculateTotals();
          }
        });
      }
      else{
        this.rowData = [];
        this.rowData1 = [];
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

//   calculateTotals() {
//     this.totalDebit = this.Account_list.reduce((sum: any, account: any) => {
//         const debit = parseFloat(account.debit_amount);
//         return sum + (isNaN(debit) ? 0 : debit);
//     }, 0);

//     this.totalCredit = this.Account_list.reduce((sum: any, account: any) => {
//         const credit = parseFloat(account.credit_amount);
//         return sum + (isNaN(credit) ? 0 : credit);
//     }, 0);

//     this.totalBalance = this.totalDebit - this.totalCredit;
// }


// calculateTotals() {
//   this.totalDebit = this.rowData.reduce((sum: any, account: any) => {
//       const debit = parseFloat(account.debit_amount);
//       return sum + (isNaN(debit) ? 0 : debit);
//   }, 0);

//   this.totalCredit = this.rowData.reduce((sum: any, account: any) => {
//       const credit = parseFloat(account.credit_amount);
//       return sum + (isNaN(credit) ? 0 : credit);
//   }, 0);

//   this.totalBalance = this.totalDebit - this.totalCredit;
// }



  calculateTotals() {

    this.totalDebit = this.Account_list.reduce((sum: any, account: any) => sum + (account.debit_amount), 0);
    this.totalCredit = this.Account_list.reduce((sum: any, account: any) => sum + (account.credit_amount), 0);
    this.totalBalance = this.totalDebit - this.totalCredit;
}

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
    // {
    //   headerName: 'Posting Date',
    //   field: 'posting_date',
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
      headerName: 'Date',
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
      headerName: 'Vendor A/C',
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
      headerName: 'Document Type',
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
      headerName: 'Document Number',
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
      headerName: 'Debit',
      minWidth: 150,
      field: 'debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // cellRenderer: (params:any) => {
      //   const amount = params.value;
      //   if (amount != null) {
      //     return `${amount.toFixed(2)}`;
      //   }
      //   return '0.00';
      // },
      // valueGetter: (params:any) => {
      //   return params.data && params.data.debit_amount ? params.data.debit_amount : 0;
      // }
    },
    {
      headerName: 'Credit',
      minWidth: 150,
      field: 'credit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // cellRenderer: (params:any) => {
      //   const amount = params.value;
      //   if (amount != null) {
      //     return `${amount.toFixed(2)}`;
      //   }
      //   return ' 0.00';
      // }
    },
    {
      headerName: 'Balance',
      minWidth: 150,
      field: 'balance', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params:any) => {
        const amount = Math.abs(params.value);
        if (amount != null) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      },
    },
    {
      headerName: 'Account Code',
      minWidth: 170,
      field: 'account_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    }

    // {
    //   headerName: 'Cost Center',
    //   minWidth: 100,
    //   field: '',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },

    // {
    //   headerName: 'Party Type',
    //   minWidth: 160,
    //   field: 'party_type',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'Party',
    //   minWidth:160,
    //   field: 'party_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   // valueGetter: (params:any) => {
    //   //   return params.data && params.data.employee_name
    //   //     ? params.data.employee_name
    //   //     : params.data.vendor_name
    //   // }
    // },
    // {
    //   headerName: 'Category',
    //   minWidth:160,
    //   field: 'product_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1
    // }
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



  onPartyTypeChange(){
    this.getJournalList();
    
    this.partyNameList =[];
    this._finaceservice.get_Party_Name_List('VENDOR',this.entity_id).subscribe((res: any) => {
      this.partyNameList = res.data;
    
      this.partyList1 = res?.data?.map((x:any)=>x.party_name);
      this.partyList2 = this.partyNameList;
    });

  }

  partyFilter(e:any){
    let aa= e;
    let filteredVariable = this.partyList2.filter((item: any) => aa.includes(item.account_name));
    this.partyNameList = filteredVariable
  }
  onPartyTypeNameSelect(){
    this.getJournalList();
  }

  onProductSelect(){
    this.getJournalList();
  }

  onBtnExportDataAsExcel(){ 
      let data = this.rowData1.map((x:any,i:number)=>({
        Date: moment(x.createdAt).format("YYYY-MM-DD"),
        DebitAmount: x.debit_amount,
        DebitAccount:x.account_name,
        AccountName:x.parent_account_name,
        CreditAccount: x.account_name,
        CreditAmount:x.credit_amount,
        DocumentType:x.entry_status,
        DocumentNo: x.journal_no,
        Vendor: x.account_name  
      }))
  
      let fromDate = this.JournalForm.get('from_date')?.value;
      let toDate = this.JournalForm.get('to_date')?.value;
      if(!fromDate && !toDate){
        fromDate = moment().startOf('month').format("YYYY-MM-DD");
        toDate = moment().endOf('month').format("YYYY-MM-DD");
      }
      else{
        fromDate = moment(fromDate).format("YYYY-MM-DD");
        toDate = moment(toDate).format("YYYY-MM-DD");
      }
      const titleRow = [ '', '', 'Vendor Ledger Report', '', '', '', '', '', '']; 
      const titleRow1 = [ '', '', `${fromDate} To ${toDate}`, '', '', '', '', '', '']; 
  
      const headerRow = ['Date', 'DebitAmount', 'DebitAccount', 'AccountName', 'CreditAccount', 'CreditAmount','DocumentType','DocumentNo','Vendor'];
  
      const finalData = [titleRow,titleRow1, headerRow, ...data.map(item => Object.values(item))];
    console.log(finalData);
          this.commonService.exportAsExcelFile(finalData, 'Vendor-Ledger');
      }

  // onBtnExportDataAsExcel1(){
  //   let data = this.rowData1.map((x:any,i:number)=>({
  //     SrNo:i+1,
  //     Date:moment(x.date).format("YYYY-MM-DD")  ,
  //     DocumentType:x.entry_status,
  //     DocumentNo: x.journal_no,
  //     Debit: x.debit_amount,
  //     Credit: x.credit_amount,
  //     Balance: x.balance,
  //     Vendor: x.party_name  
  //        // date: x.date,
  //   }))
    
  //       this.commonService.exportAsExcelFile(data, 'Vendor-Ledger');
  //   }


onDownloadPdf() {
  const doc = new jsPDF();
  const logoUrl = '../../../assets/company-logo.png';

    const logoWidth = 28; 
    const logoHeight = 15; 
    doc.addImage(logoUrl, 'PNG', 5, 5, logoWidth, logoHeight); 
  


      // Add "MECTS" on top of the title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const mectsTitle = "MECTS";
  const pageWidth = doc.internal.pageSize.width;
  const mectsWidth = doc.getTextWidth(mectsTitle);
  const mectsX = (pageWidth - mectsWidth) / 2;
  doc.text(mectsTitle, mectsX, 18);  // Positioned above the main title

  // Add main title "General Ledger" below "MECTS"
  doc.setFontSize(12);

  const title = 'Vendor Ledger';
  // const pageWidth = doc.internal.pageSize.width;
  const titleWidth = doc.getTextWidth(title); 
  const titleX = (pageWidth - titleWidth) / 2; 
  
  
  doc.text(title, titleX, 26); 

  let fromDate = this.JournalForm.get('from_date')?.value;
  let toDate = this.JournalForm.get('to_date')?.value;
  if(!fromDate && !toDate){
    fromDate = moment().startOf('month').format("YYYY-MM-DD");
    toDate = moment().endOf('month').format("YYYY-MM-DD");
  }
  else{
    fromDate = moment(fromDate).format("YYYY-MM-DD");
    toDate = moment(toDate).format("YYYY-MM-DD");
  }


  const dateRange = `Period: ${fromDate} To ${toDate}`;

  const dateRangeWidth = doc.getTextWidth(dateRange); 
  const marginRight = 6;
  const marginLeft = 15;
  const dateRangeX = pageWidth - dateRangeWidth - marginRight + marginLeft;

  doc.setFontSize(8);

  // Add the date range text in the top-right corner with smaller font
  doc.text(dateRange, dateRangeX, 18);
  
  const columns = [
    'Date', 
    'Debit     Amount', 
    'Debit     Account', 
    'AccountName', 
    'CreditAccount', 
    'Credit   Amount',
    'Document Type',
    'Document No',
    'Vendor'  
  ];

  const rows = this.rowData1.map((row: any, index: any) => [
    moment(row.createdAt).format("YYYY-MM-DD"), 
    row.debit_amount, 
    row.account_name, 
    row.parent_account_name, 
    row.account_name, 
    row.credit_amount,
    row.entry_status,
    row.journal_no,
    row.account_name
  ]);

  
  const columnWidths = [ 18, 20, 25, 25, 25, 20,20,20,20 ]; // Set your preferred widths here
  
  
  const startY = 28;  

  // Create the table
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: startY, 
    columnStyles: {
      0: { cellWidth: columnWidths[0] },  
      1: { cellWidth: columnWidths[1] },  
      2: { cellWidth: columnWidths[2] },  
      3: { cellWidth: columnWidths[3] }, 
      4: { cellWidth: columnWidths[4] },  
      5: { cellWidth: columnWidths[5] },
      6: { cellWidth: columnWidths[6] },
      7: { cellWidth: columnWidths[7] },
      8: { cellWidth: columnWidths[8] }
    },
    theme: 'grid', 
    margin: { top: 10 },
    headStyles: { fillColor: [22, 160, 133] }, 
    didDrawCell: (data: any) => {
      if (data.column.index === 0) { 
        data.cell.styles.fontStyle = 'bold'; 
      }
    }
  });


  doc.save('Vendor-Ledger.pdf');
}     


 
}
