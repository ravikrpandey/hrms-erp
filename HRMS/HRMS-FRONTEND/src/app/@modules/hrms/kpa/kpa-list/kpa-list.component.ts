import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { KpaActionComponent } from '../kpa-action/kpa-action.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { KpaStatusComponent } from '../kpa-status/kpa-status.component';
import { CreateKpaComponent } from '../create-kpa/create-kpa.component';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-kpa-list',
  templateUrl: './kpa-list.component.html',
  styleUrls: ['./kpa-list.component.scss']
})
export class KpaListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  add_Emp: any = 'Add_Emp'
  entity_id: any;
  financial_id: string | null;

  constructor(
    private _hrmMasterService: HrmServiceService,
    private _commonService: CommonService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    let payload = {
      entity_id : this.entity_id,
      financial_id : this.financial_id
    }
    this._hrmMasterService
      .getHrmKpa(payload)
      .subscribe((params: any) => {
        this.rowData = params.data;
        console.log("rowdata666666666666666666",this.rowData);
      },(err : any) => {
        this.rowData = []
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
      minWidth: 150
    },
    {
      headerName: 'Activity',
      field: 'activity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Object Name',
      field: 'objective_name',
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
      cellRenderer: KpaStatusComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // editable:true
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: KpaActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];
  // downloadCSV() {
  //   this.rowData.map((item: any)=> {
  //     delete item.id;
  //   })
  //   this._commonService?.downloadCSV(this.rowData,"Kpa_Master_List.xlsx");
  // }


  // downloadCSV() {
  //   const cleanedData = this.rowData.map((item: any) => {
  //     const { id, status,  ...cleanedItem } = item;
  //     return {      // Adding the entity name
  //       ...cleanedItem,
  //     };
  //   });

  //   console.log("Cleaned Data with Financial Year and Entity Name:", cleanedData);
  //   this._commonService?.downloadCSV(cleanedData, "Kpa_Master_List.xlsx");
  // }


  downloadCSV() {
    const cleanedData = this.rowData.map((item: any) => {
      const { id, status, ...cleanedItem } = item;

      const stripHtmlTags = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, "");

      Object.keys(cleanedItem).forEach((key) => {
        if (typeof cleanedItem[key] === "string") {
          cleanedItem[key] = stripHtmlTags(cleanedItem[key]);
        }
      });
      return cleanedItem;
    });
    console.log("Cleaned Data with Financial Year and Entity Name:", cleanedData);
      this._commonService?.downloadCSV(cleanedData, "Kpa_Master_List.xlsx");
  }




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

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  openDialog() {
    this.route.navigate(['/master/performance/kpa-master/createkpa-master'])
  }
}
