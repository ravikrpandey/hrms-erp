import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../../service/sales.service';
import { SalesOrderActionComponent } from '../sales-order-action/sales-order-action.component';

@Component({
  selector: 'app-do-history',
  templateUrl: './do-history.component.html',
  styleUrls: ['./do-history.component.scss'],
})
export class DOHistoryComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  proposalDetailsData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
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
    private _productionService: ProductionService,
    private _sales: SalesService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      if (res) {
        let proposal_id = res.do_history;
        this.getAllDoHistoy(proposal_id);
      }
    });
  }

  getAllDoHistoy(id: any) {
    try {
      this._sales.getDOHistoryData(id).subscribe(
        (response: any) => {
          if (response) {
            this.rowData = response.data;
            this.proposalDetailsData = response.proposalDetails;
          }
        },
        (err) => {
          console.log(err);
        }
      );
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
      minWidth: 30,
    },
    {
      headerName: 'Date',
      field: 'do_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Proposal No.',
      field: 'proposal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'DO No.',
    //   field: 'order_number',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    
    {
          headerName: 'Delivery Challan No.',
          field: 'do_no', 
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          // valueGetter: (params:any) => params.data?.do_no || 'N/A',
          // cellRenderer: this.customCellRenderer.bind(this),
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
      headerName: 'Product Code',
      field: 'product_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'UOM',
      field: 'uom_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Proposed Quantity',
      field: 'proposed_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Delivered Quantity',
      field: 'delivered_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Total Delivered Quantity',
      field: 'total_delivered_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Remaining Quantity',
      field: 'remaining_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
  productionData: any;
  getAllProductionData() {
    this._productionService
      .getAllProductionData()
      .subscribe((response: any) => {
        this.productionData = [];
      });
  }

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
    this._sales.getSalesByProsalId(params?.data?.proposal_id,params?.data?.do_id).subscribe((res:any)=>{
      if(res){
        this.route.navigate(["master/sales/view-order"], { queryParams: { proposalId: params?.data?.proposal_id,doId: params?.data?.do_id
          , actionType: 'view-details' } })
        } 
      },(err:any)=>{
       this.toast.warning(err.error.message)
    
    })
    }
}
