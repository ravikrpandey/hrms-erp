import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-depreciation',
  templateUrl: './depreciation.component.html',
  styleUrls: ['./depreciation.component.scss']
})
export class DepreciationComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid:any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  entity_id:any;
  filter_fy:any;
  asset_id:any
  emp_id: any;
  depreciationDetails: any;
  grn_id:any;
  constructor(
    private readonly _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    private activetRoute: ActivatedRoute,
    private asset_service:AssetListService,
     private toast: ToastrService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id= loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.grn_id = params.grn_id;
    });
    if(this.id){
      this.getAllCompanyDepreciationDetails()
    }
  }


  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Depreciation Date',
      field: 'depreciationDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: 'Dep Period FY',
    //   field: 'depPeriodFY',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150
    // },
    {
      headerName: 'Amount',
      field: 'depAmount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Cumulative Depreciation',
      field: 'cumulativeDepreciation',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Dep Amount FY',
      field: 'depAmount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Closing value',
      field: 'closingValue',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    }
  ];
  
  getAllCompanyDepreciationDetails(): void {
    this.asset_service.getAllCompanyDepreciationDetails(this.id).subscribe(
        (res: any) => {
            this.depreciationDetails = res.data;
            this.calculateAssetDepreciation();
        },
        (error) => {
          // this.toast.error(error.error.message);
          console.error(error)
        }
    );
}

calculateAssetDepreciation(){
  // this.asset_id = this.depreciationDetails.asset_id
  // const data = {
  //   putToUseDate: this.formatDate(this.depreciationDetails.putto_use_date), 
  //   purchaseCost: parseFloat(this.depreciationDetails.purchaseCost)
  // }
  this.asset_service.getDepreciationForAsset(this.grn_id).subscribe(
    (res:any)=>{
      this.rowData = res.data;
    },(error) => {
        if(error.code == 404){
          // return this.toast.error(error);
        }

      // return this.toast.error(error.error.message);
  
    })
}


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e:any){
  }

  agInit(params: ICellRendererParams): void {

  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
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

 
}


