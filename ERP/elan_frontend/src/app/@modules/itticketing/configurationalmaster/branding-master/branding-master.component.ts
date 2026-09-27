import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BrandingMasterActionComponent } from './branding-master-action/branding-master-action.component';

@Component({
  selector: 'app-branding-master',
  templateUrl: './branding-master.component.html',
  styleUrls: ['./branding-master.component.scss']
})
export class BrandingMasterComponent {
 errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  count: any = 0;
  assignAction: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

   ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;
    });
  }

    addBranding() {
    this.route.navigate(["/master/configurational-master/branding-master/create-branding"])
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
        flex: .5,
        minWidth: 80
      },    
      {
        headerName: 'Customer',
        field: 'company_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 3,
        minWidth: 100,
        //editable: true,
      },     
      {
        headerName: 'Item',
        field: 'item_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 3,
        minWidth: 100,
        //editable: true,
      },     
      {
        headerName: 'Type Of Branding',
        field: 'type_of_branding',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 3,
        minWidth: 150,
        //editable: true,
      },     
      {
        headerName: 'Price Per Unit',
        field: 'price_per_unit',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 100,
        //editable: true,
      },     
      {
        headerName: 'HSN',
        field: 'hsn_sac_code',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 100,
        //editable: true,
      },     
      {
        headerName: 'GST',
        field: 'gst_value',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: .5,
        minWidth: 90,
        //editable: true,
      }, 
      {
        headerName: 'UOM',
        field: 'uom_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: .5,
        minWidth: 90,
        //editable: true,
      },     
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: BrandingMasterActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
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

  getAllItem() {
    this._configurationalMasterService.getAllbranding().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) {  }
 


}
