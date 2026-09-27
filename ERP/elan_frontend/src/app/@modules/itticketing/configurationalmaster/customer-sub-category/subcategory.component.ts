import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SubCategoryStatusComponent } from './subcategory-action/subcategory-status/subcategory-status.component';
// import { SubcategoryStatusComponent } from './subcategory-status/subcategory-status.component';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { SubcategoryActionComponent } from './subcategory-action/subcategory-action.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent {
  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/customer-sub-category/create-item"])
    });
    
  }
  
  
  addCustomerCategory() {
        this.route.navigate(["/master/configurational-master/customer-sub-category/create-item"])
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
      headerName: 'Customer Category',
      field: 'MASTER_CUSTOMER_CATEGORY.customer_category_name',
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
      headerName: 'Sub Category Name',
      field: 'sub_category_name',
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
      headerName: 'Sub Category Code',
      field: 'sub_category_code',
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
      cellRenderer: SubCategoryStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: SubcategoryActionComponent,
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

  getAllItem() {
    this._configurationalMasterService.getCustomerSubCategoryList(this.entity_id,this.financial_year_id).subscribe((res: any) => {
      this.rowData = res.data;

    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) {

    // const dialogRef = this.dialog.open(PrItemDilogComponent, { width: '400px', data: { cellData: e.data } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

}


