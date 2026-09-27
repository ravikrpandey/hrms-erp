import { Component } from '@angular/core';
import { ProductCategoryCreateComponent } from '../product-category-create/product-category-create.component';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ProductStatusComponent } from '../product-status/product-status.component';
import { ProductActionComponent } from '../product-action/product-action.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  editDesig: any;
  entityId: string | null;
 
  financial_year_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private _finaceservice: FinaceService,
    private toaster: ToastrService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }
  
  ngOnInit(): void {
    
    
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getDesignation();
    
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;

      // this.editDesig=this.id
      // this.countryss_id = this.id.countryss_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
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
      headerName: 'Product Category Name',
      field: 'category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      editable: true,
    },
{
  
  headerName: 'Product Category code',
  field: 'category_code',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
    {
      headerName: 'Status',
      cellRenderer: ProductStatusComponent
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ProductActionComponent,
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
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }
    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    e.stopPropagation();
    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add Designation");
    }
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

  getDesignation() {
    this._configurationalMasterService.getAllCategory(this.entityId).subscribe((res: any) => {
      this.rowData = res.data;

    })
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.id;
    let val = event.newValue;



    //  --------------- change on cell ------------------- 


    let sta = event.data;

    
    if (val == event.data.designation_name || val == event.data.status || val == event.data.designation_id) {
      this._configurationalMasterService.updateDesignation(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');

        });
    }

  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  onCellClicked(e: any) {

    const dialogRef = this.dialog.open(ProductCategoryCreateComponent, {
      width: '400px',
      data: {
        role_master_id: e.data.role_master_id,
      },
    });
    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }
  add_Degsignation: any = 'Add_Designation'
  openDialog(e?: any) {
    if (e) {
      e.stopPropagation();
    }


    
    let checkPostingPeriod = new CheckPostingPeriod(this._finaceservice);
    checkPostingPeriod.returnActiveMonth(this.entityId, this.financial_year_id)
      .then(isActive => {
        if (isActive) {
       const dialogRef  = this.dialog.open(ProductCategoryCreateComponent, {
          
            width: '30%',data:{data:'addCategory'}
          });
          dialogRef.afterClosed().subscribe((result) => {});
        } else {
          this.toaster.warning('This month is not active');
          return;
        }
      })
      .catch(err => {
        console.error('Error occurred:', err);
      });
  
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
