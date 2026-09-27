
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { BankActionComponent } from '../bank-action/bank-action.component';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { FormBuilder, FormGroup , FormControl} from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { CommonService } from 'src/app/@shared/services/common.service';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profit-and-loss-clearance',
  templateUrl: './profit-and-loss-clearance.component.html',
  styleUrls: ['./profit-and-loss-clearance.component.scss']
})
export class ProfitAndLossClearanceComponent {

  @ViewChild('barChart') private barChartRef: any;
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowClass: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  public columnDefs;
  rowData: any;
    JournalForm: FormGroup;

    showReversalButton:boolean = true;

     back(){
    this.route.navigate(['master/ess/dashboard']);
  }

vatClearanceEntries:any[]=[];

  getDataPath =  (data:any)=> {
    return data.hierachy;
  };
  autoGroupColumnDef = {
    headerName: 'Account',
    field: 'name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 250,
    valueGetter: (params:any) => {
      return params.data.name;
    },
    cellRendererParams: {
      suppressCount: true,
    },
  };
  totalDebit: number = 0.00;
  totalCredit: number = 0.00;
  fisical_year_id: any;
  fisicalYear: any;

totalProfitLoss:number=0.00;
  barChart: any;
  constructor(private http: HttpClient,
    private commonService: CommonService,
  private _finaceservice: FinaceService,
  private route: Router,
  private fb: FormBuilder,
  private toast: ToastrService,) {
        this.JournalForm = this.fb.group({
          from_date: new FormControl(null),
          to_date: new FormControl(null),
        })
    this.rowClass = 'rowClass';
    this.columnDefs = [
      {
        headerName: 'Amount',
        field: 'amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params:any) => {
        const amount = params.value;
        if (amount != null) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      },
      },
      // {
      //   headerName: 'Credit',
      //   field: 'credit',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   minWidth: 150,
      // },
    ];

    // this.prepareData();
    // this.createBarChart();
  }

  ngOnInit(){
    this.get_profit_and_loss_accounts();
    this.getResultHistory();
    this.getResultTransferStatus();
  }

  isRetained:boolean = false;

  getResultTransferStatus()
{
  // this.commonService.showLoader
//   this._finaceservice.getResultTransferStatus().subscribe((res:any)=>{
//     this.commonService.hideLoader();
//     if(res?.data != null){
//       this.showReversalButton = res?.data?.is_reversal;
//       this.isRetained = res?.data?.is_retained;

//     }
//   },
//   err =>{
//   this.commonService.hideLoader();
//   this.toast.warning('Something went wrong!!', 'Error Message')
// }
// )
}

  accountsList:any[]=[];

  get_profit_and_loss_accounts(){
  let entity_id = localStorage.getItem("selectedEntityId");
  // this.commonService.showLoader();
  // this._finaceservice.get_profit_and_loss_accounts(entity_id).subscribe((res:any)=>{
  //   
  //   this.commonService.hideLoader();
  //   this.accountsList = res?.data;
  // })
  }

  resultHistoryList:any[]=[];
  filteredHistoryList:any[]=[];
  getResultHistory(){
    // this.commonService.showLoader();
//     this._finaceservice.getResultHistory().subscribe((res:any)=>{
//       this.commonService.hideLoader();
//       this.resultHistoryList = res?.data;

// this.filteredHistoryList= this.resultHistoryList.map(entry => {
//   const accountName = entry.account_name || "";
//   const prefix = accountName.split(" ")[0]; // get number before dash (e.g. "72", "78", etc.)

//   let account_type = "";
//   let nature_of_transaction = "";

//   // Determine account_type based on prefix
//   if (/^(72|62|63|65|68)/.test(prefix)) {
//     account_type = "Operational Account";
//   } else if (/^(78|69)/.test(prefix)) {
//     account_type = "Financial Account";
//   } else {
//     account_type = "Clearing Account";
//   }

//   // Determine nature_of_transaction based on account_type
//   if (account_type === "Operational Account" || account_type === "Financial Account") {
//     nature_of_transaction = "Source Account";
//   } else {
//     nature_of_transaction = "Clearing Account";
//   }

//   return {
//     ...entry,
//     account_type,
//     nature_of_transaction
//   };
// });


//       console.log('history', this.filteredHistoryList)
//     },
//   err =>{
//   this.commonService.hideLoader();
//   this.toast.warning('Something went wrong!!', 'Error Message')
// }
//   )
  }


