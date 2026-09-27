import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../service/sales.service';
import { SalesOrderActionComponent } from '../production-list/sales-order-action/sales-order-action.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-delivery-challan-list',
  templateUrl: './delivery-challan-list.component.html',
  styleUrls: ['./delivery-challan-list.component.scss']
})
export class DeliveryChallanListComponent {
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
    private _productionService:ProductionService,private _seles:SalesService
  ) {
    this.rowClass = 'rowClass';
  }

ngOnInit(): void {
  this.loginUser = localStorage.getItem('EmpMainId')
  if (this.loginUser) {
    // this.getAllSalesOrderData();
  }
  
}

getAllSalesOrderData() {
  try {
    this.$proposal.getSalesOrderList(+this.loginUser).subscribe((response: any) => {
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
    headerName: 'Proposal Number',
    field: 'proposal_no',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
     
  },
//   {
//     headerName: 'DO Number',
//     field: 'order_number', 
//     sortable: true,
//     resizable: true,
//     wrapHeaderText: true,
//     autoHeaderHeight: true,
//     cellClass: 'grid-cell-centered',
//     flex: 1,
//     valueGetter: (params:any) => params.data?.order_number || 'N/A',
//     cellRenderer: this.customCellRenderer.bind(this),
// },

  {
    headerName: 'Company Name',
    field: 'company_name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Created By',
    field: 'lead_owner',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Quotation Amount',
    field: 'grant_total',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
  },
  {
    headerName: 'Created Date',
    field: 'createdAt',
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
    cellRenderer: SalesOrderActionComponent,
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth:230,
  },
];

customCellRenderer(params: any) {
     
  const cellValue = params.value;
const clickableContent = document.createElement('div');
clickableContent.style.cursor = 'pointer';
clickableContent.style.color = 'green';
clickableContent.style.textDecoration = 'underline';
clickableContent.innerText = cellValue;
clickableContent.addEventListener('click', () => {
  this.clickIt(params);
});
return clickableContent;

}


clickIt(params:any){
this._seles.getSalesByProsalId(params?.data?.proposal_id,params?.data?.do_id).subscribe((res:any)=>{
  if(res){
    this.route.navigate(["master/sales/view-order"], { queryParams: { proposalId: params?.data?.proposal_id,doId: params?.data?.do_id
      , actionType: 'view-details' } })
    } 
  },(err:any)=>{
   this.toast.warning(err.error.message)

})
}

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
