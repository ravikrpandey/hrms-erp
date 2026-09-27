import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CentralColumnDefinitionsService } from 'src/app/@shared/services/central-column-definitions.service';
import { ManageRFPService } from '../manage-service/manage.service';
import { RfpActionComponent } from './rfp-action/rfp-action.component';

@Component({
  selector: 'app-live-rfp',
  templateUrl: './live-rfp.component.html',
  styleUrls: ['./live-rfp.component.scss']
})
export class LiveRfpComponent {
  vendorId!:any;
  entityId!:any;
  public rowData: any = [];
  public liveRfpData: any = [];
  private gridApi!: GridApi<any>;
  rowClass: string;

  constructor(
    private manageRfpService: ManageRFPService,
    private toastr: ToastrService,
    private router: Router,
    public columnDefsService: CentralColumnDefinitionsService

  ){
    this.rowClass = 'rowClass';
  }


  ngOnInit(): void {
    const storedData = localStorage.getItem('signInUser') ?? "{}";
    const userDetails = JSON.parse(storedData);
    if (userDetails ) {
      this.vendorId = userDetails.id;
      this.entityId = userDetails.entity_id;
    }

    this.addColumns();
    this.getLiveRfpList();

  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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

  addColumns(): void {
    const headersAndFields = [
      { headerName: 'Sr No.', field: '', valueGetter: 'node.rowIndex + 1' },
      { headerName: 'RFP No.', field: 'Rfp_Number' },
      { headerName: 'PR No.', field: 'pr_number' },
      {headerName:'PR Type',field:'procurement_type'},
      {
        headerName: 'Department Name', field: 'department_name',
      },
      {
        headerName: 'Start Date', field: 'start_date',

        cellRenderer: this.dateFormatter
      },
      {
        headerName: 'End Date', field: 'end_date',

        cellRenderer: this.dateFormatter
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: RfpActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        },
        cellClass: "grid-cell-centered"
      }
    ];
    this.columnDefsService.generateColumns(headersAndFields);
  }

  onCellClicked(e: any) {
   if(e.colDef.field === "purchase_request_id"){

    //this.router.navigate(['vendor/manage-rfp/rfp-detail'],{queryParams:{cmId:e.data.company_id,rfpcode:e.data.Rfp_Number,rfpCat:e.data.procurement_type}});
   }
  }
  dateFormatter(params: any) {
    const formattedDate = formatDate(params.value, 'dd-MM-yyyy', 'en-US');
    return formattedDate;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getLiveRfpList() {
    this.manageRfpService.getAll_closedandLiveRfp_vendor_id(this.entityId,this.vendorId,'LIVE RFP').subscribe((res: any) => {
      if (res.data ) {
        this.rowData = res.data;
      }
    })
  }

}