// You won't be able to revert this!
    transferToResults(e: any) {
      e.stopPropagation();

      Swal.fire({
        title: 'Do you want to proceed with transferring the account balance to Results - Please confirm?',
        text: "You can revert this",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result?.isConfirmed) {
          let entity_id = localStorage.getItem("selectedEntityId");
  let financial_year_id = localStorage.getItem("financial_id");
  let payload = {
    entity_id,
    accountsList: this.accountsList,
    financial_year_id
  }
  // this.commonService.showLoader();
//   this._finaceservice.transfer_To_Result_Accounts(payload).subscribe((res:any)=>{
//     
//     this.commonService.hideLoader();
//     this.toast.success(res?.message);
//     this.getResultHistory();
//      this.getResultTransferStatus();
//   },
// err =>{
//   this.commonService.hideLoader();
//   this.toast.warning('Something went wrong please try again later', 'Error Message')
// }
// )
        };
      });
    }

     transfer_To_Result_Accounts_reversal(e: any) {
      e.stopPropagation();

      Swal.fire({
        title: 'Are you sure you want to perform the reversal and re-transfer the account balance to the Profit and Loss Accounts?',
        text: "You can transfer to results again",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result?.isConfirmed) {
     let entity_id = localStorage.getItem("selectedEntityId");
  let financial_year_id = localStorage.getItem("financial_id");
  // let payload = {
  //   entity_id,
  //   accountsList: this.accountsList,
  //   financial_year_id
  // }
  // this.commonService.showLoader();
//   this._finaceservice.transfer_To_Result_Accounts_reversal(entity_id, financial_year_id).subscribe((res:any)=>{
//     
//     this.commonService.hideLoader();
//     this.toast.success(res?.message);
//     this.getResultHistory();
//     this.getResultTransferStatus();
//   },
// err =>{
//   this.commonService.hideLoader();
//   this.toast.warning('Something went wrong please try again later', 'Error Message')
// }
// )
        };
      });
    }



     transfer_To_Retained_Earning(e: any) {
      e.stopPropagation();

      Swal.fire({
        title: 'Are you sure you want to transfer the balance to Retained Earnings?',
        text: "You won't be able to revert this!!",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result?.isConfirmed) {
      let entity_id = localStorage.getItem("selectedEntityId");
  // let payload = {
  //   entity_id,
  //   accountsList: this.accountsList,
  //   financial_year_id
  // }
  // this.commonService.showLoader();
//   this._finaceservice.transfer_To_Retained_Earning(entity_id).subscribe((res:any)=>{
//     
//     this.commonService.hideLoader();
//     this.toast.success(res?.message);
//     this.getResultHistory();
//     this.getResultTransferStatus();
//   },
// err =>{
//   this.commonService.hideLoader();
//   this.toast.warning('Something went wrong please try again later', 'Error Message')
// }
// )
        };
      });
    }

    onBtnExportDataAsExcel() {
  console.log('rowdata', this.rowData)

      if (this.filteredHistoryList.length > 0) {

            // Map data with numeric fields as numbers (2 decimals)
            let data = this.filteredHistoryList.map((x: any) => ({
              Date: moment(x.createdAt).format("YYYY-MM-DD"),
              Transaction_Scenario: x.entry_status,
              LedgerAccount: x.account_name,
              AccountType: x.account_type,
              Nature_of_Transaction: x.nature_of_transaction,
              Debit: Number(parseFloat(x.debit_amount).toFixed(2)),
              Credit: Number(parseFloat(x.credit_amount).toFixed(2))

            }));

            const titleRow = ['', '', 'Profit and Loss Clearance History', '', '', '', ''];
            const titleRow1 = ['', '', '', '', '', '', ''];

            const headerRow = [

              'Date',
              'Transaction_Scenario',
              'LedgerAccount',
              'AccountType',
              'Nature_of_Transaction',
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

            this.commonService.exportExcelFile(finalData, 'P&L CLearance History', 'MECTS S.A');

      } else {

        this.toast.warning('No Data Found!!')
      }

}

}
