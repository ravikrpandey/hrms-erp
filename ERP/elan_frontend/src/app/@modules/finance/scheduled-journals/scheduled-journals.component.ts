import { Component } from '@angular/core';
import {GridApi,GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FinaceService } from 'src/app/@shared/services/finace.service';
@Component({
  selector: 'app-scheduled-journals',
  templateUrl: './scheduled-journals.component.html',
  styleUrls: ['./scheduled-journals.component.scss']
})

export class ScheduledJournalsComponent {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,  
    enableClipboard: true,  };
  rowData: any;
  assignAction:any;
  loginUser: any;
  publish: boolean = true;
  // roleData: any;
  constructor(
    private _finaceService: FinaceService,
   public dialog: MatDialog,
   private location: Location,
   private route: Router,
    ) {
    this.rowClass = 'rowClass'

  }
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    console.log(this.loginUser, "user login login user");
    this._finaceService.getScheduledJournals().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("this.rowDatathis.rowData",this.rowData);
    })

  }

  public columnDefs = [
    {
      headerName: 'S. no',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150
    },
    {
      headerName: 'Title',
      field: 'account_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150
    },
    {
      headerName: 'Journal Number',
      field: 'journal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    }, 
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: (params:any) => params.value === 'ACTIVE' ? 'grid-cell-centered green-text' : 'grid-cell-centered red-text',
      flex: 1,
   
      
    },
    {
      headerName: 'Reference Document',
      field: 'journal_book_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
  
    onCellClicked(e:any){
      this.route.navigate(["/master/finance/journal/scheduled-journals/details"], { queryParams: { id: e.data?.id, actionType: 'view' } })
    }
}


