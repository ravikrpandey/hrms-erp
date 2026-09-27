import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ProductionStatusComponent } from '../production-status/production-status.component';
import { ActionProductionComponent } from '../action-production/action-production.component';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.scss',],
})
export class ProductionListComponent {
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

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private $proposal: ProposalService,
    private activeroute: ActivatedRoute,
    private _productionService:ProductionService
  ) {
    this.rowClass = 'rowClass';
  }

ngOnInit(): void {
  this.loginUser = localStorage.getItem('EmpMainId')
  if (this.loginUser) {
    this.getAllorderList();
  }

}

getAllorderList() {
  try {
    this.$proposal.getAllorderListData().subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
      }
    }, err => {
      console.log(err);
    })
  } catch (error) {
    console.log(error);
  }
}

public columnDefs = [
  {
    headerName: 'S No.',
    valueGetter: 'node.rowIndex + 1',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered ',
    flex: 1,
  },
  {
    headerName: 'Sales Order Number',
    field: 'do_number', // Replace with your actual field name
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,

  },
  {
    headerName: 'Client Name',
    field: 'company_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Sales Order Date',
    field: 'do_date',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Product Name',
    field: 'product_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Varient Name',
    field: 'variant_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },

  {
    headerName: 'Action',
    field: 'id',
    cellRenderer: ActionProductionComponent,
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth:220
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
  productionData:any
  getAllProductionData(){
    this._productionService.getAllProductionData().subscribe((response:any)=>{
this.productionData=[];
    })
  }

  customButtonRenderer()  {
    return '<p class="custom-p">View BOM</>';
  }



}
