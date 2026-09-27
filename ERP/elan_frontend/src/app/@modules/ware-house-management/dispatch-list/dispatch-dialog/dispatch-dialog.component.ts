
import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  GridApi,
  GridOptions,
} from 'ag-grid-community';
import { InventoryManagementService } from '../../inventory-management.service';

@Component({
  selector: 'app-dispatch-dialog',
  templateUrl: './dispatch-dialog.component.html',
  styleUrls: ['./dispatch-dialog.component.scss']
})
export class DispatchDialogComponent {
  rowClass: any;
  rowData: any;
  warehouseList: any;
  rowList: any;
  shelfList: any;
  sectionList: any;
  productDetails: any;
  public selectedQuantity: number = 0;
  public columnApi: any;
  private gridApi!: GridApi<any>;
  frmAssignSerialNo: FormGroup;

  constructor(
    private toast: ToastrService,
    public dialog: MatDialogRef<DispatchDialogComponent>,
    private fb: FormBuilder,
    private inventoryServices: InventoryManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.rowClass = 'rowClass';
  }
  itemId: number;
  dataView: any;
  ngOnInit() {
    this.rowData = []
    this.dataView = this.data.id;
    this.selectedQuantity = this.data.quantity;


    this.frmAssignSerialNo = this.fb.group({
      warehouse_name: [],
      row_name: [],
      self_name: [],
      section_name: [],
      item: [],
      quantity: [this.data.quantity]
    })

    this.getWarehouseForDisatch(this.data.product_master_id, this.data.quantity);

  }

  getWarehouseForDisatch(item_id: any, quantity: any) {
    this.inventoryServices.getWarehouseForDisatch(item_id, quantity).subscribe({
      next: (res: any) => {
        console.log(res);
        this.warehouseList = res.data
        this.itemId = this.warehouseList[0]?.MASTER_ITEM?.id;
        this.frmAssignSerialNo.get('item')?.patchValue(this.warehouseList[0]?.MASTER_ITEM?.item_name)
      }, error: (err) => {
        console.log(err);
      },
    })
  }
  getRowForDisatch(warehouse_id: any) {


    this.inventoryServices.getRowForDisatch(this.data.product_master_id, warehouse_id.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rowList = res.data
      }, error: (err) => {
        console.log(err);
      },
    })
  }
  getShelfForDisatch(warehouseRow_id: any) {


    this.inventoryServices.getShelfForDisatch(this.data.product_master_id, warehouseRow_id.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.shelfList = res.data
      }, error: (err) => {
        console.log(err);
      },
    })
  }
  getSectionForDisatch(self_id: any) {


    this.inventoryServices.getSectionForDisatch(this.data.product_master_id, self_id.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.sectionList = res.data
      }, error: (err) => {
        console.log(err);
      },
    })
  }
  selectedSection(section: any) {

    // this.inventoryServices.getsSerialNo(section.id, this.data.product_master_id).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.rowData = res.data;
    //   }, error: (err) => {
    //     console.log(err);
    //   },
    // })
  }
  public columnDefs2 = [
    {
      headerName: 'Select',
      checkboxSelection: true,
      width: 50,
      suppressMenu: true,
      headerCheckboxSelection: true,
      suppressSorting: true,
      suppressSizeToFit: true
    },
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Serial Number',
      field: 'serial_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const value = params.value || '';
        return `
           <span class="copy-text">SN-${value}</span>
           <i class="copy-icon" title="Copy" style="cursor: pointer; margin-left: 5px;" onclick="navigator.clipboard.writeText('${value}')">📋</i>
         `;
      }
    }
  ];

  onClose() {
    this.dialog.close();
  }
  public gridOptions: GridOptions = {
    rowSelection: 'multiple',
    onSelectionChanged: this.onSelectionChanged.bind(this),
  };

  onGridReady(params: any) {

    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    if (this.gridApi) {

      this.selectRowsByQuantity();
    }
  }
  selectRowsByQuantity() {
    const rowsToSelect = this.selectedQuantity;

    if (!this.gridApi) {
      console.error("Grid API is not available");
      return;
    }

    this.gridApi.deselectAll();

    let selectedCount = 0;

    this.gridApi.forEachNode((node: any) => {
      if (selectedCount < rowsToSelect) {
        node.setSelected(true);
        selectedCount++;
      } else {
        return;
      }
    });
  }
  selectedRows: any
  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();
    console.log(this.selectedRows);

    this.getSelectedRows();
  }

  selectedRows2: any
  getSelectedRows() {
    this.selectedRows2 = this.gridOptions.api?.getSelectedRows();
    console.log(this.selectedRows2);
  }
  assigneSerialNo() {

    if (this.selectedRows2.length > this.selectedQuantity) {
      this.toast.warning("Serial cannot select more than no quantity");
      return;
    }
    if (this.selectedRows2.length < this.selectedQuantity) {
      this.toast.warning("Serial cannot select less than no quantity");
      return;
    }
    if (this.selectedRows2 && this.selectedRows2.length > 0) {
      this.selectedRows2 = this.selectedRows2.map((x: any) => {
        return {
          ...x,
          item_id: this.itemId
        }

      })
      let formData = {

        serialNo: this.selectedRows2
      };

      this.dialog.close({
        data: formData
      })

      console.log("Form Data:", formData);
    } else {
      this.toast.warning("No row selected");
      return;
    }
  }

}
