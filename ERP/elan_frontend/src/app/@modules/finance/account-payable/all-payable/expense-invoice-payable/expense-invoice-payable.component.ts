import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActionPayableComponent } from '../../action-payable/action-payable.component';
@Component({
  selector: 'app-expense-invoice-payable',
  templateUrl: './expense-invoice-payable.component.html',
  styleUrls: ['./expense-invoice-payable.component.scss'],
})
export class ExpenseInvoicePayableComponent {
  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any;
  text: any;
  firstLastName: any;
  rowClass: any;
  clicked: boolean = false;
  id: any;
  lead_id: any;
  menuAccessData: any;
  employId: string | null;
  userId: any;
  assignById: any;
  emp_name: any;
  constructor(
    private activeroute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private _finaceService: FinaceService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;

      this.lead_id = this.id.lead_id;
    });

    let empdata: any = localStorage.getItem('signInUser');
    // let empName=localStorage.getItem(empdata.first_name)

    let loginUser: any = localStorage.getItem('signInUser');
    this.emp_name = JSON.parse(loginUser).first_name;

    this.getListExpense();
  }
  // getListExpense(){
  //   this._itteketService.getApproved().subscribe((res:any)=>{
  //
  //     this.rowData=res.result;
  //

  //   })
  // }
  getListExpense() {
    // this._finaceService.getAllDataExpenseZoho().subscribe((res:any)=>{

    //   const empName:any=[]
    //   for(let i=0;i<res.data.length;i++){
    //    this.rowData=res.data[i].empName=this.emp_name
    //   }
    //   console.log(empName,'this.rowData');
    //   this.rowData=res.data;

    // })
    this._finaceService.getExpensePayble().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  openCreate() {
    this.route.navigate(
      ['master/lead/lead-management/assign-lead/assign-lead'],
      { queryParams: { lead_id: this.lead_id } }
    );
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'contact_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Expense Name',
      field: 'expense_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Expense Type',
      field: 'expense_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Task No',
      field: 'task_order',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Payable amount',
      field: 'opening_balance_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    // {
    //   headerName: 'Paid amount',
    //   field: 'task_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // }, {
    //   headerName: 'Pending amount',
    //   field: 'task_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // }, {
    //   headerName: 'Reference No',
    //   field: 'task_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },

    {
      headerName: 'Action',
      field: 'myexpense_id',
      cellRenderer: ActionPayableComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
