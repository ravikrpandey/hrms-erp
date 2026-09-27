import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ServiceCategoryActionComponent } from './service-category-action/service-category-action.component';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { ServiceCategoryDilogComponent } from './service-category-dilog/service-category-dilog.component';
import { ServiceCategoryStatusActionComponent } from './service-category-action/service-category-status-action/service-category-status-action.component';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { CommonService } from 'src/app/@shared/services/common.service';


@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.scss']
})
export class ServiceCategoryComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  gridOptions: GridOptions = {}


  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _commonService: CommonService

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getAllCategory();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
      
    });
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150
    },

    {
      headerName: 'Service Category Code',
      field: 'service_category_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
      //editable: true,
    },


    {
      headerName: 'Service Category Name',
      field: 'service_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
      //editable: true,
    },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ServiceCategoryStatusActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },

    {
      headerName: 'Action',
      // field: 'countryss_name',
       flex: 1,
       minWidth:150,
      cellRenderer: ServiceCategoryActionComponent,
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }


  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Service_Category_List.xlsx");
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

  openDialog() {
    const dialogRef = this.dialog.open(ServiceCategoryDilogComponent, {
      // data: { id: this.queryParamss },

      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getAllCategory() {
    this._configurationalMasterService.getServiceCategoryMasterList().subscribe((res: any) => {
      this.rowData = res.data;
      
    })
  }

  onFactoryButtonClick(e: any) {
    e.stopPropagation();
    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without feel");
    }
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.service_category_id;
    let val = event.newValue;
    
    
    
    

    //  --------------- change on cell ------------------- 
    
    let sta = event.data;

     
    if(val == event.data.sercvice_category || val == event.data.sercvice_category_status || val == event.data.service_category_id){
      this.prService.editCategoryMaster(id1, sta).subscribe(
        (res: any) => {
          
          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');
          
        });
    }
   
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}

let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
