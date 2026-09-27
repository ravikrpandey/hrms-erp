import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GrnActionComponent } from './grn-action/grn-action.component';
import { GrnServiceService } from '../services/grn-service.service';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GrnComponent {

  public tab: string;
  selectedIndex = 0;
  subheading: string = 'PO List';
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];

  actions = [
    {
      label: 'Generate Multi PO GRN',
      callback: this.generateMultiPoGrn.bind(this),
    },
  ];
  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];

  public poColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Shipment No.',
      field: 'shiped_no',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
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
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'PO Type',
    //   field: 'po_type',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'Indent Type',
    //   field: 'po_category',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 110,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'PO Date',
      field: 'po_date',
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
      headerName: 'PO QTY',
      field: 'item_quantity',
      cellClass: "grid-cell-centered",
      flex: .8,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Claim QTY',
      field: 'claim_qty',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Invoice Amount',
      field: 'invoice_amount',
      cellClass: "grid-cell-centered",
      valueFormatter: (params: any) => {
        return `₹${Number(params.value || 0).toFixed(2)}`;
      },
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: GrnActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      minWidth: 40,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  public completedColDef: ColDef[] = [
    {
      headerName: 'S. No.',
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
      headerName: 'GRN No.',
      field: 'grn_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Shipment No.',
      field: 'shiped_no',
      cellClass: "grid-cell-centered",
      flex: 1,
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
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'PO Type',
    //   field: 'po_type',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
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
    // {
    //   headerName: 'Indent Type',
    //   field: 'po_category',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 110,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
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
      headerName: 'Received QTY',
      field: 'item_quantity',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }, 
    // {
    //   headerName: 'Total Purchase',
    //   field: 'total_purchase',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 120,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Version',
    //   field: 'version',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Status',
    //   field: 'grnStatus',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: GrnActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      // flex: 1,
      minWidth: 120,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];
  public partialColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'GRN No.',
      field: 'grn_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Shipment No.',
      field: 'shiped_no',
      cellClass: "grid-cell-centered",
      flex: 1,
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
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'PO Type',
    //   field: 'po_type',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'Indent Type',
    //   field: 'po_category',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 110,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
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
      headerName: 'Rejected Qty',
      field: 'item_quantity',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }, 
    // {
    //   headerName: 'Total Purchase',
    //   field: 'total_purchase',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 120,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Version',
    //   field: 'version',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Status',
    //   field: 'discardStatus',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: GrnActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      // flex: 1,
      minWidth: 100,
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
      this.showList = false;
      this.tab = params['tab'];
      this.rowData = [];
      this.filteredData = [];
      if (!this.tab) {
        this.columnDefs = this.poColDef;
        this.showList = true;
        this.tab = 'po-list';
        this.selectedIndex = 0;
        this.router.navigate(['master/purchase-management/grn'], { queryParams: { tab: 'po-list' } })
      }
      if (this.tab == 'po-list') {
        this.selectedIndex = 0;
        this.columnDefs = this.poColDef;
        this.subheading = 'PO List';
        this.showList = true;
        this.getAllGRNData(0);
      } else if (this.tab == 'completed-grn') {
        this.selectedIndex = 1;
        this.columnDefs = this.completedColDef;
        this.subheading = 'Completed GRN';
        this.showList = true;
        this.getAllGRNData(2);
      }
      else if (this.tab == 'rejected-grn') {
        this.selectedIndex = 2;
        this.columnDefs = this.partialColDef;
        // this.subheading = 'Rejected / Partial GRN';
        this.subheading = 'Rejected GRN';
        this.showList = true;
        this.getAllGRNData(1);
      }
    })
  }

  getAllGRNData(status: 1 | 2 | 3 | 0) {
    this.grnService.getAllGRNData(
      this.accessCtrl.getFinancialId(),
      this.accessCtrl.getEntityId(),
      this.accessCtrl.getEmployeeId(),
      status,
      true
    ).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    })
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = ['po-list', 'completed-grn', 'rejected-grn'];
    this.router.navigate(['master/purchase-management/grn'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge'
    });
  }

  generateMultiPoGrn() {
    this.router.navigate(['master/purchase-management/grn/genrate-grn-multi-po'])
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