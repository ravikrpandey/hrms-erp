import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';
import { BatchAllocateComponent } from '../../total-inventory/batch-allocation/batch-allocate/batch-allocate.component';
import { InventoryAllocationService } from 'src/app/@shared/services/inventory/inventory-allocation.service';

@Component({
  selector: 'app-production-batch-allocation',
  templateUrl: './production-batch-allocation.component.html',
  styleUrls: ['./production-batch-allocation.component.scss']
})
export class ProductionBatchAllocationComponent {

  rowClass: string;
  batchAllocationForm: FormGroup;
  selectedMode: string = 'location';
  in_type: string = 'First_IN';
  paramsData: any;
  allBatchData: any;
  employeeData: any;
  allBranchData: any;
  rowData: any = [];
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
    private inventory_allocation_service: InventoryAllocationService,


  ) {
    this.rowClass = 'rowClass';
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      this.paramsData = JSON.parse(param.params.inventory_view)
      console.log(this.paramsData, "RECIEVED DATA");

    })
    this.batchAllocationForm = this.fb.group({
      asset_Category: new FormControl(this.paramsData.asset_category_name,),
      item_Name: new FormControl(this.paramsData.item_name),
      managed_By: new FormControl(this.paramsData.manage_by,),
      radio: new FormControl(this.selectedMode,),
      method_radio: new FormControl(this.in_type,),
      branch_Name: new FormControl(null,),
      employee_Name: new FormControl(null,),
      total_Inventory: new FormControl(this.paramsData.totalReceiveQty),
      total_Allocated: new FormControl(this.totalAllocated,),
      select_Batch: new FormControl(null,),
      remarks: new FormControl(null,),

    })
  }

  ngOnInit() {
    this.apiOnLoad()
  }
  apiOnLoad() {
    const payload = {
      // inventory_type: "Production",
      Item_Id: Number(this.paramsData.item_id),
      in_type: this.in_type,
      managed_by: "Batch Only",
      // id: this.paramsData.id
    }
    this.getBatchInventroy(payload)
    this.registrationall()
    this.branchSetup_get()
  }

  getBatchInventroy(payload: any) {
    this.inventory_Service.getProductionbyId_Inside(payload).subscribe((res: any) => {
      this.allBatchData = res.data
      // this.rowData = this.allBatchData
      // console.log(this.allBatchData,"this is batch data",this.rowData,"++++++++rowdata+++++++")
      // if(payload.inventory_type=='Production'){
      //   this.rowData=res.data.ItemDetails

      // }
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
        // inventory_type: "Production",
        Item_Id: Number(this.paramsData.item_id),
        in_type: this.in_type,
        managed_by: "Batch Only"
      }
      this.getBatchInventroy(payload)
    }
    else if (this.in_type == "First_IN") {
      const payload = {
        // inventory_type: "Production",
        Item_Id: Number(this.paramsData.item_id),
        in_type: this.in_type,
        managed_by: "Batch Only"
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
      field: 'Item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Total Required Quantity',
      field: 'total_required_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Total Recieved Quantity',
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
    
    this.inputData = Number(inputData)
    this.singleRowData = singleData.selection_item

    if (Number(singleData.selection_item) < Number(inputData)) {
      this.toastr.error("qunatity is exceeded")
    }
    this.rowData.map((item: any) => {
      if (item?.id == singleData?.id) {
        item.Inv_item = [
          {
            "Item_id": item.Item_Id,
            "selection_id": item.id,
            "grn_status_id": item.id,
            allocated_status: "ALLOCATED",
            "allocated_inventory": Number(inputData),
            
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

  selectedBatch() {
    const selectedBatchIds = this.batchAllocationForm.value.select_Batch;
    const selectedBatches = this.allBatchData.filter((batch: any) => selectedBatchIds.includes(batch.id));
    this.rowData = selectedBatches
    console.log(selectedBatches, 'selectedBatches');
    const lastSelectedBatch = selectedBatches[selectedBatches.length - 1];
    this.inventory_Service.setLastSelectedBatch(lastSelectedBatch);
  }


  submit() {
    this.totalReceiveQty = Number(this.paramsData.totalReceiveQty)
    this.total_Allocated = this.batchAllocationForm.value.total_Allocated
    if (this.totalReceiveQty < this.total_Allocated) {
      this.toastr.error("allocated inventory cannot be greater than available inventory")
      return
    }

    if (this.singleRowData < this.inputData) {
      this.toastr.error("qunatity is exceeded")
      return
    }

    const allInvItems: any[] = [];

    this.rowData.forEach((item: any) => {
      if (item.Inv_item) {
        allInvItems.push(...item.Inv_item);
      }
    });

    const payload = {
      Item_id: this.paramsData.item_id,
      allocate_inventory: this.batchAllocationForm.value.total_Allocated,
      inventory_type: "Production",
      manage_by: "Batch Only",
      Total_inventory: this.paramsData.totalReceiveQty,
      raise_indent_id: this.allBatchData.id,
      remark: this.batchAllocationForm.value.remarks,
      Inv_item: allInvItems
    };

    console.log(payload, "payload");

    this.inventory_Service.createInventory(payload).subscribe((res: any) => {
      if (res) {
        this.toastr.success(res.message)
        this.router.navigate(['/master/inventory-management/inventory-allocation/production-total-inventory-list'])
      }
    }, (err: any) => {
      this.toastr.error(err.error.message)
    })

  }

}


