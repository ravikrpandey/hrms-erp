import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductMasterActionComponent } from '../product-master-action/product-master-action.component';
import { ProductMasterStatusComponent } from '../product-master-action/product-master-status/product-master-status.component';
import { ProductMasterDialogComponent } from '../product-master-dialog/product-master-dialog.component';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { Router } from '@angular/router';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-master-list',
  templateUrl: './product-master-list.component.html',
  styleUrls: ['./product-master-list.component.scss']
})
export class ProductMasterListComponent {

  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;

  constructor(private empMaster: EmpMasterService, private _configurationalMasterService: ConfigurationalmasterService, private _rbackService: RbacMasterService,
    private shortcutService: ShortcutService,
    private route: Router,
    private _finaceservice: FinaceService,
    private toaster: ToastrService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';

  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');;

    this._configurationalMasterService.getDuplicateProductMasterList().subscribe((res: any) => {
      const aa = res.data
      const newArray = aa.map((item: any, index: any) => ({ ...item, index: index + 1 }));
      this.rowData = newArray
    }, (err: any) => {
      this.rowData = []
    })
    this.assignAction = this._rbackService.accessAssignAction();
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/product-master/create"])
    });


  }




  addProduct() {

    let checkPostingPeriod = new CheckPostingPeriod(this._finaceservice);
    checkPostingPeriod.returnActiveMonth(this.entity_id, this.financial_year_id)
      .then(isActive => {
        if (isActive) {

          this.route.navigate(["/master/configurational-master/product-master/create"])
        } else {
          this.toaster.warning('This month is not active');
          return;
        }
      })
      .catch(err => {
        console.error('Error occurred:', err);
      });
  }

  public columnDefs = [

    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Product Name',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Product Variant',
      field: 'MASTER_PRODUCT_VARIANT.variant_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Product Code',
      field: 'product_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },


    {
      headerName: 'UOM',
      field: 'MASTER_UOM.uom_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: ProductMasterStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ProductMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onCellClicked(e: any) {
    const dialogRef = this.dialog.open(ProductMasterDialogComponent, { width: '500px', data: { productMasterViewId: e.data.id, index: e.data.index } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

}

