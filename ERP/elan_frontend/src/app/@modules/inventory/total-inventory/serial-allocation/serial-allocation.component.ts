import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-serial-allocation',
  templateUrl: './serial-allocation.component.html',
  styleUrls: ['./serial-allocation.component.scss']
})


export class SerialAllocationComponent {
  rowClass: string;
  serialAllocationForm: FormGroup;
  selectedMode: string = 'location';
  in_type: string = 'First_IN';
  paramsData: any;
  allBatchData: any;
  employeeData: any;
  allBranchData: any;
  rowData: any;
  totalAllocated: any = 0;
  totalReceiveQty: any;
  total_Allocated: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedRows: any;
  grnFrom: any;
  grnTo: any;
  mfdFrom: any;
  mfdTo: any;
  filteredDate: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private inventory_Service: TotalInventoryService,
    private toastr: ToastrService,
    private datePipe: DatePipe

  ) {
    this.rowClass = 'rowClass';
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      
      this.paramsData = JSON.parse(param.params.cellData)
      getTotalInventoryValue(this.paramsData)
      console.log(this.paramsData, "RECIEVED DATA");

    })

    function getTotalInventoryValue(data: any): any {
      
      if (data.Total_inventory === null || data.Total_inventory === undefined) {
        return data.selection_item;
      } else if (data.Total_inventory !== null) {
        return data.Total_inventory;
      } else {
        return data.selection_item;
      }
    }

    this.serialAllocationForm = this.fb.group({
      asset_Category: new FormControl(this.paramsData.asset_category_name,),
      item_Name: new FormControl(this.paramsData.item_name),
      managed_By: new FormControl(this.paramsData.manage_by,),
      radio: new FormControl(this.selectedMode,),
      method_radio: new FormControl(this.in_type,),
      branch_Name: new FormControl(null,),
      employee_Name: new FormControl(null,),
      total_Inventory: new FormControl(getTotalInventoryValue(this.paramsData)),
      total_Allocated: new FormControl(this.totalAllocated,),
      grn_from: new FormControl(null,),
      grn_to: new FormControl(null,),
      mfd_from: new FormControl(null,),
      mfd_to: new FormControl(null,),
      remarks: new FormControl(null,),

    })
  }

  ngOnInit() {
    this.apiOnLoad()
  }
  apiOnLoad() {
    const payload = {
      Item_Id: this.paramsData.Item_Id,
      in_type: this.in_type,
      managed_by: "S.No. Only",
      // grn_Item_Id: this.paramsData.grn_Item_Id
    }
    this.getBatchInventroy(payload)
    this.registrationall()
    this.branchSetup_get()
  }

  getBatchInventroy(payload: any) {
    this.inventory_Service.getBatchInventory(payload).subscribe((res: any) => {
      this.allBatchData = res.data
      this.rowData = this.allBatchData
      console.log(this.allBatchData, "this is the batch data ");

    })
  }

  branchSetup_get() {
    this.inventory_Service.branchSetup_get().subscribe((res: any) => {
      this.allBranchData = res.data
      console.log(this.allBranchData, "this is the allBranchData data ");

    })
  }

  registrationall() {
    this.inventory_Service.registrationall().subscribe((res: any) => {
      this.employeeData = res.data
      console.log(this.employeeData, "this is the employeeData data ");

    })
  }

  toggleMode(mode: string) {
    this.selectedMode = mode;
  }

  toggleMethod(method: string) {
    this.in_type = method;
    if (this.in_type == "Last_IN") {
      const payload = {
        Item_Id: this.paramsData.Item_Id,
        in_type: this.in_type,
        managed_by: "S.No. Only"
      }
      this.getBatchInventroy(payload)
    }
    else if (this.in_type == "First_IN") {
      const payload = {
        Item_Id: this.paramsData.Item_Id,
        in_type: this.in_type,
        managed_by: "S.No. Only"
      }
      this.getBatchInventroy(payload)
    };

  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'MFG Date',
      field: 'expiryDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'GRN Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: '',
      field: 'checkbox',
      filter: true,
      sortable: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
  ];
  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();
    console.log(this.selectedRows, "showing the data");
    console.log(this.selectedRows.length, "showing the data");
    // const totalAllocated = this.selectedRows.reduce((total: any, currentItem: any) => {
    //   return total + currentItem.receiveQty;
    // }, 0);

    if (this.selectedRows.length > this.serialAllocationForm.value.total_Inventory) {
      this.toastr.error("allocated inventory cannot be greater than available inventory")
    }


    this.serialAllocationForm.patchValue({
      total_Allocated: this.selectedRows.length
    });

    this.selectedRows.map((item: any) => {
      
      item.Inv_item = [
        {
          "Item_id": item.Item_Id,
          "grn_status_id": item.grn_item_id,
          grn_Item_id: this.paramsData.grn_Item_Id,
          grn_id:this.paramsData.grn_id,
          allocated_status: "ALLOCATED",
          "allocated_inventory": null
        }
      ]
    })
    console.log(this.selectedRows, "this is the rows after mapping the data ");

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));

  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  customNoRowsTemplate = `
  <span style="padding: 10px; display: inline-block;">No data available</span>
`;

  submit() {
    this.totalReceiveQty = this.paramsData.totalReceiveQty
    this.total_Allocated = this.serialAllocationForm.value.total_Allocated
    if (this.totalReceiveQty < this.total_Allocated) {
      this.toastr.error("allocated inventory cannot be greater than available inventory")
      return
    }

    const allInvItems: any[] = [];

    this.selectedRows.forEach((item: any) => {
      if (item.Inv_item) {
        allInvItems.push(...item.Inv_item);
      }
    });

    const payload = {
      Item_id: this.paramsData.Item_Id,
      grn_Item_id: this.paramsData.grn_Item_Id,
      grn_id:this.paramsData.grn_id,
      inventory_type: "Inventory",
      manage_by: "S.No. Only",
      Total_inventory: this.serialAllocationForm.value.total_Inventory,
      PO_id: this.paramsData.PO_Id,
      type: this.selectedMode,
      in_type: this.in_type,
      employee_id: this.selectedMode === "employee" ? this.serialAllocationForm.value.employee_Name : null,
      branch_id: this.selectedMode === "location" ? this.serialAllocationForm.value.branch_Name : null,
      allocate_inventory: this.serialAllocationForm.value.total_Allocated,
      remark: this.serialAllocationForm.value.remarks,
      Inv_item: allInvItems
    };

    console.log(payload, "payload");

    this.inventory_Service.createInventory(payload).subscribe((res: any) => {
      if (res) {
        this.toastr.success(res.message)
        this.router.navigate(['/master/inventory-management/total-inventory/total-inventory-list'])
      }
    }, (err: any) => {
      this.toastr.error(err.error.message)
    })

  }

  formatDate(date: any): string {
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      return formattedDate || '';
    } else {
      return '';
    }
  }

  dateFilter() {
    this.grnFrom = this.formatDate(this.serialAllocationForm.value.grn_from);
    this.grnTo = this.formatDate(this.serialAllocationForm.value.grn_to);
    this.mfdFrom = this.formatDate(this.serialAllocationForm.value.mfd_from);
    this.mfdTo = this.formatDate(this.serialAllocationForm.value.mfd_to);
    console.log(this.mfdFrom, "this is the date ");
    this.inventory_Service.getFilteredInventory(this.grnFrom, this.grnTo, this.mfdFrom, this.mfdTo, this.paramsData.Item_Id).subscribe((res: any) => {
      console.log(res, "this is the response ");
      this.filteredDate = res.data
      console.log(this.filteredDate, "this is the filteredDate ");
      this.rowData = this.filteredDate
    })
  }

}




