import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ActionProductionComponent } from '../../production/action-production/action-production.component';
import { ProductionStatusComponent } from '../../production/production-status/production-status.component';
import { SalesManagementService } from '../sales-management-service/sales-management.service';
import { DeliveryActionComponent } from './delivery-action/delivery-action.component';
import { DeliveryStatusComponent } from './delivery-status/delivery-status.component';

@Component({
  selector: 'app-delivery-order',
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.scss']
})
export class DeliveryOrderComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  productionData: any = [];
  entityId: string | null;
  mainEmpId: string | null;

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _productionService: ProductionService,
    private salesManagementService: SalesManagementService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')

    this.getDeliveryRecordByID(this.mainEmpId);

  }

  navigateAddNew() {
    this.route.navigate(['master/sales-management/delivery-order/create-delivery-order'])
  }
  navigatePending() {
    this.route.navigate(['master/sales-management/delivery-order/pending-delivery-order'])
  }
  navigateApproved() {
    this.route.navigate(['master/sales-management/delivery-order/approved-delivery-order'])
  }
  navigateRejected() {
    this.route.navigate(['master/sales-management/delivery-order/rejected-delivery-order'])
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/delivery-order'])
  }

  public columnDefs = [
    {
      headerName: 'No.',
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
      headerName: 'Delivery Note ID',
      field: 'delivery_doc_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Customer',
      field: 'customer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Source Warehouse',
      field: 'temp_source_warehouse',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Date',
      field: 'create_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: { value: string | number | Date; }) => {
        // Format the date using Angular's DatePipe
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      headerName: 'Invoice Number',
      field: 'ref_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: DeliveryActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false
      },
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

  // getAllProductionData() {
  //   this._productionService.getAllProductionData().subscribe((response: any) => {
  //     this.productionData = [];
  //   })
  // }
  getDeliveryRecordByID(id: any) {
    this.salesManagementService.getDeliveryOrderByMainId(id,"ALL",this.entityId).subscribe((res: any) => {
      this.rowData = res?.data.reverse();
      return
      });
    }
  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }

  statusCellClicked(e: any) {

    const dialogRef = this.dialog.open(DeliveryStatusComponent,
      { width: '450px',
        data: { cellData: e.data,status:"View"

      } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

}
