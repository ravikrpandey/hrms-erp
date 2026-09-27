import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  rowClass: any;

  private gridApi!: GridApi<any>;
  rowData: any = [];
  basicDetails:any;
  emp_id: any;

  entity_id:any;
  filter_fy:any;

  assetHistoryDetails: any;
  id: any;

  grn_id:any;

  constructor(
    private activetRoute: ActivatedRoute,
    private asset_service:AssetListService,
  ){
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.grn_id = params.grn_id;
    });
    this.rowClass = 'rowClass'

  }
  
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id= loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');

    if(this.id && this.grn_id){
      this.getAllAssetHistory()
    }
    
  }
  getAllbasicdetails(){
    if(this.id){
      this.asset_service.getBasicDetailsForAsset(this.id).subscribe((res:any)=>{
         if(res.response){
          this.basicDetails=res.response
         }
      },(err:any)=>{
  
      })
    }
}
  getAllAssetHistory() {
    this.asset_service.getBasicDetailsForAsset(this.id).subscribe((res:any)=>{
      this.basicDetails=res.response
    this.asset_service.getAllAssetHistory(this.entity_id, this.emp_id).subscribe((res: any) => {
      this.assetHistoryDetails = res.data || [];
      const firstResponseFormatted = {
        grn_item_status_id: null, 
        grn_id: null, 
        allocated_id: null, 
        Item_name: this.basicDetails?.item_name,
        itemSerialNo: this.basicDetails?.itemSerialNo,
        asset_tagId: this.basicDetails?.asset_tagId,
        department_name: null, 
        branch_name: this.basicDetails?.branch_name,
        createdAt: this.basicDetails?.createdAt,
        assign_status: 'First Time', 
        assigned_to: null, 
        assigned_from: '',
        purchase_date:this.basicDetails?.purchase_date 
    };

    const finalResponse = [firstResponseFormatted, ...this.assetHistoryDetails];
    this.rowData = finalResponse
    }, (err: any) => {
      this.assetHistoryDetails = [];

    })
  })
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
      minWidth: 50,
    },
    {
      headerName: 'Item Name',
      field: 'Item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Purchase Date',
      field: 'purchase_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const date = params.data.purchase_date;
        return date ? date.split('T')[0] : '-----------';
      }
    },
    // {
    //   headerName: 'Department',
    //   field: 'department_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,


    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'assign_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Assigned To',
      field: 'assigned_to',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Assigned From',
      field: 'assigned_from',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const date = params.data.createdAt;
        return date ? date.split('T')[0] : '-----------';
      }
    }

  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
