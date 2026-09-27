import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { SubcategoryStatusComponent } from './subcategory-status/subcategory-status.component';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CustomercategoryActionComponent } from './customer-category-action/customer-category-action.component';
import { CustomerCategoryStatusComponent } from './customer-category-action/customer-category-status/customer-category-status.component';
// import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent {
  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  count: any = 0;
  assignAction: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private shortcutService: ShortcutService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/pr-item/create-item"])
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
      flex: .5,
    },
    {
      headerName: 'Customer Category Name',
      field: 'customer_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Quotation Scheme Status',
      field: 'quotation_scheme_status',
      cellRenderer: CustomerCategoryStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        type: 'quotation_scheme_status' 
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: CustomerCategoryStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        type: 'status' 
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CustomercategoryActionComponent,
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
    console.log("dssdsd")
    this._configurationalMasterService.allCustomerCategory().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("scvsvsf")

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


