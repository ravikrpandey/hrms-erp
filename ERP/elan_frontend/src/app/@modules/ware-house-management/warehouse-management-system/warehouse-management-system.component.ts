import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AddNewRowComponent } from './add-new-row/add-new-row.component';
import { AddNewSelfComponent } from './add-new-self/add-new-self.component';
import { AddNewSectionComponent } from './add-new-section/add-new-section.component';
import Swal from 'sweetalert2';
import { InventoryManagementService } from '../inventory-management.service';
import { FormControl, Validators } from '@angular/forms';
import { WarehousebifurcationActionComponent } from './warehousebifurcation-action/warehousebifurcation-action.component';
@Component({
  selector: 'app-warehouse-management-system',
  templateUrl: './warehouse-management-system.component.html',
  styleUrls: ['./warehouse-management-system.component.scss']
})
export class WarehouseManagementSystemComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  searchTerm: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  entity_id: any;
  rowList: any;
  selfList: any;
  sectionList: any;
  filteredResult: any;
  width: any = 0;
  warehouseList: any;
  WarehouseListNew: any;
  warehouse_id: FormControl;
  financial_year_id: string | null;
  WarehouseListBifurcation: any;

  constructor(
    public dialog: MatDialog,
    private inventoryService: InventoryManagementService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.warehouse_id = new FormControl(null, Validators.required);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.runProgressBar();
    this.getAllWarehouseList();
    this.getAllWarehouseListNew();
    this.getAllWarehouseBifurcation();

    this.rowData = []
  }
  getAllWarehouseBifurcation() {
    this.inventoryService.getAllWarehouseBifurcations().subscribe((response: any) => {
      this.WarehouseListBifurcation = response?.data || [];
    });
  }
  isActive: any;
  getWarehouseRowList(event: any): void {
    this.getAllRowList(event.value);
  }

  getAllRowList(warehouse_id: any) {
    this.inventoryService.getAllRowList(this.entity_id, this.financial_year_id, warehouse_id).subscribe((res: any) => {

      this.rowList = res.data;
      this.rowList = this.rowList.map((item: any) => {
        const totalCapacity = item.capacity - item.remaining_capacity || 0;
        return {
          ...item,
          totalCapacity
        };
      });
      this.filteredResult = this.rowList;
    });
  }


  getAllWarehouseList() {
    this.inventoryService.getAllWarehouseList(this.entity_id, this.financial_year_id).subscribe((response: any) => {
      this.warehouseList = response.data;
    })
  }

  getAllWarehouseListNew() {
    this.inventoryService.getAllWarehouseListNew().subscribe((response: any) => {
      this.WarehouseListNew = response.data || [];
    });
  }
  getCapacity: any;
  totalCapacity: any;
  getWarehouseData(warehouse: any) {

    console.warn(warehouse, 'warehouse');
    this.getCapacity = warehouse.capacity
    if (warehouse.capacity) {
      let capacity = warehouse?.capacity - warehouse?.remaining_capacity;
      this.totalCapacity = capacity;
    }



  }

  getAllSelfList(row_id: any) {
    this.inventoryService.getAllSelfList(row_id).subscribe((res: any) => {
      this.selfList = res.data;
      this.selfList = this.selfList.map((item: any) => {
        const totalCapacity = item.capacity - item.remaining_capacity;
        return {
          ...item,
          totalCapacity
        };
      });
    },
      (err: any) => {
        this.toast.error("Self data not found! ", "Error Message")
      });
  }

  getAllSectionList(self_id: any) {
    this.inventoryService.getAllSectionList(self_id).subscribe((res: any) => {
      this.sectionList = res.data;
      this.sectionList = this.sectionList.map((item: any) => {
        const totalCapacity = item.capacity - item.remaining_capacity;
        return {
          ...item,
          totalCapacity
        };
      });
    },
      (err: any) => {
        this.toast.error("Section data not found! ", "Error Message")
      });
  }

  runProgressBar() {
    const itemQty = 0;
    this.width = this.width + itemQty;
  }

  manageSetting(e: any) {
    e.stopPropagation();
  }

  // onFilterTextBoxChanged() {
  //   this.rowList = this.filteredResult.filter((data: any) => {
  //     if (data.row_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
  //       return true;
  //     }
  //     return false;
  // });


  // }
  // onPageSizeChanged() {
  //   var value = (document.getElementById('page-size') as HTMLInputElement)
  //     .value;
  //   this.gridApi.paginationSetPageSize(Number(value));
  // }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  // }

  clearWarehouse() {
    this.getAllRowList(this.warehouse_id);
    this.warehouse_id.setValue(null);
  }

  addNewRow() {
    if (this.warehouse_id.invalid) {
      this.toast.error('Please select warehouse!');
      return
    }
    const dialogRef = this.dialog.open(AddNewRowComponent, {
      data: { type: 'add', id: null, warehouseId: this.warehouse_id.value },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      const warehouseid = result ? result.warehouse_id : this.warehouse_id.value;
      this.getAllRowList(warehouseid);
    });
  }

  addNewRowCopy() {
    this.route.navigate(['master/warehouse-management/warehouse-bifurcation/warehouse-new-bircation'])
  }

  addNewSelf(e: any, row_id: any) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddNewSelfComponent, {
      data: { row_id: row_id },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllSelfList(result.row_id);
    });
  }

  addNewSection(e: any, rowid: any, selfid: any) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddNewSectionComponent, {
      data: { row_id: rowid, self_id: selfid },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllSectionList(result.self_id);
    });
  }

  editRow(e: any, row_id: any, row_name: any) {
    if (this.warehouse_id.invalid) {
      this.toast.error('please select warehouse!');
      return
    }
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddNewRowComponent, {
      data: { type: 'edit', id: row_id, row_name: row_name, warehouseId: this.warehouse_id.value },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      const warehouseid = result ? result.warehouse_id : this.warehouse_id.value;
      this.getAllRowList(warehouseid);
    });
  }

  deleteRow(e: any, row_id: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.inventoryService.deleteRow(row_id).subscribe(
          (res: any) => {
            this.toast.success('Deleted successfully ');
            this.getAllRowList(this.warehouse_id.value);
          },
          (err: any) => {
            this.toast.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  }

  navigateToDetails(data: any) {
    console.warn(data, 'data');
    this.route.navigate(['/master/inventory-management/warehouse-bifurcation/view-details'], { queryParams: { section_id: data.id } })
  }

  // new 
  getWarehouseRowListNew(e: any) {

    this.route.navigate(['/master/warehouse-management/warehouse-bifurcation/warehouse-new-bircation'], { queryParams: { id: e.value } })

  }
  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Warehouse Name',
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Warehouse Code',
      field: 'code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'license_number',
      field: 'license_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'manager_name',
      headerName: 'Manager Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'contact_number',
      headerName: 'Contact Number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Total Storage Area (ft2)',
      field: 'area',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
      valueFormatter: (params: any) => {
        if (!params.value && params.value !== 0) return '';
        return params.value.toLocaleString('en-IN');
      }
    },
    {
      headerName: 'Take Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      pinned: 'right',
      cellRenderer: WarehousebifurcationActionComponent,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
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


}


