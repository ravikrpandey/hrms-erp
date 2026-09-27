import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';
// import { AdditionalChargeDilogComponent } from './additional-charge-dilog/additional-charge-dilog.component'; 
// import { AdditionalChargeActionComponent } from './additional-charge-action/additional-charge-action.component';
// import { AdditionalChargeStatusActionComponent } from './additional-charge-action/additional-charge-status-action/additional-charge-status-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
// import { AdditionalChargeStatusActionComponent } from './additional-charge-action/additional-charge-status-action/additional-charge-status-action.component';
import { GstGlMappingDialogComponent } from './gst-gl-mapping-dialog/gst-gl-mapping-dialog.component';
import { GstGlMappingActionComponent } from './gst-gl-mapping-action/gst-gl-mapping-action.component';
import { GstGlMappingStatusActionComponent } from './gst-gl-mapping-action/gst-gl-mapping-status-action/gst-gl-mapping-status-action.component';
import { MapSalesAccountDialogComponent } from './map-sales-account-dialog/map-sales-account-dialog.component';

@Component({
 selector: 'app-gst-gl-mapping',
  templateUrl: './gst-gl-mapping.component.html',
  styleUrls: ['./gst-gl-mapping.component.scss']
})

export class GstGlMappingComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  gridOptions: GridOptions = {}
  entity_id:any;
  financial_year_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private _commonService: CommonService,
    private prService: PurchaseRequestService,
    private shortcutService: ShortcutService,
    
  ) {
    this.rowClass = 'rowClass';
  }
  
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.get_GST_GL_Mapping_List();
    this.get_mapped_sales_gl();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'GST Type',
      field: 'gst_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Direction',
      field: 'direction',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    // {
    //   headerName: 'GL Account',
    //   field: 'account_code',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },

      {
      headerName: 'GL Account Name',
      field: 'account_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
    },
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   cellRenderer: GstGlMappingStatusActionComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false,
    //     someProperty: 'value',
    //   },
    //   cellClass: "grid-cell-centered",
    // },
    {
      headerName: 'Action',
      cellRenderer: GstGlMappingActionComponent,
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
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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


    
this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
  next: (res: any) => {

    let newMonth = this._finaceservice.getCurrentMonth();
    let isExistData = res.data.some((x: any) => x.month === newMonth);
    if (!isExistData && res.code===200) {
      this.toaster.warning(res.message);
      return
    }
    if (!isExistData && res.code===201) {
      this.toaster.warning(res.message);
      return
    }
    

    const dialogRef = this.dialog.open(GstGlMappingDialogComponent, {
      width: '55%',
      height: '95%',
      maxHeight: '95%',

      data: { mode: 'add' },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }, error:(err)=> {
    console.log(err)
    this.toaster.warning(err.error.message);
      return
  },
})

  }

  get_GST_GL_Mapping_List() {
    this._commonService?.showLoader()
    this._configurationalMasterService.get_GST_GL_Mapping_List(this.entity_id).subscribe((res: any) => {
      this.rowData = res?.data;
      this._commonService?.hideLoader()
    }, (err: any) => {
      this.rowData = []
      this._commonService?.hideLoader()
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

 mapChartOfAccount(){
    const dialogRef = this.dialog.open(MapSalesAccountDialogComponent, {
      width: '600px',
      data :{ chart_account_id:this.rowData2[0]?.chart_account_id,status: 'sales' }
       
    });
    dialogRef.afterClosed().subscribe((result) => {
       
    });
  }
  mapChartOfAccountForPurcahse() {
    const dialogRef = this.dialog.open(MapSalesAccountDialogComponent, {
      width: '600px',
      data: {
        chart_account_id: this.rowData2[0]?.purchase_chart_account_id,
        status: 'purchase'  
      }
    });
  }
  rowData2:any[]=[];

  get_mapped_sales_gl(){
    this._configurationalMasterService.get_mapped_sales_gl(this.entity_id).subscribe((res:any)=>{
      this.rowData2 = res?.data;
    })
  }
  

}


  
