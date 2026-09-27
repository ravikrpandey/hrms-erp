import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { SubcategoryStatusComponent } from './subcategory-status/subcategory-status.component';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { CustomerMicroCategoryActionComponent } from './customer-micro-category-action/customer-micro-category-action.component';
import { CustomerMicroCategoryStatusComponent } from './customer-micro-category-action/customer-micro-category-status/customer-micro-category-status.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-customer-micro-category',
  templateUrl: './customer-micro-category.component.html',
  styleUrls: ['./customer-micro-category.component.scss']
})
export class CustomerMicroCategoryComponent {
  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;
  data2:any = [];
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private shortcutService: ShortcutService,
    private _finaceservice: FinaceService,

  ) {
    this.rowClass = 'rowClass';
  }


  
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
   
       this.financial_year_id = localStorage.getItem('financial_id');;
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      
      this.route.navigate(["/master/configurational-master/customer-micro-category/create-item"])
    });

  }
  addMicroCustomer(){
        this.route.navigate(["/master/configurational-master/customer-micro-category/create-item"])
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
      headerName: 'Micro Category Name',
      field: 'micro_category_name',
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
      headerName: 'Micro Category Code',
      field: 'micro_category_code',
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
      cellRenderer: CustomerMicroCategoryStatusComponent,
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
      cellRenderer: CustomerMicroCategoryActionComponent,
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
    this._configurationalMasterService.getAllCustomerMicroCategory().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("fdfsdfsd",this.rowData)

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


