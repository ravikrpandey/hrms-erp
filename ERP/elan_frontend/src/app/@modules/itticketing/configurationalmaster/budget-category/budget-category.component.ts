import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCategoryStatusComponent } from './budget-category-status/budget-category-status.component';
import { BudgetCategoryActionComponent } from './budget-category-action/budget-category-action.component';
import { BudgetCategoryDialogComponent } from './budget-category-dialog/budget-category-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-budget-category',
  templateUrl: './budget-category.component.html',
  styleUrls: ['./budget-category.component.scss']
})
export class BudgetCategoryComponent {
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
    private _finaceservice: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    private _commonService : CommonService,
    private shortcutService: ShortcutService,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getBudgetCategory()
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }
  getBudgetCategory = () => {
    this._commonService.showLoader()
    this._configurationalMasterService.listBudgetCategory(this.entity_id).subscribe((res: any) => {  
      this.rowData = res.data;
      this._commonService.hideLoader()
    },(err: any) => {
      this.rowData = []
      this._commonService.hideLoader()
    });
  }
  public columnDefs = [
    {
      headerName: 'S.No.',
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
      headerName: 'Budget Category',
      field: 'budget_category',
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
      headerName: 'Status',
      field: 'status',
      cellRenderer: BudgetCategoryStatusComponent,
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
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: BudgetCategoryActionComponent,
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


    
this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
  next: (res: any) => {

    let newMonth = this._finaceservice.getCurrentMonth();
    let isExistData = res.data.some((x: any) => x.month === newMonth);
    if (!isExistData && res.code===200) {
      this.toaster.warning(res.message);
      return
    }
    if (!isExistData && res.code===201) {
      this.toaster.warning(res.message);
      return
    }
    
    
    const dialogRef = this.dialog.open(BudgetCategoryDialogComponent, {
      width: '35%',
      data: { mode: 'add' },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }, error:(err)=> {
    console.log(err)
    this.toaster.warning(err.error.message);
      return
  },
})






    
  }

  onCellClicked(e: any) {
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
  
}