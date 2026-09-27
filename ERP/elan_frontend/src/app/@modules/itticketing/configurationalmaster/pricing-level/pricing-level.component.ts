import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActionComponent } from './action/action.component';

@Component({
  selector: 'app-pricing-level',
  templateUrl: './pricing-level.component.html',
  styleUrls: ['./pricing-level.component.scss']
})
export class PricingLevelComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count:any = 0;
  subscription: Subscription;
  segmentData:any=[];
  arr: { status: string; }[];
  levelSlabData:any =[];
  customerTypeData:any = [];
  spaData:any = [];
  traning_nameData: any =[];
  priceMapData: any = [];
;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster:ToastrService, private router:Router
  ) {
    this.rowClass = 'rowClass'
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {


      }
  });
  }

  ngOnInit(): void {
   this.getAllPriceLevel();
   this.getAllPrice();
   this.getAllLevelSlab();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;

    })

  }

  public columnDefs:any = [
    {
      headerName: 'S. No',
      field: 'pricing_level_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth:150
    },

    {
      headerName: 'Price Mapping',
      field: 'price_mapping_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.priceMapData
      },
    },
    {
      headerName: 'Level Slab',
      field: 'level_slab_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.levelSlabData
      },
    },
    {
      headerName: 'Min Value',
      field: 'min_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:180,
      //editable: true,
    },
    {
      headerName: 'Max Value',
      field: 'max_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:180,
      //editable: true,
    },

    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth:150,
      //editable: true,
    },
      {
        headerName: 'Action',
        // field: '',
         flex: 1,
         minWidth:200,
        cellRenderer: ActionComponent,
        },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }

  agInit(params: ICellRendererParams): void {

  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.id;
    let val = event.data.value1;

    //  --------------- change on cell -------------------


    let sta = event.data;


    if(val == event.data.status){
      this._configurationalMasterService.updateSingleSegment(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Status Updated Successfully')
        }, (err: any) => {

        });
    }
  }

  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) { return; }

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

  onFactoryButtonClick(e: any) {
    this.count++
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
        this.addRecordToGrid(data);

        this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without feel")
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getAllPriceLevel() {
    this._configurationalMasterService.getPriceLevel().subscribe((res: any) => {
      this.rowData = res.data;
     });
  }

  getAllPrice() {
    this._configurationalMasterService.getPriceMap().subscribe((response) => {
        response.data.forEach((element: any) => {
        this.priceMapData.push(element.price_mapping_name)
      });
      this.columnDefs[1].cellEditorParams.values = this.priceMapData
    })
  }
  getAllLevelSlab() {
    this._configurationalMasterService.getLevelSlab().subscribe((response) => {
       response.data.forEach((element: any) => {
        this.levelSlabData.push(element.level_slab_name)
      });
      this.columnDefs[2].cellEditorParams.values = this.levelSlabData
    })
  }





}


let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100)
  };

  return obj;
}


