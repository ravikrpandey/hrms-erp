import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { JournalActionComponent } from '../../../journal-entry/journal-action/journal-action.component';
import { Location } from '@angular/common';
import { AdjustmentVoucherActionComponent } from '../adjustment-voucher-action/adjustment-voucher-action.component';

@Component({
  selector: 'app-adjustment-voucher-list',
  templateUrl: './adjustment-voucher-list.component.html',
  styleUrls: ['./adjustment-voucher-list.component.scss']
})
export class AdjustmentVoucherListComponent {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,
    enableClipboard: true,  };
  rowData: any;
  entity_id:any;
  assignAction:any;
  loginUser: any;
  publish: boolean = true;
  // roleData: any;
  constructor(
    private _finaceService: FinaceService,
   public dialog: MatDialog,
   private location: Location,
   private toast: ToastrService,
   private shortcutService: ShortcutService,
   private route: Router,
    ) {
    this.rowClass = 'rowClass'

  }
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId")
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
  this.getAllAdjustmentJournalList()
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
      minWidth:100,
    },
    {
      headerName: 'Posting Date',
      field: 'posting_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params:any) => {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      headerName: 'Document Number',
      field: 'bill_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth:220,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Journal Number',
      field: 'document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth:200,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Voucher Name',
      field: 'voucher_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth:200,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Take Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AdjustmentVoucherActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
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

  getAllAdjustmentJournalList(){
    this.publish = true;
    this.rowData =[];
    this._finaceService.getAllAdjustmentJournalList().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

  getQuickEntry(){
    this.publish = false;
    this.rowData = [];
    this._finaceService.getgeneralAccount('PENDING', this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

  // getRole(){
  //   this._finaceService.generalList().subscribe((res:any)=>{
  //     this.rowData=res.data;
  //   })
  // }


    onCellClicked(e:any){
    //   const dialogRef = this.dialog.open(NewRoleDialogComponent,
    //     {
    //       width:'400px',
    //     data:{
    //       role_master_id:e.data.role_master_id}
    //   }
    //   );
    //     dialogRef.afterClosed().subscribe(result => {

    //     })
    }

    isShortcutVisible() {
      return this.shortcutService.isShortcutVisible();
    }
}
