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
import { ProformaActionComponent } from './proforma-action/proforma-action.component';
import { ProformaStatusComponent } from './proforma-status/proforma-status.component';

@Component({
  selector: 'app-performa',
  templateUrl: './performa.component.html',
  styleUrls: ['./performa.component.scss']
})
export class PerformaComponent {
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
  productionData: any = [];
  mainEmpId: string | null;

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private saleManagement : SalesManagementService
  ) {
    this.rowClass = 'rowClass';
  }
  entityId:any;
  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getAllProductionData(this.mainEmpId);

  }

  navigateAddNew() {
    this.route.navigate(['master/sales-management/proforma/create-proformas'])
  }
  navigatePending() {
    this.route.navigate(['master/sales-management/proforma/pending-proformas'])
  }
  navigateApproved() {
    this.route.navigate(['master/sales-management/proforma/approved-proformas'])
  }
  navigateRejected() {
    this.route.navigate(['master/sales-management/proforma/rejected-proformas'])
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/proforma'])
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
      headerName: 'Proforma Number',
      field: 'proforma_doc_code',
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
      field: 'business_name',
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
      field: 'delivery_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Quotation Number',
      field: 'quotation_doc_code',
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
      minWidth: 200,
      // cellRenderer: ProductionStatusComponent,
      // cellRendererParams: {
      //   className: 'mat-blue',
      //   hideRequestButton: true,
      //   hideDetailsButton: false,
      //   hideDownloadIcon: false,
      //   showCustomIcon: false,
      //   someProperty: 'value',
      // },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 100,
      // minHeight:100,
      cellRenderer:ProformaActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
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

  getAllProductionData(id:any) {
    this.saleManagement.getAllProforma(id,"ALL",this.entityId).subscribe((response: any) => {
      this.rowData = response.data;
    },(error)=>{
      this.rowData =[];
    })
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }
  statusCellClicked(e: any) {

    const dialogRef = this.dialog.open(ProformaStatusComponent,
      { width: '450px',
        data: { cellData: e.data,status:"View"

      } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

}
