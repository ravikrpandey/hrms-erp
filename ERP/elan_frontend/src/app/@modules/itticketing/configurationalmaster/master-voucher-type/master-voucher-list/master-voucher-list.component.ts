import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { TdsActionComponent } from '../../tds-master/tds-action/tds-action.component';
import { VoucherMasterActionComponent } from '../voucher-master-action/voucher-master-action.component';

@Component({
  selector: 'app-master-voucher-list',
  templateUrl: './master-voucher-list.component.html',
  styleUrls: ['./master-voucher-list.component.scss']
})
export class MasterVoucherListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  dropVal:any = [{name:'Yes',value:true},{name:'No',value:false}]
  entity_id:any;
  
  financial_year_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private activeRoute: ActivatedRoute,
    private shortcutService: ShortcutService,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    
    
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllVoucherListData()
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
   
  }
    
  
  getAllVoucherListData = () => {
    this._configurationalMasterService.getAllVoucherListData(this.entity_id).subscribe((res: any) => {  
      this.rowData = res.data;
    },(err: any) => {
      this.rowData = []
    });
  }
  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Voucher Name',
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Voucher Type',
      field: 'voucher_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
     
      // editable:true
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: VoucherMasterActionComponent,
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

 
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  openDialog(){
    let checkPostingPeriod = new CheckPostingPeriod(this._finaceservice);
    checkPostingPeriod.returnActiveMonth(this.entity_id, this.financial_year_id)
      .then(isActive => {
        if (isActive) {
          this.route.navigate(['/master/configurational-master/master-voucher-type/add-master-voucher'])
        }
       
      })
      .catch(err => {
        console.error('Error occurred:', err);
      });
   
  }

  onCellClicked(e: any) {
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
