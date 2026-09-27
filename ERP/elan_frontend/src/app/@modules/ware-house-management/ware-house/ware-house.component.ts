import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from '../inventory-management.service';
import { WarehouseActionComponent } from './warehouse-action/warehouse-action.component';

@Component({
  selector: 'app-ware-house',
  templateUrl: './ware-house.component.html',
  styleUrls: ['./ware-house.component.scss']
})
export class WareHouseComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  WarehouseList: any = [];
  entity_id: any;
  financial_year_id: string | null;
  warehouseData: any;
  racks: any[] = [];
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
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getAllWarehouseList()


    this.warehouseData = {
      area: '850 sqft',
      rack_area: '500 sqft',
      no_of_racks: 4,
      racks: [
        {
          name: 'Rack A',
          size: '120 sqft',
          no_of_shelves: 2,
          shelves: [
            {
              name: 'Shelf A',
              size: '60 sqft',
              no_of_bins: 2,
              bins: [
                {
                  name: 'Bin A1',
                  area: '30 sqft',
                  capacity: '150 sqft',
                  size: '120 sqft'
                },
                {
                  name: 'Bin A2',
                  area: '30 sqft',
                  capacity: '150 sqft',
                  size: '120 sqft'
                }
              ]
            },
            {
              name: 'Shelf B',
              size: '60 sqft',
              no_of_bins: 1,
              bins: [
                {
                  name: 'Bin B1',
                  area: '30 sqft',
                  capacity: '150 sqft',
                  size: '120 sqft'
                }
              ]
            }
          ]
        },
        {
          name: 'Rack B',
          size: '120 sqft',
          no_of_shelves: 1,
          shelves: [
            {
              name: 'Shelf C',
              size: '60 sqft',
              no_of_bins: 1,
              bins: [
                {
                  name: 'Bin C1',
                  area: '30 sqft',
                  capacity: '150 sqft',
                  size: '120 sqft'
                }
              ]
            }
          ]
        },
        {
          name: 'Rack C',
          size: '130 sqft',
          no_of_shelves: 0,
          shelves: []
        },
        {
          name: 'Rack D',
          size: '130 sqft',
          no_of_shelves: 0,
          shelves: []
        }
      ]
    }
    this.racks = this.warehouseData.racks;
  }

  public columnDefs = [
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
      headerName: 'Location',
      field: 'location_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    // {
    //   headerName: 'Type',
    //   field: 'warehouse_type_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 250,
    // },
    {
      headerName: 'Take Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellRenderer: WarehouseActionComponent,
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

  getAllWarehouseList() {
    this.inventoryService.getAllWarehouseListNew().subscribe((response: any) => {
      this.WarehouseList = response.data || [];
    });
  }


}

