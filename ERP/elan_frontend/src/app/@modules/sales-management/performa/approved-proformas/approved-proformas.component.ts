import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { ProformaActionComponent } from '../proforma-action/proforma-action.component';


@Component({
  selector: 'app-approved-proformas',
  templateUrl: './approved-proformas.component.html',
  styleUrls: ['./approved-proformas.component.scss']
})
export class ApprovedProformasComponent {
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
  userRole: any;

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
  EmpMainId:any;
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.EmpMainId= localStorage.getItem('EmpMainId');
let token:any = localStorage.getItem('signInUser');

this.userRole = JSON.parse(token);
    this.getAllApprovedProforma(this.EmpMainId);

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
      field: 'approval_status',
      headerName: 'Status',
      // editable: true,
      cellEditor: 'agSelectCellEditor',

    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ProformaActionComponent,
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

  getAllApprovedProforma(EmpMainId:any) {
    this.saleManagement.getAllProforma(EmpMainId,"APPROVED",this.entityId,this.userRole.role).subscribe((response: any) => {
      this.rowData = response.data;
      this.rowData = this.rowData.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.proforma_doc_code === value.proforma_doc_code)
      );
    },(error)=>{
      this.rowData =[];
    })
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }


}
