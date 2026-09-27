import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from '../../inventory-management.service';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AllocateItemsComponent } from '../allocate-items/allocate-items.component';

@Component({
  selector: 'app-recieving-items',
  templateUrl: './recieving-items.component.html',
  styleUrls: ['./recieving-items.component.scss']
})
export class RecievingItemsComponent {
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', getRowHeight: this.getRowHeight.bind(this) };

  getRowHeight(params: any) {
    return 40;
  }

  constructor(
    public dialog: MatDialog,
    private inventoryService: InventoryManagementService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass';
  }
  id: any
  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId")
    this.activeroute.queryParamMap.subscribe((res: any) => {
      console.warn(res, 'res');
      this.getAllCategory()
      if (res.params?.id) {
        this.id = res.params.id
        this.getRecievingGoods(this.id, '');

      }
    })
  }

  getRecievingGoods(id: any, category_id: any) {

    this.inventoryService.getRecievingWarehouseData(id, category_id).subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

  goBack() {
    this.location.back();
  }

  public columnDefs = [
    {
      headerName: '',
      field: 'isChecked',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
      cellRenderer: (params: any) => {
        console.log('Cell value:', params.value);
        return null;
      }
    },
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Name',
      field: 'Item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Category Name',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Batch Number',
      field: 'batchNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Quantity',
      field: 'receiveQty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Area (ft)',
      field: 'area',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },


  ];


  getAllCat: any = []
  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.getAllCat = res.data;
    }, (err: any) => {
      this.getAllCat = []
    })
  }

  getCatId(selectedCats: any) {
    this.getRecievingGoods(this.id, selectedCats)

  }


  gridColumnApi: any = []
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

  getSelectedData() {
    const selectedData = this.gridApi.getSelectedRows();
    console.log(selectedData);
    if (!selectedData.length) {
      this.toast.warning('Please select an items first...')
    } else {
      const dialogRef = this.dialog.open(AllocateItemsComponent, {
        width: '700px',
        data: {
          data: selectedData,
          id: this.id
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.getRecievingGoods(this.id, '');
      });

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

}
