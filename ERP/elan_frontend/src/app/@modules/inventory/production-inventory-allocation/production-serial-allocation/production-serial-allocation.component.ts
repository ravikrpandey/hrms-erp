import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { InventoryAllocationService } from 'src/app/@shared/services/inventory/inventory-allocation.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-production-serial-allocation',
  templateUrl: './production-serial-allocation.component.html',
  styleUrls: ['./production-serial-allocation.component.scss']
})
export class ProductionSerialAllocationComponent {
  rowClass: string;
  serialAllocationForm: FormGroup;
  // selectedMode: string = 'location';
  in_type: string = 'First_IN';
  paramsData: any;
  allBatchData: any;
  batchResponse: any = {};
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
    private datePipe: DatePipe,
    private inventory_allocation_service: InventoryAllocationService,


  ) {
    this.rowClass = 'rowClass';
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      this.paramsData = JSON.parse(param.params.inventory_view)
      let temp = param.params;
      console.log(this.paramsData, "RECIEVED DATA");
      console.log(temp, "test")
    })
    this.serialAllocationForm = this.fb.group({
      asset_Category: new FormControl(this.paramsData.asset_category_name,),
      item_Name: new FormControl(this.paramsData.item_name),
      managed_By: new FormControl(this.paramsData.manage_by,),
      method_radio: new FormControl(this.in_type,),
      branch_Name: new FormControl(null,),
      employee_Name: new FormControl(null,),
      total_Inventory: new FormControl(this.paramsData.totalReceiveQty),
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
      // id: Number(this.paramsData.id),
      in_type: this.in_type,
      managed_by: "S.No. Only",
      Item_Id: this.paramsData.item_id,
    }
    this.getBatchInventroy(payload)
    this.registrationall()
    this.branchSetup_get()
  }

  getBatchInventroy(payload: any) {
    this.inventory_Service.getProductionbyId_Inside(payload).subscribe((res: any) => {
      
      this.batchResponse = res;
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

  toggleMethod(method: string) {
    this.in_type = method;
    if (this.in_type == "Last_IN") {
      const payload = {
        // id: Number(this.paramsData.id),
        Item_Id: this.paramsData.item_id,
        in_type: this.in_type,
        managed_by: "S.No. Only"
      }
      this.getBatchInventroy(payload)
    }
    else if (this.in_type == "First_IN") {
      const payload = {
        // id: Number(this.paramsData.id),
        Item_Id: this.paramsData.item_id,
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
      field: 'Item_name',
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
      headerName: 'Received Qty',
      field: 'selection_item',
      // headerName: 'Total Required Quantity',
      // field: 'selection_item',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'MFG Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'GRN Date',
      field: 'expiryDate',
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
          "selection_id": item.id,
          "grn_status_id": item.id,
          allocated_status: "ALLOCATED",
          "allocated_inventory": null
        }
      ]
    })
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

  submit() {
    
    this.totalReceiveQty = this.paramsData.totalReceiveQty
    this.total_Allocated = this.serialAllocationForm.value.total_Allocated
    if (this.totalReceiveQty < this.total_Allocated) {
      return this.toastr.error("allocated inventory cannot be greater than available inventory")
    }
    if (this.batchResponse?.remaining < 1 || this.batchResponse?.remaining < this.total_Allocated) {
      // this.toastr.error("allocated inventory cannot be greater than available inventory")
      // return

      // ***********************

      Swal.fire({
        title: `You selected ${this.total_Allocated} and currently your Thershold Stock having ${this.batchResponse?.remaining}, so are you sure for it `,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result?.isConfirmed) {
          this.submitSure();
        }
      });
    }
    else {
      this.submitSure();
    }

  }

  submitSure() {
    
    const allInvItems: any[] = [];
    this.selectedRows.forEach((item: any) => {
      if (item.Inv_item) {
        allInvItems.push(
          ...item.Inv_item
        );
      }
    });
    const payload = {
      manage_by: "S.No. Only",
      Item_id: this.paramsData.item_id,
      Total_inventory: this.paramsData.totalReceiveQty,
      allocate_inventory: this.total_Allocated,
      raise_indent_id: this.allBatchData.id,
      inventory_type: "Production",
      remark: this.serialAllocationForm.value.remarks,
      Inv_item: allInvItems
    };
    this.inventory_Service.createInventory(payload).subscribe((res: any) => {
      if (res) {
        this.toastr.success(res.message)
        this.router.navigate(['/master/inventory-management/inventory-allocation/production-total-inventory-list'])
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

    this.inventory_Service.getFilteredInventory(this.grnFrom, this.grnTo, this.mfdFrom, this.mfdTo, Number(this.paramsData.production_mapping_id)).subscribe((res: any) => {
      console.log(res, "this is the response ");
      this.filteredDate = res.data
      console.log(this.filteredDate, "this is the filteredDate ");
      this.rowData = this.filteredDate
    })
  }

}



