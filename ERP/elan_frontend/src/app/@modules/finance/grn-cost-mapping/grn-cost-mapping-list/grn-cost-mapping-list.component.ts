import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { GrnServiceService } from '../../../purchase-management/services/grn-service.service' ;
import { GrnCostMappingActionComponent } from '../grn-cost-mapping-action/grn-cost-mapping-action.component';


@Component({
  selector: 'app-grn-cost-mapping-list',
  templateUrl: './grn-cost-mapping-list.component.html',
  styleUrls: ['./grn-cost-mapping-list.component.scss']
})
export class GrnCostMappingListComponent {

  public tab: string;
  selectedIndex = 0;

  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];


  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];



  public completedColDef: ColDef[] = [
    {
      headerName: 'Sr. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO Type',
      field: 'po_type',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO Category',
      field: 'po_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => moment(new Date(params.value)).format('DD-MM-YYYY'),
    },
    {
      headerName: 'Quantity',
      field: 'item_quantity',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }, {
      headerName: 'Total Purchase',
      field: 'total_amount',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Version',
      field: 'version',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Status',
      field: 'grnStatus',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: GrnCostMappingActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private _rbackService: RbacMasterService,
    private grnService: GrnServiceService,

  ) {
    this.assignAction = this._rbackService.accessAssignAction();

    this.route.queryParams.subscribe((params: any) => {
      
      
      this.rowData = [];
      this.filteredData = [];
        this.columnDefs = this.completedColDef;
        this.getAllGRNData();
      
    
    })
  }

  getAllGRNData() {
    this.grnService.getAllGRNDataInvoice(
      this.accessCtrl.getFinancialId(),
      this.accessCtrl.getEntityId(),
      this.accessCtrl.getEmployeeId(),
    ).subscribe((res: any) => {
    
      this.rowData = res.data.filter((i:any)=>i.invoice_status=='COMPLETED');
      this.filteredData = this.rowData;
    })
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

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter((res: any) => res.department_name == event);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
