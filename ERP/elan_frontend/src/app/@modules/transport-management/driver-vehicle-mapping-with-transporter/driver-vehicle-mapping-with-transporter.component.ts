import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-driver-vehicle-mapping-with-transporter',
  templateUrl: './driver-vehicle-mapping-with-transporter.component.html',
  styleUrls: ['./driver-vehicle-mapping-with-transporter.component.scss']
})
export class DriverVehicleMappingWithTransporterComponent {

  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: Number | null;
  financial_year_id: Number | null;
  
  constructor(private accessData: AccessControlService,
   private route: Router,private transport_service:TransportManagementService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.getAllData();
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
      flex: .5
    },
    {
      headerName: 'Transporter Code',
      field: 'tm_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Transporter Name',
      field: 'tm_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Total Drivers',
      field: 'driver_count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Total Vehicles',
      field: 'vehicle_count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .6
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: .8,
      cellRenderer: (params: any) => {
        return `
          <span class="action-icons" style="color: #00644d !important; cursor:pointer">
            <i class="material-icons map" title="Driver Vehicle Mapping">sync_alt</i>
            <i class="material-icons view" title="View">visibility</i>
          </span>
        `;
      },
      onCellClicked: (params: any) => {
        const target = params.event.target;

        if (target.classList.contains('map')) {
          this.OnClick(params.data.id,'CreateUpdate');
        }

        if (target.classList.contains('view')) {
          this.OnClick(params.data.id,'View');
        }

      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellValueChanged(event: CellValueChangedEvent) {

  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  OnClick(id:any, actionType: any){
    this.route.navigate(['/master/transport-management/create-mapping'],{ queryParams: { id: id, actionType: actionType } });
  }

  getAllData(){
    this.transport_service.getAllDriverVehicleMapping(this.entity_id).subscribe((res:any)=>{
      if(res){
        this.rowData=res.data;
      }
    },(err:any)=>{

    })
  }

}