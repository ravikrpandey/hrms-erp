import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BatchAllocateComponent } from './batch-allocate/batch-allocate.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';

@Component({
  selector: 'app-batch-allocation',
  templateUrl: './batch-allocation.component.html',
  styleUrls: ['./batch-allocation.component.scss']
})
export class BatchAllocationComponent {
  rowClass: string;
  batchAllocationForm: FormGroup;
  selectedMode: string = 'location';
  in_type: string = 'First_IN';
  paramsData: any;
  allBatchData: any;
  employeeData: any;
  allBranchData: any;
  rowData: any[] = [];
  totalAllocated: any = 0;
  totalReceiveQty: any;
  total_Allocated: any;
  inputData: number;
  singleRowData: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private inventory_Service: TotalInventoryService,
    private toastr: ToastrService,

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
    this.batchAllocationForm = this.fb.group({
      asset_Category: new FormControl(this.paramsData.asset_category_name,),
      item_Name: new FormControl(this.paramsData.item_name),
      managed_By: new FormControl(this.paramsData.manage_by,),
      radio: new FormControl(this.selectedMode,),
      method_radio: new FormControl(this.in_type,),
      branch_Name: new FormControl(null,),
      employee_Name: new FormControl(null,),
      total_Inventory: new FormControl(getTotalInventoryValue(this.paramsData)),
      total_Allocated: new FormControl(''),
      select_Batch: new FormControl(null,),
      remarks: new FormControl(null,),

    })
  }

  ngOnInit() {
    this.apiOnLoad()
  }
  apiOnLoad() {
    const payload = {
      Item_Id: this.paramsData.Item_Id,
      // grn_Item_Id: this.paramsData.grn_id,
      // grn_Item_Id: 192,
      in_type: this.in_type,
      managed_by: "Batch Only"
    }
    this.getBatchInventroy(payload)
    this.registrationall()
    this.branchSetup_get()
  }

  getBatchInventroy(payload: any) {
    this.inventory_Service.getBatchInventory(payload).subscribe((res: any) => {
      // this.allBatchData = res.data
      this.allBatchData = res.data.filter((item: any) => item.selection_item !== 0);
      console.log("+++++allBatch Data", this.allBatchData, "dffff", res.data)
    }, (err: any) => {
      this.allBatchData = []
    })
  }

  branchSetup_get() {
    this.inventory_Service.branchSetup_get().subscribe((res: any) => {
      this.allBranchData = res.data
    })
  }

  registrationall() {
    this.inventory_Service.registrationall().subscribe((res: any) => {
      this.employeeData = res.data
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
        // grn_id: this.paramsData.grn_id,
        in_type: this.in_type,
        managed_by: "Batch Only"
      }
      this.getBatchInventroy(payload)
    }
    else if (this.in_type == "First_IN") {
      const payload = {
        Item_Id: this.paramsData.Item_Id,
        // grn_id: this.paramsData.grn_id,
        in_type: this.in_type,
        managed_by: "Batch Only"
      }
      this.getBatchInventroy(payload)
    };
  }

  selectedBatch() {
    const selectedBatchIds = this.batchAllocationForm.value.select_Batch;
    const selectedBatches = this.allBatchData.filter((batch: any) => selectedBatchIds.includes(batch.id));
    this.rowData = selectedBatches
    console.log(selectedBatches, 'selectedBatches');
    const lastSelectedBatch = selectedBatches[selectedBatches.length - 1];
    this.inventory_Service.setLastSelectedBatch(lastSelectedBatch);
  }

  public columnDefs = [
    {
      headerName: 'Batch No',
      field: 'batchNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Total Qty',
      field: 'selection_item',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Allocated Inventory',
      cellRenderer: BatchAllocateComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
        onActionPerform: (singleData: any, inputData: any) => this.handleActionData(singleData, inputData),
      },
      field: 'plant_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];

  handleActionData(singleData: any, inputData: any) {
    this.inputData = Number(inputData);

    // Check if inputData is less than or equal to singleData.receiveQty
    if (this.inputData <= singleData.selection_item) {
      this.batchAllocationForm.patchValue({
        total_Allocated: this.inputData
      });
    } else {
      this.toastr.error("Quantity exceeded the received quantity");
    }

    this.singleRowData = singleData.receiveQty;

    this.rowData.map((item: any) => {
      if (item?.id == singleData?.id) {
        item.Inv_item = [
          {
            Item_id: item.Item_Id,
            grn_status_id: item.grn_item_id,
            grn_Item_id: this.paramsData.grn_Item_Id,
            grn_id: this.paramsData.grn_id,
            allocated_status: "ALLOCATED",
            allocated_inventory: Number(inputData)
          }
        ]
      }
    })

    const totalAllocated = this.rowData.reduce((total: number, item: any) => {
      return total + (item.Inv_item ? item.Inv_item.reduce((sum: number, invItem: any) => sum + invItem.allocated_inventory, 0) : 0);
    }, 0);

    this.batchAllocationForm.patchValue({
      total_Allocated: totalAllocated
    });

  }

  submit() {
    this.totalReceiveQty = this.batchAllocationForm.value.total_Inventory
    this.total_Allocated = this.batchAllocationForm.value.total_Allocated
    if (this.totalReceiveQty < this.total_Allocated) {
      this.toastr.error("allocated inventory cannot be greater than available inventory")
      return
    }

    if (this.singleRowData < this.inputData) {
      this.toastr.error("qunatity is exceeded")
      return
    }
    let Inv_item: any[] = [];
    this.rowData.forEach((item: any) => {
      if (item.Inv_item) {
        Inv_item = Inv_item.concat(item.Inv_item);
      }
    });
    // let data=this.rowData.map((res:any)=>{
    //   return {
    //     Item_id: res.Item_Id,
    //     grn_status_id: res.grn_item_id,
    //     grn_Item_id: this.paramsData.grn_Item_Id,
    //     grn_id:this.paramsData.grn_id,
    //     allocated_status: "ALLOCATED",
    //     allocated_inventory: this.inputData
    //   }
    // })
    // 
    const payload = {
      Item_id: this.paramsData.Item_Id,
      inventory_type: "Inventory",
      grn_Item_id: this.paramsData.grn_Item_Id,
      grn_id: this.paramsData.grn_id,
      manage_by: "Batch Only",
      Total_inventory: this.batchAllocationForm.value.total_Inventory,
      PO_id: this.paramsData.PO_Id,
      type: this.selectedMode,
      in_type: this.in_type,
      employee_id: this.selectedMode === "employee" ? this.batchAllocationForm.value.employee_Name : null,
      branch_id: this.selectedMode === "location" ? this.batchAllocationForm.value.branch_Name : null,
      allocate_inventory: this.batchAllocationForm.value.total_Allocated,
      remark: this.batchAllocationForm.value.remarks,
      Inv_item: Inv_item
    };


    this.inventory_Service.createInventory(payload).subscribe((res: any) => {
      if (res) {
        this.toastr.success(res.message)
        this.router.navigate(['/master/inventory-management/total-inventory/total-inventory-list'])
      }
    }, (err: any) => {
      this.toastr.error(err.error.message)
    })

  }

}


