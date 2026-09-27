import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { SubCategoryStatusComponent } from './subcategory-action/subcategory-status/subcategory-status.component';
// import { SubcategoryStatusComponent } from './subcategory-status/subcategory-status.component';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
// import { SubcategoryActionComponent } from './subcategory-action/subcategory-action.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-accessory-subcategory',
  templateUrl: './accessory-subcategory.component.html',
  styleUrls: ['./accessory-subcategory.component.scss']
})
export class AccessorySubcategoryComponent {
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
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/subcategory-master/create-item"])
    });

  }

  addSubCategory() {
    
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
        
        this.route.navigate(["/master/configurational-master/subcategory-master/create-item"])

        


      }, error: (err) => {
        console.log(err)
        this.toaster.warning(err.error.message);
        return
      }
    })
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
      headerName: 'Category Name',
      field: 'MASTER_ASSET.asset_category_name',
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
    // {
    //   headerName: 'Sub Category Code',
    //   field: 'sub_category_code',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   //editable: true,
    // },
    {
      headerName: 'Status',
      field: 'status',
      // cellRenderer: AccessorySubCategoryStatusComponent,
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
      // cellRenderer: SubcategoryActionComponent,
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
    this._configurationalMasterService.getSubCategoryList(this.entity_id,this.financial_year_id).subscribe((res: any) => {
      this.rowData = res.data
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


