import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionComponent } from './action/action.component';
import { InventoryAllocationService } from 'src/app/@shared/services/inventory/inventory-allocation.service';

@Component({
  selector: 'app-production-total-inventory-list',
  templateUrl: './production-total-inventory-list.component.html',
  styleUrls: ['./production-total-inventory-list.component.scss']
})
export class ProductionTotalInventoryListComponent {
  rowClass: string;
  rowData: any
  constructor(
    private router: Router,
    private toast: ToastrService,
    private inventory_allocation_service: InventoryAllocationService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
    this.apicallonload()
  }
  apicallonload() {
    this.inventory_allocation_service.getProductionData().subscribe((res: any) => {
      this.rowData = res.data
    })
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
      headerName: 'production_order_no',
      field: 'production_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'plantName',
      field: 'plantName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'product_name',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'product_variant_name',
    //   field: 'product_variant_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Action',
      field: 'not decided',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
}


